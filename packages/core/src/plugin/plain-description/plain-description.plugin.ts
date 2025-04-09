import { VendurePlugin, PluginCommonModule } from '@vendure/core';
import { gql } from 'graphql-tag';

import { ProductPlainDescriptionResolver } from './product-plain-description.resolver';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [ProductPlainDescriptionResolver],
    shopApiExtensions: {
        schema: gql`
            extend type Product {
                plainDescription: String!
            }
        `,
        resolvers: [ProductPlainDescriptionResolver],
    },
    adminApiExtensions: {
        schema: gql`
            extend type Product {
                plainDescription: String!
            }
        `,
        resolvers: [ProductPlainDescriptionResolver],
    },
})
export class PlainDescriptionPlugin {}
