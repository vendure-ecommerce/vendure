import createMollieClient, { PaymentStatus } from '@mollie/api-client';
import { Body, Controller, Param, Post } from '@nestjs/common';
import {
    ChannelService,
    LanguageCode,
    Logger,
    OrderService,
    Payment,
    PaymentMethodService,
    RequestContext,
    TransactionalConnection,
} from '@vendure/core';

import { loggerCtx } from './constants';

@Controller('payments')
export class MollieController {
    constructor(
        private orderService: OrderService,
        private connection: TransactionalConnection,
        private paymentMethodService: PaymentMethodService,
        private channelService: ChannelService,
    ) {}

    @Post('mollie/:channelToken/:paymentMethodId')
    async webhook(
        @Param('channelToken') channelToken: string,
        @Param('paymentMethodId') paymentMethodId: string,
        @Body() body: any,
    ): Promise<void> {
        const ctx = await this.createContext(channelToken);
        Logger.info(`Received payment for ${channelToken}`, loggerCtx);
        const paymentMethod = await this.paymentMethodService.findOne(ctx, paymentMethodId);
        if (!paymentMethod) {
            // Fail silently, as we don't want to expose if a paymentMethodId exists or not
            return Logger.error(`No paymentMethod found with id ${paymentMethod}`, loggerCtx);
        }
        const apiKey = paymentMethod.handler.args.find(a => a.name === 'apiKey')?.value;
        if (!apiKey) {
            throw Error(`No apiKey found for payment ${paymentMethod.id} for channel ${channelToken}`);
        }
        const client = createMollieClient({ apiKey });
        const molliePayment = await client.payments.get(body.id);
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
