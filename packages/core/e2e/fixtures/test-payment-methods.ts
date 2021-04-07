import { PaymentMethodHandler } from '@vendure/core';

import { LanguageCode } from '../graphql/generated-e2e-admin-types';

export const testSuccessfulPaymentMethod = new PaymentMethodHandler({
    code: 'test-payment-method',
    description: [{ languageCode: LanguageCode.en, value: 'Test Payment Method' }],
    args: {},
    createPayment: (ctx, order, amount, args, metadata) => {
        return {
            amount,
            state: 'Settled',
            transactionId: '12345',
            metadata: { public: metadata },
        };
    },
    settlePayment: () => ({
        success: true,
    }),
});

export const onTransitionSpy = jest.fn();
/**
 * A two-stage (authorize, capture) payment method, with no createRefund method.
 */
export const twoStagePaymentMethod = new PaymentMethodHandler({
    code: 'authorize-only-payment-method',
    description: [{ languageCode: LanguageCode.en, value: 'Test Payment Method' }],
    args: {},
    createPayment: (ctx, order, amount, args, metadata) => {
        return {
            amount,
            state: 'Authorized',
            transactionId: '12345',
            metadata: { public: metadata },
        };
    },
    settlePayment: () => {
        return {
            success: true,
            metadata: {
                moreData: 42,
            },
        };
    },
    onStateTransitionStart: (fromState, toState, data) => {
        onTransitionSpy(fromState, toState, data);
    },
});

/**
 * A method that can be used to pay for only part of the order (allowing us to test multiple payments
 * per order).
 */
export const partialPaymentMethod = new PaymentMethodHandler({
    code: 'partial-payment-method',
    description: [{ languageCode: LanguageCode.en, value: 'Partial Payment Method' }],
    args: {},
    createPayment: (ctx, order, amount, args, metadata) => {
        return {
            amount: metadata.amount,
            state: 'Settled',
            transactionId: '12345',
            metadata: { public: metadata },
        };
    },
    settlePayment: () => {
        return {
            success: true,
        };
    },
});

/**
 * A payment method which includes a createRefund method.
 */
export const singleStageRefundablePaymentMethod = new PaymentMethodHandler({
    code: 'single-stage-refundable-payment-method',
    description: [{ languageCode: LanguageCode.en, value: 'Test Payment Method' }],
    args: {},
    createPayment: (ctx, order, amount, args, metadata) => {
        return {
            amount,
            state: 'Settled',
            transactionId: '12345',
            metadata,
        };
    },
    settlePayment: () => {
        return { success: true };
    },
    createRefund: (ctx, input, amount, order, payment, args) => {
        return {
            amount,
            state: 'Settled',
            transactionId: 'abc123',
        };
    },
});

/**
 * A payment method where calling `settlePayment` always fails.
 */
export const failsToSettlePaymentMethod = new PaymentMethodHandler({
    code: 'fails-to-settle-payment-method',
    description: [{ languageCode: LanguageCode.en, value: 'Test Payment Method' }],
    args: {},
    createPayment: (ctx, order, amount, args, metadata) => {
        return {
            amount,
            state: 'Authorized',
            transactionId: '12345',
            metadata: {
                privateCreatePaymentData: 'secret',
                public: {
                    publicCreatePaymentData: 'public',
                },
            },
        };
    },
    settlePayment: () => {
        return {
            success: false,
            state: 'Cancelled',
            errorMessage: 'Something went horribly wrong',
            metadata: {
                privateSettlePaymentData: 'secret',
                public: {
                    publicSettlePaymentData: 'public',
                },
            },
        };
    },
});
export const testFailingPaymentMethod = new PaymentMethodHandler({
    code: 'test-failing-payment-method',
    description: [{ languageCode: LanguageCode.en, value: 'Test Failing Payment Method' }],
    args: {},
    createPayment: (ctx, order, amount, args, metadata) => {
        return {
            amount,
            state: 'Declined',
            errorMessage: 'Insufficient funds',
            metadata: { public: metadata },
        };
    },
    settlePayment: () => ({
        success: true,
    }),
});
export const testErrorPaymentMethod = new PaymentMethodHandler({
    code: 'test-error-payment-method',
    description: [{ languageCode: LanguageCode.en, value: 'Test Error Payment Method' }],
    args: {},
    createPayment: (ctx, order, amount, args, metadata) => {
        return {
            amount,
            state: 'Error',
            errorMessage: 'Something went horribly wrong',
            metadata,
        };
    },
    settlePayment: () => ({
        success: true,
    }),
});
