import '@vendure/core/dist/entity/custom-entity-fields';
import { Request } from 'express';
import { IncomingMessage } from 'http';

// Note: deep import is necessary here because CustomCustomerFields is also extended in the Braintree
// plugin. Reference: https://github.com/microsoft/TypeScript/issues/46617
declare module '@vendure/core/dist/entity/custom-entity-fields' {
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

export interface RequestWithRawBody extends Request {
    rawBody: Buffer;
}
