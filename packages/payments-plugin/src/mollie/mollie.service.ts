import { Order as MollieOrder, OrderStatus, PaymentMethod as MollieClientMethod } from '@mollie/api-client';
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
    createExtendedMollieClient,
    ExtendedMollieClient,
    ManageOrderLineInput,
} from './extended-mollie-client';
import {
    ErrorCode,
    MolliePaymentIntentError,
    MolliePaymentIntentInput,
    MolliePaymentIntentResult,
    MolliePaymentMethod,
} from './graphql/generated-shop-types';
import { molliePaymentHandler } from './mollie.handler';
import { amountToCents, getLocale, toAmount, toMollieAddress, toMollieOrderLines } from './mollie.helpers';
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
        const allowedMethods = Object.values(MollieClientMethod) as string[];
        if (molliePaymentMethodCode && !allowedMethods.includes(molliePaymentMethodCode)) {
            return new InvalidInputError(
                `molliePaymentMethodCode has to be one of "${allowedMethods.join(',')}"`,
            );
        }
        const [order, paymentMethod] = await Promise.all([
            this.getOrder(ctx, input.orderId),
            this.getPaymentMethod(ctx, paymentMethodCode),
        ]);
        if (order instanceof PaymentIntentError) {
            return order;
        }
        await this.entityHydrator.hydrate(ctx, order, {
            relations: [
                'customer',
                'surcharges',
                'lines.productVariant',
                'lines.productVariant.translations',
                'shippingLines.shippingMethod',
                'payments',
            ],
        });
        if (order.state !== 'ArrangingPayment' && order.state !== 'ArrangingAdditionalPayment') {
            // Pre-check if order is transitionable to ArrangingPayment, because that will happen after Mollie payment
            try {
                await this.canTransitionTo(ctx, order.id, 'ArrangingPayment');
            } catch (e) {
                if ((e as Error).message) {
                    return new PaymentIntentError((e as Error).message);
                }
                throw e;
            }
        }
        if (!order.customer?.firstName.length) {
            return new PaymentIntentError(
                'Cannot create payment intent for order with customer that has no firstName set',
            );
        }
        if (!order.customer?.lastName.length) {
            return new PaymentIntentError(
                'Cannot create payment intent for order with customer that has no lastName set',
            );
        }
        if (!paymentMethod) {
            return new PaymentIntentError(`No paymentMethod found with code ${String(paymentMethodCode)}`);
        }
        let redirectUrl = input.redirectUrl;
        if (!redirectUrl) {
            // Use fallback redirect if no redirectUrl is given
            let fallbackRedirect = paymentMethod.handler.args.find(arg => arg.name === 'redirectUrl')?.value;
            if (!fallbackRedirect) {
                return new PaymentIntentError(
                    'No redirect URl was given and no fallback redirect is configured',
                );
            }
            redirectUrl = fallbackRedirect;
            // remove appending slash if present
            fallbackRedirect = fallbackRedirect.endsWith('/')
                ? fallbackRedirect.slice(0, -1)
                : fallbackRedirect;
            redirectUrl = `${fallbackRedirect}/${order.code}`;
        }
        const apiKey = paymentMethod.handler.args.find(arg => arg.name === 'apiKey')?.value;
        if (!apiKey) {
            Logger.warn(
                `CreatePaymentIntent failed, because no apiKey is configured for ${paymentMethod.code}`,
                loggerCtx,
            );
            return new PaymentIntentError(`Paymentmethod ${paymentMethod.code} has no apiKey configured`);
        }
        const mollieClient = createExtendedMollieClient({ apiKey });
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
        if (amountToPay === 0) {
            // The order can be transitioned to PaymentSettled, because the order has 0 left to pay
            // Only admins can add payments, so we need an admin ctx
            const adminCtx = new RequestContext({
                apiType: 'admin',
                isAuthorized: true,
                authorizedAsOwnerOnly: false,
                channel: ctx.channel,
                languageCode: ctx.languageCode,
            });
            await this.addPayment(
                adminCtx,
                order,
                amountToPay,
                { method: 'Settled without Mollie' },
                paymentMethod.code,
                'Settled',
            );
            return {
                url: redirectUrl,
            };
        }
        const orderInput: CreateParameters = {
            orderNumber: order.code,
            amount: toAmount(amountToPay, order.currencyCode),
            redirectUrl,
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
        const existingMollieOrderId = (order as OrderWithMollieReference).customFields.mollieOrderId;
        if (existingMollieOrderId) {
            // Update order and return its checkoutUrl
            const updateMollieOrder = await this.updateMollieOrder(
                mollieClient,
                orderInput,
                existingMollieOrderId,
            ).catch(e => {
                Logger.error(
                    `Failed to update Mollie order '${existingMollieOrderId}' for '${order.code}': ${(e as Error).message}`,
                    loggerCtx,
                );
            });
            const checkoutUrl = updateMollieOrder?.getCheckoutUrl();
            if (checkoutUrl) {
                Logger.info(
                    `Updated Mollie order '${updateMollieOrder?.id as string}' for order '${order.code}'`,
                    loggerCtx,
                );
                return {
                    url: checkoutUrl,
                };
            }
        }
        // Otherwise create a new Mollie order
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
        const client = createExtendedMollieClient({ apiKey });
        const mollieOrder = await client.orders.get(orderId);
        if (mollieOrder.metadata?.languageCode) {
            // Recreate ctx with the original languageCode
            ctx = new RequestContext({
                apiType: 'admin',
                isAuthorized: true,
                authorizedAsOwnerOnly: false,
                req: ctx.req,
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
        const amount = amountToCents(mollieOrder.amount);
        if (mollieOrder.status === OrderStatus.expired) {
            // Expired is fine, a customer can retry the payment later
            return;
        }
        if (mollieOrder.status === OrderStatus.paid) {
            // Paid is only used by 1-step payments without Authorized state. This will settle immediately
            await this.addPayment(ctx, order, amount, mollieOrder, paymentMethod.code, 'Settled');
            return;
        }
        if (order.state === 'AddingItems' && mollieOrder.status === OrderStatus.authorized) {
            order = await this.addPayment(ctx, order, amount, mollieOrder, paymentMethod.code, 'Authorized');
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
        amount: number,
        mollieMetadata: Partial<MollieOrder>,
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
                amount,
                status,
                orderId: mollieMetadata.id,
                mode: mollieMetadata.mode,
                method: mollieMetadata.method,
                profileId: mollieMetadata.profileId,
                settlementAmount: mollieMetadata.amount,
                authorizedAt: mollieMetadata.authorizedAt,
                paidAt: mollieMetadata.paidAt,
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

        const client = createExtendedMollieClient({ apiKey });
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
     * Update an existing Mollie order based on the given Vendure order.
     */
    async updateMollieOrder(
        mollieClient: ExtendedMollieClient,
        newMollieOrderInput: CreateParameters,
        mollieOrderId: string,
    ): Promise<MollieOrder> {
        const existingMollieOrder = await mollieClient.orders.get(mollieOrderId);
        const [order] = await Promise.all([
            this.updateMollieOrderData(mollieClient, existingMollieOrder, newMollieOrderInput),
            this.updateMollieOrderLines(mollieClient, existingMollieOrder, newMollieOrderInput.lines),
        ]);
        return order;
    }

    /**
     * Update the Mollie Order data itself, excluding the order lines.
     * So, addresses, redirect url etc
     */
    private async updateMollieOrderData(
        mollieClient: ExtendedMollieClient,
        existingMollieOrder: MollieOrder,
        newMollieOrderInput: CreateParameters,
    ): Promise<MollieOrder> {
        return await mollieClient.orders.update(existingMollieOrder.id, {
            billingAddress: newMollieOrderInput.billingAddress,
            shippingAddress: newMollieOrderInput.shippingAddress,
            redirectUrl: newMollieOrderInput.redirectUrl,
        });
    }

    /**
     * Delete all order lines of current Mollie order, and create new ones based on the new Vendure order lines
     */
    private async updateMollieOrderLines(
        mollieClient: ExtendedMollieClient,
        existingMollieOrder: MollieOrder,
        /**
         * These are the new order lines based on the Vendure order
         */
        newMollieOrderLines: CreateParameters['lines'],
    ): Promise<MollieOrder> {
        const manageOrderLinesInput: ManageOrderLineInput = {
            operations: [],
        };
        // Cancel all previous order lines and create new ones
        existingMollieOrder.lines.forEach(existingLine => {
            manageOrderLinesInput.operations.push({
                operation: 'cancel',
                data: { id: existingLine.id },
            });
        });
        // Add new order lines
        newMollieOrderLines.forEach(newLine => {
            manageOrderLinesInput.operations.push({
                operation: 'add',
                data: newLine,
            });
        });
        return await mollieClient.manageOrderLines(existingMollieOrder.id, manageOrderLinesInput);
    }

    /**
     * Dry run a transition to a given state.
     * As long as we don't call 'finalize', the transition never completes.
     */
    private async canTransitionTo(ctx: RequestContext, orderId: ID, state: OrderState) {
        // Fetch new order object, because `transition()` mutates the order object
        const orderCopy = await assertFound(this.orderService.findOne(ctx, orderId));
        const orderStateMachine = this.injector.get(OrderStateMachine);
        await orderStateMachine.transition(ctx, orderCopy, state);
    }

    private async getPaymentMethod(
        ctx: RequestContext,
        paymentMethodCode?: string | null,
    ): Promise<PaymentMethod | undefined> {
        if (paymentMethodCode) {
            const { items } = await this.paymentMethodService.findAll(ctx, {
                filter: {
                    code: { eq: paymentMethodCode },
                },
            });
            return items.find(pm => pm.code === paymentMethodCode);
        } else {
            const { items } = await this.paymentMethodService.findAll(ctx);
            return items.find(pm => pm.handler.code === molliePaymentHandler.code);
        }
    }

    /**
     * Get order by id, or active order if no orderId is given
     */
    private async getOrder(ctx: RequestContext, orderId?: ID | null): Promise<Order | PaymentIntentError> {
        if (orderId) {
            return await assertFound(this.orderService.findOne(ctx, orderId));
        }
        const order = await this.activeOrderService.getActiveOrder(ctx, undefined);
        if (!order) {
            return new PaymentIntentError('No active order found for session');
        }
        return order;
    }
}
