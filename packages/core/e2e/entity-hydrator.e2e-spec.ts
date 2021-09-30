/* tslint:disable:no-non-null-assertion */
import { mergeConfig, Product } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { HydrationTestPlugin } from './fixtures/test-plugins/hydration-test-plugin';

describe('Entity hydration', () => {
    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig, {
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
