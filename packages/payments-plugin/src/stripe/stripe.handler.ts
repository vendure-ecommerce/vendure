import {
    CreatePaymentResult,
    CreateRefundResult,
    Injector,
    LanguageCode,
    PaymentMethodHandler,
    SettlePaymentResult,
} from '@vendure/core';
import Stripe from 'stripe';

import { getAmountFromStripeMinorUnits } from './stripe-utils';
import { StripeService } from './stripe.service';

const { StripeError } = Stripe.errors;

let stripeService: StripeService;

/**
 * The handler for Stripe payments.
 */
export const stripePaymentMethodHandler = new PaymentMethodHandler({
    code: 'stripe',

    description: [{ languageCode: LanguageCode.en, value: 'Stripe payments' }],

    args: {
        apiKey: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'API Key' }],
            ui: { component: 'password-form-input' },
        },
        webhookSecret: {
            type: 'string',
            label: [
                {
                    languageCode: LanguageCode.en,
                    value: 'Webhook secret',
                },
            ],
            description: [
                {
                    languageCode: LanguageCode.en,
                    value: 'Secret to validate incoming webhooks. Get this from your Stripe dashboard',
                },
            ],
            ui: { component: 'password-form-input' },
        },
    },

    init(injector: Injector) {
        stripeService = injector.get(StripeService);
    },

    createPayment(ctx, order, amount, ___, metadata): CreatePaymentResult {
        // Payment is already settled in Stripe by the time the webhook in stripe.controller.ts
        // adds the payment to the order
        if (ctx.apiType !== 'admin') {
            throw Error(`CreatePayment is not allowed for apiType '${ctx.apiType}'`);
        }
        const amountInMinorUnits = getAmountFromStripeMinorUnits(order, metadata.paymentIntentAmountReceived);
        return {
            amount: amountInMinorUnits,
            state: 'Settled' as const,
            transactionId: metadata.paymentIntentId,
        };
    },

    settlePayment(): SettlePaymentResult {
        return {
            success: true,
        };
    },

    async createRefund(ctx, input, amount, order, payment, args): Promise<CreateRefundResult> {
        // TODO: Consider passing the "reason" property once this feature request is addressed:
        // https://github.com/vendure-ecommerce/vendure/issues/893
        try {
            const refund = await stripeService.createRefund(ctx, order, payment, amount);
            if (refund.status === 'succeeded') {
                return {
                    state: 'Settled' as const,
                    transactionId: payment.transactionId,
                };
            }

            if (refund.status === 'pending') {
                return {
                    state: 'Pending' as const,
                    transactionId: payment.transactionId,
                };
            }

            return {
                state: 'Failed' as const,
                transactionId: payment.transactionId,
                metadata: {
                    message: refund.failure_reason,
                },
            };
        } catch (e: any) {
            if (e instanceof StripeError) {
                return {
                    state: 'Failed' as const,
                    transactionId: payment.transactionId,
                    metadata: {
                        type: e.type,
                        message: e.message,
                    },
                };
            }
            throw e;
        }
    },
});
