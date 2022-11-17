import createMollieClient, { OrderStatus, PaymentStatus, RefundStatus } from '@mollie/api-client';
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
        autoCapture: {
            type: 'boolean',
            label: [{ languageCode: LanguageCode.en, value: 'Auto capture payments' }],
            defaultValue: true,
            description: [
                { languageCode: LanguageCode.en, value: 'Automatically capture payments for pay-later methods. Without autoCapture orders will remain in the PaymentAuthorized state, and you need to manually settle payments to get paid.' },
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
        // Only Admins and internal calls should be allowed to settle and authorize payments
        if (ctx.apiType !== 'admin') {
            throw Error(`CreatePayment is not allowed for apiType '${ctx.apiType}'`);
        }
        const state = metadata.status === OrderStatus.paid ? 'Settled' : 'Authorized';
        Logger.info(`Payment for order ${order.code} created with state '${state}'`, loggerCtx);
        return {
            amount,
            state,
            transactionId: metadata.orderId, // The plugin now only supports 1 payment per order, so a mollie order equals a payment
            metadata, // Store all given metadata on a payment
        };
    },
    settlePayment: async (ctx, order, payment, args): Promise<SettlePaymentResult> => {
        // Called for Authorized payments
        const { apiKey } = args;
        const mollieClient = createMollieClient({ apiKey });
        const mollieOrder = await mollieClient.orders.get(payment.transactionId);
        if (!mollieOrder.isCompleted()) {
            // Order could have been completed via Mollie, then we can just settle
            await mollieClient.orders_shipments.create({orderId: payment.transactionId}); // Creating a shipment captures the payment
        }
        Logger.info(`Settled payment for ${order.code}`, loggerCtx);
        return { success: true };
    },
    createRefund: async (ctx, input, amount, order, payment, args): Promise<CreateRefundResult> => {
        const { apiKey } = args;
        const mollieClient = createMollieClient({ apiKey });
        const mollieOrder = await mollieClient.orders.get(payment.transactionId);
        const molliePayments = await mollieOrder.getPayments();
        const molliePayment = molliePayments.find(p => p.status === PaymentStatus.paid); // Only one paid payment should be there
        if (!molliePayment) {
            throw Error(`No payment with status 'paid' was found in Mollie for order ${order.code} (Mollie order ${mollieOrder.id})`);
        }
        const refund = await mollieClient.payments_refunds.create({
            paymentId: molliePayment.id,
            description: input.reason,
            amount: {
                value: (amount / 100).toFixed(2),
                currency: order.currencyCode,
            },
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
