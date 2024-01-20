/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DefaultJobQueuePlugin, DefaultSearchPlugin, mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../../e2e-common/test-config';
import {
    SearchInput,
    SearchResultSortParameter,
    SortOrder,
    SearchProductsAdminQuery,
    SearchProductsAdminQueryVariables,
} from '../graphql/generated-e2e-admin-types';
import {
    SearchProductsShopQuery,
    SearchProductsShopQueryVariables,
} from '../graphql/generated-e2e-shop-types';
import { awaitRunningJobs } from '../utils/await-running-jobs';

interface SearchProductsShopQueryVariablesExt extends SearchProductsShopQueryVariables {
    input: SearchProductsShopQueryVariables['input'] & {
        // This input field is dynamically added only when the `indexStockStatus` init option
        // is set to `true`, and therefore not included in the generated type. Therefore
        // we need to manually patch it here.
        inStock?: boolean;
    };
}

const SEARCH_PRODUCTS_SHOP = gql`
    query SearchProductsShop($input: SearchInput!) {
        search(input: $input) {
            totalItems
            items {
                productId
                productName
                productVariantId
                productVariantName
                sku
                collectionIds
                price {
                    ... on SinglePrice {
                        value
                    }
                    ... on PriceRange {
                        min
                        max
                    }
                }
            }
        }
    }
`;

const SEARCH_PRODUCTS_ADMIN = gql`
    query SearchProductsAdmin($input: SearchInput!) {
        search(input: $input) {
            totalItems
            items {
                enabled
                productId
                productName
                slug
                description
                productVariantId
                productVariantName
                sku
            }
        }
    }
`;

describe('Default search plugin - sort by', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            plugins: [
                DefaultSearchPlugin.init({
                    indexStockStatus: true,
                }),
                DefaultJobQueuePlugin,
            ],
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures', 'sort-by.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
        await awaitRunningJobs(adminClient);
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await awaitRunningJobs(adminClient);
        await server.destroy();
    });

    function searchProductsShop(input: SearchProductsShopQueryVariablesExt['input']) {
        return shopClient.query<SearchProductsShopQuery, SearchProductsShopQueryVariablesExt>(
            SEARCH_PRODUCTS_SHOP,
            { input },
        );
    }

    function searchProductsAdmin(input: SearchInput) {
        return adminClient.query<SearchProductsAdminQuery, SearchProductsAdminQueryVariables>(
            SEARCH_PRODUCTS_ADMIN,
            { input },
        );
    }

    type SearchProducts = (input: SearchInput) => Promise<SearchProductsShopQuery | SearchProductsAdminQuery>;

    async function testSortBy(
        searchProducts: SearchProducts,
        groupByProduct: boolean,
        sortBy: keyof SearchResultSortParameter,
        sortOrder: (typeof SortOrder)[keyof typeof SortOrder],
        skip: number,
        take: number,
    ) {
        return searchProducts({
            groupByProduct,
            sort: {
                [sortBy]: sortOrder,
            },
            skip,
            take,
        });
    }

    describe('shop API', () => {
        it('sort by price ASC', async () => {
            const resultPage1 = await testSortBy(searchProductsShop, false, 'price', SortOrder.ASC, 0, 3);
            const resultPage2 = await testSortBy(searchProductsShop, false, 'price', SortOrder.ASC, 3, 3);

            // console.log(
            //     resultPage1.search.items.map(i => i.sku),
            //     resultPage2.search.items.map(i => i.sku),
            // );

            const pvIds1 = resultPage1.search.items.map(i => i.productVariantId);
            const pvIds2 = resultPage2.search.items.map(i => i.productVariantId);
            const pvIds3 = pvIds1.concat(pvIds2);

            expect(new Set(pvIds3).size).equals(6);

            expect(resultPage1.search.items.map(i => i.sku)).toEqual(['SA40', 'SA41', 'SA42']);

            expect(resultPage2.search.items.map(i => i.sku)).toEqual(['SA43', 'SB40', 'SB41']);
        });
    });
});
