import { ConfigArgValues } from '@vendure/core/dist/common/configurable-operation';
import { Environment } from 'braintree';

import { braintreePaymentMethodHandler } from './braintree.handler';

export type PaymentMethodArgsHash = ConfigArgValues<typeof braintreePaymentMethodHandler['args']>;

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
     */
    environment?: Environment;
}
