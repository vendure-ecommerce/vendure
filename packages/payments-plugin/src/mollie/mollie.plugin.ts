import { PluginCommonModule, RuntimeVendureConfig, VendurePlugin } from '@vendure/core';

import { PLUGIN_INIT_OPTIONS } from './constants';
import { MollieController } from './mollie.controller';
import { molliePaymentHandler } from './mollie.handler';

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
     * The host of your storefront application, e.g. `'https://my-shop.com'`
     */
    vendureHost: string;
}

/**
 * @description
 * Plugin to enable payments through the [Mollie platform](https://docs.mollie.com/).
 * This plugin uses the Payments API from Mollie, not the Orders API.
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
 * In your storefront you add a payment to an order using the `addPaymentToOrder` mutation. In this example, our Mollie
 * PaymentMethod was given the code "mollie-payment-method".
 *
 * ```GraphQL
 * mutation AddPaymentToOrder {
 *   addPaymentToOrder(input: {
 *     method: "mollie-payment-method"
 *     metadata: {}
 *   }) {
 *    ...on Order {
 *      id
 *      state
 *      payments {
 *          id
 *          metadata
 *      }
 *    }
 *    ...on ErrorResult {
 *      errorCode
 *      message
 *    }
 *   }
 * }
 * ```
 * The response will have
 * a `order.payments.metadata.public.redirectLink` in it, which can be used to redirect your customer to the Mollie
 * platform.
 *
 * After completing payment on the Mollie platform,
 * the user is redirected to the configured redirect url + orderCode: `https://storefront/order/CH234X5`
 *
 * ## Local development
 *
 * Use something like [localtunnel](https://github.com/localtunnel/localtunnel) to test on localhost.
 *
 * ```bash
 * npx localtunnel --port 3000 --subdomain my-shop-local-dev
 * > your url is: https://my-shop-local-dev.loca.lt     <- use this as the vendureHost for local dev.
 * ```
 *
 * @docsCategory payments-plugin
 * @docsPage MolliePlugin
 * @docsWeight 0
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [MollieController],
    providers: [{ provide: PLUGIN_INIT_OPTIONS, useFactory: () => MolliePlugin.options }],
    configuration: (config: RuntimeVendureConfig) => {
        config.paymentOptions.paymentMethodHandlers.push(molliePaymentHandler);
        return config;
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
