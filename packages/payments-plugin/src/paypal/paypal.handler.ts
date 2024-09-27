import { LanguageCode } from '@vendure/common/lib/generated-types';
import { EntityHydrator, Injector, PaymentMethodHandler, TransactionalConnection } from '@vendure/core';

import { PayPalService } from './paypal.service';

let paypalService: PayPalService;
let connection: TransactionalConnection;
let entityHydrator: EntityHydrator;

/**
 * The handler for PayPal payments.
 */
export const paypalPaymentMethodHandler = new PaymentMethodHandler({
    code: 'paypal',
    description: [{ languageCode: LanguageCode.en, value: 'PayPal' }],
    args: {},
    init(injector: Injector) {
        connection = injector.get(TransactionalConnection);
        entityHydrator = injector.get(EntityHydrator);
        paypalService = injector.get(PayPalService);
    },

    async createPayment(ctx, order, amount, args, metadata) {
        if (!metadata.orderId) {
            return {
                state: 'Error' as const,
                amount: order.totalWithTax,
                errorMessage: "'orderId' must be set in metadata. Call 'createPayPalOrder' to get order id.",
            };
        }

        const orderDetails = await paypalService.orderDetails(metadata.orderId);

        const validationResult = paypalService.validatePayPalOrder(order, orderDetails);
        if (validationResult) {
            return validationResult;
        }

        const authorizedOrderResponse = await paypalService.authorizeOrder(metadata.orderId);

        if (!authorizedOrderResponse.purchase_units[0].payments) {
            return {
                state: 'Error' as const,
                amount: 0,
                errorMessage: 'Payment authorization failed. No payments found.',
            };
        }

        if (!authorizedOrderResponse.purchase_units[0].payments.authorizations.length) {
            return {
                state: 'Error' as const,
                amount: 0,
                errorMessage: 'Payment authorization failed. No authorizations found.',
            };
        }

        const authorization = authorizedOrderResponse.purchase_units[0].payments.authorizations[0];

        if (authorization.status !== 'CREATED') {
            return {
                state: 'Error' as const,
                amount: 0,
                errorMessage: "Payment authorization failed. Payment status must be 'CREATED'.",
            };
        }

        return {
            state: 'Authorized' as const,
            amount: order.totalWithTax,
            transactionId: authorizedOrderResponse.id,
            metadata: {
                payerId: authorizedOrderResponse.payer.payer_id,
            },
        };
    },

    async settlePayment(ctx, order, payment, args, method) {
        if (payment.state !== 'Authorized') {
            return {
                success: false,
                errorMessage: "Payment is not authorized. Call 'createPayment' to authorize payment.",
            };
        }

        const now = new Date();
        now.setTime(now.getTime() + 30000); // Add 30 seconds buffer to account for the time it takes to capture the payment

        const orderDetails = await paypalService.orderDetails(payment.transactionId);
        const authorization = orderDetails.purchase_units[0].payments?.authorizations[0];

        if (!authorization) {
            return {
                success: false,
                errorMessage: 'No authorization found in order details.',
                state: 'Error' as const,
            };
        }

        // check if authorizationExpirationTime is earlier than now
        if (now > new Date(authorization.expiration_time)) {
            await paypalService.reauthorizeOrder(authorization.id);
        }

        try {
            await paypalService.capturePayment(authorization.id);
            return {
                success: true,
            };
        } catch (error) {
            return {
                success: false,
                errorMessage: (error as Error)?.message,
            };
        }
    },

    async createRefund(ctx, input, total, order, payment, args) {
        return {
            state: 'Failed' as const,
            metadata: {},
        };
    },
});
