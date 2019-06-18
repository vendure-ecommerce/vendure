import { pick } from '@vendure/common/lib/pick';
import gql from 'graphql-tag';
import path from 'path';

import { SimpleGraphQLClient } from '../mock-data/simple-graphql-client';
import { facetValueCollectionFilter } from '../src/config/collection/default-collection-filters';
import { DefaultSearchPlugin } from '../src/plugin/default-search-plugin/default-search-plugin';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import {
    ConfigArgType,
    CreateCollection,
    CreateFacet,
    GetRunningJobs,
    JobState,
    LanguageCode,
    SearchFacetValues,
    SearchGetPrices,
    SearchInput,
    UpdateCollection,
    UpdateProduct,
    UpdateProductVariants,
    UpdateTaxRate,
} from './graphql/generated-e2e-admin-types';
import { SearchProductsShop } from './graphql/generated-e2e-shop-types';
import {
    CREATE_COLLECTION,
    CREATE_FACET,
    UPDATE_COLLECTION,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
    UPDATE_TAX_RATE,
} from './graphql/shared-definitions';
import { SEARCH_PRODUCTS_SHOP } from './graphql/shop-definitions';
import { TestAdminClient, TestShopClient } from './test-client';
import { TestServer } from './test-server';

describe('Default search plugin', () => {
    const adminClient = new TestAdminClient();
    const shopClient = new TestShopClient();
    const server = new TestServer();

    beforeAll(async () => {
        const token = await server.init(
            {
                productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
                customerCount: 1,
            },
            {
                plugins: [new DefaultSearchPlugin()],
            },
        );
        await adminClient.init();
        await shopClient.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    async function testGroupByProduct(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShop.Query, SearchProductsShop.Variables>(SEARCH_PRODUCTS_SHOP, {
            input: {
                groupByProduct: true,
            },
        });
        expect(result.search.totalItems).toBe(20);
    }

    async function testNoGrouping(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShop.Query, SearchProductsShop.Variables>(SEARCH_PRODUCTS_SHOP, {
            input: {
                groupByProduct: false,
            },
        });
        expect(result.search.totalItems).toBe(34);
    }

    async function testMatchSearchTerm(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShop.Query, SearchProductsShop.Variables>(SEARCH_PRODUCTS_SHOP, {
            input: {
                term: 'camera',
                groupByProduct: true,
            },
        });
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Instant Camera',
            'Camera Lens',
            'SLR Camera',
        ]);
    }

    async function testMatchFacetIds(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShop.Query, SearchProductsShop.Variables>(SEARCH_PRODUCTS_SHOP, {
            input: {
                facetValueIds: ['T_1', 'T_2'],
                groupByProduct: true,
            },
        });
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Laptop',
            'Curvy Monitor',
            'Gaming PC',
            'Hard Drive',
            'Clacky Keyboard',
            'USB Cable',
        ]);
    }

    async function testMatchCollectionId(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShop.Query, SearchProductsShop.Variables>(SEARCH_PRODUCTS_SHOP, {
            input: {
                collectionId: 'T_2',
                groupByProduct: true,
            },
        });
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Spiky Cactus',
            'Orchid',
            'Bonsai Tree',
        ]);
    }

    async function testSinglePrices(client: SimpleGraphQLClient) {
        const result = await client.query<SearchGetPrices.Query, SearchGetPrices.Variables>(SEARCH_GET_PRICES, {
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
        const result = await client.query<SearchGetPrices.Query, SearchGetPrices.Variables>(SEARCH_GET_PRICES, {
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

        it('matches by facetId', () => testMatchFacetIds(shopClient));

        it('matches by collectionId', () => testMatchCollectionId(shopClient));

        it('single prices', () => testSinglePrices(shopClient));

        it('price ranges', () => testPriceRanges(shopClient));

        it('returns correct facetValues when not grouped by product', async () => {
            const result = await shopClient.query<SearchFacetValues.Query, SearchFacetValues.Variables>(SEARCH_GET_FACET_VALUES, {
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
            const result = await shopClient.query<SearchFacetValues.Query, SearchFacetValues.Variables>(SEARCH_GET_FACET_VALUES, {
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
            const { createFacet } = await adminClient.query<CreateFacet.Mutation, CreateFacet.Variables>(CREATE_FACET, {
                input: {
                    code: 'profit-margin',
                    isPrivate: true,
                    translations: [
                        { languageCode: LanguageCode.en, name: 'Profit Margin' },
                    ],
                    values: [
                        { code: 'massive', translations: [{ languageCode: LanguageCode.en, name: 'massive' }] },
                    ],
                },
            });
            await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                input: {
                    id: 'T_2',
                    // T_1 & T_2 are the existing facetValues (electronics & photo)
                    facetValueIds: ['T_1', 'T_2', createFacet.values[0].id],
                },
            });

            const result = await shopClient.query<SearchFacetValues.Query, SearchFacetValues.Variables>(SEARCH_GET_FACET_VALUES, {
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

        it('encodes the productId and productVariantId', async () => {
            const result = await shopClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(SEARCH_PRODUCTS_SHOP, {
                input: {
                    groupByProduct: false,
                    take: 1,
                },
            });
            expect(pick(result.search.items[0], ['productId', 'productVariantId'])).toEqual(
                {
                    productId: 'T_1',
                    productVariantId: 'T_1',
                },
            );
        });

        it('omits results for disabled ProductVariants', async () => {
            await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(UPDATE_PRODUCT_VARIANTS, {
                input: [
                    { id: 'T_3', enabled: false },
                ],
            });
            await awaitRunningJobs();
            const result = await shopClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(SEARCH_PRODUCTS_SHOP, {
                input: {
                    groupByProduct: false,
                    take: 3,
                },
            });
            expect(result.search.items.map(i => i.productVariantId)).toEqual(['T_1', 'T_2', 'T_4']);
        });

        it('encodes collectionIds', async () => {
            const result = await shopClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(SEARCH_PRODUCTS_SHOP, {
                input: {
                    groupByProduct: false,
                    term: 'cactus',
                    take: 1,
                },
            });

            expect(result.search.items[0].collectionIds).toEqual(['T_2']);
        });
    });

    describe('admin api', () => {
        it('group by product', () => testGroupByProduct(adminClient));

        it('no grouping', () => testNoGrouping(adminClient));

        it('matches search term', () => testMatchSearchTerm(adminClient));

        it('matches by facetId', () => testMatchFacetIds(adminClient));

        it('matches by collectionId', () => testMatchCollectionId(adminClient));

        it('single prices', () => testSinglePrices(adminClient));

        it('price ranges', () => testPriceRanges(adminClient));

        it('updates index when a Product is changed', async () => {
            await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                input: {
                    id: 'T_1',
                    facetValueIds: [],
                },
            });
            await awaitRunningJobs();
            const result = await adminClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(
                SEARCH_PRODUCTS,
                {
                    input: {
                        facetValueIds: ['T_2'],
                        groupByProduct: true,
                    },
                },
            );
            expect(result.search.items.map(i => i.productName)).toEqual([
                'Curvy Monitor',
                'Gaming PC',
                'Hard Drive',
                'Clacky Keyboard',
                'USB Cable',
            ]);
        });

        it('updates index when a Collection is changed', async () => {
            await adminClient.query<UpdateCollection.Mutation, UpdateCollection.Variables>(
                UPDATE_COLLECTION,
                {
                    input: {
                        id: 'T_2',
                        filters: [
                            {
                                code: facetValueCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'facetValueIds',
                                        value: `["T_4"]`,
                                        type: ConfigArgType.FACET_VALUE_IDS,
                                    },
                                    {
                                        name: 'containsAny',
                                        value: `false`,
                                        type: ConfigArgType.BOOLEAN,
                                    },
                                ],
                            },
                        ],
                    },
                },
            );
            await awaitRunningJobs();
            const result = await adminClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(
                SEARCH_PRODUCTS,
                {
                    input: {
                        collectionId: 'T_2',
                        groupByProduct: true,
                    },
                },
            );
            expect(result.search.items.map(i => i.productName)).toEqual([
                'Road Bike',
                'Skipping Rope',
                'Boxing Gloves',
                'Tent',
                'Cruiser Skateboard',
                'Football',
                'Running Shoe',
            ]);
        });

        it('updates index when a Collection created', async () => {
            const { createCollection } = await adminClient.query<
                CreateCollection.Mutation,
                CreateCollection.Variables
                >(CREATE_COLLECTION, {
                input: {
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'Photo',
                            description: '',
                        },
                    ],
                    filters: [
                        {
                            code: facetValueCollectionFilter.code,
                            arguments: [
                                {
                                    name: 'facetValueIds',
                                    value: `["T_3"]`,
                                    type: ConfigArgType.FACET_VALUE_IDS,
                                },
                                {
                                    name: 'containsAny',
                                    value: `false`,
                                    type: ConfigArgType.BOOLEAN,
                                },
                            ],
                        },
                    ],
                },
            });
            await awaitRunningJobs();
            const result = await adminClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(
                SEARCH_PRODUCTS,
                {
                    input: {
                        collectionId: createCollection.id,
                        groupByProduct: true,
                    },
                },
            );
            expect(result.search.items.map(i => i.productName)).toEqual([
                'Instant Camera',
                'Camera Lens',
                'Tripod',
                'SLR Camera',
            ]);
        });

        it('updates index when a taxRate is changed', async () => {
            await adminClient.query<UpdateTaxRate.Mutation, UpdateTaxRate.Variables>(UPDATE_TAX_RATE, {
                input: {
                    // Default Channel's defaultTaxZone is Europe (id 2) and the id of the standard TaxRate
                    // to Europe is 2.
                    id: 'T_2',
                    value: 50,
                },
            });
            await awaitRunningJobs();
            const result = await adminClient.query<SearchGetPrices.Query, SearchGetPrices.Variables>(SEARCH_GET_PRICES, {
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

        it('returns disabled field when not grouped', async () => {
            const result = await adminClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(SEARCH_PRODUCTS, {
                input: {
                    groupByProduct: false,
                    take: 3,
                },
            });
            expect(result.search.items.map(pick(['productVariantId', 'enabled']))).toEqual([
                { productVariantId: 'T_1', enabled: true },
                { productVariantId: 'T_2', enabled: true },
                { productVariantId: 'T_3', enabled: false },
            ]);
        });

        it('when grouped, disabled is false if at least one variant is enabled', async () => {
            await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(UPDATE_PRODUCT_VARIANTS, {
                input: [
                    { id: 'T_1', enabled: false },
                    { id: 'T_2', enabled: false },
                ],
            });
            await awaitRunningJobs();
            const result = await adminClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(SEARCH_PRODUCTS, {
                input: {
                    groupByProduct: true,
                    take: 3,
                },
            });
            expect(result.search.items.map(pick(['productId', 'enabled']))).toEqual([
                { productId: 'T_1', enabled: true },
                { productId: 'T_2', enabled: true },
                { productId: 'T_3', enabled: true },
            ]);
        });

        it('when grouped, disabled is true if all variants are disabled', async () => {
            await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(UPDATE_PRODUCT_VARIANTS, {
                input: [
                    { id: 'T_4', enabled: false },
                ],
            });
            await awaitRunningJobs();
            const result = await adminClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(SEARCH_PRODUCTS, {
                input: {
                    groupByProduct: true,
                    take: 3,
                },
            });
            expect(result.search.items.map(pick(['productId', 'enabled']))).toEqual([
                { productId: 'T_1', enabled: false },
                { productId: 'T_2', enabled: true },
                { productId: 'T_3', enabled: true },
            ]);
        });

        it('when grouped, disabled is true product is disabled', async () => {
            await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                input: {
                    id: 'T_3',
                    enabled: false,
                },
            });
            await awaitRunningJobs();
            const result = await adminClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(SEARCH_PRODUCTS, {
                input: {
                    groupByProduct: true,
                    take: 3,
                },
            });
            expect(result.search.items.map(pick(['productId', 'enabled']))).toEqual([
                { productId: 'T_1', enabled: false },
                { productId: 'T_2', enabled: true },
                { productId: 'T_3', enabled: false },
            ]);
        });
    });

    /**
     * Since the updates to the search index are performed in the background, we need
     * to ensure that any running background jobs are completed before continuing certain
     * tests.
     */
    async function awaitRunningJobs() {
        let runningJobs = 0;
        do {
            const { jobs } = await adminClient.query<GetRunningJobs.Query>(GET_RUNNING_JOBS);
            runningJobs = jobs.filter(job => job.state !== JobState.COMPLETED).length;
        } while (runningJobs > 0);
    }
});

export const GET_RUNNING_JOBS = gql`
    query GetRunningJobs {
        jobs {
            name
            state
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
                productPreview
                productVariantId
                productVariantName
                productVariantPreview
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
