import { ConfigArgValues } from '@vendure/core/dist/common/configurable-operation';
import '@vendure/core/dist/entity/custom-entity-fields';
import { Environment } from 'braintree';

import { braintreePaymentMethodHandler } from './braintree.handler';

export type PaymentMethodArgsHash = ConfigArgValues<typeof braintreePaymentMethodHandler['args']>;

// Note: deep import is necessary here because CustomCustomerFields is also extended in the Stripe
// plugin. Reference: https://github.com/microsoft/TypeScript/issues/46617
declare module '@vendure/core/dist/entity/custom-entity-fields' {
    interface CustomCustomerFields {
        braintreeCustomerId?: string;
    }
}

/**
 * @description
 * Options for the Braintree plugin.
 *
 * @docsCategory payments-plugin
 * @docsPage BraintreePlugin
 */
export interface BraintreePluginOptions {
    /**
     * @description
     * The Braintree environment being targeted, e.g. sandbox or production.
     *
     * @default Environment.Sandbox
     */
    environment?: Environment;
    /**
     * @description
     * If set to `true`, a [Customer](https://developer.paypal.com/braintree/docs/guides/customers) object
     * will be created in Braintree, which allows the secure storage of previously-used payment methods.
     * This is done by adding a custom field to the Customer entity to store the Braintree customer ID,
     * so switching this on will require a database migration / synchronization.
     *
     * @default false
     */
    storeCustomersInBraintree?: boolean;
}
