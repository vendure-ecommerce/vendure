import { Query, Resolver } from '@nestjs/graphql';
import { VendurePlugin } from '@vendure/core';
import gql from 'graphql-tag';

@Resolver()
export class TestAdminPluginResolver {
    @Query()
    foo() {
        return ['bar'];
    }

    @Query()
    barList() {
        return {
            items: [{ id: 1, name: 'Test' }],
            totalItems: 1,
        };
    }
}

@Resolver()
export class TestShopPluginResolver {
    @Query()
    baz() {
        return ['quux'];
    }
}

@VendurePlugin({
    shopApiExtensions: {
        resolvers: [TestShopPluginResolver],
        schema: gql`
            extend type Query {
                baz: [String]!
            }
        `,
    },
    adminApiExtensions: {
        resolvers: [TestAdminPluginResolver],
        schema: gql`
            extend type Query {
                foo: [String]!
                barList(options: BarListOptions): BarList!
            }

            input BarListOptions
            type Bar implements Node {
                id: ID!
                name: String!
            }
            type BarList implements PaginatedList {
                items: [Bar!]!
                totalItems: Int!
            }
        `,
    },
})
export class TestAPIExtensionPlugin {}
