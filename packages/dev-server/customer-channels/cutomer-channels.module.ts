import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import gql from 'graphql-tag';

import CustomerChannelsResolver from './customer-channels.resolver';

@VendurePlugin({
    imports: [PluginCommonModule],
    shopApiExtensions: {
        schema: gql`
            extend type Query {
                customerChannels: [Channel!]!
            }
        `,
        resolvers: [CustomerChannelsResolver],
    },
})
export class CustomerChannelsPlugin {}
