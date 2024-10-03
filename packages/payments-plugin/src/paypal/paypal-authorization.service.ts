import { Inject } from '@nestjs/common';
import { InternalServerError, PaymentMethodService, RequestContext } from '@vendure/core';

import { PAYPAL_PAYMENT_PLUGIN_OPTIONS } from './constants';
import { PayPalBaseService } from './paypal-base.service';
import { PayPalOrderInformation, PayPalPluginOptions } from './types';

export class PayPalAuthorizationService extends PayPalBaseService {
    constructor(
        @Inject(PAYPAL_PAYMENT_PLUGIN_OPTIONS) options: PayPalPluginOptions,
        paymentMethodService: PaymentMethodService,
    ) {
        super(paymentMethodService, options);
    }

    async authorizationDetails(
        ctx: RequestContext,
        authorizationId: string,
    ): Promise<PayPalOrderInformation> {
        const accessToken = (await this.authenticate(ctx)).access_token;

        try {
            const response = await fetch(`${this.options.apiUrl}/v2/checkout/orders/${authorizationId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get PayPal order details.');
            }

            return (await response.json()) as PayPalOrderInformation;
        } catch (error) {
            throw new InternalServerError('PayPal integration failed');
        }
    }

    async reauthorizeOrder(ctx: RequestContext, authorizationId: string): Promise<PayPalOrderInformation> {
        const accessToken = (await this.authenticate(ctx)).access_token;

        const response = await fetch(
            `${this.options.apiUrl}/v2/payments/authorizations/${authorizationId}/reauthorize`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error('Failed to reauthorize PayPal order.');
        }

        return (await response.json()) as PayPalOrderInformation;
    }

    async authorizeOrder(ctx: RequestContext, paypalOrderId: string): Promise<PayPalOrderInformation> {
        const accessToken = (await this.authenticate(ctx)).access_token;

        const response = await fetch(`${this.options.apiUrl}/v2/checkout/orders/${paypalOrderId}/authorize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to authorize PayPal order.');
        }

        return (await response.json()) as PayPalOrderInformation;
    }

    async captureAuthorization(
        ctx: RequestContext,
        authorizationId: string,
    ): Promise<PayPalOrderInformation> {
        const accessToken = (await this.authenticate(ctx)).access_token;

        const response = await fetch(
            `${this.options.apiUrl}/v2/payments/authorizations/${authorizationId}/capture`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error('Failed to capture payment.');
        }

        return (await response.json()) as PayPalOrderInformation;
    }
}
