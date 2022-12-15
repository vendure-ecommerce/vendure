import {
    CreatePaymentResult,
    LanguageCode,
    PaymentMethodHandler,
    SettlePaymentErrorResult,
    SettlePaymentResult,
    VendureConfig,
} from '@vendure/core';

/**
 * This is a handler which integrates Vendure with an imaginary
 * payment provider, who provide a Node SDK which we use to
 * interact with their APIs.
 */
const cardPaymentHandler = new PaymentMethodHandler({
    code: 'card',
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'Card Payment',
        },
    ],
    args: {},

    /** This is called when the `addPaymentToOrder` mutation is executed */
    createPayment: async (ctx, order, amount, args, metadata): Promise<CreatePaymentResult> => {
        return {
            amount: order.totalWithTax,
            state: 'Declined' as const,
            metadata: {
                errorMessage: 'This endpoint should not be called!',
            },
        };
    },

    /** This is called when the `settlePayment` mutation is executed */
    settlePayment: async (
        ctx,
        order,
        payment,
        args,
    ): Promise<SettlePaymentResult | SettlePaymentErrorResult> => {
        return {
            success: false,
            errorMessage: 'This endpoint should not be called!',
        };
    },
});
export default cardPaymentHandler;
