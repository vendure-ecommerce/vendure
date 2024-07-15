import createMollieClient, {
    OrderEmbed,
    PaymentStatus,
    RefundStatus,
    Order as MollieOrder,
} from '@mollie/api-client';
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
        autoCapture: {
            type: 'boolean',
            label: [{ languageCode: LanguageCode.en, value: 'Auto capture payments' }],
            defaultValue: false,
            description: [
                {
                    languageCode: LanguageCode.en,
                    value:
                        'This option only affects pay-later methods. Automatically capture payments ' +
                        'immediately after authorization. Without autoCapture orders will remain in the PaymentAuthorized state, ' +
                        'and you need to manually settle payments to get paid.',
                },
            ],
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
        metadata,
    ): CreatePaymentResult | CreatePaymentErrorResult => {
        // Only Admins and internal calls should be allowed to settle and authorize payments
        if (ctx.apiType !== 'admin' && ctx.apiType !== 'custom') {
            throw Error(`CreatePayment is not allowed for apiType '${ctx.apiType}'`);
        }
        if (metadata.status !== 'Authorized' && metadata.status !== 'Settled') {
            throw Error(
                `Cannot create payment for status ${metadata.status as string} for order ${
                    order.code
                }. Only Authorized or Settled are allowed.`,
            );
        }
        Logger.info(
            `Payment for order ${order.code} with amount ${metadata.amount as string} created with state '${
                metadata.status as string
            }'`,
            loggerCtx,
        );
        return {
            amount: metadata.amount,
            state: metadata.status,
            transactionId: metadata.orderId, // The plugin now only supports 1 payment per order, so a mollie order equals a payment
            metadata, // Store all given metadata on a payment
        };
    },
    settlePayment: async (ctx, order, payment, args): Promise<SettlePaymentResult> => {
        // Called for Authorized payments
        const { apiKey } = args;
        const mollieClient = createMollieClient({ apiKey });
        const mollieOrder = await mollieClient.orders.get(payment.transactionId);
        // Order could have been completed via Mollie dashboard, then we can just settle
        if (!mollieOrder.isCompleted()) {
            await mollieClient.orders_shipments.create({ orderId: payment.transactionId }); // Creating a shipment captures the payment
        }
        Logger.info(`Settled payment for ${order.code}`, loggerCtx);
        return { success: true };
    },
    createRefund: async (ctx, input, amount, order, payment, args): Promise<CreateRefundResult> => {
        const { apiKey } = args;
        const mollieClient = createMollieClient({ apiKey });
        const mollieOrder = await mollieClient.orders.get(payment.transactionId, {
            embed: [OrderEmbed.payments],
        });
        const molliePayments = await mollieOrder.getPayments();
        const molliePayment = molliePayments.find(p => p.status === PaymentStatus.paid); // Only one paid payment should be there
        if (!molliePayment) {
            throw Error(
                `No payment with status 'paid' was found in Mollie for order ${order.code} (Mollie order ${mollieOrder.id})`,
            );
        }
        const refund = await mollieClient.payments_refunds.create({
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
