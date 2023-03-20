import { Body, Controller, Param, Post } from '@nestjs/common';
import { Logger } from '@vendure/core';

import { loggerCtx } from './constants';
import { MollieService } from './mollie.service';

@Controller('payments')
export class MollieController {
    constructor(private mollieService: MollieService) {}

    @Post('mollie/:channelToken/:paymentMethodId')
    async webhook(
        @Param('channelToken') channelToken: string,
        @Param('paymentMethodId') paymentMethodId: string,
        @Body() body: any,
    ): Promise<void> {
        if (!body.id) {
            return Logger.warn(' Ignoring incoming webhook, because it has no body.id.', loggerCtx);
        }
        try {
            await this.mollieService.handleMollieStatusUpdate({
                channelToken,
                paymentMethodId,
                orderId: body.id,
            });
        } catch (error: any) {
            Logger.error(
                `Failed to process incoming webhook: ${JSON.stringify(error?.message)}`,
                loggerCtx,
                error.stack,
            );
            throw error;
        }
    }
}
