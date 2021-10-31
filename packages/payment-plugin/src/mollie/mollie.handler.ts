import createMollieClient, { RefundStatus } from '@mollie/api-client';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import {
    CreatePaymentResult,
    CreateRefundResult,
    Logger,
    PaymentMethodHandler,
    PaymentMethodService,
    SettlePaymentResult,
} from '@vendure/core';

import { MolliePlugin } from './mollie.plugin';

let paymentMethodService: PaymentMethodService;
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
        },
        redirectUrl: {
            type: 'string',
        },
    },
    init(injector) {
        paymentMethodService = injector.get(PaymentMethodService);
    },
    createPayment: async (ctx, order, amount, args, _metadata): Promise<CreatePaymentResult> => {
        try {
            const { apiKey } = args;
            let { redirectUrl } = args;
            redirectUrl = redirectUrl.endsWith('/') ? redirectUrl.slice(0, -1) : redirectUrl; // remove appending slash
            const paymentMethods = await paymentMethodService.findAll(ctx);
            const paymentMethod = paymentMethods.items.find(pm =>
                pm.handler.args.find(arg => arg.value === apiKey),
            );
            if (!paymentMethod) {
                throw Error(`No paymentMethod found for given apiKey`); // This should never happen
            }
            const mollieClient = createMollieClient({ apiKey });
            const payment = await mollieClient.payments.create({
                amount: {
                    value: `${(order.totalWithTax / 100).toFixed(2)}`,
                    currency: order.currencyCode,
                },
                metadata: {
                    orderCode: order.code,
                },
                description: `Order ${order.code}`,
                redirectUrl: `${redirectUrl}/${order.code}`,
                webhookUrl: `${MolliePlugin.host}/payments/mollie/${ctx.channel.token}/${paymentMethod.id}`,
            });
            return {
                amount: order.totalWithTax,
                transactionId: payment.id,
                state: 'Authorized' as const,
                metadata: {
                    public: {
                        redirectLink: payment.getPaymentUrl(),
                    },
                },
            };
        } catch (err) {
            Logger.error(err, MolliePlugin.context);
            return {
                amount: order.totalWithTax,
                state: 'Declined' as const,
                metadata: {
                    errorMessage: err.message,
                },
            };
        }
    },
    settlePayment: async (order, payment, args): Promise<SettlePaymentResult> => {
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
        );
        return {
            state: 'Settled',
            transactionId: payment.transactionId,
        };
    },
});
