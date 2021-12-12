/* tslint:disable:no-non-null-assertion */
import { mergeConfig, Order, Product, ProductVariant } from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { HydrationTestPlugin } from './fixtures/test-plugins/hydration-test-plugin';
import { AddItemToOrder, UpdatedOrderFragment } from './graphql/generated-e2e-shop-types';
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
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
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
        const { addItemToOrder } = await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(
            ADD_ITEM_TO_ORDER,
            {
                productVariantId: 'T_1',
                quantity: 1,
            },
        );
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
        const { addItemToOrder } = await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(
            ADD_ITEM_TO_ORDER,
            {
                productVariantId: 'T_1',
                quantity: 2,
            },
        );
        orderResultGuard.assertSuccess(addItemToOrder);

        const { hydrateOrderReturnQuantities } = await adminClient.query<{
            hydrateOrderReturnQuantities: number[];
        }>(GET_HYDRATED_ORDER_QUANTITIES, {
            id: addItemToOrder.id,
        });

        expect(hydrateOrderReturnQuantities).toEqual([2]);
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
