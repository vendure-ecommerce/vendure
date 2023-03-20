/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { pick } from '@vendure/common/lib/pick';
import {
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    facetValueCollectionFilter,
    mergeConfig,
} from '@vendure/core';
import {
    createTestEnvironment,
    E2E_DEFAULT_CHANNEL_TOKEN,
    registerInitializer,
    SimpleGraphQLClient,
    SqljsInitializer,
} from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import * as Codegen from './graphql/generated-e2e-admin-types';
import {
    ChannelFragment,
    CurrencyCode,
    LanguageCode,
    SearchInput,
    SearchResultSortParameter,
    SortOrder,
} from './graphql/generated-e2e-admin-types';
import {
    LogicalOperator,
    SearchProductsShopQuery,
    SearchProductsShopQueryVariables,
} from './graphql/generated-e2e-shop-types';
import {
    ASSIGN_PRODUCTVARIANT_TO_CHANNEL,
    ASSIGN_PRODUCT_TO_CHANNEL,
    CREATE_CHANNEL,
    CREATE_COLLECTION,
    CREATE_FACET,
    CREATE_PRODUCT,
    CREATE_PRODUCT_VARIANTS,
    DELETE_ASSET,
    DELETE_PRODUCT,
    DELETE_PRODUCT_VARIANT,
    REMOVE_PRODUCTVARIANT_FROM_CHANNEL,
    REMOVE_PRODUCT_FROM_CHANNEL,
    UPDATE_ASSET,
    UPDATE_COLLECTION,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
    UPDATE_TAX_RATE,
} from './graphql/shared-definitions';
import { SEARCH_PRODUCTS_SHOP } from './graphql/shop-definitions';
import { awaitRunningJobs } from './utils/await-running-jobs';

registerInitializer('sqljs', new SqljsInitializer(path.join(__dirname, '__data__'), 1000));

interface SearchProductShopQueryVariables extends SearchProductsShopQueryVariables {
    input: SearchProductsShopQueryVariables['input'] & {
        // This input field is dynamically added only when the `indexStockStatus` init option
        // is set to `true`, and therefore not included in the generated type. Therefore
        // we need to manually patch it here.
        inStock?: boolean;
    };
}

describe('Default search plugin', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            plugins: [DefaultSearchPlugin.init({ indexStockStatus: true }), DefaultJobQueuePlugin],
        }),
    );

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
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await awaitRunningJobs(adminClient);
        await server.destroy();
    });

    function doAdminSearchQuery(input: SearchInput) {
        return adminClient.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(SEARCH_PRODUCTS, {
            input,
        });
    }

    async function testGroupByProduct(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    groupByProduct: true,
                },
            },
        );
        expect(result.search.totalItems).toBe(20);
    }

    async function testNoGrouping(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    groupByProduct: false,
                },
            },
        );
        expect(result.search.totalItems).toBe(34);
    }

    async function testSortingWithGrouping(
        client: SimpleGraphQLClient,
        sortBy: keyof SearchResultSortParameter,
    ) {
        const result = await client.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    groupByProduct: true,
                    sort: {
                        [sortBy]: SortOrder.ASC,
                    },
                    take: 3,
                },
            },
        );
        const expected =
            sortBy === 'name'
                ? ['Bonsai Tree', 'Boxing Gloves', 'Camera Lens']
                : ['Skipping Rope', 'Tripod', 'Spiky Cactus'];
        expect(result.search.items.map(i => i.productName)).toEqual(expected);
    }

    async function testSortingNoGrouping(
        client: SimpleGraphQLClient,
        sortBy: keyof SearchResultSortParameter,
    ) {
        const result = await client.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    groupByProduct: false,
                    sort: {
                        [sortBy]: SortOrder.DESC,
                    },
                    take: 3,
                },
            },
        );
        const expected =
            sortBy === 'name'
                ? ['USB Cable', 'Tripod', 'Tent']
                : ['Road Bike', 'Laptop 15 inch 16GB', 'Laptop 13 inch 16GB'];
        expect(result.search.items.map(i => i.productVariantName)).toEqual(expected);
    }

    async function testMatchSearchTerm(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    term: 'camera',
                    groupByProduct: true,
                    sort: {
                        name: SortOrder.ASC,
                    },
                },
            },
        );
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Camera Lens',
            'Instant Camera',
            'Slr Camera',
        ]);
    }

    async function testMatchPartialSearchTerm(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    term: 'lap',
                    groupByProduct: true,
                    sort: {
                        name: SortOrder.ASC,
                    },
                },
            },
        );
        expect(result.search.items.map(i => i.productName)).toEqual(['Laptop']);
    }

    async function testMatchFacetIdsAnd(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    facetValueIds: ['T_1', 'T_2'],
                    facetValueOperator: LogicalOperator.AND,
                    groupByProduct: true,
                },
            },
        );
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Laptop',
            'Curvy Monitor',
            'Gaming PC',
            'Hard Drive',
            'Clacky Keyboard',
            'USB Cable',
        ]);
    }

    async function testMatchFacetIdsOr(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    facetValueIds: ['T_1', 'T_5'],
                    facetValueOperator: LogicalOperator.OR,
                    groupByProduct: true,
                },
            },
        );
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Laptop',
            'Curvy Monitor',
            'Gaming PC',
            'Hard Drive',
            'Clacky Keyboard',
            'USB Cable',
            'Instant Camera',
            'Camera Lens',
            'Tripod',
            'Slr Camera',
            'Spiky Cactus',
            'Orchid',
            'Bonsai Tree',
        ]);
    }

    async function testMatchFacetValueFiltersAnd(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    groupByProduct: true,
                    facetValueFilters: [{ and: 'T_1' }, { and: 'T_2' }],
                },
            },
        );
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Laptop',
            'Curvy Monitor',
            'Gaming PC',
            'Hard Drive',
            'Clacky Keyboard',
            'USB Cable',
        ]);
    }

    async function testMatchFacetValueFiltersOr(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    groupByProduct: true,
                    facetValueFilters: [{ or: ['T_1', 'T_5'] }],
                },
            },
        );
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Laptop',
            'Curvy Monitor',
            'Gaming PC',
            'Hard Drive',
            'Clacky Keyboard',
            'USB Cable',
            'Instant Camera',
            'Camera Lens',
            'Tripod',
            'Slr Camera',
            'Spiky Cactus',
            'Orchid',
            'Bonsai Tree',
        ]);
    }

    async function testMatchFacetValueFiltersOrWithAnd(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    groupByProduct: true,
                    facetValueFilters: [{ and: 'T_1' }, { or: ['T_2', 'T_3'] }],
                },
            },
        );
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Laptop',
            'Curvy Monitor',
            'Gaming PC',
            'Hard Drive',
            'Clacky Keyboard',
            'USB Cable',
            'Instant Camera',
            'Camera Lens',
            'Tripod',
            'Slr Camera',
        ]);
    }

    async function testMatchFacetValueFiltersWithFacetIdsOr(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    facetValueIds: ['T_2', 'T_3'],
                    facetValueOperator: LogicalOperator.OR,
                    facetValueFilters: [{ and: 'T_1' }],
                    groupByProduct: true,
                },
            },
        );
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Laptop',
            'Curvy Monitor',
            'Gaming PC',
            'Hard Drive',
            'Clacky Keyboard',
            'USB Cable',
            'Instant Camera',
            'Camera Lens',
            'Tripod',
            'Slr Camera',
        ]);
    }

    async function testMatchFacetValueFiltersWithFacetIdsAnd(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    facetValueIds: ['T_1'],
                    facetValueFilters: [{ and: 'T_3' }],
                    facetValueOperator: LogicalOperator.AND,
                    groupByProduct: true,
                },
            },
        );
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Instant Camera',
            'Camera Lens',
            'Tripod',
            'Slr Camera',
        ]);
    }

    async function testMatchCollectionId(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    collectionId: 'T_2',
                    groupByProduct: true,
                },
            },
        );
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Spiky Cactus',
            'Orchid',
            'Bonsai Tree',
        ]);
    }

    async function testMatchCollectionSlug(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    collectionSlug: 'plants',
                    groupByProduct: true,
                },
            },
        );
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Spiky Cactus',
            'Orchid',
            'Bonsai Tree',
        ]);
    }

    async function testSinglePrices(client: SimpleGraphQLClient) {
        const result = await client.query<
            Codegen.SearchGetPricesQuery,
            Codegen.SearchGetPricesQueryVariables
        >(SEARCH_GET_PRICES, {
            input: {
                groupByProduct: false,
                take: 3,
            } as SearchInput,
        });
        expect(result.search.items).toEqual([
            {
                price: { value: 129900 },
                priceWithTax: { value: 155880 },
            },
            {
                price: { value: 139900 },
                priceWithTax: { value: 167880 },
            },
            {
                price: { value: 219900 },
                priceWithTax: { value: 263880 },
            },
        ]);
    }

    async function testPriceRanges(client: SimpleGraphQLClient) {
        const result = await client.query<
            Codegen.SearchGetPricesQuery,
            Codegen.SearchGetPricesQueryVariables
        >(SEARCH_GET_PRICES, {
            input: {
                groupByProduct: true,
                take: 3,
            } as SearchInput,
        });
        expect(result.search.items).toEqual([
            {
                price: { min: 129900, max: 229900 },
                priceWithTax: { min: 155880, max: 275880 },
            },
            {
                price: { min: 14374, max: 16994 },
                priceWithTax: { min: 17249, max: 20393 },
            },
            {
                price: { min: 93120, max: 109995 },
                priceWithTax: { min: 111744, max: 131994 },
            },
        ]);
    }

    describe('shop api', () => {
        it('group by product', () => testGroupByProduct(shopClient));

        it('no grouping', () => testNoGrouping(shopClient));

        it('matches search term', () => testMatchSearchTerm(shopClient));

        it('matches partial search term', () => testMatchPartialSearchTerm(shopClient));

        it('matches by facetId with AND operator', () => testMatchFacetIdsAnd(shopClient));

        it('matches by facetId with OR operator', () => testMatchFacetIdsOr(shopClient));

        it('matches by FacetValueFilters AND', () => testMatchFacetValueFiltersAnd(shopClient));

        it('matches by FacetValueFilters OR', () => testMatchFacetValueFiltersOr(shopClient));

        it('matches by FacetValueFilters OR and AND', () => testMatchFacetValueFiltersOrWithAnd(shopClient));

        it('matches by FacetValueFilters with facetId OR operator', () =>
            testMatchFacetValueFiltersWithFacetIdsOr(shopClient));

        it('matches by FacetValueFilters with facetId AND operator', () =>
            testMatchFacetValueFiltersWithFacetIdsAnd(shopClient));

        it('matches by collectionId', () => testMatchCollectionId(shopClient));

        it('matches by collectionSlug', () => testMatchCollectionSlug(shopClient));

        it('single prices', () => testSinglePrices(shopClient));

        it('price ranges', () => testPriceRanges(shopClient));

        it('returns correct facetValues when not grouped by product', async () => {
            const result = await shopClient.query<
                Codegen.SearchFacetValuesQuery,
                Codegen.SearchFacetValuesQueryVariables
            >(SEARCH_GET_FACET_VALUES, {
                input: {
                    groupByProduct: false,
                },
            });
            expect(result.search.facetValues).toEqual([
                { count: 21, facetValue: { id: 'T_1', name: 'electronics' } },
                { count: 17, facetValue: { id: 'T_2', name: 'computers' } },
                { count: 4, facetValue: { id: 'T_3', name: 'photo' } },
                { count: 10, facetValue: { id: 'T_4', name: 'sports equipment' } },
                { count: 3, facetValue: { id: 'T_5', name: 'home & garden' } },
                { count: 3, facetValue: { id: 'T_6', name: 'plants' } },
            ]);
        });

        it('returns correct facetValues when grouped by product', async () => {
            const result = await shopClient.query<
                Codegen.SearchFacetValuesQuery,
                Codegen.SearchFacetValuesQueryVariables
            >(SEARCH_GET_FACET_VALUES, {
                input: {
                    groupByProduct: true,
                },
            });
            expect(result.search.facetValues).toEqual([
                { count: 10, facetValue: { id: 'T_1', name: 'electronics' } },
                { count: 6, facetValue: { id: 'T_2', name: 'computers' } },
                { count: 4, facetValue: { id: 'T_3', name: 'photo' } },
                { count: 7, facetValue: { id: 'T_4', name: 'sports equipment' } },
                { count: 3, facetValue: { id: 'T_5', name: 'home & garden' } },
                { count: 3, facetValue: { id: 'T_6', name: 'plants' } },
            ]);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/1236
        it('returns correct facetValues when not grouped by product, with search term', async () => {
            const result = await shopClient.query<
                Codegen.SearchFacetValuesQuery,
                Codegen.SearchFacetValuesQueryVariables
            >(SEARCH_GET_FACET_VALUES, {
                input: {
                    groupByProduct: false,
                    term: 'laptop',
                },
            });
            expect(result.search.facetValues).toEqual([
                { count: 4, facetValue: { id: 'T_1', name: 'electronics' } },
                { count: 4, facetValue: { id: 'T_2', name: 'computers' } },
            ]);
        });

        it('omits facetValues of private facets', async () => {
            const { createFacet } = await adminClient.query<
                Codegen.CreateFacetMutation,
                Codegen.CreateFacetMutationVariables
            >(CREATE_FACET, {
                input: {
                    code: 'profit-margin',
                    isPrivate: true,
                    translations: [{ languageCode: LanguageCode.en, name: 'Profit Margin' }],
                    values: [
                        {
                            code: 'massive',
                            translations: [{ languageCode: LanguageCode.en, name: 'massive' }],
                        },
                    ],
                },
            });
            await adminClient.query<Codegen.UpdateProductMutation, Codegen.UpdateProductMutationVariables>(
                UPDATE_PRODUCT,
                {
                    input: {
                        id: 'T_2',
                        // T_1 & T_2 are the existing facetValues (electronics & photo)
                        facetValueIds: ['T_1', 'T_2', createFacet.values[0].id],
                    },
                },
            );

            await awaitRunningJobs(adminClient);

            const result = await shopClient.query<
                Codegen.SearchFacetValuesQuery,
                Codegen.SearchFacetValuesQueryVariables
            >(SEARCH_GET_FACET_VALUES, {
                input: {
                    groupByProduct: true,
                },
            });
            expect(result.search.facetValues).toEqual([
                { count: 10, facetValue: { id: 'T_1', name: 'electronics' } },
                { count: 6, facetValue: { id: 'T_2', name: 'computers' } },
                { count: 4, facetValue: { id: 'T_3', name: 'photo' } },
                { count: 7, facetValue: { id: 'T_4', name: 'sports equipment' } },
                { count: 3, facetValue: { id: 'T_5', name: 'home & garden' } },
                { count: 3, facetValue: { id: 'T_6', name: 'plants' } },
            ]);
        });

        it('returns correct collections when not grouped by product', async () => {
            const result = await shopClient.query<
                Codegen.SearchCollectionsQuery,
                Codegen.SearchCollectionsQueryVariables
            >(SEARCH_GET_COLLECTIONS, {
                input: {
                    groupByProduct: false,
                },
            });
            expect(result.search.collections).toEqual([
                { collection: { id: 'T_2', name: 'Plants' }, count: 3 },
            ]);
        });

        it('returns correct collections when grouped by product', async () => {
            const result = await shopClient.query<
                Codegen.SearchCollectionsQuery,
                Codegen.SearchCollectionsQueryVariables
            >(SEARCH_GET_COLLECTIONS, {
                input: {
                    groupByProduct: true,
                },
            });
            expect(result.search.collections).toEqual([
                { collection: { id: 'T_2', name: 'Plants' }, count: 3 },
            ]);
        });

        it('encodes the productId and productVariantId', async () => {
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
                SEARCH_PRODUCTS_SHOP,
                {
                    input: {
                        groupByProduct: false,
                        take: 1,
                    },
                },
            );
            expect(pick(result.search.items[0], ['productId', 'productVariantId'])).toEqual({
                productId: 'T_1',
                productVariantId: 'T_1',
            });
        });

        it('sort name with grouping', () => testSortingWithGrouping(shopClient, 'name'));

        it('sort price with grouping', () => testSortingWithGrouping(shopClient, 'price'));

        it('sort name without grouping', () => testSortingNoGrouping(shopClient, 'name'));

        it('sort price without grouping', () => testSortingNoGrouping(shopClient, 'price'));

        it('omits results for disabled ProductVariants', async () => {
            await adminClient.query<
                Codegen.UpdateProductVariantsMutation,
                Codegen.UpdateProductVariantsMutationVariables
            >(UPDATE_PRODUCT_VARIANTS, {
                input: [{ id: 'T_3', enabled: false }],
            });
            await awaitRunningJobs(adminClient);
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
                SEARCH_PRODUCTS_SHOP,
                {
                    input: {
                        groupByProduct: false,
                        take: 3,
                    },
                },
            );
            expect(result.search.items.map(i => i.productVariantId)).toEqual(['T_1', 'T_2', 'T_4']);
        });

        it('encodes collectionIds', async () => {
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
                SEARCH_PRODUCTS_SHOP,
                {
                    input: {
                        groupByProduct: false,
                        term: 'cactus',
                        take: 1,
                    },
                },
            );

            expect(result.search.items[0].collectionIds).toEqual(['T_2']);
        });

        it('inStock is false and not grouped by product', async () => {
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
                SEARCH_PRODUCTS_SHOP,
                {
                    input: {
                        groupByProduct: false,
                        inStock: false,
                    },
                },
            );
            expect(result.search.totalItems).toBe(2);
        });

        it('inStock is false and grouped by product', async () => {
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
                SEARCH_PRODUCTS_SHOP,
                {
                    input: {
                        groupByProduct: true,
                        inStock: false,
                    },
                },
            );
            expect(result.search.totalItems).toBe(1);
        });

        it('inStock is true and not grouped by product', async () => {
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
                SEARCH_PRODUCTS_SHOP,
                {
                    input: {
                        groupByProduct: false,
                        inStock: true,
                    },
                },
            );
            expect(result.search.totalItems).toBe(31);
        });

        it('inStock is true and grouped by product', async () => {
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
                SEARCH_PRODUCTS_SHOP,
                {
                    input: {
                        groupByProduct: true,
                        inStock: true,
                    },
                },
            );
            expect(result.search.totalItems).toBe(19);
        });

        it('inStock is undefined and not grouped by product', async () => {
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
                SEARCH_PRODUCTS_SHOP,
                {
                    input: {
                        groupByProduct: false,
                        inStock: undefined,
                    },
                },
            );
            expect(result.search.totalItems).toBe(33);
        });

        it('inStock is undefined and grouped by product', async () => {
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
                SEARCH_PRODUCTS_SHOP,
                {
                    input: {
                        groupByProduct: true,
                        inStock: undefined,
                    },
                },
            );
            expect(result.search.totalItems).toBe(20);
        });
    });

    describe('admin api', () => {
        it('group by product', () => testGroupByProduct(adminClient));

        it('no grouping', () => testNoGrouping(adminClient));

        it('matches search term', () => testMatchSearchTerm(adminClient));

        it('matches partial search term', () => testMatchPartialSearchTerm(adminClient));

        it('matches by facetId with AND operator', () => testMatchFacetIdsAnd(adminClient));

        it('matches by facetId with OR operator', () => testMatchFacetIdsOr(adminClient));

        it('matches by FacetValueFilters AND', () => testMatchFacetValueFiltersAnd(shopClient));

        it('matches by FacetValueFilters OR', () => testMatchFacetValueFiltersOr(shopClient));

        it('matches by FacetValueFilters OR and AND', () => testMatchFacetValueFiltersOrWithAnd(shopClient));

        it('matches by FacetValueFilters with facetId OR operator', () =>
            testMatchFacetValueFiltersWithFacetIdsOr(shopClient));

        it('matches by FacetValueFilters with facetId AND operator', () =>
            testMatchFacetValueFiltersWithFacetIdsAnd(shopClient));

        it('matches by collectionId', () => testMatchCollectionId(adminClient));

        it('matches by collectionSlug', () => testMatchCollectionSlug(adminClient));

        it('single prices', () => testSinglePrices(adminClient));

        it('price ranges', () => testPriceRanges(adminClient));

        it('sort name with grouping', () => testSortingWithGrouping(adminClient, 'name'));

        it('sort price with grouping', () => testSortingWithGrouping(adminClient, 'price'));

        it('sort name without grouping', () => testSortingNoGrouping(adminClient, 'name'));

        it('sort price without grouping', () => testSortingNoGrouping(adminClient, 'price'));

        describe('updating the index', () => {
            it('updates index when ProductVariants are changed', async () => {
                await awaitRunningJobs(adminClient);
                const { search } = await doAdminSearchQuery({ term: 'drive', groupByProduct: false });
                expect(search.items.map(i => i.sku)).toEqual([
                    'IHD455T1',
                    'IHD455T2',
                    'IHD455T3',
                    'IHD455T4',
                    'IHD455T6',
                ]);

                await adminClient.query<
                    Codegen.UpdateProductVariantsMutation,
                    Codegen.UpdateProductVariantsMutationVariables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: search.items.map(i => ({
                        id: i.productVariantId,
                        sku: i.sku + '_updated',
                    })),
                });

                await awaitRunningJobs(adminClient);
                const { search: search2 } = await doAdminSearchQuery({
                    term: 'drive',
                    groupByProduct: false,
                });

                expect(search2.items.map(i => i.sku)).toEqual([
                    'IHD455T1_updated',
                    'IHD455T2_updated',
                    'IHD455T3_updated',
                    'IHD455T4_updated',
                    'IHD455T6_updated',
                ]);
            });

            it('updates index when ProductVariants are deleted', async () => {
                await awaitRunningJobs(adminClient);
                const { search } = await doAdminSearchQuery({ term: 'drive', groupByProduct: false });

                const variantToDelete = search.items[0];
                expect(variantToDelete.sku).toBe('IHD455T1_updated');

                await adminClient.query<
                    Codegen.DeleteProductVariantMutation,
                    Codegen.DeleteProductVariantMutationVariables
                >(DELETE_PRODUCT_VARIANT, {
                    id: variantToDelete.productVariantId,
                });

                await awaitRunningJobs(adminClient);
                const { search: search2 } = await doAdminSearchQuery({
                    term: 'drive',
                    groupByProduct: false,
                });

                expect(search2.items.map(i => i.sku)).toEqual([
                    'IHD455T2_updated',
                    'IHD455T3_updated',
                    'IHD455T4_updated',
                    'IHD455T6_updated',
                ]);
            });

            it('updates index when a Product is changed', async () => {
                await adminClient.query<
                    Codegen.UpdateProductMutation,
                    Codegen.UpdateProductMutationVariables
                >(UPDATE_PRODUCT, {
                    input: {
                        id: 'T_1',
                        facetValueIds: [],
                    },
                });
                await awaitRunningJobs(adminClient);
                const result = await doAdminSearchQuery({ facetValueIds: ['T_2'], groupByProduct: true });
                expect(result.search.items.map(i => i.productName)).toEqual([
                    'Curvy Monitor',
                    'Gaming PC',
                    'Hard Drive',
                    'Clacky Keyboard',
                    'USB Cable',
                ]);
            });

            it('updates index when a Product is deleted', async () => {
                const { search } = await doAdminSearchQuery({ facetValueIds: ['T_2'], groupByProduct: true });
                expect(search.items.map(i => i.productId)).toEqual(['T_2', 'T_3', 'T_4', 'T_5', 'T_6']);
                await adminClient.query<
                    Codegen.DeleteProductMutation,
                    Codegen.DeleteProductMutationVariables
                >(DELETE_PRODUCT, {
                    id: 'T_5',
                });
                await awaitRunningJobs(adminClient);
                const { search: search2 } = await doAdminSearchQuery({
                    facetValueIds: ['T_2'],
                    groupByProduct: true,
                });
                expect(search2.items.map(i => i.productId)).toEqual(['T_2', 'T_3', 'T_4', 'T_6']);
            });

            it('updates index when a Collection is changed', async () => {
                await adminClient.query<
                    Codegen.UpdateCollectionMutation,
                    Codegen.UpdateCollectionMutationVariables
                >(UPDATE_COLLECTION, {
                    input: {
                        id: 'T_2',
                        filters: [
                            {
                                code: facetValueCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'facetValueIds',
                                        value: '["T_4"]',
                                    },
                                    {
                                        name: 'containsAny',
                                        value: 'false',
                                    },
                                ],
                            },
                        ],
                    },
                });
                await awaitRunningJobs(adminClient);
                // add an additional check for the collection filters to update
                await awaitRunningJobs(adminClient);
                const result1 = await doAdminSearchQuery({ collectionId: 'T_2', groupByProduct: true });

                expect(result1.search.items.map(i => i.productName)).toEqual([
                    'Road Bike',
                    'Skipping Rope',
                    'Boxing Gloves',
                    'Tent',
                    'Cruiser Skateboard',
                    'Football',
                    'Running Shoe',
                ]);

                const result2 = await doAdminSearchQuery({ collectionSlug: 'plants', groupByProduct: true });

                expect(result2.search.items.map(i => i.productName)).toEqual([
                    'Road Bike',
                    'Skipping Rope',
                    'Boxing Gloves',
                    'Tent',
                    'Cruiser Skateboard',
                    'Football',
                    'Running Shoe',
                ]);
            }, 10000);

            it('updates index when a Collection created', async () => {
                const { createCollection } = await adminClient.query<
                    Codegen.CreateCollectionMutation,
                    Codegen.CreateCollectionMutationVariables
                >(CREATE_COLLECTION, {
                    input: {
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'Photo',
                                description: '',
                                slug: 'photo',
                            },
                        ],
                        filters: [
                            {
                                code: facetValueCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'facetValueIds',
                                        value: '["T_3"]',
                                    },
                                    {
                                        name: 'containsAny',
                                        value: 'false',
                                    },
                                ],
                            },
                        ],
                    },
                });
                await awaitRunningJobs(adminClient);
                // add an additional check for the collection filters to update
                await awaitRunningJobs(adminClient);
                const result = await doAdminSearchQuery({
                    collectionId: createCollection.id,
                    groupByProduct: true,
                });
                expect(result.search.items.map(i => i.productName)).toEqual([
                    'Instant Camera',
                    'Camera Lens',
                    'Tripod',
                    'Slr Camera',
                ]);
            });

            it('updates index when a taxRate is changed', async () => {
                await adminClient.query<
                    Codegen.UpdateTaxRateMutation,
                    Codegen.UpdateTaxRateMutationVariables
                >(UPDATE_TAX_RATE, {
                    input: {
                        // Default Channel's defaultTaxZone is Europe (id 2) and the id of the standard TaxRate
                        // to Europe is 2.
                        id: 'T_2',
                        value: 50,
                    },
                });
                await awaitRunningJobs(adminClient);
                const result = await adminClient.query<
                    Codegen.SearchGetPricesQuery,
                    Codegen.SearchGetPricesQueryVariables
                >(SEARCH_GET_PRICES, {
                    input: {
                        groupByProduct: true,
                        term: 'laptop',
                    } as SearchInput,
                });
                expect(result.search.items).toEqual([
                    {
                        price: { min: 129900, max: 229900 },
                        priceWithTax: { min: 194850, max: 344850 },
                    },
                ]);
            });

            describe('asset changes', () => {
                function searchForLaptop() {
                    return adminClient.query<
                        Codegen.SearchGetAssetsQuery,
                        Codegen.SearchGetAssetsQueryVariables
                    >(SEARCH_GET_ASSETS, {
                        input: {
                            term: 'laptop',
                            take: 1,
                        },
                    });
                }

                it('updates index when asset focalPoint is changed', async () => {
                    const { search: search1 } = await searchForLaptop();

                    expect(search1.items[0].productAsset!.id).toBe('T_1');
                    expect(search1.items[0].productAsset!.focalPoint).toBeNull();

                    await adminClient.query<
                        Codegen.UpdateAssetMutation,
                        Codegen.UpdateAssetMutationVariables
                    >(UPDATE_ASSET, {
                        input: {
                            id: 'T_1',
                            focalPoint: {
                                x: 0.42,
                                y: 0.42,
                            },
                        },
                    });

                    await awaitRunningJobs(adminClient);

                    const { search: search2 } = await searchForLaptop();

                    expect(search2.items[0].productAsset!.id).toBe('T_1');
                    expect(search2.items[0].productAsset!.focalPoint).toEqual({ x: 0.42, y: 0.42 });
                });

                it('updates index when asset deleted', async () => {
                    const { search: search1 } = await searchForLaptop();

                    const assetId = search1.items[0].productAsset?.id;
                    expect(assetId).toBeTruthy();

                    await adminClient.query<
                        Codegen.DeleteAssetMutation,
                        Codegen.DeleteAssetMutationVariables
                    >(DELETE_ASSET, {
                        input: {
                            assetId: assetId!,
                            force: true,
                        },
                    });

                    await awaitRunningJobs(adminClient);

                    const { search: search2 } = await searchForLaptop();

                    expect(search2.items[0].productAsset).toBeNull();
                });
            });

            it('does not include deleted ProductVariants in index', async () => {
                const { search: s1 } = await doAdminSearchQuery({
                    term: 'hard drive',
                    groupByProduct: false,
                });

                const { deleteProductVariant } = await adminClient.query<
                    Codegen.DeleteProductVariantMutation,
                    Codegen.DeleteProductVariantMutationVariables
                >(DELETE_PRODUCT_VARIANT, { id: s1.items[0].productVariantId });

                await awaitRunningJobs(adminClient);

                const { search } = await adminClient.query<
                    Codegen.SearchGetPricesQuery,
                    Codegen.SearchGetPricesQueryVariables
                >(SEARCH_GET_PRICES, { input: { term: 'hard drive', groupByProduct: true } });
                expect(search.items[0].price).toEqual({
                    min: 7896,
                    max: 13435,
                });
            });

            it('returns enabled field when not grouped', async () => {
                const result = await doAdminSearchQuery({ groupByProduct: false, take: 3 });
                expect(result.search.items.map(pick(['productVariantId', 'enabled']))).toEqual([
                    { productVariantId: 'T_1', enabled: true },
                    { productVariantId: 'T_2', enabled: true },
                    { productVariantId: 'T_3', enabled: false },
                ]);
            });

            it('when grouped, enabled is true if at least one variant is enabled', async () => {
                await adminClient.query<
                    Codegen.UpdateProductVariantsMutation,
                    Codegen.UpdateProductVariantsMutationVariables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [
                        { id: 'T_1', enabled: false },
                        { id: 'T_2', enabled: false },
                    ],
                });
                await awaitRunningJobs(adminClient);
                const result = await doAdminSearchQuery({ groupByProduct: true, take: 3 });
                expect(result.search.items.map(pick(['productId', 'enabled']))).toEqual([
                    { productId: 'T_1', enabled: true },
                    { productId: 'T_2', enabled: true },
                    { productId: 'T_3', enabled: true },
                ]);
            });

            it('when grouped, enabled is false if all variants are disabled', async () => {
                await adminClient.query<
                    Codegen.UpdateProductVariantsMutation,
                    Codegen.UpdateProductVariantsMutationVariables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [{ id: 'T_4', enabled: false }],
                });
                await awaitRunningJobs(adminClient);
                const result = await doAdminSearchQuery({ groupByProduct: true, take: 3 });
                expect(result.search.items.map(pick(['productId', 'enabled']))).toEqual([
                    { productId: 'T_1', enabled: false },
                    { productId: 'T_2', enabled: true },
                    { productId: 'T_3', enabled: true },
                ]);
            });

            it('when grouped, enabled is false if product is disabled', async () => {
                await adminClient.query<
                    Codegen.UpdateProductMutation,
                    Codegen.UpdateProductMutationVariables
                >(UPDATE_PRODUCT, {
                    input: {
                        id: 'T_3',
                        enabled: false,
                    },
                });
                await awaitRunningJobs(adminClient);
                const result = await doAdminSearchQuery({ groupByProduct: true, take: 3 });
                expect(result.search.items.map(pick(['productId', 'enabled']))).toEqual([
                    { productId: 'T_1', enabled: false },
                    { productId: 'T_2', enabled: true },
                    { productId: 'T_3', enabled: false },
                ]);
            });

            // https://github.com/vendure-ecommerce/vendure/issues/295
            it('enabled status survives reindex', async () => {
                await adminClient.query<Codegen.ReindexMutation>(REINDEX);

                await awaitRunningJobs(adminClient);
                const result = await doAdminSearchQuery({ groupByProduct: true, take: 3 });
                expect(result.search.items.map(pick(['productId', 'enabled']))).toEqual([
                    { productId: 'T_1', enabled: false },
                    { productId: 'T_2', enabled: true },
                    { productId: 'T_3', enabled: false },
                ]);
            });

            // https://github.com/vendure-ecommerce/vendure/issues/1482
            it('price range omits disabled variant', async () => {
                const result1 = await shopClient.query<
                    Codegen.SearchGetPricesQuery,
                    Codegen.SearchGetPricesQueryVariables
                >(SEARCH_GET_PRICES, {
                    input: {
                        groupByProduct: true,
                        term: 'monitor',
                        take: 3,
                    } as SearchInput,
                });
                expect(result1.search.items).toEqual([
                    {
                        price: { min: 14374, max: 16994 },
                        priceWithTax: { min: 21561, max: 25491 },
                    },
                ]);
                await adminClient.query<
                    Codegen.UpdateProductVariantsMutation,
                    Codegen.UpdateProductVariantsMutationVariables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [{ id: 'T_5', enabled: false }],
                });
                await awaitRunningJobs(adminClient);

                const result2 = await shopClient.query<
                    Codegen.SearchGetPricesQuery,
                    Codegen.SearchGetPricesQueryVariables
                >(SEARCH_GET_PRICES, {
                    input: {
                        groupByProduct: true,
                        term: 'monitor',
                        take: 3,
                    } as SearchInput,
                });
                expect(result2.search.items).toEqual([
                    {
                        price: { min: 16994, max: 16994 },
                        priceWithTax: { min: 25491, max: 25491 },
                    },
                ]);
            });

            // https://github.com/vendure-ecommerce/vendure/issues/745
            it('very long Product descriptions no not cause indexing to fail', async () => {
                // We generate this long string out of random chars because Postgres uses compression
                // when storing the string value, so e.g. a long series of a single character will not
                // reproduce the error.
                const description = Array.from({ length: 220 })
                    .map(() => Math.random().toString(36))
                    .join(' ');

                const { createProduct } = await adminClient.query<
                    Codegen.CreateProductMutation,
                    Codegen.CreateProductMutationVariables
                >(CREATE_PRODUCT, {
                    input: {
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'Very long description aabbccdd',
                                slug: 'very-long-description',
                                description,
                            },
                        ],
                    },
                });
                await adminClient.query<
                    Codegen.CreateProductVariantsMutation,
                    Codegen.CreateProductVariantsMutationVariables
                >(CREATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            productId: createProduct.id,
                            sku: 'VLD01',
                            price: 100,
                            translations: [
                                { languageCode: LanguageCode.en, name: 'Very long description variant' },
                            ],
                        },
                    ],
                });
                await awaitRunningJobs(adminClient);
                const result = await doAdminSearchQuery({ term: 'aabbccdd' });
                expect(result.search.items.map(i => i.productName)).toEqual([
                    'Very long description aabbccdd',
                ]);
                await adminClient.query<
                    Codegen.DeleteProductMutation,
                    Codegen.DeleteProductMutationVariables
                >(DELETE_PRODUCT, {
                    id: createProduct.id,
                });
            });
        });

        // https://github.com/vendure-ecommerce/vendure/issues/609
        describe('Synthetic index items', () => {
            let createdProductId: string;

            it('creates synthetic index item for Product with no variants', async () => {
                const { createProduct } = await adminClient.query<
                    Codegen.CreateProductMutation,
                    Codegen.CreateProductMutationVariables
                >(CREATE_PRODUCT, {
                    input: {
                        facetValueIds: ['T_1'],
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'Strawberry cheesecake',
                                slug: 'strawberry-cheesecake',
                                description: 'A yummy dessert',
                            },
                        ],
                    },
                });

                await awaitRunningJobs(adminClient);
                const result = await doAdminSearchQuery({ groupByProduct: true, term: 'strawberry' });
                expect(
                    result.search.items.map(
                        pick([
                            'productId',
                            'enabled',
                            'productName',
                            'productVariantName',
                            'slug',
                            'description',
                        ]),
                    ),
                ).toEqual([
                    {
                        productId: createProduct.id,
                        enabled: false,
                        productName: 'Strawberry cheesecake',
                        productVariantName: 'Strawberry cheesecake',
                        slug: 'strawberry-cheesecake',
                        description: 'A yummy dessert',
                    },
                ]);
                createdProductId = createProduct.id;
            });

            it('removes synthetic index item once a variant is created', async () => {
                const { createProductVariants } = await adminClient.query<
                    Codegen.CreateProductVariantsMutation,
                    Codegen.CreateProductVariantsMutationVariables
                >(CREATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            productId: createdProductId,
                            sku: 'SC01',
                            price: 1399,
                            translations: [
                                { languageCode: LanguageCode.en, name: 'Strawberry Cheesecake Pie' },
                            ],
                        },
                    ],
                });
                await awaitRunningJobs(adminClient);

                const result = await doAdminSearchQuery({ groupByProduct: false, term: 'strawberry' });
                expect(result.search.items.map(pick(['productVariantName']))).toEqual([
                    { productVariantName: 'Strawberry Cheesecake Pie' },
                ]);
            });
        });

        describe('channel handling', () => {
            const SECOND_CHANNEL_TOKEN = 'second-channel-token';
            let secondChannel: ChannelFragment;

            beforeAll(async () => {
                const { createChannel } = await adminClient.query<
                    Codegen.CreateChannelMutation,
                    Codegen.CreateChannelMutationVariables
                >(CREATE_CHANNEL, {
                    input: {
                        code: 'second-channel',
                        token: SECOND_CHANNEL_TOKEN,
                        defaultLanguageCode: LanguageCode.en,
                        currencyCode: CurrencyCode.GBP,
                        pricesIncludeTax: true,
                        defaultTaxZoneId: 'T_1',
                        defaultShippingZoneId: 'T_1',
                    },
                });
                secondChannel = createChannel as ChannelFragment;
            });

            it('adding product to channel', async () => {
                adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
                await adminClient.query<
                    Codegen.AssignProductsToChannelMutation,
                    Codegen.AssignProductsToChannelMutationVariables
                >(ASSIGN_PRODUCT_TO_CHANNEL, {
                    input: { channelId: secondChannel.id, productIds: ['T_1', 'T_2'] },
                });
                await awaitRunningJobs(adminClient);

                adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
                const { search } = await doAdminSearchQuery({ groupByProduct: true });
                expect(search.items.map(i => i.productId)).toEqual(['T_1', 'T_2']);
            }, 10000);

            it('removing product from channel', async () => {
                adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
                const { removeProductsFromChannel } = await adminClient.query<
                    Codegen.RemoveProductsFromChannelMutation,
                    Codegen.RemoveProductsFromChannelMutationVariables
                >(REMOVE_PRODUCT_FROM_CHANNEL, {
                    input: {
                        productIds: ['T_2'],
                        channelId: secondChannel.id,
                    },
                });
                await awaitRunningJobs(adminClient);

                adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
                const { search } = await doAdminSearchQuery({ groupByProduct: true });
                expect(search.items.map(i => i.productId)).toEqual(['T_1']);
            }, 10000);

            it('adding product variant to channel', async () => {
                adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
                await adminClient.query<
                    Codegen.AssignProductVariantsToChannelMutation,
                    Codegen.AssignProductVariantsToChannelMutationVariables
                >(ASSIGN_PRODUCTVARIANT_TO_CHANNEL, {
                    input: { channelId: secondChannel.id, productVariantIds: ['T_10', 'T_15'] },
                });
                await awaitRunningJobs(adminClient);

                adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);

                const { search: searchGrouped } = await doAdminSearchQuery({ groupByProduct: true });
                expect(searchGrouped.items.map(i => i.productId)).toEqual(['T_1', 'T_3', 'T_4']);

                const { search: searchUngrouped } = await doAdminSearchQuery({ groupByProduct: false });
                expect(searchUngrouped.items.map(i => i.productVariantId)).toEqual([
                    'T_1',
                    'T_2',
                    'T_3',
                    'T_4',
                    'T_10',
                    'T_15',
                ]);
            }, 10000);

            it('removing product variant from channel', async () => {
                adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
                await adminClient.query<
                    Codegen.RemoveProductVariantsFromChannelMutation,
                    Codegen.RemoveProductVariantsFromChannelMutationVariables
                >(REMOVE_PRODUCTVARIANT_FROM_CHANNEL, {
                    input: { channelId: secondChannel.id, productVariantIds: ['T_1', 'T_15'] },
                });
                await awaitRunningJobs(adminClient);

                adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);

                const { search: searchGrouped } = await doAdminSearchQuery({ groupByProduct: true });
                expect(searchGrouped.items.map(i => i.productId)).toEqual(['T_1', 'T_3']);

                const { search: searchUngrouped } = await doAdminSearchQuery({ groupByProduct: false });
                expect(searchUngrouped.items.map(i => i.productVariantId)).toEqual([
                    'T_2',
                    'T_3',
                    'T_4',
                    'T_10',
                ]);
            }, 10000);

            it('updating product affects current channel', async () => {
                adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
                const { updateProduct } = await adminClient.query<
                    Codegen.UpdateProductMutation,
                    Codegen.UpdateProductMutationVariables
                >(UPDATE_PRODUCT, {
                    input: {
                        id: 'T_3',
                        enabled: true,
                        translations: [{ languageCode: LanguageCode.en, name: 'xyz' }],
                    },
                });

                await awaitRunningJobs(adminClient);

                const { search: searchGrouped } = await doAdminSearchQuery({
                    groupByProduct: true,
                    term: 'xyz',
                });
                expect(searchGrouped.items.map(i => i.productName)).toEqual(['xyz']);
            });

            it('updating product affects other channels', async () => {
                adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
                const { search: searchGrouped } = await doAdminSearchQuery({
                    groupByProduct: true,
                    term: 'xyz',
                });
                expect(searchGrouped.items.map(i => i.productName)).toEqual(['xyz']);
            });

            // https://github.com/vendure-ecommerce/vendure/issues/896
            it('removing from channel with multiple languages', async () => {
                adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);

                await adminClient.query<
                    Codegen.UpdateProductMutation,
                    Codegen.UpdateProductMutationVariables
                >(UPDATE_PRODUCT, {
                    input: {
                        id: 'T_4',
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'product en',
                                slug: 'product-en',
                                description: 'en',
                            },
                            {
                                languageCode: LanguageCode.de,
                                name: 'product de',
                                slug: 'product-de',
                                description: 'de',
                            },
                        ],
                    },
                });

                await adminClient.query<
                    Codegen.AssignProductsToChannelMutation,
                    Codegen.AssignProductsToChannelMutationVariables
                >(ASSIGN_PRODUCT_TO_CHANNEL, {
                    input: { channelId: secondChannel.id, productIds: ['T_4'] },
                });
                await awaitRunningJobs(adminClient);

                async function searchSecondChannelForDEProduct() {
                    adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
                    const { search } = await adminClient.query<
                        SearchProductsShopQuery,
                        SearchProductShopQueryVariables
                    >(
                        SEARCH_PRODUCTS,
                        {
                            input: { term: 'product', groupByProduct: true },
                        },
                        { languageCode: LanguageCode.de },
                    );
                    return search;
                }

                const search1 = await searchSecondChannelForDEProduct();
                expect(search1.items.map(i => i.productName)).toEqual(['product de']);

                adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
                const { removeProductsFromChannel } = await adminClient.query<
                    Codegen.RemoveProductsFromChannelMutation,
                    Codegen.RemoveProductsFromChannelMutationVariables
                >(REMOVE_PRODUCT_FROM_CHANNEL, {
                    input: {
                        productIds: ['T_4'],
                        channelId: secondChannel.id,
                    },
                });
                await awaitRunningJobs(adminClient);

                const search2 = await searchSecondChannelForDEProduct();
                expect(search2.items.map(i => i.productName)).toEqual([]);
            });
        });

        describe('multiple language handling', () => {
            function searchInLanguage(languageCode: LanguageCode) {
                return adminClient.query<SearchProductsShopQuery, SearchProductShopQueryVariables>(
                    SEARCH_PRODUCTS,
                    {
                        input: {
                            take: 100,
                        },
                    },
                    {
                        languageCode,
                    },
                );
            }

            beforeAll(async () => {
                const { updateProduct } = await adminClient.query<
                    Codegen.UpdateProductMutation,
                    Codegen.UpdateProductMutationVariables
                >(UPDATE_PRODUCT, {
                    input: {
                        id: 'T_1',
                        translations: [
                            {
                                languageCode: LanguageCode.de,
                                name: 'laptop name de',
                                slug: 'laptop-slug-de',
                                description: 'laptop description de',
                            },
                            {
                                languageCode: LanguageCode.zh,
                                name: 'laptop name zh',
                                slug: 'laptop-slug-zh',
                                description: 'laptop description zh',
                            },
                        ],
                    },
                });

                await adminClient.query<
                    Codegen.UpdateProductVariantsMutation,
                    Codegen.UpdateProductVariantsMutationVariables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            id: updateProduct.variants[0].id,
                            translations: [
                                {
                                    languageCode: LanguageCode.fr,
                                    name: 'laptop variant fr',
                                },
                            ],
                        },
                    ],
                });

                await awaitRunningJobs(adminClient);
            });

            it('fallbacks to default language', async () => {
                const { search } = await searchInLanguage(LanguageCode.af);
                // No records for AF language, but we expect > 0
                // because of fallback to default language (EN)
                expect(search.totalItems).toBeGreaterThan(0);
            });

            it('indexes product-level languages', async () => {
                const { search: search1 } = await searchInLanguage(LanguageCode.de);

                expect(search1.items.map(i => i.productName)).toContain('laptop name de');
                expect(search1.items.map(i => i.productName)).not.toContain('laptop name zh');
                expect(search1.items.map(i => i.slug)).toContain('laptop-slug-de');
                expect(search1.items.map(i => i.description)).toContain('laptop description de');

                const { search: search2 } = await searchInLanguage(LanguageCode.zh);

                expect(search2.items.map(i => i.productName)).toContain('laptop name zh');
                expect(search2.items.map(i => i.productName)).not.toContain('laptop name de');
                expect(search2.items.map(i => i.slug)).toContain('laptop-slug-zh');
                expect(search2.items.map(i => i.description)).toContain('laptop description zh');
            });

            it('indexes product variant-level languages', async () => {
                const { search: search1 } = await searchInLanguage(LanguageCode.fr);

                expect(search1.items.map(i => i.productName)).toContain('Laptop');
                expect(search1.items.map(i => i.productVariantName)).toContain('laptop variant fr');
            });

            // https://github.com/vendure-ecommerce/vendure/issues/1752
            // https://github.com/vendure-ecommerce/vendure/issues/1746
            it('sort by name with non-default languageCode', async () => {
                const result = await adminClient.query<
                    SearchProductsShopQuery,
                    SearchProductShopQueryVariables
                >(
                    SEARCH_PRODUCTS,
                    {
                        input: {
                            take: 2,
                            sort: {
                                name: SortOrder.ASC,
                            },
                        },
                    },
                    {
                        languageCode: LanguageCode.de,
                    },
                );
                expect(result.search.items.length).toEqual(2);
            });
        });

        // https://github.com/vendure-ecommerce/vendure/issues/1789
        describe('input escaping', () => {
            function search(term: string) {
                return adminClient.query<SearchProductsShop.Query, SearchProductShopVariables>(
                    SEARCH_PRODUCTS,
                    {
                        input: { take: 10, term },
                    },
                    {
                        languageCode: LanguageCode.en,
                    },
                );
            }
            it('correctly escapes "a & b"', async () => {
                const result = await search('laptop & camera');
                expect(result.search.items).toBeDefined();
            });

            it('correctly escapes other special chars', async () => {
                const result = await search('a : b ? * (c) ! "foo"');
                expect(result.search.items).toBeDefined();
            });

            it('correctly escapes mysql binary mode chars', async () => {
                expect((await search('foo+')).search.items).toBeDefined();
                expect((await search('foo-')).search.items).toBeDefined();
                expect((await search('foo<')).search.items).toBeDefined();
                expect((await search('foo>')).search.items).toBeDefined();
                expect((await search('foo*')).search.items).toBeDefined();
                expect((await search('foo~')).search.items).toBeDefined();
                expect((await search('foo@bar')).search.items).toBeDefined();
                expect((await search('foo + - *')).search.items).toBeDefined();
                expect((await search('foo + - bar')).search.items).toBeDefined();
            });
        });
    });
});

export const REINDEX = gql`
    mutation Reindex {
        reindex {
            id
        }
    }
`;

export const SEARCH_PRODUCTS = gql`
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

export const SEARCH_GET_FACET_VALUES = gql`
    query SearchFacetValues($input: SearchInput!) {
        search(input: $input) {
            totalItems
            facetValues {
                count
                facetValue {
                    id
                    name
                }
            }
        }
    }
`;

export const SEARCH_GET_COLLECTIONS = gql`
    query SearchCollections($input: SearchInput!) {
        search(input: $input) {
            totalItems
            collections {
                count
                collection {
                    id
                    name
                }
            }
        }
    }
`;

export const SEARCH_GET_ASSETS = gql`
    query SearchGetAssets($input: SearchInput!) {
        search(input: $input) {
            totalItems
            items {
                productId
                productName
                productVariantName
                productAsset {
                    id
                    preview
                    focalPoint {
                        x
                        y
                    }
                }
                productVariantAsset {
                    id
                    preview
                    focalPoint {
                        x
                        y
                    }
                }
            }
        }
    }
`;

export const SEARCH_GET_PRICES = gql`
    query SearchGetPrices($input: SearchInput!) {
        search(input: $input) {
            items {
                price {
                    ... on PriceRange {
                        min
                        max
                    }
                    ... on SinglePrice {
                        value
                    }
                }
                priceWithTax {
                    ... on PriceRange {
                        min
                        max
                    }
                    ... on SinglePrice {
                        value
                    }
                }
            }
        }
    }
`;
