import {
    CreatePaymentResult,
    CreateRefundResult,
    Injector,
    LanguageCode,
    PaymentMethodHandler,
    SettlePaymentResult,
} from '@vendure/core';
import Stripe from 'stripe';

import { getAmountFromStripeMinorUnits, getAmountInStripeMinorUnits } from './stripe-utils';
import { StripeService } from './stripe.service';

const { StripeError } = Stripe.errors;

let stripeService: StripeService;

/**
 * The handler for Stripe payments.
 */
export const stripePaymentMethodHandler = new PaymentMethodHandler({
    code: 'stripe',

    description: [{ languageCode: LanguageCode.en, value: 'Stripe payments' }],

    args: {},

    init(injector: Injector) {
        stripeService = injector.get(StripeService);
    },

    async createPayment(ctx, order, amount, ___, metadata): Promise<CreatePaymentResult> {
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
        const result = await stripeService.createRefund(payment.transactionId, amount);

        if (result instanceof StripeError) {
            return {
                state: 'Failed' as const,
                transactionId: payment.transactionId,
                metadata: {
                    type: result.type,
                    message: result.message,
                },
            };
        }

        if (result.status === 'succeeded') {
            return {
                state: 'Settled' as const,
                transactionId: payment.transactionId,
            };
        }

        if (result.status === 'pending') {
            return {
                state: 'Pending' as const,
                transactionId: payment.transactionId,
            };
        }

        return {
            state: 'Failed' as const,
            transactionId: payment.transactionId,
            metadata: {
                message: result.failure_reason,
            },
        };
    },
});
