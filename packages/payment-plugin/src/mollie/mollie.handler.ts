import createMollieClient from '@mollie/api-client';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { CreatePaymentResult, Logger, PaymentMethodHandler, SettlePaymentResult } from '@vendure/core';

import { MolliePlugin } from './mollie.plugin';

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

    /** This is called when the `addPaymentToOrder` mutation is executed */
    createPayment: async (ctx, order, amount, args, _metadata): Promise<CreatePaymentResult> => {
        try {
            const { apiKey } = args;
            let { redirectUrl } = args;
            if (redirectUrl && !redirectUrl.endsWith('/')) {
                redirectUrl = `${redirectUrl}/`; // append slash if not set
            }
            const mollieClient = createMollieClient({ apiKey });
            const payment = await mollieClient.payments.create({
                customerId: '',
                mandateId: '',
                amount: {
                    value: `${(order.totalWithTax / 100).toFixed(2)}`,
                    currency: 'EUR',
                },
                metadata: {
                    orderCode: order.code,
                },
                description: `Bestelling ${order.code}`,
                redirectUrl: `${redirectUrl}order/${order.code}`,
                webhookUrl: `${MolliePlugin.host}/payments/mollie/${ctx.channel.token}`,
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

    /** This is called when the `settlePayment` mutation is executed */
    settlePayment: async (order, payment, args): Promise<SettlePaymentResult> => {
        return { success: true };
    },
});
