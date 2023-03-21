import { PluginCommonModule, RuntimeVendureConfig, VendurePlugin } from '@vendure/core';

import { PLUGIN_INIT_OPTIONS } from './constants';
import { shopSchema } from './mollie-shop-schema';
import { MollieController } from './mollie.controller';
import { molliePaymentHandler } from './mollie.handler';
import { MollieResolver } from './mollie.resolver';
import { MollieService } from './mollie.service';

/**
 * @description
 * Configuration options for the Mollie payments plugin.
 *
 * @docsCategory payments-plugin
 * @docsPage MolliePlugin
 */
export interface MolliePluginOptions {
    /**
     * @description
     * The host of your Vendure server, e.g. `'https://my-vendure.io'`.
     * This is used by Mollie to send webhook events to the Vendure server
     */
    vendureHost: string;
}

/**
 * @description
 * Plugin to enable payments through the [Mollie platform](https://docs.mollie.com/).
 * This plugin uses the Order API from Mollie, not the Payments API.
 *
 * ## Requirements
 *
 * 1. You will need to create a Mollie account and get your apiKey in the dashboard.
 * 2. Install the Payments plugin and the Mollie client:
 *
 *     `yarn add \@vendure/payments-plugin \@mollie/api-client`
 *
 *     or
 *
 *     `npm install \@vendure/payments-plugin \@mollie/api-client`
 *
 * ## Setup
 *
 * 1. Add the plugin to your VendureConfig `plugins` array:
 *     ```TypeScript
 *     import { MolliePlugin } from '\@vendure/payments-plugin/package/mollie';
 *
 *     // ...
 *
 *     plugins: [
 *       MolliePlugin.init({ vendureHost: 'https://yourhost.io/' }),
 *     ]
 *     ```
 * 2. Create a new PaymentMethod in the Admin UI, and select "Mollie payments" as the handler.
 * 3. Set the Redirect URL. This is the url that is used to redirect the end-user, e.g. `https://storefront/order`
 * 4. Set your Mollie apiKey in the `API Key` field.
 *
 * ## Storefront usage
 *
 * In your storefront you add a payment to an order using the `createMolliePaymentIntent` mutation. In this example, our Mollie
 * PaymentMethod was given the code "mollie-payment-method".
 *
 * ```GraphQL
 * mutation CreateMolliePaymentIntent {
 *   createMolliePaymentIntent(input: {
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
 * You can pass `MolliePaymentMethod.code` to the `createMolliePaymentIntent` mutation to skip the method selection.
 *
 * After completing payment on the Mollie platform,
 * the user is redirected to the configured redirect url + orderCode: `https://storefront/order/CH234X5`
 *
 * ## Pay later methods
 * Mollie supports pay-later methods like 'Klarna Pay Later'. For pay-later methods, the status of an order is
 * 'PaymentAuthorized' after the Mollie hosted checkout. You need to manually settle the payment via the admin ui to capture the payment!
 * Make sure you capture a payment within 28 days, because this is the Klarna expiry time
 *
 * If you don't want this behaviour (Authorized first), you can set 'autoCapture=true' on the payment method. This option will immediately
 * capture the payment after a customer authorizes the payment.
 *
 * @docsCategory payments-plugin
 * @docsPage MolliePlugin
 * @docsWeight 0
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [MollieController],
    providers: [MollieService, { provide: PLUGIN_INIT_OPTIONS, useFactory: () => MolliePlugin.options }],
    configuration: (config: RuntimeVendureConfig) => {
        config.paymentOptions.paymentMethodHandlers.push(molliePaymentHandler);
        return config;
    },
    shopApiExtensions: {
        schema: shopSchema,
        resolvers: [MollieResolver],
    },
})
export class MolliePlugin {
    static options: MolliePluginOptions;

    /**
     * @description
     * Initialize the mollie payment plugin
     * @param vendureHost is needed to pass to mollie for callback
     */
    static init(options: MolliePluginOptions): typeof MolliePlugin {
        this.options = options;
        return MolliePlugin;
    }
}
