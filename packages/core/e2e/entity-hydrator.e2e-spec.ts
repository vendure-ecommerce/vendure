/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    Asset,
    ChannelService,
    EntityHydrator,
    mergeConfig,
    Order,
    Product,
    ProductVariant,
    RequestContext,
    ActiveOrderService,
    OrderService,
    TransactionalConnection,
    OrderLine,
    RequestContextService,
} from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { AdditionalConfig, HydrationTestPlugin } from './fixtures/test-plugins/hydration-test-plugin';
import { UpdateChannelMutation, UpdateChannelMutationVariables } from './graphql/generated-e2e-admin-types';
import {
    AddItemToOrderDocument,
    AddItemToOrderMutation,
    AddItemToOrderMutationVariables,
    UpdatedOrderFragment,
} from './graphql/generated-e2e-shop-types';
import { UPDATE_CHANNEL } from './graphql/shared-definitions';
import { ADD_ITEM_TO_ORDER } from './graphql/shop-definitions';

const orderResultGuard: ErrorResultGuard<UpdatedOrderFragment> = createErrorResultGuard(
    input => !!input.lines,
);

describe('Entity hydration', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            plugins: [HydrationTestPlugin],
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 2,
        });
        await adminClient.asSuperAdmin();

        const connection = server.app.get(TransactionalConnection).rawConnection;
        const asset = await connection.getRepository(Asset).findOne({ where: {} });
        await connection.getRepository(AdditionalConfig).save(
            new AdditionalConfig({
                backgroundImage: asset,
            }),
        );
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('includes existing relations', async () => {
        const { hydrateProduct } = await adminClient.query<HydrateProductQuery>(GET_HYDRATED_PRODUCT, {
            id: 'T_1',
        });

        expect(hydrateProduct.facetValues).toBeDefined();
        expect(hydrateProduct.facetValues.length).toBe(2);
    });

    it('hydrates top-level single relation', async () => {
        const { hydrateProduct } = await adminClient.query<HydrateProductQuery>(GET_HYDRATED_PRODUCT, {
            id: 'T_1',
        });

        expect(hydrateProduct.featuredAsset.name).toBe('derick-david-409858-unsplash.jpg');
    });

    it('hydrates top-level array relation', async () => {
        const { hydrateProduct } = await adminClient.query<HydrateProductQuery>(GET_HYDRATED_PRODUCT, {
            id: 'T_1',
        });

        expect(hydrateProduct.assets.length).toBe(1);
        expect(hydrateProduct.assets[0].asset.name).toBe('derick-david-409858-unsplash.jpg');
    });

    it('hydrates nested single relation', async () => {
        const { hydrateProduct } = await adminClient.query<HydrateProductQuery>(GET_HYDRATED_PRODUCT, {
            id: 'T_1',
        });

        expect(hydrateProduct.variants[0].product.id).toBe('T_1');
    });

    it('hydrates nested array relation', async () => {
        const { hydrateProduct } = await adminClient.query<HydrateProductQuery>(GET_HYDRATED_PRODUCT, {
            id: 'T_1',
        });

        expect(hydrateProduct.variants[0].options.length).toBe(2);
    });

    it('translates top-level translatable', async () => {
        const { hydrateProduct } = await adminClient.query<HydrateProductQuery>(GET_HYDRATED_PRODUCT, {
            id: 'T_1',
        });

        expect(hydrateProduct.variants.map(v => v.name).sort()).toEqual([
            'Laptop 13 inch 16GB',
            'Laptop 13 inch 8GB',
            'Laptop 15 inch 16GB',
            'Laptop 15 inch 8GB',
        ]);
    });

    it('translates nested translatable', async () => {
        const { hydrateProduct } = await adminClient.query<HydrateProductQuery>(GET_HYDRATED_PRODUCT, {
            id: 'T_1',
        });

        expect(
            getVariantWithName(hydrateProduct, 'Laptop 13 inch 8GB')
                .options.map(o => o.name)
                .sort(),
        ).toEqual(['13 inch', '8GB']);
    });

    it('translates nested translatable 2', async () => {
        const { hydrateProduct } = await adminClient.query<HydrateProductQuery>(GET_HYDRATED_PRODUCT, {
            id: 'T_1',
        });

        expect(hydrateProduct.assets[0].product.name).toBe('Laptop');
    });

    it('populates ProductVariant price data', async () => {
        const { hydrateProduct } = await adminClient.query<HydrateProductQuery>(GET_HYDRATED_PRODUCT, {
            id: 'T_1',
        });

        expect(getVariantWithName(hydrateProduct, 'Laptop 13 inch 8GB').price).toBe(129900);
        expect(getVariantWithName(hydrateProduct, 'Laptop 13 inch 8GB').priceWithTax).toBe(155880);
        expect(getVariantWithName(hydrateProduct, 'Laptop 13 inch 16GB').price).toBe(219900);
        expect(getVariantWithName(hydrateProduct, 'Laptop 13 inch 16GB').priceWithTax).toBe(263880);
        expect(getVariantWithName(hydrateProduct, 'Laptop 15 inch 8GB').price).toBe(139900);
        expect(getVariantWithName(hydrateProduct, 'Laptop 15 inch 8GB').priceWithTax).toBe(167880);
        expect(getVariantWithName(hydrateProduct, 'Laptop 15 inch 16GB').price).toBe(229900);
        expect(getVariantWithName(hydrateProduct, 'Laptop 15 inch 16GB').priceWithTax).toBe(275880);
    });

    // https://github.com/vendure-ecommerce/vendure/issues/1153
    it('correctly handles empty array relations', async () => {
        // Product T_5 has no asset defined
        const { hydrateProductAsset } = await adminClient.query<{ hydrateProductAsset: Product }>(
            GET_HYDRATED_PRODUCT_ASSET,
            {
                id: 'T_5',
            },
        );

        expect(hydrateProductAsset.assets).toEqual([]);
    });

    // https://github.com/vendure-ecommerce/vendure/issues/1324
    it('correctly handles empty nested array relations', async () => {
        const { hydrateProductWithNoFacets } = await adminClient.query<{
            hydrateProductWithNoFacets: Product;
        }>(GET_HYDRATED_PRODUCT_NO_FACETS);

        expect(hydrateProductWithNoFacets.facetValues).toEqual([]);
    });

    // https://github.com/vendure-ecommerce/vendure/issues/1161
    it('correctly expands missing relations', async () => {
        const { hydrateProductVariant } = await adminClient.query<{ hydrateProductVariant: ProductVariant }>(
            GET_HYDRATED_VARIANT,
            { id: 'T_1' },
        );

        expect(hydrateProductVariant.product.id).toBe('T_1');
        expect(hydrateProductVariant.product.facetValues.map(fv => fv.id).sort()).toEqual(['T_1', 'T_2']);
    });

    // https://github.com/vendure-ecommerce/vendure/issues/1172
    it('can hydrate entity with getters (Order)', async () => {
        const { addItemToOrder } = await shopClient.query<
            AddItemToOrderMutation,
            AddItemToOrderMutationVariables
        >(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_1',
            quantity: 1,
        });
        orderResultGuard.assertSuccess(addItemToOrder);

        const { hydrateOrder } = await adminClient.query<{ hydrateOrder: Order }>(GET_HYDRATED_ORDER, {
            id: addItemToOrder.id,
        });

        expect(hydrateOrder.id).toBe('T_1');
        expect(hydrateOrder.payments).toEqual([]);
    });

    // https://github.com/vendure-ecommerce/vendure/issues/1229
    it('deep merges existing properties', async () => {
        await shopClient.asAnonymousUser();
        const { addItemToOrder } = await shopClient.query<
            AddItemToOrderMutation,
            AddItemToOrderMutationVariables
        >(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_1',
            quantity: 2,
        });
        orderResultGuard.assertSuccess(addItemToOrder);

        const { hydrateOrderReturnQuantities } = await adminClient.query<{
            hydrateOrderReturnQuantities: number[];
        }>(GET_HYDRATED_ORDER_QUANTITIES, {
            id: addItemToOrder.id,
        });

        expect(hydrateOrderReturnQuantities).toEqual([2]);
    });

    // https://github.com/vendure-ecommerce/vendure/issues/1284
    it('hydrates custom field relations', async () => {
        await adminClient.query<UpdateChannelMutation, UpdateChannelMutationVariables>(UPDATE_CHANNEL, {
            input: {
                id: 'T_1',
                customFields: {
                    thumbId: 'T_2',
                },
            },
        });

        const { hydrateChannel } = await adminClient.query<{
            hydrateChannel: any;
        }>(GET_HYDRATED_CHANNEL, {
            id: 'T_1',
        });

        expect(hydrateChannel.customFields.thumb).toBeDefined();
        expect(hydrateChannel.customFields.thumb.id).toBe('T_2');
    });

    it('hydrates a nested custom field', async () => {
        await adminClient.query<UpdateChannelMutation, UpdateChannelMutationVariables>(UPDATE_CHANNEL, {
            input: {
                id: 'T_1',
                customFields: {
                    additionalConfigId: 'T_1',
                },
            },
        });

        const { hydrateChannelWithNestedRelation } = await adminClient.query<{
            hydrateChannelWithNestedRelation: any;
        }>(GET_HYDRATED_CHANNEL_NESTED, {
            id: 'T_1',
        });

        expect(hydrateChannelWithNestedRelation.customFields.additionalConfig).toBeDefined();
    });

    // https://github.com/vendure-ecommerce/vendure/issues/2682
    it('hydrates a nested custom field where the first level is null', async () => {
        await adminClient.query<UpdateChannelMutation, UpdateChannelMutationVariables>(UPDATE_CHANNEL, {
            input: {
                id: 'T_1',
                customFields: {
                    additionalConfigId: null,
                },
            },
        });

        const { hydrateChannelWithNestedRelation } = await adminClient.query<{
            hydrateChannelWithNestedRelation: any;
        }>(GET_HYDRATED_CHANNEL_NESTED, {
            id: 'T_1',
        });

        expect(hydrateChannelWithNestedRelation.customFields.additionalConfig).toBeNull();
    });

    // https://github.com/vendure-ecommerce/vendure/issues/2013
    describe('hydration of OrderLine ProductVariantPrices', () => {
        let order: Order | undefined;

        it('Create order with 3 items', async () => {
            await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
            await shopClient.query(AddItemToOrderDocument, {
                productVariantId: '1',
                quantity: 1,
            });
            await shopClient.query(AddItemToOrderDocument, {
                productVariantId: '2',
                quantity: 1,
            });
            const { addItemToOrder } = await shopClient.query(AddItemToOrderDocument, {
                productVariantId: '3',
                quantity: 1,
            });
            orderResultGuard.assertSuccess(addItemToOrder);
            const channel = await server.app.get(ChannelService).getDefaultChannel();
            // This is ugly, but in our real life example we use a CTX constructed by Vendure
            const internalOrderId = +addItemToOrder.id.replace(/^\D+/g, '');
            const ctx = new RequestContext({
                channel,
                authorizedAsOwnerOnly: true,
                apiType: 'shop',
                isAuthorized: true,
                session: {
                    activeOrderId: internalOrderId,
                    activeChannelId: 1,
                    user: {
                        id: 2,
                    },
                } as any,
            });
            order = await server.app.get(ActiveOrderService).getActiveOrder(ctx, undefined);
            await server.app.get(EntityHydrator).hydrate(ctx, order!, {
                relations: ['lines.productVariant'],
                applyProductVariantPrices: true,
            });
        });

        it('Variant of orderLine 1 has a price', async () => {
            expect(order!.lines[0].productVariant.priceWithTax).toBeGreaterThan(0);
        });

        it('Variant of orderLine 2 has a price', async () => {
            expect(order!.lines[1].productVariant.priceWithTax).toBeGreaterThan(0);
        });

        it('Variant of orderLine 3 has a price', async () => {
            expect(order!.lines[1].productVariant.priceWithTax).toBeGreaterThan(0);
        });
    });

    // https://github.com/vendure-ecommerce/vendure/issues/2546
    it('Preserves ordering when merging arrays of relations', async () => {
        await shopClient.asUserWithCredentials('trevor_donnelly96@hotmail.com', 'test');
        await shopClient.query(AddItemToOrderDocument, {
            productVariantId: '1',
            quantity: 1,
        });
        const { addItemToOrder } = await shopClient.query(AddItemToOrderDocument, {
            productVariantId: '2',
            quantity: 2,
        });
        orderResultGuard.assertSuccess(addItemToOrder);
        const internalOrderId = +addItemToOrder.id.replace(/^\D+/g, '');
        const ctx = await server.app.get(RequestContextService).create({ apiType: 'admin' });
        const order = await server.app
            .get(OrderService)
            .findOne(ctx, internalOrderId, ['lines.productVariant']);

        for (const line of order?.lines ?? []) {
            // Assert that things are as we expect before hydrating
            expect(line.productVariantId).toBe(line.productVariant.id);
        }

        // modify the first order line to make postgres tend to return the lines in the wrong order
        await server.app
            .get(TransactionalConnection)
            .getRepository(ctx, OrderLine)
            .update(order!.lines[0].id, {
                sellerChannelId: 1,
            });

        await server.app.get(EntityHydrator).hydrate(ctx, order!, {
            relations: ['lines.sellerChannel'],
        });

        for (const line of order?.lines ?? []) {
            expect(line.productVariantId).toBe(line.productVariant.id);
        }
    });
});

function getVariantWithName(product: Product, name: string) {
    return product.variants.find(v => v.name === name)!;
}

type HydrateProductQuery = { hydrateProduct: Product };

const GET_HYDRATED_PRODUCT = gql`
    query GetHydratedProduct($id: ID!) {
        hydrateProduct(id: $id)
    }
`;
const GET_HYDRATED_PRODUCT_NO_FACETS = gql`
    query GetHydratedProductWithNoFacets {
        hydrateProductWithNoFacets
    }
`;
const GET_HYDRATED_PRODUCT_ASSET = gql`
    query GetHydratedProductAsset($id: ID!) {
        hydrateProductAsset(id: $id)
    }
`;
const GET_HYDRATED_VARIANT = gql`
    query GetHydratedVariant($id: ID!) {
        hydrateProductVariant(id: $id)
    }
`;
const GET_HYDRATED_ORDER = gql`
    query GetHydratedOrder($id: ID!) {
        hydrateOrder(id: $id)
    }
`;
const GET_HYDRATED_ORDER_QUANTITIES = gql`
    query GetHydratedOrderQuantities($id: ID!) {
        hydrateOrderReturnQuantities(id: $id)
    }
`;

const GET_HYDRATED_CHANNEL = gql`
    query GetHydratedChannel($id: ID!) {
        hydrateChannel(id: $id)
    }
`;

const GET_HYDRATED_CHANNEL_NESTED = gql`
    query GetHydratedChannelNested($id: ID!) {
        hydrateChannelWithNestedRelation(id: $id)
    }
`;
