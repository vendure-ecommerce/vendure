import createMollieClient, { RefundStatus } from '@mollie/api-client';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import {
    CreatePaymentErrorResult,
    CreatePaymentResult,
    CreateRefundResult,
    Logger,
    PaymentMethodHandler,
    PaymentMethodService,
    SettlePaymentResult,
} from '@vendure/core';

import { loggerCtx, PLUGIN_INIT_OPTIONS } from './constants';
import { MollieService } from './mollie.service';

let mollieService: MollieService;
export const molliePaymentHandler = new PaymentMethodHandler({
    code: 'mollie-payment-handler',
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'Mollie payment',
        },
    ],
    args: {
        apiKey: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'API Key' }],
        },
        redirectUrl: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'Redirect URL' }],
            description: [
                { languageCode: LanguageCode.en, value: 'Redirect the client to this URL after payment' },
            ],
        },
    },
    init(injector) {
        mollieService = injector.get(MollieService);
    },
    createPayment: async (
        ctx,
        order,
        amount,
        args,
        metadata,
    ): Promise<CreatePaymentResult | CreatePaymentErrorResult> => {
        // Payment is already settled in Mollie by the time the webhook in mollie.controller.ts
        // adds the payment to the order
        return {
            amount,
            state: 'Settled' as const,
            transactionId: metadata.paymentIntentId,
        };
    },
    settlePayment: async (order, payment, args): Promise<SettlePaymentResult> => {
        // Settlement is handled by incoming webhook in mollie.controller.ts
        return { success: true };
    },
    createRefund: async (ctx, input, amount, order, payment, args): Promise<CreateRefundResult> => {
        const { apiKey } = args;
        const mollieClient = createMollieClient({ apiKey });
        const refund = await mollieClient.payments_refunds.create({
            paymentId: payment.transactionId,
            description: input.reason,
            amount: {
                value: (amount / 100).toFixed(2),
                currency: order.currencyCode,
            },
        });
        if (refund.status === RefundStatus.failed) {
            Logger.error(
                `Failed to create refund of ${amount.toFixed()} for order ${order.code} for transaction ${
                    payment.transactionId
                }`,
                loggerCtx,
            );
            return {
                state: 'Failed',
                transactionId: payment.transactionId,
            };
        }
        Logger.info(
            `Created refund of ${amount.toFixed()} for order ${order.code} for transaction ${
                payment.transactionId
            }`,
            loggerCtx,
        );
        return {
            state: 'Settled',
            transactionId: payment.transactionId,
        };
    },
});
