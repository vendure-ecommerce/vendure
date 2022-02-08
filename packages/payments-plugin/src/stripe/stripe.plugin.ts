import { LanguageCode, PluginCommonModule, Type, VendurePlugin } from '@vendure/core';
import { gql } from 'graphql-tag';

import { STRIPE_PLUGIN_OPTIONS } from './constants';
import { rawBodyMiddleware } from './raw-body.middleware';
import { StripeController } from './stripe.controller';
import { stripePaymentMethodHandler } from './stripe.handler';
import { StripeResolver } from './stripe.resolver';
import { StripeService } from './stripe.service';
import { StripePluginOptions } from './types';

/**
 * @description
 * Plugin to enable payments through [Stripe](https://stripe.com/docs) via the Payment Intents API.
 *
 * ## Requirements
 *
 * 1. You will need to create a Stripe account and get your secret key in the dashboard.
 * 2. Create a webhook endpoint in the Stripe dashboard which listens to the `payment_intent.succeeded` and
 * `payment_intent.payment_failed` events. The URL should be `https://my-shop.com/payments/stripe`, where
 * `my-shop.com` is the host of your storefront application.
 * 3. Get the signing secret for the newly created webhook.
 * 4. Install the Payments plugin and the Stripe Node library:
 *
 *     `yarn add \@vendure/payments-plugin stripe`
 *
 *     or
 *
 *     `npm install \@vendure/payments-plugin stripe`
 *
 * ## Setup
 *
 * 1. Add the plugin to your VendureConfig `plugins` array:
 *     ```TypeScript
 *     import { StripePlugin } from '\@vendure/payments-plugin/package/stripe';
 *
 *     // ...
 *
 *     plugins: [
 *       StripePlugin.init({
 *         apiKey: process.env.YOUR_STRIPE_SECRET_KEY,
 *         webhookSigningSecret: process.env.YOUR_STRIPE_WEBHOOK_SIGNING_SECRET,
 *         // This prevents different customers from using the same PaymentIntent
 *         storeCustomersInStripe: true,
 *       }),
 *     ]
 *     ````
 * 2. Create a new PaymentMethod in the Admin UI, and select "Stripe payments" as the handler.
 *
 * ## Storefront usage
 *
 * The plugin is designed to work with the [Custom payment flow](https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements).
 * In this flow, Stripe provides libraries which handle the payment UI and confirmation for you. You can install it in your storefront project
 * with:
 *
 * ```shell
 * yarn add \@stripe/stripe-js
 * # or
 * npm install \@stripe/stripe-js
 * ```
 *
 * If you are using React, you should also consider installing `@stripe/react-stripe-js`, which is a wrapper around Stripe Elements.
 *
 * The high-level workflow is:
 * 1. Create a "payment intent" on the server by executing the `createStripePaymentIntent` mutation which is exposed by this plugin.
 * 2. Use the returned client secret to instantiate the Stripe Payment Element.
 * 3. Once the form is submitted and Stripe processes the payment, the webhook takes care of updating the order without additional action
 * in the storefront.
 *
 * ## Local development
 *
 * Use something like [localtunnel](https://github.com/localtunnel/localtunnel) to test on localhost.
 *
 * ```bash
 * npx localtunnel --port 3000 --subdomain my-shop-local-dev
 * > your url is: https://my-shop-local-dev.loca.lt
 * ```
 *
 * @docsCategory payments-plugin
 * @docsPage StripePlugin
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [StripeController],
    providers: [
        {
            provide: STRIPE_PLUGIN_OPTIONS,
            useFactory: (): StripePluginOptions => StripePlugin.options,
        },
        StripeService,
    ],
    configuration: config => {
        config.paymentOptions.paymentMethodHandlers.push(stripePaymentMethodHandler);

        config.apiOptions.middleware.push({
            route: '/payments/stripe',
            handler: rawBodyMiddleware,
            beforeListen: true,
        });

        if (StripePlugin.options.storeCustomersInStripe) {
            config.customFields.Customer.push({
                name: 'stripeCustomerId',
                type: 'string',
                label: [{ languageCode: LanguageCode.en, value: 'Stripe Customer ID' }],
                nullable: true,
                public: false,
                readonly: true,
            });
        }

        return config;
    },
    shopApiExtensions: {
        schema: gql`
            extend type Mutation {
                createStripePaymentIntent: String
            }
        `,
        resolvers: [StripeResolver],
    },
})
export class StripePlugin {
    static options: StripePluginOptions;

    /**
     * @description
     * Initialize the Stripe payment plugin
     */
    static init(options: StripePluginOptions): Type<StripePlugin> {
        this.options = options;
        return StripePlugin;
    }
}
