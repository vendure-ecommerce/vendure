import { PayPalOrderLink } from './graphql/generated-shop-types';

export interface PayPalAuthorizationResponse {
    access_token: string;
    app_id: string;
    expires_in: number;
    id_token: string;
    nonce: string;
    scope: string;
    token_type: string;
}

/**
 * @description
 * The plugin can be configured using the following options:
 */
export interface PayPalPluginOptions {
    /**
     * The base URL of the PayPal API.
     *
     * @example https://api-m.sandbox.paypal.com/
     * @example https://api-m.paypal.com
     */
    apiUrl: string;
}

// Packages like @types/paypal-rest-sdk are not deprecated, but still do not work correctly, so we
// define our own types based on the PayPal documentation here.

export interface PayPalPaymentAuthorization {
    amount: Amount;
    create_time: string;
    expiration_time: string;
    id: string;
    status: string;
}

export interface PayPalRefundRequest {
    amount: Amount;
    invoice_id?: string;
}

export interface PayPalRefundResponse {
    id: string;
    status: string;
    amount: Amount;
    links: PayPalOrderLink[];
}

export interface PayPalPaymentCapture {
    id: string;
    status: string;
    amount: Amount;
}

export interface PayPalPaymentInformation {
    authorizations?: PayPalPaymentAuthorization[];
    captures?: PayPalPaymentCapture[];
}

export interface PayPalPayer {
    email_address?: string;
    payer_id?: string;
    name?: {
        given_name?: string;
        surname?: string;
    };
}

export interface PayPalOrderInformation {
    create_time: string;
    id: string;
    intent: 'CAPTURE' | 'AUTHORIZE';
    links: [
        {
            href: string;
            method: string;
            rel: string;
        },
    ];
    payer: PayPalPayer;
    status: string;
    purchase_units: PayPalOrderPurchaseUnit[];
}

/**
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
export interface Amount {
    currency_code: string;
    value: string;
}

/**
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
export interface PayPalOrderItem {
    name: string;
    quantity: string;
    unit_amount: Amount;
    description?: string;
    sku?: string;
    url?: string;
    category?: 'PHYSICAL_GOODS' | 'DIGITAL_GOODS';
    tax?: Amount;
}

/**
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
export type PayPalOrderPurchaseUnitAmount = Amount & {
    breakdown?: {
        item_total?: Amount;
        shipping?: Amount;
        handling?: Amount;
        tax_total?: Amount;
        shipping_discount?: Amount;
    };
};

/**
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
export interface PayPalOrderPurchaseUnit {
    reference_id?: string;
    description?: string;
    custom_id?: string;
    invoice_id?: string;
    soft_descriptor?: string;
    amount: PayPalOrderPurchaseUnitAmount;
    items?: PayPalOrderItem[];
    payee?: {
        email_address?: string;
        merchant_id: string;
    };
    payments?: PayPalPaymentInformation;
}

/**
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
export interface CreatePayPalOrderRequest {
    purchase_units: PayPalOrderPurchaseUnit[];
    intent: 'AUTHORIZE' | 'CAPTURE';
}
