import {
    InternalServerError,
    Logger,
    PaymentMethod,
    PaymentMethodService,
    RequestContext,
} from '@vendure/core';

import { handlerCode, loggerCtx } from './constants';
import { ConfigArg } from './graphql/generated-shop-types';
import { PayPalAuthorizationResponse, PayPalPluginOptions } from './types';

export abstract class PayPalBaseService {
    constructor(
        private readonly paymentMethodService: PaymentMethodService,
        protected readonly options: PayPalPluginOptions,
    ) {}

    protected async getPaymentHandlerArgs(ctx: RequestContext): Promise<ConfigArg[]> {
        const paymentMethod = await this.getPaymentMethod(ctx);
        if (!paymentMethod) {
            throw new InternalServerError('No PayPal payment method configured');
        }
        if (!paymentMethod.handler.args) {
            throw new InternalServerError('No args defined for PayPal payment method');
        }

        return paymentMethod.handler.args;
    }

    protected async getPaymentMethod(ctx: RequestContext): Promise<PaymentMethod | undefined> {
        const allPaymentMethods = await this.paymentMethodService.findAll(ctx);
        const paymentMethod = allPaymentMethods.items.find(item => item.handler?.code === handlerCode);

        return paymentMethod;
    }

    protected async authenticate(ctx: RequestContext): Promise<PayPalAuthorizationResponse> {
        const args = await this.getPaymentHandlerArgs(ctx);

        if (args.length <= 0) {
            throw new InternalServerError('PayPal payment method is not configured correctly.');
        }

        const clientId = args.find(arg => arg.name === 'clientId')?.value;
        const clientSecret = args.find(arg => arg.name === 'clientSecret')?.value;
        if (!clientId || !clientSecret) {
            throw new InternalServerError(
                'PayPal payment method is not configured correctly. Please set clientId and clientSecret.',
            );
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
            const message = 'PayPal authentication failed';
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
