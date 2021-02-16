import { LanguageCode } from '@vendure/common/lib/generated-types';

import { CreatePaymentResult, PaymentMethodHandler } from './payment-method-handler';

/**
 * @description
 * A dummy PaymentMethodHandler which simply creates a Payment without any integration
 * with an external payment provider. Intended only for use in development.
 */
export const dummyPaymentHandler = new PaymentMethodHandler({
    code: 'dummy-payment-handler',
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'A dummy payment provider intended for testing and development only.',
        },
    ],
    args: {
        automaticSettle: {
            type: 'boolean',
            label: [
                {
                    languageCode: LanguageCode.en,
                    value: 'Authorize and settle in 1 step',
                },
            ],
            description: [
                {
                    languageCode: LanguageCode.en,
                    value: 'If enabled, Payments will be created in the "Settled" state.',
                },
            ],
            required: true,
            defaultValue: false,
        },
    },
    createPayment: async (ctx, order, amount, args, metadata): Promise<CreatePaymentResult> => {
        if (metadata.shouldDecline) {
            return {
                amount,
                state: 'Declined' as 'Declined',
                metadata: {
                    errorMessage: 'Simulated error',
                },
            };
        } else {
            return {
                amount,
                state: args.automaticSettle ? 'Settled' : 'Authorized',
                transactionId: Math.random().toString(36).substr(3),
                metadata,
            };
        }
    },
    settlePayment: async (ctx, order, payment, args) => {
        return {
            success: true,
            metadata: {},
        };
    },
});
