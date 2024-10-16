import {
    InternalServerError,
    Logger,
    PaymentMethod,
    PaymentMethodService,
    RequestContext,
} from '@vendure/core';

import { handlerCode, loggerCtx } from './constants';
import { ConfigArg } from './graphql/generated-shop-types';
import { PayPalError } from './paypal.error';
import { PayPalAuthorizationResponse, PayPalPluginOptions } from './types';

export abstract class PayPalBaseService {
    constructor(
        private readonly paymentMethodService: PaymentMethodService,
        protected readonly options: PayPalPluginOptions,
    ) {}

    protected async getPaymentHandlerArgs(ctx: RequestContext): Promise<ConfigArg[]> {
        const paymentMethod = await this.getPaymentMethod(ctx);
        if (!paymentMethod) {
            throw new InternalServerError('error.paypal-payment-method-not-configured');
        }
        if (!paymentMethod.handler.args) {
            throw new InternalServerError('error.error-in-paypal-payment-configuration');
        }

        return paymentMethod.handler.args;
    }

    protected async getPaymentMethod(ctx: RequestContext): Promise<PaymentMethod | undefined> {
        const allPaymentMethods = await this.paymentMethodService.findAll(ctx);
        return allPaymentMethods.items.find(item => item.handler?.code === handlerCode);
    }

    protected async authenticate(ctx: RequestContext): Promise<PayPalAuthorizationResponse> {
        const args = await this.getPaymentHandlerArgs(ctx);

        const clientId = args.find(arg => arg.name === 'clientId')?.value;
        const clientSecret = args.find(arg => arg.name === 'clientSecret')?.value;
        if (!clientId || !clientSecret) {
            throw new PayPalError('error.error-in-paypal-payment-configuration');
        }

        const authenticationToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        try {
            const response = await fetch(`${this.options.apiUrl}/v1/oauth2/token`, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${authenticationToken}`,
                },
                body: new URLSearchParams({
                    grant_type: 'client_credentials',
                    response_type: 'id_token',
                    intent: 'sdk_init',
                }),
            });

            if (!response.ok) {
                throw response;
            }

            return (await response.json()) as PayPalAuthorizationResponse;
        } catch (error: any) {
            const message = 'error.paypal-authentication-failed';
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
