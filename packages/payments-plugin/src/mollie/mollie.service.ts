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
import { CreateParameters } from '@mollie/api-client/dist/types/src/binders/payments/parameters';
import { PaymentMethod as MollieClientMethod } from '@mollie/api-client';

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

class InvalidInput implements MolliePaymentIntentError {
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

    /**
     * Creates a redirectUrl to Mollie for the given paymentMethod and current activeOrder
     */
    async createPaymentIntent(
        ctx: RequestContext,
        { paymentMethodCode, molliePaymentMethodCode }: MolliePaymentIntentInput,
    ): Promise<MolliePaymentIntentResult> {
        const allowedMethods = Object.values(MollieClientMethod) as string[];
        if (molliePaymentMethodCode && !allowedMethods.includes(molliePaymentMethodCode)) {
            return new InvalidInput(`molliePaymentMethodCode has to be one of "${allowedMethods.join(',')}"`);
        }
        const [order, paymentMethod] = await Promise.all([
            this.activeOrderService.getOrderFromContext(ctx),
            this.getPaymentMethod(ctx, paymentMethodCode),
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
        const paymentInput: CreateParameters = {
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
        };
        if (molliePaymentMethodCode) {
            paymentInput.method = molliePaymentMethodCode as MollieClientMethod;
        }
        const payment = await mollieClient.payments.create(paymentInput);
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
