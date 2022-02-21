import createMollieClient, { PaymentStatus } from '@mollie/api-client';
import { Inject, Injectable } from '@nestjs/common';
import {
    ActiveOrderService,
    ChannelService,
    LanguageCode,
    Logger,
    OrderService,
    Payment,
    PaymentMethodService,
    RequestContext,
    TransactionalConnection,
} from '@vendure/core';

import { loggerCtx, PLUGIN_INIT_OPTIONS } from './constants';
import { MolliePluginOptions } from './mollie.plugin';

interface SettlePaymentInput {
    channelToken: string;
    paymentMethodId: string;
    paymentId: string;
}

@Injectable()
export class MollieService {
    constructor(
        private paymentMethodService: PaymentMethodService,
        @Inject(PLUGIN_INIT_OPTIONS) private options: MolliePluginOptions,
        private activeOrderService: ActiveOrderService,
        private orderService: OrderService,
        private channelService: ChannelService,
        private connection: TransactionalConnection,
    ) {}

    /**
     * Creates a redirectUrl to Mollie for the given paymentMethod and current activeOrder
     */
    async createPaymentIntent(ctx: RequestContext, paymentMethodCode: string): Promise<string | undefined> {
        const [order, paymentMethods] = await Promise.all([
            this.activeOrderService.getOrderFromContext(ctx),
            this.paymentMethodService.findAll(ctx),
        ]);
        const paymentMethod = paymentMethods.items.find(pm => pm.code === paymentMethodCode);
        if (!paymentMethod) {
            throw Error(`No paymentMethod found with code ${paymentMethodCode}`); // This should never happen
        } else if (!order) {
            throw Error(`No active order found for session ${ctx.session?.id}`);
        }
        const apiKeyArg = paymentMethod.handler.args.find(arg => arg.name === 'apiKey');
        const redirectUrlArg = paymentMethod.handler.args.find(arg => arg.name === 'redirectUrl');
        if (!apiKeyArg || !redirectUrlArg) {
            throw Error(`Paymentmethod ${paymentMethod.code} has no apiKey or redirectUrl configured.`);
        }
        const apiKey = apiKeyArg.value;
        let redirectUrl = apiKeyArg.value;
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
            webhookUrl: `${vendureHost}/payments/mollie/${ctx.channel.token}/${paymentMethodId}`,
        });
        return payment.getPaymentUrl();
    }

    /**
     * Makes a request to Mollie to verify the given payment by id
     */
    async settlePayment({ channelToken, paymentMethodId, paymentId }: SettlePaymentInput) {
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
        Logger.info(
            `Received payment ${molliePayment.id} for order ${molliePayment.metadata.orderCode} with status ${molliePayment.status}`,
            loggerCtx,
        );
        const dbPayment = await this.connection
            .getRepository(Payment)
            .findOneOrFail({ where: { transactionId: molliePayment.id } });
        if (molliePayment.status === PaymentStatus.paid) {
            await this.orderService.settlePayment(ctx, dbPayment.id);
            Logger.info(`Payment for order ${molliePayment.metadata.orderCode} settled`, loggerCtx);
        } else {
            Logger.warn(
                `Received payment for order ${molliePayment.metadata.orderCode} with status ${molliePayment.status}`,
                loggerCtx,
            );
        }
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
