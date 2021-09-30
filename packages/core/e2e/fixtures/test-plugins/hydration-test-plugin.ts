import { Args, Query, Resolver } from '@nestjs/graphql';
import {
    Ctx,
    EntityHydrator,
    ID,
    PluginCommonModule,
    Product,
    RequestContext,
    TransactionalConnection,
    VendurePlugin,
} from '@vendure/core';
import gql from 'graphql-tag';

@Resolver()
export class TestAdminPluginResolver {
    constructor(private connection: TransactionalConnection, private entityHydrator: EntityHydrator) {}

    @Query()
    async hydrateProduct(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
        const product = await this.connection.getRepository(ctx, Product).findOne(args.id, {
            relations: ['facetValues'],
        });
        // tslint:disable-next-line:no-non-null-assertion
        await this.entityHydrator.hydrate(ctx, product!, {
            relations: [
                'variants.options',
                'variants.product',
                'assets.product',
                'facetValues.facet',
                'featuredAsset',
                'variants.stockMovements',
            ],
            applyProductVariantPrices: true,
        });
        return product;
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    adminApiExtensions: {
        resolvers: [TestAdminPluginResolver],
        schema: gql`
            extend type Query {
                hydrateProduct(id: ID!): JSON
            }
        `,
    },
})
export class HydrationTestPlugin {}
