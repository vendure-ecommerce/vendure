/* tslint:disable:no-non-null-assertion */
import { Args, Query, Resolver } from '@nestjs/graphql';
import {
    Ctx,
    EntityHydrator,
    ID,
    PluginCommonModule,
    Product,
    ProductVariant,
    ProductVariantService,
    RequestContext,
    TransactionalConnection,
    VendurePlugin,
} from '@vendure/core';
import gql from 'graphql-tag';

@Resolver()
class TestResolver {
    constructor(
        private productVariantService: ProductVariantService,
        private connection: TransactionalConnection,
        private entityHydrator: EntityHydrator,
    ) {}

    @Query()
    async hydrateTest(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
        const product = await this.connection.getRepository(ctx, Product).findOne(args.id, {
            relations: ['featuredAsset'],
        });
        await this.entityHydrator.hydrate(ctx, product!, {
            relations: ['facetValues.facet', 'variants.options', 'assets'],
        });
        return product;
    }
}

// A plugin to explore solutions to https://github.com/vendure-ecommerce/vendure/issues/1103
@VendurePlugin({
    imports: [PluginCommonModule],
    adminApiExtensions: {
        schema: gql`
            extend type Query {
                hydrateTest(id: ID!): JSON
            }
        `,
        resolvers: [TestResolver],
    },
})
export class EntityHydratePlugin {}
