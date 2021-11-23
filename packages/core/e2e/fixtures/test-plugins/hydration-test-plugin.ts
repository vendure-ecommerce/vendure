/* tslint:disable:no-non-null-assertion */
import { Args, Query, Resolver } from '@nestjs/graphql';
import {
    Ctx,
    EntityHydrator,
    ID,
    OrderService,
    PluginCommonModule,
    Product,
    ProductVariantService,
    RequestContext,
    TransactionalConnection,
    VendurePlugin,
} from '@vendure/core';
import gql from 'graphql-tag';

@Resolver()
export class TestAdminPluginResolver {
    constructor(
        private connection: TransactionalConnection,
        private orderService: OrderService,
        private productVariantService: ProductVariantService,
        private entityHydrator: EntityHydrator,
    ) {}

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

    // Test case for https://github.com/vendure-ecommerce/vendure/issues/1153
    @Query()
    async hydrateProductAsset(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
        const product = await this.connection.getRepository(ctx, Product).findOne(args.id);
        // tslint:disable-next-line:no-non-null-assertion
        await this.entityHydrator.hydrate(ctx, product!, {
            relations: ['assets'],
        });
        return product;
    }

    // Test case for https://github.com/vendure-ecommerce/vendure/issues/1161
    @Query()
    async hydrateProductVariant(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
        const [variant] = await this.productVariantService.findByIds(ctx, [args.id]);
        await this.entityHydrator.hydrate(ctx, variant, {
            relations: ['product.facetValues.facet'],
        });
        return variant;
    }

    // Test case for https://github.com/vendure-ecommerce/vendure/issues/1172
    @Query()
    async hydrateOrder(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
        const order = await this.orderService.findOne(ctx, args.id);
        await this.entityHydrator.hydrate(ctx, order!, {
            relations: ['payments'],
        });
        return order;
    }

    // Test case for https://github.com/vendure-ecommerce/vendure/issues/1229
    @Query()
    async hydrateOrderReturnQuantities(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
        const order = await this.orderService.findOne(ctx, args.id);
        await this.entityHydrator.hydrate(ctx, order!, {
            relations: [
                'lines',
                'lines.productVariant',
                'lines.productVariant.product',
                'lines.productVariant.product.assets',
            ],
        });
        return order?.lines.map(line => line.quantity);
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    adminApiExtensions: {
        resolvers: [TestAdminPluginResolver],
        schema: gql`
            extend type Query {
                hydrateProduct(id: ID!): JSON
                hydrateProductAsset(id: ID!): JSON
                hydrateProductVariant(id: ID!): JSON
                hydrateOrder(id: ID!): JSON
                hydrateOrderReturnQuantities(id: ID!): JSON
            }
        `,
    },
})
export class HydrationTestPlugin {}
