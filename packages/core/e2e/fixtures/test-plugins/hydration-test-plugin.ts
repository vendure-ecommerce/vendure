/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Args, Query, Resolver } from '@nestjs/graphql';
import {
    Asset,
    ChannelService,
    Ctx,
    DeepPartial,
    EntityHydrator,
    ID,
    LanguageCode,
    OrderService,
    PluginCommonModule,
    Product,
    ProductService,
    ProductVariantService,
    RequestContext,
    TransactionalConnection,
    VendureEntity,
    VendurePlugin,
} from '@vendure/core';
import gql from 'graphql-tag';
import { Entity, ManyToOne } from 'typeorm';

@Resolver()
export class TestAdminPluginResolver {
    constructor(
        private connection: TransactionalConnection,
        private orderService: OrderService,
        private channelService: ChannelService,
        private productVariantService: ProductVariantService,
        private productService: ProductService,
        private entityHydrator: EntityHydrator,
    ) {}

    @Query()
    async hydrateProduct(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
        const product = await this.connection.getRepository(ctx, Product).findOne({
            where: { id: args.id },
            relations: ['facetValues'],
        });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
        const product = await this.connection.getRepository(ctx, Product).findOne({ where: { id: args.id } });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

    // Test case for https://github.com/vendure-ecommerce/vendure/issues/1324
    @Query()
    async hydrateProductWithNoFacets(@Ctx() ctx: RequestContext) {
        const product = await this.productService.create(ctx, {
            enabled: true,
            translations: [
                {
                    languageCode: LanguageCode.en,
                    name: 'test',
                    slug: 'test',
                    description: 'test',
                },
            ],
        });
        await this.entityHydrator.hydrate(ctx, product, {
            relations: ['facetValues', 'facetValues.facet'],
        });
        return product;
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

    // Test case for https://github.com/vendure-ecommerce/vendure/issues/1284
    @Query()
    async hydrateChannel(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
        const channel = await this.channelService.findOne(ctx, args.id);
        await this.entityHydrator.hydrate(ctx, channel!, {
            relations: ['customFields.thumb'],
        });
        return channel;
    }

    @Query()
    async hydrateChannelWithNestedRelation(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
        const channel = await this.channelService.findOne(ctx, args.id);
        await this.entityHydrator.hydrate(ctx, channel!, {
            relations: [
                'customFields.thumb',
                'customFields.additionalConfig',
                'customFields.additionalConfig.backgroundImage',
            ],
        });
        return channel;
    }
}

@Entity()
export class AdditionalConfig extends VendureEntity {
    constructor(input?: DeepPartial<AdditionalConfig>) {
        super(input);
    }

    @ManyToOne(() => Asset, { onDelete: 'SET NULL', nullable: true })
    backgroundImage: Asset;
}

@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [AdditionalConfig],
    adminApiExtensions: {
        resolvers: [TestAdminPluginResolver],
        schema: gql`
            extend type Query {
                hydrateProduct(id: ID!): JSON
                hydrateProductWithNoFacets: JSON
                hydrateProductAsset(id: ID!): JSON
                hydrateProductVariant(id: ID!): JSON
                hydrateOrder(id: ID!): JSON
                hydrateOrderReturnQuantities(id: ID!): JSON
                hydrateChannel(id: ID!): JSON
                hydrateChannelWithNestedRelation(id: ID!): JSON
            }
        `,
    },
    configuration: config => {
        config.customFields.Channel.push({ name: 'thumb', type: 'relation', entity: Asset, nullable: true });
        config.customFields.Channel.push({
            name: 'additionalConfig',
            type: 'relation',
            entity: AdditionalConfig,
            graphQLType: 'JSON',
            nullable: true,
        });
        return config;
    },
})
export class HydrationTestPlugin {}
