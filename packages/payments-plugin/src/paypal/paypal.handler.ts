import { LanguageCode } from '@vendure/common/lib/generated-types';
import { Injector, PaymentMethodHandler } from '@vendure/core';

import { handlerCode } from './constants';
import { PayPalAuthorizationService } from './paypal-authorization.service';
import { PayPalOrderService } from './paypal-order.service';

let paypalOrderService: PayPalOrderService;
let paypalAuthorizationService: PayPalAuthorizationService;

/**
 * The handler for PayPal payments.
 */
export const paypalPaymentMethodHandler = new PaymentMethodHandler({
    code: handlerCode,
    description: [{ languageCode: LanguageCode.en, value: 'PayPal' }],
    args: {
        clientId: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'Client ID' }],
        },
        clientSecret: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'Client Secret' }],
            ui: { component: 'password-form-input' },
        },
        merchantId: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'Merchant Id' }],
        },
    },
    init(injector: Injector) {
        paypalOrderService = injector.get(PayPalOrderService);
        paypalAuthorizationService = injector.get(PayPalAuthorizationService);
    },

    async createPayment(ctx, order, amount, args, metadata) {
        if (!metadata.orderId) {
            return {
                state: 'Error' as const,
                amount: order.totalWithTax,
                errorMessage: "'orderId' must be set in metadata. Call 'createPayPalOrder' to get order id.",
            };
        }

        const orderDetails = await paypalOrderService.orderDetails(ctx, metadata.orderId);

        const validationResult = await paypalOrderService.validateOrderMatch(ctx, order, orderDetails);
        if (validationResult) {
            return validationResult;
        }

        const authorizedOrderResponse = await paypalAuthorizationService.authorizeOrder(
            ctx,
            metadata.orderId,
        );

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

        const orderDetails = await paypalOrderService.orderDetails(ctx, payment.transactionId);
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
            await paypalAuthorizationService.reauthorizeOrder(ctx, authorization.id);
        }

        try {
            await paypalAuthorizationService.captureAuthorization(ctx, authorization.id);
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

    createRefund(ctx, input, total, order, payment, args) {
        return {
            state: 'Failed' as const,
            metadata: {},
        };
    },
});
