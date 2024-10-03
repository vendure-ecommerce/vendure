import { Inject } from '@nestjs/common';
import {
    ConfigService,
    CreatePaymentErrorResult,
    InternalServerError,
    Order,
    PaymentMethodService,
    RequestContext,
} from '@vendure/core';

import { PAYPAL_PAYMENT_PLUGIN_OPTIONS } from './constants';
import { PayPalBaseService } from './paypal-base.service';
import { convertAmount } from './paypal-order.helpers';
import {
    PayPalOrderInformation,
    PayPalPluginOptions,
    PayPalRefundRequest,
    PayPalRefundResponse,
} from './types';

export class PayPalCaptureService extends PayPalBaseService {
    private readonly precision: number;

    constructor(
        @Inject(PAYPAL_PAYMENT_PLUGIN_OPTIONS) options: PayPalPluginOptions,
        paymentMethodService: PaymentMethodService,
        private readonly configService: ConfigService,
    ) {
        super(paymentMethodService, options);

        if (!this.configService.entityOptions.moneyStrategy) {
            throw new Error('No MoneyStrategy configured. Please check your Vendure configuration.');
        }
        if (!this.configService.entityOptions.moneyStrategy.precision) {
            throw new Error('MoneyStrategy precision is not provided.');
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
                throw new Error();
            }

            return (await response.json()) as PayPalRefundResponse;
        } catch (error) {
            throw new InternalServerError('PayPal refund failed.');
        }
    }
}
