import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { gql } from 'apollo-server-core';

import { braintreePaymentMethodHandler } from './braintree-payment-method';
import { BraintreeResolver } from './braintree.resolver';

/**
 * This plugin implements the Braintree (https://www.braintreepayments.com/) payment provider.
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [],
    configuration: config => {
        config.paymentOptions.paymentMethodHandlers.push(braintreePaymentMethodHandler);
        return config;
    },
    shopApiExtensions: {
        schema: gql`
            extend type Query {
                generateBraintreeClientToken(orderId: ID!): String!
            }
        `,
        resolvers: [BraintreeResolver],
    },
})
export class BraintreePlugin {}
