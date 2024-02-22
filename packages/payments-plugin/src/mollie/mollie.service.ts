import createMollieClient, {
    Order as MollieOrder,
    OrderStatus,
    PaymentMethod as MollieClientMethod,
    MollieClient,
} from '@mollie/api-client';
import { CreateParameters } from '@mollie/api-client/dist/types/src/binders/orders/parameters';
import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
    ActiveOrderService,
    assertFound,
    EntityHydrator,
    ErrorResult,
    ID,
    Injector,
    LanguageCode,
    Logger,
    Order,
    OrderService,
    OrderState,
    OrderStateTransitionError,
    PaymentMethod,
    PaymentMethodService,
    ProductVariant,
    ProductVariantService,
    RequestContext,
} from '@vendure/core';
import { OrderStateMachine } from '@vendure/core/';
import { totalCoveredByPayments } from '@vendure/core/dist/service/helpers/utils/order-utils';

import { loggerCtx, PLUGIN_INIT_OPTIONS } from './constants';
import { OrderWithMollieReference } from './custom-fields';
import {
    ErrorCode,
    MolliePaymentIntentError,
    MolliePaymentIntentInput,
    MolliePaymentIntentResult,
    MolliePaymentMethod,
} from './graphql/generated-shop-types';
import {
    amountToCents,
    getLocale,
    isAmountEqual,
    toAmount,
    toMollieAddress,
    toMollieOrderLines,
} from './mollie.helpers';
import { MolliePluginOptions } from './mollie.plugin';

interface OrderStatusInput {
    paymentMethodId: string;
    orderId: string;
}

class PaymentIntentError implements MolliePaymentIntentError {
    errorCode = ErrorCode.ORDER_PAYMENT_STATE_ERROR;

    constructor(public message: string) {}
}

class InvalidInputError implements MolliePaymentIntentError {
    errorCode = ErrorCode.INELIGIBLE_PAYMENT_METHOD_ERROR;

    constructor(public message: string) {}
}

@Injectable()
export class MollieService {
    private readonly injector: Injector;

    constructor(
        private paymentMethodService: PaymentMethodService,
        @Inject(PLUGIN_INIT_OPTIONS) private options: MolliePluginOptions,
        private activeOrderService: ActiveOrderService,
        private orderService: OrderService,
        private entityHydrator: EntityHydrator,
        private variantService: ProductVariantService,
        private moduleRef: ModuleRef,
    ) {
        this.injector = new Injector(this.moduleRef);
    }

    /**
     * Creates a redirectUrl to Mollie for the given paymentMethod and current activeOrder
     */
    async createPaymentIntent(
        ctx: RequestContext,
        input: MolliePaymentIntentInput,
    ): Promise<MolliePaymentIntentResult> {
        const { paymentMethodCode, molliePaymentMethodCode } = input;
        let redirectUrl: string;
        const allowedMethods = Object.values(MollieClientMethod) as string[];
        if (molliePaymentMethodCode && !allowedMethods.includes(molliePaymentMethodCode)) {
            return new InvalidInputError(
                `molliePaymentMethodCode has to be one of "${allowedMethods.join(',')}"`,
            );
        }
        const [order, paymentMethod]: [OrderWithMollieReference | undefined, PaymentMethod | undefined] =
            await Promise.all([
                this.activeOrderService.getActiveOrder(ctx, undefined),
                this.getPaymentMethod(ctx, paymentMethodCode),
            ]);
        if (!order) {
            return new PaymentIntentError('No active order found for session');
        }
        await this.entityHydrator.hydrate(ctx, order, {
            relations: [
                'customer',
                'surcharges',
                'lines.productVariant',
                'shippingLines.shippingMethod',
                'payments',
            ],
        });
        if (!order.lines?.length) {
            return new PaymentIntentError('Cannot create payment intent for empty order');
        }
        if (!order.customer) {
            return new PaymentIntentError('Cannot create payment intent for order without customer');
        }
        if (!order.customer.firstName.length) {
            return new PaymentIntentError(
                'Cannot create payment intent for order with customer that has no firstName set',
            );
        }
        if (!order.customer.lastName.length) {
            return new PaymentIntentError(
                'Cannot create payment intent for order with customer that has no lastName set',
            );
        }
        if (!order.customer.emailAddress.length) {
            return new PaymentIntentError(
                'Cannot create payment intent for order with customer that has no emailAddress set',
            );
        }
        if (!order.shippingLines?.length) {
            return new PaymentIntentError('Cannot create payment intent for order without shippingMethod');
        }
        if (!paymentMethod) {
            return new PaymentIntentError(`No paymentMethod found with code ${paymentMethodCode}`);
        }
        if (this.options.useDynamicRedirectUrl === true) {
            if (!input.redirectUrl) {
                return new InvalidInputError('Cannot create payment intent without redirectUrl specified');
            }
            redirectUrl = input.redirectUrl;
        } else {
            const paymentMethodRedirectUrl = paymentMethod.handler.args.find(
                arg => arg.name === 'redirectUrl',
            )?.value;
            if (!paymentMethodRedirectUrl) {
                return new PaymentIntentError(
                    'Cannot create payment intent without redirectUrl specified in paymentMethod',
                );
            }
            redirectUrl = paymentMethodRedirectUrl;
        }
        // FIXME: The manual checks above can be removed, now that we do a canTransition check?
        if (order.state !== 'ArrangingPayment' && order.state !== 'ArrangingAdditionalPayment') {
            // Check if order is transitionable to ArrangingPayment, because that will happen after Mollie payment
            await this.canTransitionTo(ctx, order.id, 'ArrangingPayment');
        }
        const variantsWithInsufficientSaleableStock = await this.getVariantsWithInsufficientStock(ctx, order);
        if (variantsWithInsufficientSaleableStock.length) {
            return new PaymentIntentError(
                `The following variants are out of stock: ${variantsWithInsufficientSaleableStock
                    .map(v => v.name)
                    .join(', ')}`,
            );
        }
        const apiKey = paymentMethod.handler.args.find(arg => arg.name === 'apiKey')?.value;
        if (!apiKey) {
            Logger.warn(
                `CreatePaymentIntent failed, because no apiKey is configured for ${paymentMethod.code}`,
                loggerCtx,
            );
            return new PaymentIntentError(`Paymentmethod ${paymentMethod.code} has no apiKey configured`);
        }
        const mollieClient = createMollieClient({ apiKey });
        redirectUrl =
            redirectUrl.endsWith('/') && this.options.useDynamicRedirectUrl !== true
                ? redirectUrl.slice(0, -1)
                : redirectUrl; // remove appending slash
        const vendureHost = this.options.vendureHost.endsWith('/')
            ? this.options.vendureHost.slice(0, -1)
            : this.options.vendureHost; // remove appending slash
        const billingAddress =
            toMollieAddress(order.billingAddress, order.customer) ||
            toMollieAddress(order.shippingAddress, order.customer);
        if (!billingAddress) {
            return new InvalidInputError(
                "Order doesn't have a complete shipping address or billing address. " +
                    'At least city, postalCode, streetline1 and country are needed to create a payment intent.',
            );
        }
        const alreadyPaid = totalCoveredByPayments(order);
        const amountToPay = order.totalWithTax - alreadyPaid;
        const orderInput: CreateParameters = {
            orderNumber: order.code,
            amount: toAmount(amountToPay, order.currencyCode),
            redirectUrl:
                this.options.useDynamicRedirectUrl === true ? redirectUrl : `${redirectUrl}/${order.code}`,
            webhookUrl: `${vendureHost}/payments/mollie/${ctx.channel.token}/${paymentMethod.id}`,
            billingAddress,
            locale: getLocale(billingAddress.country, ctx.languageCode),
            lines: toMollieOrderLines(order, alreadyPaid),
            metadata: {
                languageCode: ctx.languageCode,
            },
        };
        if (molliePaymentMethodCode) {
            orderInput.method = molliePaymentMethodCode as MollieClientMethod;
        }
        if (order.customFields?.mollieOrderId) {
            // A payment was already started, so we try to reuse the existing order
            const checkoutUrl = await this.getExistingCheckout(
                mollieClient,
                order,
                amountToPay,
                order.customFields.mollieOrderId,
            ).catch(e => {
                Logger.warn(`Failed to reuse existing Mollie order: ${(e as Error).message}`, loggerCtx);
            });
            if (checkoutUrl) {
                Logger.info(`Reusing existing Mollie order '${order.customFields.mollieOrderId}'`, loggerCtx);
                return {
                    url: checkoutUrl,
                };
            }
            // Otherwise, try to cancel existing Mollie order in the background
            this.cancelMollieOrder(mollieClient, order.customFields.mollieOrderId).catch(e => {
                Logger.info(`Failed to cancel existing Mollie order: ${(e as Error).message}`, loggerCtx);
            });
        }
        const mollieOrder = await mollieClient.orders.create(orderInput);
        // Save async, because this shouldn't impact intent creation
        this.orderService.updateCustomFields(ctx, order.id, { mollieOrderId: mollieOrder.id }).catch(e => {
            Logger.error(`Failed to save Mollie order ID: ${(e as Error).message}`, loggerCtx);
        });
        Logger.info(`Created Mollie order ${mollieOrder.id} for order ${order.code}`, loggerCtx);
        const url = mollieOrder.getCheckoutUrl();
        if (!url) {
            throw Error('Unable to getCheckoutUrl() from Mollie order');
        }
        return {
            url,
        };
    }

    /**
     * Update Vendure payments and order status based on the incoming Mollie order
     */
    async handleMollieStatusUpdate(
        ctx: RequestContext,
        { paymentMethodId, orderId }: OrderStatusInput,
    ): Promise<void> {
        Logger.info(
            `Received status update for channel ${ctx.channel.token} for Mollie order ${orderId}`,
            loggerCtx,
        );
        const paymentMethod = await this.paymentMethodService.findOne(ctx, paymentMethodId);
        if (!paymentMethod) {
            // Fail silently, as we don't want to expose if a paymentMethodId exists or not
            return Logger.warn(`No paymentMethod found with id ${paymentMethodId}`, loggerCtx);
        }
        const apiKey = paymentMethod.handler.args.find(a => a.name === 'apiKey')?.value;
        const autoCapture = paymentMethod.handler.args.find(a => a.name === 'autoCapture')?.value === 'true';
        if (!apiKey) {
            throw Error(`No apiKey found for payment ${paymentMethod.id} for channel ${ctx.channel.token}`);
        }
        const client = createMollieClient({ apiKey });
        const mollieOrder = await client.orders.get(orderId);
        if (mollieOrder.metadata?.languageCode) {
            // Recreate ctx with the original languageCode
            ctx = new RequestContext({
                apiType: 'admin',
                isAuthorized: true,
                authorizedAsOwnerOnly: false,
                channel: ctx.channel,
                languageCode: mollieOrder.metadata.languageCode as LanguageCode,
            });
        }
        Logger.info(
            `Processing status '${mollieOrder.status}' for order ${mollieOrder.orderNumber} for channel ${ctx.channel.token} for Mollie order ${orderId}`,
            loggerCtx,
        );
        let order = await this.orderService.findOneByCode(ctx, mollieOrder.orderNumber, ['payments']);
        if (!order) {
            throw Error(
                `Unable to find order ${mollieOrder.orderNumber}, unable to process Mollie order ${mollieOrder.id}`,
            );
        }
        const statesThatRequireAction: OrderState[] = [
            'AddingItems',
            'ArrangingPayment',
            'ArrangingAdditionalPayment',
            'PaymentAuthorized',
            'Draft',
        ];
        if (!statesThatRequireAction.includes(order.state)) {
            // If order is not in one of these states, we don't need to handle the Mollie webhook
            Logger.info(
                `Order ${order.code} is already '${order.state}', no need for handling Mollie status '${mollieOrder.status}'`,
                loggerCtx,
            );
            return;
        }
        if (mollieOrder.status === OrderStatus.expired) {
            // Expired is fine, a customer can retry the payment later
            return;
        }
        if (mollieOrder.status === OrderStatus.paid) {
            // Paid is only used by 1-step payments without Authorized state. This will settle immediately
            await this.addPayment(ctx, order, mollieOrder, paymentMethod.code, 'Settled');
            return;
        }
        if (order.state === 'AddingItems' && mollieOrder.status === OrderStatus.authorized) {
            order = await this.addPayment(ctx, order, mollieOrder, paymentMethod.code, 'Authorized');
            if (autoCapture && mollieOrder.status === OrderStatus.authorized) {
                // Immediately capture payment if autoCapture is set
                Logger.info(`Auto capturing payment for order ${order.code}`, loggerCtx);
                await this.settleExistingPayment(ctx, order, mollieOrder.id);
            }
            return;
        }
        if (order.state === 'PaymentAuthorized' && mollieOrder.status === OrderStatus.completed) {
            return this.settleExistingPayment(ctx, order, mollieOrder.id);
        }
        if (autoCapture && mollieOrder.status === OrderStatus.completed) {
            // When autocapture is enabled, we should not handle the completed status from Mollie,
            // because the order will be transitioned to PaymentSettled during auto capture
            return;
        }
        // Any other combination of Mollie status and Vendure status indicates something is wrong.
        throw Error(
            `Unhandled incoming Mollie status '${mollieOrder.status}' for order ${order.code} with status '${order.state}'`,
        );
    }

    /**
     * Add payment to order. Can be settled or authorized depending on the payment method.
     */
    async addPayment(
        ctx: RequestContext,
        order: Order,
        mollieOrder: MollieOrder,
        paymentMethodCode: string,
        status: 'Authorized' | 'Settled',
    ): Promise<Order> {
        if (order.state !== 'ArrangingPayment' && order.state !== 'ArrangingAdditionalPayment') {
            const transitionToStateResult = await this.orderService.transitionToState(
                ctx,
                order.id,
                'ArrangingPayment',
            );
            if (transitionToStateResult instanceof OrderStateTransitionError) {
                throw Error(
                    `Error transitioning order ${order.code} from ${transitionToStateResult.fromState} ` +
                        `to ${transitionToStateResult.toState}: ${transitionToStateResult.message}`,
                );
            }
        }
        const addPaymentToOrderResult = await this.orderService.addPaymentToOrder(ctx, order.id, {
            method: paymentMethodCode,
            metadata: {
                amount: amountToCents(mollieOrder.amount),
                status,
                orderId: mollieOrder.id,
                mode: mollieOrder.mode,
                method: mollieOrder.method,
                profileId: mollieOrder.profileId,
                settlementAmount: mollieOrder.amount,
                authorizedAt: mollieOrder.authorizedAt,
                paidAt: mollieOrder.paidAt,
            },
        });
        if (!(addPaymentToOrderResult instanceof Order)) {
            throw Error(`Error adding payment to order ${order.code}: ${addPaymentToOrderResult.message}`);
        }
        return addPaymentToOrderResult;
    }

    /**
     * Settle an existing payment based on the given mollieOrder
     */
    async settleExistingPayment(ctx: RequestContext, order: Order, mollieOrderId: string): Promise<void> {
        order = await this.entityHydrator.hydrate(ctx, order, { relations: ['payments'] });
        const payment = order.payments.find(p => p.transactionId === mollieOrderId);
        if (!payment) {
            throw Error(
                `Cannot find payment ${mollieOrderId} for ${order.code}. Unable to settle this payment`,
            );
        }
        const result = await this.orderService.settlePayment(ctx, payment.id);
        if ((result as ErrorResult).message) {
            throw Error(
                `Error settling payment ${payment.id} for order ${order.code}: ${
                    (result as ErrorResult).errorCode
                } - ${(result as ErrorResult).message}`,
            );
        }
    }

    async getEnabledPaymentMethods(
        ctx: RequestContext,
        paymentMethodCode: string,
    ): Promise<MolliePaymentMethod[]> {
        const paymentMethod = await this.getPaymentMethod(ctx, paymentMethodCode);
        const apiKey = paymentMethod?.handler.args.find(arg => arg.name === 'apiKey')?.value;
        if (!apiKey) {
            throw Error(`No apiKey configured for payment method ${paymentMethodCode}`);
        }

        const client = createMollieClient({ apiKey });
        const activeOrder = await this.activeOrderService.getActiveOrder(ctx, undefined);
        const additionalParams = await this.options.enabledPaymentMethodsParams?.(
            this.injector,
            ctx,
            activeOrder ?? null,
        );

        // We use the orders API, so list available methods for that API usage
        const methods = await client.methods.list({
            ...additionalParams,
            resource: 'orders',
        });
        return methods.map(m => ({
            ...m,
            code: m.id,
        }));
    }

    async getVariantsWithInsufficientStock(ctx: RequestContext, order: Order): Promise<ProductVariant[]> {
        const variantsWithInsufficientSaleableStock: ProductVariant[] = [];
        for (const line of order.lines) {
            const availableStock = await this.variantService.getSaleableStockLevel(ctx, line.productVariant);
            if (line.quantity > availableStock) {
                variantsWithInsufficientSaleableStock.push(line.productVariant);
            }
        }
        return variantsWithInsufficientSaleableStock;
    }

    /**
     * Tries to cancel an existing Mollie order
     * An order might not be cancellable when it has open payments
     * It takes at least 15 minutes for a payment to expire and be cancallable: https://docs.mollie.com/payments/status-changes#when-does-a-payment-expire
     */
    async cancelMollieOrder(client: MollieClient, mollieOrderId: string): Promise<void> {
        const mollieOrder = await client.orders.get(mollieOrderId);
        if (mollieOrder.isCancelable) {
            await client.orders.cancel(mollieOrder.id);
        } else {
            // Try to cancel all payments
            const payments = await mollieOrder.getPayments();
            await Promise.all(
                payments.map(async payment => {
                    if (!payment.isCancelable) {
                        throw Error(
                            `Payment ${payment.id} for Mollie order '${mollieOrderId}' is not cancellable`,
                        );
                    }
                    await client.payments.cancel(payment.id);
                }),
            );
            // Try to cancel order again
            await client.orders.cancel(mollieOrder.id);
        }
        Logger.info(`Cancelled Mollie order ${mollieOrder.id}`, loggerCtx);
    }

    /**
     * Checks if we can reuse the existing Mollie order, and returns the checkoutUrl if possible.
     * If no checkout URL returned, the checkout could not be reused.
     */
    private async getExistingCheckout(
        mollieClient: MollieClient,
        vendureOrder: Order,
        amountToPay: number,
        mollieOrderId: string,
    ): Promise<string | undefined> {
        const existingMollieOrder = await mollieClient.orders.get(mollieOrderId);
        const checkoutUrl = existingMollieOrder.getCheckoutUrl();
        const amountsMatch = isAmountEqual(
            vendureOrder.currencyCode,
            amountToPay,
            existingMollieOrder.amount,
        );
        if (checkoutUrl && amountsMatch) {
            return checkoutUrl;
        }
    }

    private async canTransitionTo(ctx: RequestContext, orderId: ID, state: OrderState) {
        // Fetch new order object, because `transition()` mutates the order object
        const orderCopy = await assertFound(this.orderService.findOne(ctx, orderId));
        const orderStateMachine = this.injector.get(OrderStateMachine);
        await orderStateMachine.transition(ctx, orderCopy, state);
    }

    private async getPaymentMethod(
        ctx: RequestContext,
        paymentMethodCode: string,
    ): Promise<PaymentMethod | undefined> {
        const paymentMethods = await this.paymentMethodService.findAll(ctx);
        return paymentMethods.items.find(pm => pm.code === paymentMethodCode);
    }
}
