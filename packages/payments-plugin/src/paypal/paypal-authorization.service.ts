import { Inject } from '@nestjs/common';
import { InternalServerError, Logger, PaymentMethodService, RequestContext } from '@vendure/core';

import { loggerCtx, PAYPAL_PAYMENT_PLUGIN_OPTIONS } from './constants';
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
                throw response;
            }

            return (await response.json()) as PayPalOrderInformation;
        } catch (error: any) {
            const message = 'Failed to get PayPal authorization details';
            if (error instanceof Response) {
                const responseClone = error.clone();
                Logger.error(message, loggerCtx, await responseClone.text());
            }

            Logger.error(message, loggerCtx, error?.stack);
            // Throw a generic error to avoid leaking sensitive information
            throw new InternalServerError(message);
        }
    }

    async reauthorizeOrder(ctx: RequestContext, authorizationId: string): Promise<PayPalOrderInformation> {
        const accessToken = (await this.authenticate(ctx)).access_token;

        try {
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
                throw response;
            }

            return (await response.json()) as PayPalOrderInformation;
        } catch (error: any) {
            const message = 'PayPal reauthorization failed';
            if (error instanceof Response) {
                const responseClone = error.clone();
                Logger.error(message, loggerCtx, await responseClone.text());
            }

            Logger.error(message, loggerCtx, error?.stack);
            // Throw a generic error to avoid leaking sensitive information
            throw new InternalServerError(message);
        }
    }

    async authorizeOrder(ctx: RequestContext, paypalOrderId: string): Promise<PayPalOrderInformation> {
        const accessToken = (await this.authenticate(ctx)).access_token;

        try {
            const response = await fetch(
                `${this.options.apiUrl}/v2/checkout/orders/${paypalOrderId}/authorize`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            if (!response.ok) {
                throw response;
            }

            return (await response.json()) as PayPalOrderInformation;
        } catch (error: any) {
            const message = 'PayPal authorization failed';
            if (error instanceof Response) {
                const responseClone = error.clone();
                Logger.error(message, loggerCtx, await responseClone.text());
            }

            Logger.error(message, loggerCtx, error?.stack);
            // Throw a generic error to avoid leaking sensitive information
            throw new InternalServerError(message);
        }
    }

    async captureAuthorization(
        ctx: RequestContext,
        authorizationId: string,
    ): Promise<PayPalOrderInformation> {
        const accessToken = (await this.authenticate(ctx)).access_token;

        try {
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
                throw response;
            }

            return (await response.json()) as PayPalOrderInformation;
        } catch (error: any) {
            const message = 'PayPal capture failed';
            if (error instanceof Response) {
                const responseClone = error.clone();
                Logger.error(message, loggerCtx, await responseClone.text());
            }

            Logger.error(message, loggerCtx, error?.stack);
            // Throw a generic error to avoid leaking sensitive information
            throw new InternalServerError(message);
        }
    }
}
