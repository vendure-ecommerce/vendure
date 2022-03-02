import createMollieClient, { PaymentStatus } from '@mollie/api-client';
import { Inject, Injectable } from '@nestjs/common';
import {
    ActiveOrderService,
    ChannelService,
    EntityHydrator,
    LanguageCode,
    Logger,
    Order,
    OrderService,
    PaymentMethodService,
    RequestContext,
} from '@vendure/core';
import { OrderStateTransitionError } from '@vendure/core/dist/common/error/generated-graphql-shop-errors';

import { loggerCtx, PLUGIN_INIT_OPTIONS } from './constants';
import { ErrorCode, MolliePaymentIntentError, MolliePaymentIntentResult } from './graphql/generated-shop-types';
import { MolliePluginOptions } from './mollie.plugin';

interface SettlePaymentInput {
    channelToken: string;
    paymentMethodId: string;
    paymentId: string;
}

class PaymentIntentError implements MolliePaymentIntentError {
    errorCode = ErrorCode.ORDER_PAYMENT_STATE_ERROR;
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

    /**
     * Creates a redirectUrl to Mollie for the given paymentMethod and current activeOrder
     */
    async createPaymentIntent(ctx: RequestContext, paymentMethodCode: string): Promise<MolliePaymentIntentResult> {
        const [order, paymentMethods] = await Promise.all([
            this.activeOrderService.getOrderFromContext(ctx),
            this.paymentMethodService.findAll(ctx),
        ]);
        if (!order) {
            return new PaymentIntentError('No active order found for session');
        }
        await this.entityHydrator.hydrate(ctx, order, { relations: ['lines', 'customer', 'shippingLines'] });
        if (!order.lines?.length) {
            return new PaymentIntentError('Cannot create payment intent for empty order');
        }
        if (!order.customer) {
            return new PaymentIntentError('Cannot create payment intent for order without customer');
        }
        if (!order.shippingLines?.length) {
            return new PaymentIntentError('Cannot create payment intent for order without shippingMethod');
        }
        const paymentMethod = paymentMethods.items.find(pm => pm.code === paymentMethodCode);
        if (!paymentMethod) {
            return new PaymentIntentError(`No paymentMethod found with code ${paymentMethodCode}`);
        }
        const apiKeyArg = paymentMethod.handler.args.find(arg => arg.name === 'apiKey');
        const redirectUrlArg = paymentMethod.handler.args.find(arg => arg.name === 'redirectUrl');
        if (!apiKeyArg || !redirectUrlArg) {
            Logger.warn(`CreatePaymentIntent failed, because no apiKey or redirect is configured for ${paymentMethod.code}`, loggerCtx);
            return new PaymentIntentError(`Paymentmethod ${paymentMethod.code} has no apiKey or redirectUrl configured`);
        }
        const apiKey = apiKeyArg.value;
        let redirectUrl = redirectUrlArg.value;
        const mollieClient = createMollieClient({ apiKey });
        redirectUrl = redirectUrl.endsWith('/') ? redirectUrl.slice(0, -1) : redirectUrl; // remove appending slash
        const vendureHost = this.options.vendureHost.endsWith('/')
            ? this.options.vendureHost.slice(0, -1)
            : this.options.vendureHost; // remove appending slash
        const payment = await mollieClient.payments.create({
            amount: {
                value: `${(order.totalWithTax / 100).toFixed(2)}`,
                currency: order.currencyCode,
            },
            metadata: {
                orderCode: order.code,
            },
            description: `Order ${order.code}`,
            redirectUrl: `${redirectUrl}/${order.code}`,
            webhookUrl: `${vendureHost}/payments/mollie/${ctx.channel.token}/${paymentMethod.id}`,
        });
        const url = payment.getCheckoutUrl();
        if (!url) {
            throw Error(`Unable to getCheckoutUrl() from Mollie payment`);
        }
        return {
            url,
        };
    }

    /**
     * Makes a request to Mollie to verify the given payment by id
     */
    async settlePayment({ channelToken, paymentMethodId, paymentId }: SettlePaymentInput): Promise<void> {
        const ctx = await this.createContext(channelToken);
        Logger.info(`Received payment for ${channelToken}`, loggerCtx);
        const paymentMethod = await this.paymentMethodService.findOne(ctx, paymentMethodId);
        if (!paymentMethod) {
            // Fail silently, as we don't want to expose if a paymentMethodId exists or not
            return Logger.warn(`No paymentMethod found with id ${paymentMethodId}`, loggerCtx);
        }
        const apiKey = paymentMethod.handler.args.find(a => a.name === 'apiKey')?.value;
        if (!apiKey) {
            throw Error(`No apiKey found for payment ${paymentMethod.id} for channel ${channelToken}`);
        }
        const client = createMollieClient({ apiKey });
        const molliePayment = await client.payments.get(paymentId);
        const orderCode = molliePayment.metadata.orderCode;
        if (molliePayment.status !== PaymentStatus.paid) {
            return Logger.warn(
                `Received payment for ${channelToken} for order ${orderCode} with status ${molliePayment.status}`,
                loggerCtx,
            );
        }
        if (!orderCode) {
            throw Error(`Molliepayment does not have metadata.orderCode, unable to settle payment ${molliePayment.id}!`);
        }
        Logger.info(
            `Received payment ${molliePayment.id} for order ${orderCode} with status ${molliePayment.status}`,
            loggerCtx,
        );
        const order = await this.orderService.findOneByCode(ctx, orderCode);
        if (!order) {
            throw Error(`Unable to find order ${orderCode}, unable to settle payment ${molliePayment.id}!`);
        }
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
            method: paymentMethod.code,
            metadata: {
                paymentId: molliePayment.id,
                mode: molliePayment.mode,
                method: molliePayment.method,
                profileId: molliePayment.profileId,
                settlementAmount: molliePayment.settlementAmount,
                customerId: molliePayment.customerId,
                authorizedAt: molliePayment.authorizedAt,
                paidAt: molliePayment.paidAt,
            },
        });
        if (!(addPaymentToOrderResult instanceof Order)) {
            throw Error(
                `Error adding payment to order ${orderCode}: ${addPaymentToOrderResult.message}`,
            );
        }
        Logger.info(`Payment for order ${molliePayment.metadata.orderCode} settled`, loggerCtx);
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
