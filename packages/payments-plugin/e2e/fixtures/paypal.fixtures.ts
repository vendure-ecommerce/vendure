import { PayPalOrderInformation, PayPalPaymentInformation } from '../../src/paypal/types';

export const authorizationId = 'mocked_authorization_id';
export const paypalOrderId = 'mocked_paypal_order_id';
export const orderCode = 'mocked_order_code';
export const methodCode = 'mocked_paypal_method';
export const captureId = 'mocked_capture_id';
export const refundId = 'mocked_refund_id';

export const clientId = 'mocked_client_id';
export const clientSecret = 'mocked_client_secret';
export const authenticationToken = 'bW9ja2VkX2NsaWVudF9pZDptb2NrZWRfY2xpZW50X3NlY3JldA==';
export const accessToken = 'mocked_access_token';
export const merchantId = 'mocked_merchant_id';

export const alternativeChannelToken = 'alternative_channel_token';
export const alternativeClientId = 'alternative_mocked_client_id';
export const alternativeClientSecret = 'alternative_mocked_client_secret';
export const alternativeAuthenticationToken =
    'YWx0ZXJuYXRpdmVfbW9ja2VkX2NsaWVudF9pZDphbHRlcm5hdGl2ZV9tb2NrZWRfY2xpZW50X3NlY3JldA==';
export const alternativeAccessToken = 'alternative_mocked_access_token';
export const alternativeMerchantId = 'alternative_mocked_merchant_id';

export const apiUrl = 'https://api.sandbox.paypal.com';
export const authenticatePath = '/v1/oauth2/token';
export const reauthorizePath = `/v2/payments/authorizations/${authorizationId}/reauthorize`;
export const capturePath = `/v2/payments/authorizations/${authorizationId}/capture`;
export const authorizePath = `/v2/checkout/orders/${paypalOrderId}/authorize`;
export const getOrderPath = `/v2/checkout/orders/${paypalOrderId}`;
export const postOrderPath = `/v2/checkout/orders`;
export const postRefundPath = `/v2/payments/captures/${captureId}/refund`;

// The default product variant id used for test orders in this file.
export const productVariantId = 'T_5';

// The default product variant quantity used for test orders in this file.
export const productVariantQuantity = 10;

// The default order total with taxes and to on
export const orderTotal = '1209.88';

export const payments: Required<PayPalPaymentInformation> = {
    authorizations: [
        {
            amount: {
                currency_code: 'USD',
                value: orderTotal,
            },
            create_time: '2000-01-01T00:00:00Z',
            expiration_time: '3000-01-01T00:00:00Z',
            id: authorizationId,
            status: 'AUTHORIZED',
        },
    ],
    captures: [],
};

export const paypalOrder: PayPalOrderInformation = {
    id: paypalOrderId,
    purchase_units: [
        {
            reference_id: orderCode,
            amount: {
                currency_code: 'USD',
                value: orderTotal,
                breakdown: {
                    item_total: { currency_code: 'USD', value: '1199.90' },
                    shipping: { currency_code: 'USD', value: '10.00' },
                },
            },
            payee: {
                merchant_id: merchantId,
            },
            payments,
        },
    ],
    create_time: '2000-01-01T00:00:00Z',
    intent: 'AUTHORIZE',
    payer: {
        name: {
            given_name: 'John',
            surname: 'Doe',
        },
        email_address: 'john.doe@example.com',
        payer_id: '123123123',
    },
    status: 'APPROVED',
    links: [],
};
