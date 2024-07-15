import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { Ctx, Logger, RequestContext, Transaction, ChannelService, LanguageCode } from '@vendure/core';
import { Request } from 'express';

import { loggerCtx } from './constants';
import { MollieService } from './mollie.service';

@Controller('payments')
export class MollieController {
    constructor(
        private mollieService: MollieService,
        private channelService: ChannelService,
    ) {}

    @Post('mollie/:channelToken/:paymentMethodId')
    @Transaction()
    async webhook(
        @Param('channelToken') channelToken: string,
        @Param('paymentMethodId') paymentMethodId: string,
        @Body() body: any,
        @Req() req: Request,
    ): Promise<void> {
        if (!body.id) {
            return Logger.warn(' Ignoring incoming webhook, because it has no body.id.', loggerCtx);
        }
        try {
            // We need to construct a RequestContext based on the channelToken,
            // because this is an incoming webhook, not a graphql request with a valid Ctx
            const ctx = await this.createContext(channelToken, req);
            await this.mollieService.handleMollieStatusUpdate(ctx, {
                paymentMethodId,
                orderId: body.id,
            });
        } catch (error: any) {
            Logger.error(
                `Failed to process incoming webhook: ${JSON.stringify(error?.message)}`,
                loggerCtx,
                error,
            );
            throw error;
        }
    }

    private async createContext(channelToken: string, req: Request): Promise<RequestContext> {
        const channel = await this.channelService.getChannelFromToken(channelToken);
        return new RequestContext({
            apiType: 'admin',
            isAuthorized: true,
            authorizedAsOwnerOnly: false,
            channel,
            req,
            languageCode: LanguageCode.en,
        });
    }
}
