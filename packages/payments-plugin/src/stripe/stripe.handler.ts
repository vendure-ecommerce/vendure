import { CreatePaymentResult, LanguageCode, PaymentMethodHandler, SettlePaymentResult } from '@vendure/core';

/**
 * The handler for Stripe payments.
 */
export const stripePaymentMethodHandler = new PaymentMethodHandler({
    code: 'stripe',

    description: [{ languageCode: LanguageCode.en, value: 'Stripe payments' }],

    args: {},

    async createPayment(_, __, amount, ___, metadata): Promise<CreatePaymentResult> {
        // Payment is already settled in Stripe by the time the webhook in stripe.controller.ts
        // adds the payment to the order
        return {
            amount,
            state: 'Settled' as const,
            transactionId: metadata.paymentIntentId,
        };
    },

    settlePayment(): SettlePaymentResult {
        return {
            success: true,
        };
    },
});
