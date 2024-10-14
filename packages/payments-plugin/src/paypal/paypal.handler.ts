import { LanguageCode } from '@vendure/common/lib/generated-types';
import { Injector, PaymentMethodHandler, UserInputError } from '@vendure/core';

import { handlerCode } from './constants';
import { PayPalAuthorizationService } from './paypal-authorization.service';
import { PayPalCaptureService } from './paypal-capture.service';
import { PayPalOrderService } from './paypal-order.service';
import { PayPalError } from './paypal.error';

let paypalOrderService: PayPalOrderService;
let paypalAuthorizationService: PayPalAuthorizationService;
let paypalCaptureService: PayPalCaptureService;

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
            required: true,
        },
        clientSecret: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'Client Secret' }],
            ui: { component: 'password-form-input' },
            required: true,
        },
        merchantId: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'Merchant Id' }],
            required: true,
        },
    },
    init(injector: Injector) {
        paypalOrderService = injector.get(PayPalOrderService);
        paypalAuthorizationService = injector.get(PayPalAuthorizationService);
        paypalCaptureService = injector.get(PayPalCaptureService);
    },

    async createPayment(ctx, order, amount, args, metadata) {
        if (!metadata.orderId) {
            throw new UserInputError('error.configurable-argument-is-required', {
                name: 'orderId',
            });
        }

        const orderDetails = await paypalOrderService.orderDetails(ctx, metadata.orderId);

        const validationResult = await paypalOrderService.validateOrderMatch(ctx, order, orderDetails);
        if (validationResult) {
            return validationResult;
        }

        let authorizedOrderResponse;

        try {
            authorizedOrderResponse = await paypalAuthorizationService.authorizeOrder(ctx, metadata.orderId);
        } catch (error: any) {
            return {
                state: 'Error' as const,
                amount: 0,
                errorMessage: error.message,
            };
        }

        if (!authorizedOrderResponse.purchase_units[0].payments) {
            return {
                state: 'Error' as const,
                amount: 0,
                errorMessage: 'errorResult.PAYPAL_ORDER_WITHOUT_PAYMENTS',
            };
        }

        if (!authorizedOrderResponse.purchase_units[0].payments.authorizations?.length) {
            return {
                state: 'Error' as const,
                amount: 0,
                errorMessage: 'errorResult.PAYPAL_ORDER_WITHOUT_AUTHORIZATIONS',
            };
        }

        const authorization = authorizedOrderResponse.purchase_units[0].payments.authorizations[0];

        if (authorization.status !== 'CREATED') {
            return {
                state: 'Error' as const,
                amount: 0,
                errorMessage: 'errorResult.PAYPAL_ORDER_STATUS_NOT_CREATED',
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
                errorMessage: 'errorResult.PAYPAL_ORDER_WITHOUT_AUTHORIZATIONS',
                state: 'Error' as const,
            };
        }

        const now = new Date();
        now.setTime(now.getTime() + 30000); // Add 30 seconds buffer to account for the time it takes to capture the payment

        const orderDetails = await paypalOrderService.orderDetails(ctx, payment.transactionId);

        const authorizations = orderDetails.purchase_units[0].payments?.authorizations;
        if (!authorizations?.length) {
            return {
                success: false,
                errorMessage: 'errorResult.PAYPAL_ORDER_WITHOUT_AUTHORIZATIONS',
                state: 'Error' as const,
            };
        }

        const authorization = authorizations[0];

        // check if authorizationExpirationTime is earlier than now
        if (!authorization.expiration_time?.trim() || now > new Date(authorization.expiration_time)) {
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

    async createRefund(ctx, input, total, order, payment, args) {
        const orderDetails = await paypalOrderService.orderDetails(ctx, payment.transactionId);

        const payments = orderDetails.purchase_units[0].payments;
        const captures = payments?.captures;

        if (!captures || !captures.length) {
            throw new PayPalError('errorResult.PAYPAL_ORDER_WITHOUT_PAYMENTS');
        }

        if (captures.length !== 1) {
            throw new PayPalError('errorResult.MULTIPLE_CAPTURES');
        }

        const capture = captures[0];

        if (capture.status !== 'COMPLETED' && capture.status !== 'PARTIALLY_REFUNDED') {
            throw new PayPalError('errorResult.PAYPAL_PAYMENT_NOT_CAPTURED');
        }

        const refundResponse = await paypalCaptureService.refundCapture(ctx, captures[0].id, total, order);

        return {
            state: 'Settled' as const,
            transactionId: refundResponse.id,
        };
    },
});
