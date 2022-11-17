import createMollieClient, {
    Order as MollieOrder,
    OrderStatus,
    PaymentMethod as MollieClientMethod,
} from '@mollie/api-client';
import { Inject, Injectable } from '@nestjs/common';
import {
    ActiveOrderService,
    ChannelService,
    EntityHydrator,
    ErrorResult,
    LanguageCode,
    Logger,
    Order,
    OrderService,
    PaymentMethod,
    PaymentMethodService,
    RequestContext,
} from '@vendure/core';
import { OrderStateTransitionError } from '@vendure/core/dist/common/error/generated-graphql-shop-errors';

import { loggerCtx, PLUGIN_INIT_OPTIONS } from './constants';
import {
    ErrorCode,
    MolliePaymentIntentError,
    MolliePaymentIntentInput,
    MolliePaymentIntentResult,
    MolliePaymentMethod,
} from './graphql/generated-shop-types';
import { MolliePluginOptions } from './mollie.plugin';
import { CreateParameters } from '@mollie/api-client/dist/types/src/binders/orders/parameters';
import { getLocale, toAmount, toMollieAddress, toMollieOrderLines } from './mollie.helpers';

interface OrderStatusInput {
    channelToken: string;
    paymentMethodId: string;
    orderId: string;
}

class PaymentIntentError implements MolliePaymentIntentError {
    errorCode = ErrorCode.ORDER_PAYMENT_STATE_ERROR;

    constructor(public message: string) {
    }
}

class InvalidInputError implements MolliePaymentIntentError {
    errorCode = ErrorCode.INELIGIBLE_PAYMENT_METHOD_ERROR;

    constructor(public message: string) {
    }
}

@Injectable()
export class MollieService {

    constructor(
        private paymentMethodService: PaymentMethodService,
        @Inject(PLUGIN_INIT_OPTIONS) private options: MolliePluginOptions,
        private activeOrderService: ActiveOrderService,
        private orderService: OrderService,
        private channelService: ChannelService,
        private entityHydrator: EntityHydrator,
    ) {
    }

    // TODO subscribe to status changes and push to Mollie

    /**
     * Creates a redirectUrl to Mollie for the given paymentMethod and current activeOrder
     */
    async createPaymentIntent(
        ctx: RequestContext,
        { paymentMethodCode, molliePaymentMethodCode }: MolliePaymentIntentInput,
    ): Promise<MolliePaymentIntentResult> {
        const allowedMethods = Object.values(MollieClientMethod) as string[];
        if (molliePaymentMethodCode && !allowedMethods.includes(molliePaymentMethodCode)) {
            return new InvalidInputError(`molliePaymentMethodCode has to be one of "${allowedMethods.join(',')}"`);
        }
        const [order, paymentMethod] = await Promise.all([
            this.activeOrderService.getActiveOrder(ctx, undefined),
            this.getPaymentMethod(ctx, paymentMethodCode),
        ]);
        if (!order) {
            return new PaymentIntentError('No active order found for session');
        }
        await this.entityHydrator.hydrate(ctx, order, { relations: ['customer', 'lines', 'lines.productVariant', 'shippingLines', 'shippingLines.shippingMethod'] });
        if (!order.lines?.length) {
            return new PaymentIntentError('Cannot create payment intent for empty order');
        }
        if (!order.customer) {
            return new PaymentIntentError('Cannot create payment intent for order without customer');
        }
        if (!order.shippingLines?.length) {
            return new PaymentIntentError('Cannot create payment intent for order without shippingMethod');
        }
        if (!paymentMethod) {
            return new PaymentIntentError(`No paymentMethod found with code ${paymentMethodCode}`);
        }
        const apiKey = paymentMethod.handler.args.find(arg => arg.name === 'apiKey')?.value;
        let redirectUrl = paymentMethod.handler.args.find(arg => arg.name === 'redirectUrl')?.value;
        if (!apiKey || !redirectUrl) {
            Logger.warn(`CreatePaymentIntent failed, because no apiKey or redirect is configured for ${paymentMethod.code}`, loggerCtx);
            return new PaymentIntentError(`Paymentmethod ${paymentMethod.code} has no apiKey or redirectUrl configured`);
        }
        const mollieClient = createMollieClient({ apiKey });
        redirectUrl = redirectUrl.endsWith('/') ? redirectUrl.slice(0, -1) : redirectUrl; // remove appending slash
        const vendureHost = this.options.vendureHost.endsWith('/')
            ? this.options.vendureHost.slice(0, -1)
            : this.options.vendureHost; // remove appending slash
        const billingAddress = toMollieAddress(order.billingAddress, order.customer) || toMollieAddress(order.shippingAddress, order.customer);
        if (!billingAddress) {
            return new InvalidInputError(`Order doesn't have a complete shipping address or billing address. At least city, streetline1 and country are needed.`);
        }
        const orderInput: CreateParameters = {
            orderNumber: order.code,
            amount: toAmount(order.totalWithTax, order.currencyCode),
            redirectUrl: `${redirectUrl}/${order.code}`,
            webhookUrl: `${vendureHost}/payments/mollie/${ctx.channel.token}/${paymentMethod.id}`,
            billingAddress,
            locale: getLocale(billingAddress.country, ctx.languageCode),
            lines: toMollieOrderLines(order),
        };
        if (molliePaymentMethodCode) {
            orderInput.method = molliePaymentMethodCode as MollieClientMethod;
        }
        const mollieOrder = await mollieClient.orders.create(orderInput);
        Logger.info(`Created Mollie order ${mollieOrder.id} for order ${order.code}`);
        const url = mollieOrder.getCheckoutUrl();
        if (!url) {
            throw Error(`Unable to getCheckoutUrl() from Mollie order`);
        }
        return {
            url,
        };
    }

    /**
     * Handle Vendure payments and order status based on the incoming Mollie order
     */
    async handleMollieStatusUpdate({ channelToken, paymentMethodId, orderId }: OrderStatusInput): Promise<void> {
        const ctx = await this.createContext(channelToken);
        Logger.info(`Received status update for channel ${channelToken} for Mollie order ${orderId}`, loggerCtx);
        const paymentMethod = await this.paymentMethodService.findOne(ctx, paymentMethodId);
        if (!paymentMethod) {
            // Fail silently, as we don't want to expose if a paymentMethodId exists or not
            return Logger.warn(`No paymentMethod found with id ${paymentMethodId}`, loggerCtx);
        }
        const apiKey = paymentMethod.handler.args.find(a => a.name === 'apiKey')?.value;
        const autoCapture = !!paymentMethod.handler.args.find(a => a.name === 'autoCapture')?.value;
        if (!apiKey) {
            throw Error(`No apiKey found for payment ${paymentMethod.id} for channel ${channelToken}`);
        }
        const client = createMollieClient({ apiKey });
        const mollieOrder = await client.orders.get(orderId);
        Logger.info(`Processing status '${mollieOrder.status}' for order ${mollieOrder.orderNumber} for channel ${channelToken} for Mollie order ${orderId}`, loggerCtx);
        let order = await this.orderService.findOneByCode(ctx, mollieOrder.orderNumber, ['payments']);
        if (!order) {
            throw Error(`Unable to find order ${mollieOrder.orderNumber}, unable to process Mollie order ${mollieOrder.id}`);
        }
        if (mollieOrder.status === OrderStatus.paid ) {
            // Paid is only used by 1-step payments without Authorized state. This will settle immediately
            await this.addPayment(ctx, order, mollieOrder, paymentMethod.code);
            return;
        }
        if (order.state === 'AddingItems' && mollieOrder.status === OrderStatus.authorized) {
            order = await this.addPayment(ctx, order, mollieOrder, paymentMethod.code);
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
        if (order.state === 'PaymentAuthorized' || order.state === 'PaymentSettled') {
            Logger.info(`Order ${order.code} is '${order.state}', no need for handling Mollie status '${mollieOrder.status}'`, loggerCtx);
            return;
        }
        // Any other combination of Mollie status and Vendure status indicates something is wrong.
        throw Error(`Unhandled incoming Mollie status '${mollieOrder.status}' for order ${order.code} with status '${order.state}'`);
    }

    /**
     * Add payment to order. Can be settled or authorized depending on the payment method.
     */
    async addPayment(ctx: RequestContext, order: Order, mollieOrder: MollieOrder, paymentMethodCode: string): Promise<Order> {
        if (order.state !== 'ArrangingPayment') {
            const transitionToStateResult = await this.orderService.transitionToState(
                ctx,
                order.id,
                'ArrangingPayment',
            );
            if (transitionToStateResult instanceof OrderStateTransitionError) {
                throw Error(
                    `Error transitioning order ${order.code} from ${transitionToStateResult.fromState} to ${transitionToStateResult.toState}: ${transitionToStateResult.message}`);
            }
        }
        const addPaymentToOrderResult = await this.orderService.addPaymentToOrder(ctx, order.id, {
            method: paymentMethodCode,
            metadata: {
                status: mollieOrder.status,
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
            throw Error(
                `Error adding payment to order ${order.code}: ${addPaymentToOrderResult.message}`,
            );
        }
        return addPaymentToOrderResult;
    }

    /**
     * Settle an existing payment based on the given mollieOrder
     */
    async settleExistingPayment(ctx: RequestContext, order: Order, mollieOrderId: string): Promise<void> {
        const payment = order.payments.find(p => p.transactionId === mollieOrderId);
        if (!payment) {
            throw Error(`Cannot find payment ${mollieOrderId} for ${order.code}. Unable to settle this payment`);
        }
        const result = await this.orderService.settlePayment(ctx, payment.id);
        if ((result as ErrorResult).message) {
            throw Error(
                `Error settling payment ${payment.id} for order ${order.code}: ${(result as ErrorResult).errorCode} - ${(result as ErrorResult).message}`);
        }
    }

    async getEnabledPaymentMethods(ctx: RequestContext, paymentMethodCode: string): Promise<MolliePaymentMethod[]> {
        const paymentMethod = await this.getPaymentMethod(ctx, paymentMethodCode);
        const apiKey = paymentMethod?.handler.args.find(arg => arg.name === 'apiKey')?.value;
        if (!apiKey) {
            throw Error(`No apiKey configured for payment method ${paymentMethodCode}`);
        }
        const client = createMollieClient({ apiKey });
        const methods = await client.methods.list();
        return methods.map(m => ({
            ...m,
            code: m.id,
        }));
    }

    private async getPaymentMethod(ctx: RequestContext, paymentMethodCode: string): Promise<PaymentMethod | undefined> {
        const paymentMethods = await this.paymentMethodService.findAll(ctx);
        return paymentMethods.items.find(pm => pm.code === paymentMethodCode);
    }

    private async createContext(channelToken: string): Promise<RequestContext> {
        const channel = await this.channelService.getChannelFromToken(channelToken);
        return new RequestContext({
            apiType: 'admin',
            isAuthorized: true,
            authorizedAsOwnerOnly: false,
            channel,
            languageCode: LanguageCode.en,
        });
    }
}
