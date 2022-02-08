import { CustomCustomerFields } from '@vendure/core';
import { IncomingMessage } from 'http';

declare module '@vendure/core' {
    interface CustomCustomerFields {
        stripeCustomerId?: string;
    }
}

/**
 * @description
 * Configuration options for the Stripe payments plugin.
 *
 * @docsCategory payments-plugin
 * @docsPage StripePlugin
 */
export interface StripePluginOptions {
    /**
     * @description
     * Secret key of your Stripe account.
     */
    apiKey: string;
    /**
     * @description
     * Signing secret of your configured Stripe webhook.
     */
    webhookSigningSecret: string;
    /**
     * @description
     * If set to `true`, a [Customer](https://stripe.com/docs/api/customers) object will be created in Stripe - if
     * it doesn't already exist - for authenticated users, which prevents payment methods attached to other Customers
     * to be used with the same PaymentIntent. This is done by adding a custom field to the Customer entity to store
     * the Stripe customer ID, so switching this on will require a database migration / synchronization.
     *
     * @default false
     */
    storeCustomersInStripe?: boolean;
}

export interface IncomingMessageWithRawBody extends IncomingMessage {
    rawBody: Buffer;
}
