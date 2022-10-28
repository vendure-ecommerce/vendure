import { Args, Query, Resolver } from '@nestjs/graphql';
import { ID } from '@vendure/common/lib/shared-types';
import {
    Asset,
    Ctx,
    PluginCommonModule,
    Product,
    RequestContext,
    TransactionalConnection,
    VendureEntity,
    VendurePlugin,
} from '@vendure/core';
import gql from 'graphql-tag';
import { Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Vendor extends VendureEntity {
    constructor() {
        super();
    }

    @OneToOne(type => Product, { eager: true })
    @JoinColumn()
    featuredProduct: Product;
}

@Resolver()
class TestResolver1636 {
    constructor(private connection: TransactionalConnection) {}

    @Query()
    async getAssetTest(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
        const asset = await this.connection.findOneInChannel(ctx, Asset, args.id, ctx.channelId, {
            relations: ['customFields.single', 'customFields.multi'],
        });
        TestPlugin1636_1664.testResolverSpy(asset);
        return true;
    }
}

/**
 * Testing https://github.com/vendure-ecommerce/vendure/issues/1636
 *
 * and
 *
 * https://github.com/vendure-ecommerce/vendure/issues/1664
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [Vendor],
    shopApiExtensions: {
        schema: gql`
            extend type Query {
                getAssetTest(id: ID!): Boolean!
            }
            type Vendor {
                id: ID
                featuredProduct: Product
            }
        `,
        resolvers: [TestResolver1636],
    },
    adminApiExtensions: {
        schema: gql`
            type Vendor {
                id: ID
                featuredProduct: Product
            }
        `,
        resolvers: [],
    },
    configuration: config => {
        config.customFields.Product.push({
            name: 'cfVendor',
            type: 'relation',
            entity: Vendor,
            graphQLType: 'Vendor',
            list: false,
            internal: false,
            public: true,
        });
        config.customFields.User.push({
            name: 'cfVendor',
            type: 'relation',
            entity: Vendor,
            graphQLType: 'Vendor',
            list: false,
            eager: true,
            internal: false,
            public: true,
        });
        return config;
    },
})
// tslint:disable-next-line:class-name
export class TestPlugin1636_1664 {
    static testResolverSpy = jest.fn();
}
