import { LanguageCode } from '@vendure/common/lib/generated-types';
import {
    CreatePaymentResult,
    CreateRefundResult,
    Logger,
    PaymentMethodHandler,
    SettlePaymentResult,
} from '@vendure/core';
import { Stripe } from 'stripe';

import { loggerCtx } from './constants';
import { getGateway } from './stripe-common';

/**
 * The handler for stripe payments
 */
export const stripePaymentMethodHandler: any = new PaymentMethodHandler({
    code: 'stripe',
    description: [{ languageCode: LanguageCode.en, value: 'stripe_description' }],
    args: {
        automaticCapture: {
            type: 'boolean',
        },
        secretKey: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'stripe_secret_key' }],
        },
        publishedKey: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'stripe_published_key' }],
        },
    },

    createPayment: async (order: any, args: any, metadata: any): Promise<CreatePaymentResult> => {
        const gateway = getGateway(args);
        let intent!: Stripe.Response<Stripe.PaymentIntent>;

        try {
            intent = await gateway.paymentIntents.create({
                amount: order.total,
                currency: order.currencyCode,
                payment_method: metadata.paymentMethod.id,
                capture_method: args.automaticCapture ? 'automatic' : 'manual',
                confirmation_method: args.automaticCapture ? 'automatic' : 'manual',
                confirm: true,
            });
        } catch (e: any) {
            Logger.error(e, loggerCtx);
        }

        return {
            amount: order.total,
            state: args.automaticCapture ? 'Settled' : 'Authorized',
            transactionId: intent?.id.toString(),
            metadata: intent,
        };
    },

    settlePayment: async (order: any, payment: any, args): Promise<SettlePaymentResult> => {
        const gateway = getGateway(args);
        let response;
        try {
            response = await gateway?.paymentIntents?.capture(payment?.metadata?.id, {
                amount_to_capture: order?.total,
            });
        } catch (e: any) {
            Logger.error(e, loggerCtx);
            return {
                success: true,
                metadata: response,
            };
        }

        return {
            success: true,
            metadata: response,
        };
    },

    // createRefund: async (input, total, order, payment: any, args): Promise<CreateRefundResult> => {
    //     const gateway = getGateway(args);
    //     let response;

    //     // try {
    //     //     response = await gateway?.refunds?.create({
    //     //         // @ts-ignore
    //     //         payment_intent: payment?.metadata?.id,
    //     //         amount: total,
    //     //         reason: 'requested_by_customer',
    //     //     });
    //     // } catch (e: any) {
    //     //     // TODO: might be a better way to handle errors from bad responses.
    //     //     // https://stripe.com/docs/error-codes#charge-already-refunded
    //     //     if (e.type === 'StripeInvalidRequestError') {
    //     //         switch (e.code) {
    //     //             case 'charge_already_refunded':
    //     //                 return {
    //     //                     state: 'Failed' as const,
    //     //                     transactionId: payment?.transactionId,
    //     //                     metadata: {
    //     //                         response: e.raw,
    //     //                     },
    //     //                 };
    //     //         }
    //     //     }
    //     // }

    //     if (response?.status === 'failed') {
    //         return {
    //             state: 'Failed' as const,
    //             transactionId: response.id,
    //             metadata: response,
    //         };
    //     }

    //     return {
    //         state: 'Settled' as const,
    //         transactionId: response?.id,
    //         metadata: response,
    //     };
    // },
});
