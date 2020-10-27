import { LanguageCode } from '@vendure/common/lib/generated-types';

import { CreatePaymentResult, PaymentMethodHandler } from './payment-method-handler';

/**
 * A dummy API to simulate an SDK provided by a popular payments service.
 */
const gripeSDK = {
    charges: {
        create: (options: any) => {
            return Promise.resolve({
                id: Math.random().toString(36).substr(3),
            });
        },
        capture: (transactionId: string) => {
            return true;
        },
    },
};

/**
 * An example of a payment method which sets up and authorizes the payment on the client side and then
 * requires a further step on the server side to charge the card.
 */
export const examplePaymentHandler = new PaymentMethodHandler({
    code: 'example-payment-provider',
    description: [{ languageCode: LanguageCode.en, value: 'Example Payment Provider' }],
    args: {
        automaticCapture: { type: 'boolean' },
        apiKey: { type: 'string' },
    },
    createPayment: async (ctx, order, args, metadata): Promise<CreatePaymentResult> => {
        try {
            const result = await gripeSDK.charges.create({
                apiKey: args.apiKey,
                amount: order.total,
                source: metadata.authToken,
            });
            return {
                amount: order.total,
                state: args.automaticCapture ? 'Settled' : 'Authorized',
                transactionId: result.id.toString(),
                metadata,
            };
        } catch (err) {
            return {
                amount: order.total,
                state: 'Declined' as 'Declined',
                metadata: {
                    errorMessage: err.message,
                },
            };
        }
    },
    settlePayment: async (ctx, order, payment, args) => {
        const result = await gripeSDK.charges.capture(payment.transactionId);
        return {
            success: result,
            metadata: {
                captureId: '1234567',
            },
        };
    },
});
