/* eslint-disable @typescript-eslint/no-non-null-assertion, no-console */
import { CurrencyCode, SortOrder } from '@vendure/common/lib/generated-types';
import { pick } from '@vendure/common/lib/pick';
import {
    DefaultJobQueuePlugin,
    DefaultLogger,
    FacetValue,
    facetValueCollectionFilter,
    LanguageCode,
    LogLevel,
    mergeConfig,
} from '@vendure/core';
import { createTestEnvironment, E2E_DEFAULT_CHANNEL_TOKEN } from '@vendure/testing';
import { fail } from 'assert';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import * as Codegen from '../../core/e2e/graphql/generated-e2e-admin-types';
import {
    SearchProductsShopQuery,
    SearchProductsShopQueryVariables,
} from '../../core/e2e/graphql/generated-e2e-shop-types';
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
} from '../../core/e2e/graphql/shared-definitions';
import { SEARCH_PRODUCTS_SHOP } from '../../core/e2e/graphql/shop-definitions';
import { awaitRunningJobs } from '../../core/e2e/utils/await-running-jobs';
import { ElasticsearchPlugin } from '../src/plugin';

import {
    doAdminSearchQuery,
    dropElasticIndices,
    testGroupByProduct,
    testMatchCollectionId,
    testMatchCollectionSlug,
    testMatchFacetIdsAnd,
    testMatchFacetIdsOr,
    testMatchFacetValueFiltersAnd,
    testMatchFacetValueFiltersOr,
    testMatchFacetValueFiltersOrWithAnd,
    testMatchFacetValueFiltersWithFacetIdsAnd,
    testMatchFacetValueFiltersWithFacetIdsOr,
    testMatchSearchTerm,
    testNoGrouping,
    testPriceRanges,
    testSinglePrices,
} from './e2e-helpers';
import {
    GetJobInfoQuery,
    GetJobInfoQueryVariables,
    JobState,
} from './graphql/generated-e2e-elasticsearch-plugin-types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { elasticsearchHost, elasticsearchPort } = require('./constants');

interface SearchProductShopVariables extends SearchProductsShopQueryVariables {
    input: SearchProductsShopQueryVariables['input'] & {
        // This input field is dynamically added only when the `indexStockStatus` init option
        // of DefaultSearchPlugin is set to `true`, and therefore not included in the generated type. Therefore
        // we need to manually patch it here.
        inStock?: boolean;
    };
}

const INDEX_PREFIX = 'e2e-tests';

describe('Elasticsearch plugin', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            customFields: {
                ProductVariant: [
                    {
                        name: 'material',
                        type: 'relation',
                        entity: FacetValue,
                    },
                ],
            },
            plugins: [
                ElasticsearchPlugin.init({
                    indexPrefix: INDEX_PREFIX,
                    port: elasticsearchPort,
                    host: elasticsearchHost,
                    hydrateProductVariantRelations: ['customFields.material', 'stockLevels'],
                    customProductVariantMappings: {
                        inStock: {
                            graphQlType: 'Boolean!',
                            valueFn: variant => {
                                return variant.stockLevels[0]?.stockOnHand > 0;
                            },
                        },
                        materialCode: {
                            graphQlType: 'String!',
                            valueFn: variant => {
                                const materialFacetValue: FacetValue | undefined = (
                                    variant.customFields as any
                                ).material;
                                let result = '';
                                if (materialFacetValue) {
                                    result = `${materialFacetValue.code}`;
                                }
                                return result;
                            },
                        },
                    },
                    customProductMappings: {
                        answer: {
                            graphQlType: 'Int!',
                            valueFn: args => {
                                return 42;
                            },
                        },
                        hello: {
                            graphQlType: 'String!',
                            public: false,
                            valueFn: args => {
                                return 'World';
                            },
                        },
                        priority: {
                            graphQlType: 'Int!',
                            valueFn: args => {
                                return ((args.id as number) % 2) + 1; // only 1 or 2
                            },
                        },
                    },
                    searchConfig: {
                        scriptFields: {
                            answerMultiplied: {
                                graphQlType: 'Int!',
                                context: 'product',
                                scriptFn: input => {
                                    const factor = input.factor ?? 2;
                                    return { script: `doc['product-answer'].value * ${factor as string}` };
                                },
                            },
                        },
                        mapSort: (sort, input) => {
                            const priority = (input.sort as any)?.priority;
                            if (priority) {
                                return [
                                    ...sort,
                                    {
                                        ['product-priority']: {
                                            order: priority === SortOrder.ASC ? 'asc' : 'desc',
                                        },
                                    },
                                ];
                            }
                            return sort;
                        },
                    },
                    extendSearchInputType: {
                        factor: 'Int',
                    },
                    extendSearchSortType: ['priority'],
                }),
                DefaultJobQueuePlugin,
            ],
        }),
    );

    beforeAll(async () => {
        await dropElasticIndices(INDEX_PREFIX);
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
        await adminClient.query(REINDEX);
        await awaitRunningJobs(adminClient);
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await awaitRunningJobs(adminClient);
        await server.destroy();
    });

    describe('shop api', () => {
        it('group by product', () => testGroupByProduct(shopClient));

        it('no grouping', () => testNoGrouping(shopClient));

        it('matches search term', () => testMatchSearchTerm(shopClient));

        it('matches by facetValueId with AND operator', () => testMatchFacetIdsAnd(shopClient));

        it('matches by facetValueId with OR operator', () => testMatchFacetIdsOr(shopClient));

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
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopVariables>(
                SEARCH_PRODUCTS_SHOP,
                {
                    input: {
                        term: 'Laptop 13 inch 8GB',
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

        it('omits results for disabled ProductVariants', async () => {
            await adminClient.query<
                Codegen.UpdateProductVariantsMutation,
                Codegen.UpdateProductVariantsMutationVariables
            >(UPDATE_PRODUCT_VARIANTS, {
                input: [{ id: 'T_3', enabled: false }],
            });
            await awaitRunningJobs(adminClient);
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopVariables>(
                SEARCH_PRODUCTS_SHOP,
                {
                    input: {
                        groupByProduct: false,
                        take: 100,
                    },
                },
            );
            expect(result.search.items.map(i => i.productVariantId).includes('T_3')).toBe(false);
        });

        it('encodes collectionIds', async () => {
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopVariables>(
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
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopVariables>(
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
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopVariables>(
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
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopVariables>(
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
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopVariables>(
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
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopVariables>(
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
            const result = await shopClient.query<SearchProductsShopQuery, SearchProductShopVariables>(
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

        it('matches by facetValueId with AND operator', () => testMatchFacetIdsAnd(adminClient));

        it('matches by facetValueId with OR operator', () => testMatchFacetIdsOr(adminClient));

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

        describe('updating the index', () => {
            it('updates index when ProductVariants are changed', async () => {
                await awaitRunningJobs(adminClient);
                const { search } = await doAdminSearchQuery(adminClient, {
                    term: 'drive',
                    groupByProduct: false,
                });
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
                const { search: search2 } = await doAdminSearchQuery(adminClient, {
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
                const { search } = await doAdminSearchQuery(adminClient, {
                    term: 'drive',
                    groupByProduct: false,
                });

                await adminClient.query<
                    Codegen.DeleteProductVariantMutation,
                    Codegen.DeleteProductVariantMutationVariables
                >(DELETE_PRODUCT_VARIANT, {
                    id: search.items[0].productVariantId,
                });

                await awaitRunningJobs(adminClient);
                await awaitRunningJobs(adminClient);
                const { search: search2 } = await doAdminSearchQuery(adminClient, {
                    term: 'drive',
                    groupByProduct: false,
                });

                expect(search2.items.map(i => i.sku).sort()).toEqual([
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
                const result = await doAdminSearchQuery(adminClient, {
                    facetValueIds: ['T_2'],
                    groupByProduct: true,
                });
                expect(result.search.items.map(i => i.productName).sort()).toEqual([
                    'Clacky Keyboard',
                    'Curvy Monitor',
                    'Gaming PC',
                    'Hard Drive',
                    'USB Cable',
                ]);
            });

            it('updates index when a Product is deleted', async () => {
                const { search } = await doAdminSearchQuery(adminClient, {
                    facetValueIds: ['T_2'],
                    groupByProduct: true,
                });
                expect(search.items.map(i => i.productId).sort()).toEqual([
                    'T_2',
                    'T_3',
                    'T_4',
                    'T_5',
                    'T_6',
                ]);
                await adminClient.query<
                    Codegen.DeleteProductMutation,
                    Codegen.DeleteProductMutationVariables
                >(DELETE_PRODUCT, {
                    id: 'T_5',
                });
                await awaitRunningJobs(adminClient);
                const { search: search2 } = await doAdminSearchQuery(adminClient, {
                    facetValueIds: ['T_2'],
                    groupByProduct: true,
                });
                expect(search2.items.map(i => i.productId).sort()).toEqual(['T_2', 'T_3', 'T_4', 'T_6']);
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
                const result1 = await doAdminSearchQuery(adminClient, {
                    collectionId: 'T_2',
                    groupByProduct: true,
                });

                expect(result1.search.items.map(i => i.productName).sort()).toEqual([
                    'Boxing Gloves',
                    'Cruiser Skateboard',
                    'Football',
                    'Road Bike',
                    'Running Shoe',
                    'Skipping Rope',
                    'Tent',
                ]);

                const result2 = await doAdminSearchQuery(adminClient, {
                    collectionSlug: 'plants',
                    groupByProduct: true,
                });

                expect(result2.search.items.map(i => i.productName).sort()).toEqual([
                    'Boxing Gloves',
                    'Cruiser Skateboard',
                    'Football',
                    'Road Bike',
                    'Running Shoe',
                    'Skipping Rope',
                    'Tent',
                ]);
            });

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
                const result = await doAdminSearchQuery(adminClient, {
                    collectionId: createCollection.id,
                    groupByProduct: true,
                });
                expect(result.search.items.map(i => i.productName).sort()).toEqual([
                    'Camera Lens',
                    'Instant Camera',
                    'SLR Camera',
                    'Tripod',
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
                    } as Codegen.SearchInput,
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
                    return doAdminSearchQuery(adminClient, {
                        term: 'laptop',
                        groupByProduct: true,
                        take: 1,
                        sort: {
                            name: SortOrder.ASC,
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
                const { search: s1 } = await doAdminSearchQuery(adminClient, {
                    term: 'hard drive',
                    groupByProduct: false,
                });

                const variantToDelete = s1.items.find(i => i.sku === 'IHD455T2_updated')!;

                const { deleteProductVariant } = await adminClient.query<
                    Codegen.DeleteProductVariantMutation,
                    Codegen.DeleteProductVariantMutationVariables
                >(DELETE_PRODUCT_VARIANT, { id: variantToDelete.productVariantId });

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

            it('returns disabled field when not grouped', async () => {
                const result = await doAdminSearchQuery(adminClient, {
                    groupByProduct: false,
                    term: 'laptop',
                });
                expect(result.search.items.map(pick(['productVariantId', 'enabled']))).toEqual([
                    { productVariantId: 'T_1', enabled: true },
                    { productVariantId: 'T_2', enabled: true },
                    { productVariantId: 'T_3', enabled: false },
                    { productVariantId: 'T_4', enabled: true },
                ]);
            });

            it('when grouped, disabled is false if at least one variant is enabled', async () => {
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
                const result = await doAdminSearchQuery(adminClient, {
                    groupByProduct: true,
                    term: 'laptop',
                });
                expect(result.search.items.map(pick(['productId', 'enabled']))).toEqual([
                    { productId: 'T_1', enabled: true },
                ]);
            });

            it('when grouped, disabled is true if all variants are disabled', async () => {
                await adminClient.query<
                    Codegen.UpdateProductVariantsMutation,
                    Codegen.UpdateProductVariantsMutationVariables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [{ id: 'T_4', enabled: false }],
                });
                await awaitRunningJobs(adminClient);
                const result = await doAdminSearchQuery(adminClient, {
                    groupByProduct: true,
                    take: 3,
                    term: 'laptop',
                });
                expect(result.search.items.map(pick(['productId', 'enabled']))).toEqual([
                    { productId: 'T_1', enabled: false },
                ]);
            });

            it('when grouped, disabled is true product is disabled', async () => {
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
                const result = await doAdminSearchQuery(adminClient, {
                    groupByProduct: true,
                    term: 'gaming',
                });
                expect(result.search.items.map(pick(['productId', 'enabled']))).toEqual([
                    { productId: 'T_3', enabled: false },
                ]);
            });

            // https://github.com/vendure-ecommerce/vendure/issues/295
            it('enabled status survives reindex', async () => {
                await adminClient.query<Codegen.ReindexMutation>(REINDEX);

                await awaitRunningJobs(adminClient);
                const result = await doAdminSearchQuery(adminClient, {
                    term: 'laptop',
                    groupByProduct: true,
                    take: 3,
                });
                expect(result.search.items.map(pick(['productId', 'enabled']))).toEqual([
                    { productId: 'T_1', enabled: false },
                ]);
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
                const result = await doAdminSearchQuery(adminClient, {
                    groupByProduct: true,
                    term: 'strawberry',
                });
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

                const result = await doAdminSearchQuery(adminClient, {
                    groupByProduct: true,
                    term: 'strawberry',
                });
                expect(result.search.items.map(pick(['productVariantName']))).toEqual([
                    { productVariantName: 'Strawberry Cheesecake Pie' },
                ]);
            });
        });

        describe('channel handling', () => {
            const SECOND_CHANNEL_TOKEN = 'second-channel-token';
            let secondChannel: Codegen.ChannelFragment;

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
                        defaultTaxZoneId: 'T_2',
                        defaultShippingZoneId: 'T_1',
                    },
                });
                secondChannel = createChannel as Codegen.ChannelFragment;

                adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
                await adminClient.query<Codegen.ReindexMutation>(REINDEX);
                await awaitRunningJobs(adminClient);
            });

            it('new channel is initially empty', async () => {
                const { search: searchGrouped } = await doAdminSearchQuery(adminClient, {
                    groupByProduct: true,
                });
                const { search: searchUngrouped } = await doAdminSearchQuery(adminClient, {
                    groupByProduct: false,
                });
                expect(searchGrouped.totalItems).toEqual(0);
                expect(searchUngrouped.totalItems).toEqual(0);
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
                const { search } = await doAdminSearchQuery(adminClient, { groupByProduct: true });
                expect(search.items.map(i => i.productId).sort()).toEqual(['T_1', 'T_2']);
            });

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
                const { search } = await doAdminSearchQuery(adminClient, { groupByProduct: true });
                expect(search.items.map(i => i.productId)).toEqual(['T_1']);
            });

            it('reindexes in channel', async () => {
                adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);

                const { reindex } = await adminClient.query<Codegen.ReindexMutation>(REINDEX);
                await awaitRunningJobs(adminClient);

                const { job } = await adminClient.query<GetJobInfoQuery, GetJobInfoQueryVariables>(
                    GET_JOB_INFO,
                    { id: reindex.id },
                );
                expect(job!.state).toBe(JobState.COMPLETED);

                const { search } = await doAdminSearchQuery(adminClient, { groupByProduct: true });
                expect(search.items.map(i => i.productId).sort()).toEqual(['T_1']);
            });

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

                const { search: searchGrouped } = await doAdminSearchQuery(adminClient, {
                    groupByProduct: true,
                });
                expect(searchGrouped.items.map(i => i.productId).sort()).toEqual(['T_1', 'T_3', 'T_4']);

                const { search: searchUngrouped } = await doAdminSearchQuery(adminClient, {
                    groupByProduct: false,
                });
                expect(searchUngrouped.items.map(i => i.productVariantId).sort()).toEqual([
                    'T_1',
                    'T_10',
                    'T_15',
                    'T_2',
                    'T_3',
                    'T_4',
                ]);
            });

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

                const { search: searchGrouped } = await doAdminSearchQuery(adminClient, {
                    groupByProduct: true,
                });
                expect(searchGrouped.items.map(i => i.productId).sort()).toEqual(['T_1', 'T_3']);

                const { search: searchUngrouped } = await doAdminSearchQuery(adminClient, {
                    groupByProduct: false,
                });
                expect(searchUngrouped.items.map(i => i.productVariantId).sort()).toEqual([
                    'T_10',
                    'T_2',
                    'T_3',
                    'T_4',
                ]);
            });

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

                const { search: searchGrouped } = await doAdminSearchQuery(adminClient, {
                    groupByProduct: true,
                    term: 'xyz',
                });
                expect(searchGrouped.items.map(i => i.productName)).toEqual(['xyz']);
            });

            it('updating product affects other channels', async () => {
                adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
                const { search: searchGrouped } = await doAdminSearchQuery(adminClient, {
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
                        SearchProductShopVariables
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
            function searchInLanguage(languageCode: LanguageCode, groupByProduct: boolean) {
                return adminClient.query<
                    Codegen.SearchProductsAdminQuery,
                    Codegen.SearchProductsAdminQueryVariables
                >(
                    SEARCH_PRODUCTS,
                    {
                        input: {
                            take: 1,
                            term: 'laptop',
                            groupByProduct,
                        },
                    },
                    {
                        languageCode,
                    },
                );
            }

            beforeAll(async () => {
                adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
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

            it('indexes product-level languages', async () => {
                const { search: search1 } = await searchInLanguage(LanguageCode.de, true);

                expect(search1.items[0].productName).toBe('laptop name de');
                expect(search1.items[0].slug).toBe('laptop-slug-de');
                expect(search1.items[0].description).toBe('laptop description de');

                const { search: search2 } = await searchInLanguage(LanguageCode.zh, true);

                expect(search2.items[0].productName).toBe('laptop name zh');
                expect(search2.items[0].slug).toBe('laptop-slug-zh');
                expect(search2.items[0].description).toBe('laptop description zh');
            });

            it('indexes product variant-level languages', async () => {
                const { search: search1 } = await searchInLanguage(LanguageCode.fr, false);
                expect(search1.items.length ? search1.items[0].productName : undefined).toBe('Laptop');
                expect(search1.items.length ? search1.items[0].productVariantName : undefined).toBe(
                    'laptop variant fr',
                );
            });
        });
    });

    describe('customMappings', () => {
        it('variant mappings', async () => {
            const query = `{
            search(input: { take: 1, groupByProduct: false, sort: { name: ASC } }) {
                items {
                  productVariantName
                  customProductVariantMappings {
                    inStock
                  }
                  customProductMappings {
                    answer
                  }
                  customMappings {
                    ...on CustomProductVariantMappings {
                      inStock
                    }
                    ...on CustomProductMappings {
                        answer
                    }
                  }
                }
              }
            }`;
            const { search } = await shopClient.query(gql(query));

            expect(search.items[0]).toEqual({
                productVariantName: 'Bonsai Tree',
                customProductVariantMappings: {
                    inStock: false,
                },
                customProductMappings: {
                    answer: 42,
                },
                customMappings: {
                    inStock: false,
                },
            });
        });

        // https://github.com/vendure-ecommerce/vendure/issues/1638
        it('hydrates variant custom field relation', async () => {
            const { updateProductVariants } = await adminClient.query<
                Codegen.UpdateProductVariantsMutation,
                Codegen.UpdateProductVariantsMutationVariables
            >(UPDATE_PRODUCT_VARIANTS, {
                input: [
                    {
                        id: 'T_20',
                        customFields: {
                            materialId: 'T_1',
                        },
                    },
                ],
            });
            expect(updateProductVariants[0]!.id).toBe('T_20');

            await adminClient.query<Codegen.ReindexMutation>(REINDEX);
            await awaitRunningJobs(adminClient);
            const query = `{
            search(input: { groupByProduct: false, term: "tripod" }) {
                items {
                  productVariantName
                  productVariantId
                  customMappings {
                    ...on CustomProductVariantMappings {
                      materialCode
                    }
                  }
                }
              }
            }`;
            const { search } = await shopClient.query(gql(query));

            expect(search.items.map((i: any) => i.customMappings)).toEqual([{ materialCode: 'electronics' }]);
        });

        it('product mappings', async () => {
            const query = `{
            search(input: { take: 1, groupByProduct: true, sort: { name: ASC } }) {
                items {
                  productName
                  customMappings {
                    ...on CustomProductMappings {
                      answer
                    }
                  }
                }
              }
            }`;
            const { search } = await shopClient.query(gql(query));

            expect(search.items[0]).toEqual({
                productName: 'Bonsai Tree',
                customMappings: {
                    answer: 42,
                },
            });
        });

        it('private mappings', async () => {
            const query = `{
            search(input: { take: 1, groupByProduct: true, sort: { name: ASC } }) {
                items {
                  customMappings {
                    ...on CustomProductMappings {
                      answer
                      hello
                    }
                  }
                }
              }
            }`;
            try {
                await shopClient.query(gql(query));
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toContain('Cannot query field "hello"');
                return;
            }
            fail('should not be able to query field "hello"');
        });
    });

    describe('scriptFields', () => {
        it('script mapping', async () => {
            const query = `{
                search(input: { take: 1, groupByProduct: true, sort: { name: ASC } }) {
                    items {
                      productVariantName
                      customScriptFields {
                        answerMultiplied
                      }
                    }
                  }
                }`;
            const { search } = await shopClient.query(gql(query));

            expect(search.items[0]).toEqual({
                productVariantName: 'Bonsai Tree',
                customScriptFields: {
                    answerMultiplied: 84,
                },
            });
        });

        it('can use the custom search input field', async () => {
            const query = `{
                search(input: { take: 1, groupByProduct: true, sort: { name: ASC }, factor: 10 }) {
                    items {
                      productVariantName
                      customScriptFields {
                        answerMultiplied
                      }
                    }
                  }
                }`;
            const { search } = await shopClient.query(gql(query));

            expect(search.items[0]).toEqual({
                productVariantName: 'Bonsai Tree',
                customScriptFields: {
                    answerMultiplied: 420,
                },
            });
        });
    });

    describe('sort', () => {
        it('sort ASC', async () => {
            const query = `{
                search(input: { take: 1, groupByProduct: true, sort: { priority: ASC } }) {
                    items {
                        customMappings {
                            ...on CustomProductMappings {
                              priority
                            }
                        }
                    }
                  }
                }`;
            const { search } = await shopClient.query(gql(query));

            expect(search.items[0]).toEqual({
                customMappings: {
                    priority: 1,
                },
            });
        });

        it('sort DESC', async () => {
            const query = `{
                search(input: { take: 1, groupByProduct: true, sort: { priority: DESC } }) {
                    items {
                        customMappings {
                            ...on CustomProductMappings {
                              priority
                            }
                        }
                    }
                  }
                }`;
            const { search } = await shopClient.query(gql(query));

            expect(search.items[0]).toEqual({
                customMappings: {
                    priority: 2,
                },
            });
        });
    });
});

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
                productAsset {
                    id
                    preview
                    focalPoint {
                        x
                        y
                    }
                }
                productVariantId
                productVariantName
                productVariantAsset {
                    id
                    preview
                    focalPoint {
                        x
                        y
                    }
                }
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

const REINDEX = gql`
    mutation Reindex {
        reindex {
            id
            queueName
            state
            progress
            duration
            result
        }
    }
`;

const GET_JOB_INFO = gql`
    query GetJobInfo($id: ID!) {
        job(jobId: $id) {
            id
            queueName
            state
            progress
            duration
            result
        }
    }
`;
