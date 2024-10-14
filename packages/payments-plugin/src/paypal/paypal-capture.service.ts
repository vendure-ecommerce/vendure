import { Inject } from '@nestjs/common';
import {
    ConfigService,
    CreatePaymentErrorResult,
    InternalServerError,
    Logger,
    Order,
    PaymentMethodService,
    RequestContext,
} from '@vendure/core';

import { loggerCtx, PAYPAL_PAYMENT_PLUGIN_OPTIONS } from './constants';
import { PayPalBaseService } from './paypal-base.service';
import { convertAmount } from './paypal-order.helpers';
import { PayPalError } from './paypal.error';
import { PayPalPluginOptions, PayPalRefundRequest, PayPalRefundResponse } from './types';

export class PayPalCaptureService extends PayPalBaseService {
    private readonly precision: number;

    constructor(
        @Inject(PAYPAL_PAYMENT_PLUGIN_OPTIONS) options: PayPalPluginOptions,
        paymentMethodService: PaymentMethodService,
        private readonly configService: ConfigService,
    ) {
        super(paymentMethodService, options);

        if (!this.configService.entityOptions.moneyStrategy?.precision) {
            throw new InternalServerError('error.money-strategy-not-configured');
        }

        this.precision = this.configService.entityOptions.moneyStrategy.precision;
    }

    async refundCapture(
        ctx: RequestContext,
        captureId: string,
        total: number,
        order: Order,
    ): Promise<PayPalRefundResponse> {
        const accessToken = (await this.authenticate(ctx)).access_token;

        const payload: PayPalRefundRequest = {
            amount: {
                currency_code: order.currencyCode,
                value: convertAmount(total, this.precision),
            },
        };

        try {
            const response = await fetch(`${this.options.apiUrl}/v2/payments/captures/${captureId}/refund`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                method: 'POST',
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw response;
            }

            return (await response.json()) as PayPalRefundResponse;
        } catch (error: any) {
            const message = 'error.paypal-refund-failed';
            if (error instanceof Response) {
                const responseClone = error.clone();
                Logger.error(message, loggerCtx, await responseClone.text());
            }

            Logger.error(message, loggerCtx, error?.stack);
            // Throw a generic error to avoid leaking sensitive information
            throw new PayPalError(message);
        }
    }
}
