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
 * Plugin to enable payments through the [PayPal platform](https://www.paypal.com).
 * This plugin uses the [Order API of PayPal](https://developer.paypal.com/docs/api/orders/v2/#orders_create).
 *
 * ## Requirements
 *
 * 1. You will need to create a PayPal account and get your clientID, clientSecret and merchantId in the dashboard.
 * 2. Install the Payments plugin:
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
 *     ```ts
 *     import { PayPalPlugin } from '\@vendure/payments-plugin/package/paypal';
 *
 *     // ...
 *
 *     plugins: [
 *       PayPalPlugin.init({ apiUrl: 'https://api-m.sandbox.paypal.com/' }), // To use the PayPal sandbox environment.
 *     ]
 *     ```
 * 2. Create a new PaymentMethod in the Admin UI, and select "PayPal payments" as the handler.
 * 3. Set your Mollie clientId, clientSecret and merchantId in the according fields.
 *
 * ## Storefront usage
 *
 * In your storefront you add a payment to an order using the `createMolliePaymentIntent` mutation. In this example, our Mollie
 * PaymentMethod was given the code "mollie-payment-method". The `redirectUrl``is the url that is used to redirect the end-user
 * back to your storefront after completing the payment.
 *
 * ```GraphQL
 * mutation CreateMolliePaymentIntent {
 *   createMolliePaymentIntent(input: {
 *     redirectUrl: "https://storefront/order/1234XYZ"
 *     paymentMethodCode: "mollie-payment-method"
 *     molliePaymentMethodCode: "ideal"
 *   }) {
 *          ... on MolliePaymentIntent {
 *               url
 *           }
 *          ... on MolliePaymentIntentError {
 *               errorCode
 *               message
 *          }
 *   }
 * }
 * ```
 *
 * The response will contain
 * a redirectUrl, which can be used to redirect your customer to the Mollie
 * platform.
 *
 * 'molliePaymentMethodCode' is an optional parameter that can be passed to skip Mollie's hosted payment method selection screen
 * You can get available Mollie payment methods with the following query:
 *
 * ```GraphQL
 * {
 *  molliePaymentMethods(input: { paymentMethodCode: "mollie-payment-method" }) {
 *    id
 *    code
 *    description
 *    minimumAmount {
 *      value
 *      currency
 *    }
 *    maximumAmount {
 *      value
 *      currency
 *    }
 *    image {
 *      size1x
 *      size2x
 *      svg
 *    }
 *  }
 * }
 * ```
 * You can pass `creditcard` for example, to the `createMolliePaymentIntent` mutation to skip the method selection.
 *
 * After completing payment on the Mollie platform,
 * the user is redirected to the given redirect url, e.g. `https://storefront/order/CH234X5`
 *
 * ## Pay later methods
 * Mollie supports pay-later methods like 'Klarna Pay Later'. For pay-later methods, the status of an order is
 * 'PaymentAuthorized' after the Mollie hosted checkout. You need to manually settle the payment via the admin ui to capture the payment!
 * Make sure you capture a payment within 28 days, because this is the Klarna expiry time
 *
 * If you don't want this behaviour (Authorized first), you can set 'autoCapture=true' on the payment method. This option will immediately
 * capture the payment after a customer authorizes the payment.
 *
 * ## ArrangingAdditionalPayment state
 *
 * In some rare cases, a customer can add items to the active order, while a Mollie payment is still open,
 * for example by opening your storefront in another browser tab.
 * This could result in an order being in `ArrangingAdditionalPayment` status after the customer finished payment.
 * You should check if there is still an active order with status `ArrangingAdditionalPayment` on your order confirmation page,
 * and if so, allow your customer to pay for the additional items by creating another Mollie payment.
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
