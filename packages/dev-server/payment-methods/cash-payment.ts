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
const cashPaymentHandler = new PaymentMethodHandler({
    code: 'cash',
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'Cash Payment',
        },
    ],
    args: {},

    /** This is called when the `addPaymentToOrder` mutation is executed */
    createPayment: async (ctx, order, amount, args, metadata): Promise<CreatePaymentResult> => {
        try {
            return {
                amount: order.totalWithTax,
                state: 'Authorized' as const,
            };
        } catch (err: any) {
            return {
                amount: order.totalWithTax,
                state: 'Declined' as const,
                metadata: {
                    errorMessage: err.message,
                },
            };
        }
    },

    /** This is called when the `settlePayment` mutation is executed */
    settlePayment: async (
        ctx,
        order,
        payment,
        args,
    ): Promise<SettlePaymentResult | SettlePaymentErrorResult> => {
        try {
            return { success: true };
        } catch (err: any) {
            return {
                success: false,
                errorMessage: err.message,
            };
        }
    },
});
export default cashPaymentHandler;
