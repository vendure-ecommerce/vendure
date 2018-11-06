import { PaymentConfig, PaymentMethodHandler } from './payment-method-handler';

const gripeSDK = {
    charges: {
        create: (options: any) => {
            return Promise.resolve({
                id: Math.random()
                    .toString(36)
                    .substr(3),
            });
        },
    },
};

/**
 * An example of a payment method which sets up and authorizes the payment on the client side and then
 * requires a further step on the server side to charge the card.
 */
export const gripePaymentHandler = new PaymentMethodHandler({
    code: 'gripe',
    name: 'Gripe Checkout',
    args: {
        apiKey: 'string',
    },
    createPayment: async (order, args, metadata): Promise<PaymentConfig> => {
        try {
            const result = await gripeSDK.charges.create({
                apiKey: args.apiKey,
                amount: order.total,
                source: metadata.authToken,
            });
            return {
                amount: order.total,
                state: 'Settled' as 'Settled',
                transactionId: result.id.toString(),
                metadata: {
                    sampleMetadata: 'some arbitrary values',
                },
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
});
