import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core';

import { adminSchemaExtensions, shopSchemaExtensions } from './api-extensions';
import { PAYPAL_PAYMENT_PLUGIN_OPTIONS } from './constants';
import { PayPalAuthorizationService } from './paypal-authorization.service';
import { PayPalCaptureService } from './paypal-capture.service';
import { PayPalOrderService } from './paypal-order.service';
import { paypalPaymentMethodHandler } from './paypal.handler';
import { PayPalShopResolver } from './paypal.shop-resolver';
import { PayPalPluginOptions } from './types';

/**
 * @description
 * This plugin enables payments via the [PayPal Order API](https://developer.paypal.com/docs/api/orders/v2/#orders_create).
 *
 * > **_Note:_** This plugin only supports a [2 step flow](https://docs.vendure.io/guides/core-concepts/payment/#two-step).
 * > This means that the payment has to manually captured by an admin.
 *
 * ## Requirements
 *
 * 1. Create a PayPal business account.
 * 2. Make sure you have the client ID and secret of your PayPal REST API app.
 * 3. Get the merchant ID from your PayPal account. This is the account ID of your PayPal business account.
 * 4. Install the Payments plugin:
 *
 *     `yarn add \@vendure/payments-plugin`
 *
 *     or
 *
 *     `npm install \@vendure/payments-plugin`
 *
 * ## Setup
 *
 * 1. Add the plugin to your VendureConfig `plugins` array:
 * ```ts
 * import { PayPalPlugin } from '\@vendure/payments-plugin/package/paypal';
 *
 * // ...
 *
 * plugins: [
 *     // Set the apiUrl to the PayPal sandbox environment
 *     PayPalPlugin.init({ apiUrl: 'https://sandbox.paypal.com/' }),
 * ]
 * ```
 * 2. Create a new PaymentMethod in the Admin UI, and select "PayPal payments" as the handler.
 * 3. Set your PayPal client ID, secret and merchant ID in the according fields.
 *
 * ## Storefront usage
 *
 * To successfully make a payment, the following steps are explained in detail:
 * 1. Create a PayPal order
 * 2. Use the PayPal SDK to authorize the payment
 * 3. Add the payment to the order
 * 4. Capture the payment
 *
 * ### Create PayPal order
 *
 * Begin by creating a new PayPal order. This order is the reference for the payment and is used to authorize the payment.
 * Make sure to store the order ID in your frontend, as it is needed in the next steps.
 *
 * This step does not modify any data on your Vendure instance. It only creates a new order in the PayPal system.
 *
 * Create the PayPal order using the following mutation:
 * ```GraphQL
 * mutation CreatePayPalOrder {
 *     createPayPalOrder() {
 *         ... on PayPalOrder {
 *             id
 *         }
 *     }
 * }
 * ```
 *
 * ### Authorize payment
 * The PayPal order you created must be authorized by your customers. This step is handled by the PayPal SDK for the most part.
 *
 * For JavaScript projects, you can check out this integration guide to
 * integrate the PayPal SDK: [PayPal SDK Integration Guide](https://developer.paypal.com/studio/checkout/standard/integrate).
 *
 * ### Add payment
 * After authorizing the payment, you need to add it to the Vendure order. This will add and validate the authorizations
 * add to the payment in the previous step. If the payment is valid, the order will be updated to the next state.
 *
 * ```GraphQL
 * mutation AddPaymentToOrder() {
 *     addPaymentToOrder(input: {
 *         method: "paypal-payment-method",
 *         metadata: {
 *             orderId: "the PayPal order ID"
 *         }
 *     }) {
 *         ... on Order {
 *             id
 *             code
 *             state
 *             payments {
 *                 id
 *                 state
 *                 transactionId
 *                 method
 *             }
 *         }
 *         ... on ErrorResult {
 *             message
 *             errorCode
 *         }
 *         ... on PaymentFailedError {
 *             paymentErrorMessage
 *         }
 *     }
 * }
 * ```
 *
 * ### Capture payment
 * Using the admin ui, the admin can settle this payment. After this step, the payment is successfully captured.
 *
 * ## Creating refunds
 * Refunds can be created like any other refund in Vendure. The refund will be processed through the PayPal API.
 *
 * @docsCategory core plugins/PaymentsPlugin
 * @docsPage PayPalPlugin
 * @docsWeight 0
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [
        { provide: PAYPAL_PAYMENT_PLUGIN_OPTIONS, useFactory: () => PayPalPlugin.options },
        PayPalOrderService,
        PayPalAuthorizationService,
        PayPalCaptureService,
    ],
    configuration: config => {
        config.paymentOptions.paymentMethodHandlers.push(paypalPaymentMethodHandler);

        return config;
    },
    compatibility: '^3.0.0',
    adminApiExtensions: {
        schema: shopSchemaExtensions,
    },
    shopApiExtensions: {
        resolvers: [PayPalShopResolver],
        schema: adminSchemaExtensions,
    },
})
export class PayPalPlugin {
    static options: PayPalPluginOptions;

    /**
     * @description
     * Initialize the PayPal payment plugin
     */
    static init(options: PayPalPluginOptions): Type<PayPalPlugin> {
        this.options = options;
        return PayPalPlugin;
    }
}
