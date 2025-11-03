import createMollieClient, { PaymentStatus, RefundStatus } from '@mollie/api-client';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import {
    CreatePaymentErrorResult,
    CreatePaymentResult,
    CreateRefundResult,
    Logger,
    PaymentMethodHandler,
    SettlePaymentResult,
} from '@vendure/core';

import { loggerCtx } from './constants';
import { toAmount } from './mollie.helpers';
import { MollieService } from './mollie.service';
import { MolliePaymentMetadata } from './types';

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
            required: true,
            defaultValue: '',
            label: [{ languageCode: LanguageCode.en, value: 'Fallback redirect URL' }],
            description: [
                {
                    languageCode: LanguageCode.en,
                    value: 'Redirect URL to use when no URL is given by the storefront. Order code is appended to this URL',
                },
            ],
        },
    },
    init(injector) {
        mollieService = injector.get(MollieService);
    },
    createPayment: (
        ctx,
        order,
        _amount, // Don't use this amount, but the amount from the metadata, because that has the actual paid amount from Mollie
        args,
        _metadata, // Use type asserted 'mollieMetadata' instead of this
    ): CreatePaymentResult | CreatePaymentErrorResult => {
        // Only Admins and internal calls should be allowed to settle and authorize payments
        if (ctx.apiType !== 'admin' && ctx.apiType !== 'custom') {
            throw Error(`CreatePayment is not allowed for apiType '${ctx.apiType}'`);
        }
        const mollieMetadata = _metadata as MolliePaymentMetadata;
        if (mollieMetadata.status !== 'Authorized' && mollieMetadata.status !== 'Settled') {
            throw Error(
                `Cannot create payment for status ${mollieMetadata.status as string} for order ${
                    order.code
                }. Only Authorized or Settled are allowed.`,
            );
        }
        Logger.info(
            `Payment for order ${order.code} with amount ${mollieMetadata.amount} created with state '${
                mollieMetadata.status as string
            }'`,
            loggerCtx,
        );
        return {
            amount: mollieMetadata.amount,
            state: mollieMetadata.status,
            transactionId: mollieMetadata.paymentId,
            metadata: mollieMetadata, // Store all given metadata on a payment
        };
    },
    settlePayment: async (ctx, order, payment, args): Promise<SettlePaymentResult> => {
        // Called for Authorized payments
        const { apiKey } = args;
        const mollieClient = createMollieClient({ apiKey });
        const molliePayment = await mollieClient.payments.get(payment.transactionId);
        if (molliePayment.status === PaymentStatus.paid) {
            Logger.info(`Payment '${payment.id}' for ${order.code} is already captured`, loggerCtx);
            return { success: true };
        }
        // We poll 10 x 500ms to see if the payment is captured, because it is done async, but usually fast enough to wait
        let capture = await mollieClient.paymentCaptures.create({
            paymentId: molliePayment.id,
            amount: molliePayment.amount,
        });
        for (let i = 0; i < 10; i++) {
            capture = await mollieClient.paymentCaptures.get(capture.id, { paymentId: molliePayment.id });
            if (capture.status === 'succeeded') {
                Logger.info(`Payment '${payment.id}' for ${order.code} is captured.`, loggerCtx);
                return { success: true };
            }
            if (capture.status === 'failed') {
                throw new Error(
                    `Failed to capture payment '${payment.id}' for ${order.code}. Please check your Mollie dashboard for payment '${molliePayment.id}' for more details.`,
                );
            }
            // Wait 500ms before next attempt
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        throw new Error(
            `Failed to capture payment after 10 attempts. Last status: '${capture.status}'. Try again later`,
        );
    },
    createRefund: async (ctx, input, amount, order, payment, args): Promise<CreateRefundResult> => {
        const { apiKey } = args;
        const mollieClient = createMollieClient({ apiKey });
        const molliePayment = await mollieClient.payments.get(payment.transactionId);
        if (!molliePayment) {
            throw Error(
                `No payment with status 'paid' was found in Mollie for order ${order.code} (Mollie payment ${payment.transactionId})`,
            );
        }
        const refund = await mollieClient.paymentRefunds.create({
            paymentId: molliePayment.id,
            description: input.reason,
            amount: toAmount(amount, order.currencyCode),
        });
        if (refund.status === RefundStatus.failed) {
            Logger.error(
                `Failed to create refund of ${amount.toFixed()} for order ${order.code} for transaction ${
                    molliePayment.id
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
