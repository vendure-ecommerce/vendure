import { DefaultJobQueuePlugin, DefaultSearchPlugin, mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../../e2e-common/test-config';
import { SEARCH_PRODUCTS_ADMIN } from '../graphql/admin-definitions';
import {
    SearchResultSortParameter,
    SortOrder,
    SearchProductsAdminQuery,
    SearchProductsAdminQueryVariables,
} from '../graphql/generated-e2e-admin-types';
import {
    SearchProductsShopQuery,
    SearchProductsShopQueryVariables,
} from '../graphql/generated-e2e-shop-types';
import { SEARCH_PRODUCTS_SHOP } from '../graphql/shop-definitions';
import { awaitRunningJobs } from '../utils/await-running-jobs';

describe('Default search plugin', () => {
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
            productsCsvPath: path.join(__dirname, 'fixtures', 'default-search-plugin-sort-by.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
        await awaitRunningJobs(adminClient);
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await awaitRunningJobs(adminClient);
        await server.destroy();
    });

    function searchProductsShop(queryVariables: SearchProductsShopQueryVariables) {
        return shopClient.query<SearchProductsShopQuery, SearchProductsShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            queryVariables,
        );
    }

    function searchProductsAdmin(queryVariables: SearchProductsAdminQueryVariables) {
        return adminClient.query<SearchProductsAdminQuery, SearchProductsAdminQueryVariables>(
            SEARCH_PRODUCTS_ADMIN,
            queryVariables,
        );
    }

    type SearchProducts = (
        queryVariables: SearchProductsShopQueryVariables | SearchProductsAdminQueryVariables,
    ) => Promise<SearchProductsShopQuery | SearchProductsAdminQuery>;

    async function testSearchProducts(
        searchProducts: SearchProducts,
        groupByProduct: boolean,
        sortBy: keyof SearchResultSortParameter,
        sortOrder: (typeof SortOrder)[keyof typeof SortOrder],
        skip: number,
        take: number,
    ) {
        return searchProducts({
            input: {
                groupByProduct,
                sort: {
                    [sortBy]: sortOrder,
                },
                skip,
                take,
            },
        });
    }

    async function testSortByPriceAsc(searchProducts: SearchProducts) {
        const resultPage1 = await testSearchProducts(searchProducts, false, 'price', SortOrder.ASC, 0, 3);
        const resultPage2 = await testSearchProducts(searchProducts, false, 'price', SortOrder.ASC, 3, 3);

        const pvIds1 = resultPage1.search.items.map(i => i.productVariantId);
        const pvIds2 = resultPage2.search.items.map(i => i.productVariantId);
        const pvIds3 = pvIds1.concat(pvIds2);

        expect(new Set(pvIds3).size).equals(6);
        expect(resultPage1.search.items.map(i => i.productVariantId)).toEqual(['T_4', 'T_5', 'T_6']);
        expect(resultPage2.search.items.map(i => i.productVariantId)).toEqual(['T_7', 'T_8', 'T_9']);
    }

    async function testSortByPriceDesc(searchProducts: SearchProducts) {
        const resultPage1 = await testSearchProducts(searchProducts, false, 'price', SortOrder.DESC, 0, 3);
        const resultPage2 = await testSearchProducts(searchProducts, false, 'price', SortOrder.DESC, 3, 3);

        const pvIds1 = resultPage1.search.items.map(i => i.productVariantId);
        const pvIds2 = resultPage2.search.items.map(i => i.productVariantId);
        const pvIds3 = pvIds1.concat(pvIds2);

        expect(new Set(pvIds3).size).equals(6);
        expect(resultPage1.search.items.map(i => i.productVariantId)).toEqual(['T_1', 'T_2', 'T_3']);
        expect(resultPage2.search.items.map(i => i.productVariantId)).toEqual(['T_4', 'T_5', 'T_6']);
    }

    async function testSortByPriceAscGroupByProduct(searchProducts: SearchProducts) {
        const resultPage1 = await testSearchProducts(searchProducts, true, 'price', SortOrder.ASC, 0, 3);
        const resultPage2 = await testSearchProducts(searchProducts, true, 'price', SortOrder.ASC, 3, 3);

        const pvIds1 = resultPage1.search.items.map(i => i.productVariantId);
        const pvIds2 = resultPage2.search.items.map(i => i.productVariantId);
        const pvIds3 = pvIds1.concat(pvIds2);

        expect(new Set(pvIds3).size).equals(6);
        expect(resultPage1.search.items.map(i => i.productId)).toEqual(['T_4', 'T_5', 'T_6']);
        expect(resultPage2.search.items.map(i => i.productId)).toEqual(['T_1', 'T_2', 'T_3']);
    }

    async function testSortByPriceDescGroupByProduct(searchProducts: SearchProducts) {
        const resultPage1 = await testSearchProducts(searchProducts, true, 'price', SortOrder.DESC, 0, 3);
        const resultPage2 = await testSearchProducts(searchProducts, true, 'price', SortOrder.DESC, 3, 3);

        const pvIds1 = resultPage1.search.items.map(i => i.productVariantId);
        const pvIds2 = resultPage2.search.items.map(i => i.productVariantId);
        const pvIds3 = pvIds1.concat(pvIds2);

        expect(new Set(pvIds3).size).equals(6);
        expect(resultPage1.search.items.map(i => i.productId)).toEqual(['T_1', 'T_2', 'T_3']);
        expect(resultPage2.search.items.map(i => i.productId)).toEqual(['T_4', 'T_5', 'T_6']);
    }

    describe('Search products shop', () => {
        const searchProducts = searchProductsShop;

        it('sort by price ASC', () => testSortByPriceAsc(searchProducts));
        it('sort by price DESC', () => testSortByPriceDesc(searchProducts));

        it('sort by price ASC group by product', () => testSortByPriceAscGroupByProduct(searchProducts));
        it('sort by price DESC group by product', () => testSortByPriceDescGroupByProduct(searchProducts));
    });

    describe('Search products admin', () => {
        const searchProducts = searchProductsAdmin;

        it('sort by price ACS', () => testSortByPriceAsc(searchProducts));
        it('sort by price DESC', () => testSortByPriceDesc(searchProducts));

        it('sort by price ASC group by product', () => testSortByPriceAscGroupByProduct(searchProducts));
        it('sort by price DESC group by product', () => testSortByPriceDescGroupByProduct(searchProducts));
    });
});
