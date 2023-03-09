/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DefaultJobQueuePlugin, DefaultSearchPlugin, mergeConfig, UuidIdStrategy } from '@vendure/core';
import { createTestEnvironment, registerInitializer, SqljsInitializer } from '@vendure/testing';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import {
    FacetValueFragment,
    GetFacetListQuery,
    GetFacetListQueryVariables,
} from './graphql/generated-e2e-admin-types';
import {
    SearchProductsShopQuery,
    SearchProductsShopQueryVariables,
    SortOrder,
} from './graphql/generated-e2e-shop-types';
import { GET_FACET_LIST } from './graphql/shared-definitions';
import { SEARCH_PRODUCTS_SHOP } from './graphql/shop-definitions';
import { awaitRunningJobs } from './utils/await-running-jobs';

registerInitializer('sqljs', new SqljsInitializer(path.join(__dirname, '__data__'), 1000));

describe('Default search plugin with UUIDs', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            plugins: [DefaultSearchPlugin.init({ indexStockStatus: true }), DefaultJobQueuePlugin],
            entityOptions: {
                entityIdStrategy: new UuidIdStrategy(),
            },
        }),
    );

    let plantsFacetValue: FacetValueFragment;
    let furnitureFacetValue: FacetValueFragment;
    let photoFacetValue: FacetValueFragment;
    let electronicsFacetValue: FacetValueFragment;

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-default-search.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();

        // A precaution against a race condition in which the index
        // rebuild is not completed in time for the first test.
        await new Promise(resolve => setTimeout(resolve, 5000));

        const { facets } = await adminClient.query<GetFacetListQuery, GetFacetListQueryVariables>(
            GET_FACET_LIST,
            {
                options: {
                    sort: {
                        name: SortOrder.ASC,
                    },
                },
            },
        );
        plantsFacetValue = facets.items[0].values.find(v => v.code === 'plants')!;
        furnitureFacetValue = facets.items[0].values.find(v => v.code === 'furniture')!;
        photoFacetValue = facets.items[0].values.find(v => v.code === 'photo')!;
        electronicsFacetValue = facets.items[0].values.find(v => v.code === 'electronics')!;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await awaitRunningJobs(adminClient);
        await server.destroy();
    });

    it('can filter by facetValueIds', async () => {
        const result = await shopClient.query<SearchProductsShopQuery, SearchProductsShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    facetValueIds: [plantsFacetValue.id],
                    groupByProduct: true,
                    sort: { name: SortOrder.ASC },
                },
            },
        );
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Bonsai Tree',
            'Orchid',
            'Spiky Cactus',
        ]);
    });

    it('can filter by facetValueFilters', async () => {
        const { facets } = await adminClient.query<GetFacetListQuery, GetFacetListQueryVariables>(
            GET_FACET_LIST,
        );
        const result = await shopClient.query<SearchProductsShopQuery, SearchProductsShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    facetValueFilters: [
                        { and: electronicsFacetValue.id },
                        { or: [plantsFacetValue.id, photoFacetValue.id] },
                    ],
                    sort: { name: SortOrder.ASC },
                    groupByProduct: true,
                },
            },
        );
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Camera Lens',
            'Instant Camera',
            'Slr Camera',
            'Tripod',
        ]);
    });
});
