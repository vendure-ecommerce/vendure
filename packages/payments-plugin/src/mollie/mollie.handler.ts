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
import { Permission } from '@vendure/core';

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
        // Creating a payment immediately settles the payment in Mollie flow, so only Admins and internal calls should be allowed to do this
        if (ctx.apiType !== 'admin') {
            throw Error(`CreatePayment is not allowed for apiType '${ctx.apiType}'`);
        }
        return {
            amount,
            state: 'Settled' as const,
            transactionId: metadata.paymentId,
            metadata // Store all given metadata on a payment
        };
    },
    settlePayment: async (ctx, order, payment, args): Promise<SettlePaymentResult> => {
        // this should never be called
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
