/* tslint:disable:no-non-null-assertion */
import { pick } from '@vendure/common/lib/pick';
import { DefaultSearchPlugin, facetValueCollectionFilter, mergeConfig } from '@vendure/core';
import { createTestEnvironment, E2E_DEFAULT_CHANNEL_TOKEN, SimpleGraphQLClient } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    AssignProductsToChannel,
    CreateChannel,
    CreateCollection,
    CreateFacet,
    CurrencyCode,
    DeleteProduct,
    DeleteProductVariant,
    LanguageCode,
    RemoveProductsFromChannel,
    SearchFacetValues,
    SearchGetAssets,
    SearchGetPrices,
    SearchInput,
    SortOrder,
    UpdateAsset,
    UpdateCollection,
    UpdateProduct,
    UpdateProductVariants,
    UpdateTaxRate,
} from './graphql/generated-e2e-admin-types';
import { SearchProductsShop } from './graphql/generated-e2e-shop-types';
import {
    ASSIGN_PRODUCT_TO_CHANNEL,
    CREATE_CHANNEL,
    CREATE_COLLECTION,
    CREATE_FACET,
    DELETE_PRODUCT,
    DELETE_PRODUCT_VARIANT,
    REMOVE_PRODUCT_FROM_CHANNEL,
    UPDATE_ASSET,
    UPDATE_COLLECTION,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
    UPDATE_TAX_RATE,
} from './graphql/shared-definitions';
import { SEARCH_PRODUCTS_SHOP } from './graphql/shop-definitions';
import { awaitRunningJobs } from './utils/await-running-jobs';

describe('Default search plugin', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, { plugins: [DefaultSearchPlugin] }),
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

    function doAdminSearchQuery(input: SearchInput) {
        return adminClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(SEARCH_PRODUCTS, {
            input,
        });
    }

    async function testGroupByProduct(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShop.Query, SearchProductsShop.Variables>(
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
        const result = await client.query<SearchProductsShop.Query, SearchProductsShop.Variables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    groupByProduct: false,
                },
            },
        );
        expect(result.search.totalItems).toBe(34);
    }

    async function testMatchSearchTerm(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShop.Query, SearchProductsShop.Variables>(
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

    async function testMatchFacetIds(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShop.Query, SearchProductsShop.Variables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    facetValueIds: ['T_1', 'T_2'],
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

    async function testMatchCollectionId(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShop.Query, SearchProductsShop.Variables>(
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

    async function testSinglePrices(client: SimpleGraphQLClient) {
        const result = await client.query<SearchGetPrices.Query, SearchGetPrices.Variables>(
            SEARCH_GET_PRICES,
            {
                input: {
                    groupByProduct: false,
                    take: 3,
                } as SearchInput,
            },
        );
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
        const result = await client.query<SearchGetPrices.Query, SearchGetPrices.Variables>(
            SEARCH_GET_PRICES,
            {
                input: {
                    groupByProduct: true,
                    take: 3,
                } as SearchInput,
            },
        );
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
            const result = await shopClient.query<SearchFacetValues.Query, SearchFacetValues.Variables>(
                SEARCH_GET_FACET_VALUES,
                {
                    input: {
                        groupByProduct: false,
                    },
                },
            );
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
            const result = await shopClient.query<SearchFacetValues.Query, SearchFacetValues.Variables>(
                SEARCH_GET_FACET_VALUES,
                {
                    input: {
                        groupByProduct: true,
                    },
                },
            );
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
            const { createFacet } = await adminClient.query<CreateFacet.Mutation, CreateFacet.Variables>(
                CREATE_FACET,
                {
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
                },
            );
            await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                input: {
                    id: 'T_2',
                    // T_1 & T_2 are the existing facetValues (electronics & photo)
                    facetValueIds: ['T_1', 'T_2', createFacet.values[0].id],
                },
            });

            await awaitRunningJobs(adminClient);

            const result = await shopClient.query<SearchFacetValues.Query, SearchFacetValues.Variables>(
                SEARCH_GET_FACET_VALUES,
                {
                    input: {
                        groupByProduct: true,
                    },
                },
            );
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
            const result = await shopClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(
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

        it('omits results for disabled ProductVariants', async () => {
            await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                UPDATE_PRODUCT_VARIANTS,
                {
                    input: [{ id: 'T_3', enabled: false }],
                },
            );
            await awaitRunningJobs(adminClient);
            const result = await shopClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(
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
            const result = await shopClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(
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
    });

    describe('admin api', () => {
        it('group by product', () => testGroupByProduct(adminClient));

        it('no grouping', () => testNoGrouping(adminClient));

        it('matches search term', () => testMatchSearchTerm(adminClient));

        it('matches by facetId', () => testMatchFacetIds(adminClient));

        it('matches by collectionId', () => testMatchCollectionId(adminClient));

        it('single prices', () => testSinglePrices(adminClient));

        it('price ranges', () => testPriceRanges(adminClient));

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

                await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                    UPDATE_PRODUCT_VARIANTS,
                    {
                        input: search.items.map(i => ({
                            id: i.productVariantId,
                            sku: i.sku + '_updated',
                        })),
                    },
                );

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

                await adminClient.query<DeleteProductVariant.Mutation, DeleteProductVariant.Variables>(
                    DELETE_PRODUCT_VARIANT,
                    {
                        id: search.items[0].productVariantId,
                    },
                );

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
                await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
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
                await adminClient.query<DeleteProduct.Mutation, DeleteProduct.Variables>(DELETE_PRODUCT, {
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
                                            type: 'facetValueIds',
                                        },
                                        {
                                            name: 'containsAny',
                                            value: `false`,
                                            type: 'boolean',
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                );
                await awaitRunningJobs(adminClient);
                const result = await doAdminSearchQuery({ collectionId: 'T_2', groupByProduct: true });

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
                                        type: 'facetValueIds',
                                    },
                                    {
                                        name: 'containsAny',
                                        value: `false`,
                                        type: 'boolean',
                                    },
                                ],
                            },
                        ],
                    },
                });
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
                await adminClient.query<UpdateTaxRate.Mutation, UpdateTaxRate.Variables>(UPDATE_TAX_RATE, {
                    input: {
                        // Default Channel's defaultTaxZone is Europe (id 2) and the id of the standard TaxRate
                        // to Europe is 2.
                        id: 'T_2',
                        value: 50,
                    },
                });
                await awaitRunningJobs(adminClient);
                const result = await adminClient.query<SearchGetPrices.Query, SearchGetPrices.Variables>(
                    SEARCH_GET_PRICES,
                    {
                        input: {
                            groupByProduct: true,
                            term: 'laptop',
                        } as SearchInput,
                    },
                );
                expect(result.search.items).toEqual([
                    {
                        price: { min: 129900, max: 229900 },
                        priceWithTax: { min: 194850, max: 344850 },
                    },
                ]);
            });

            it('updates index when asset focalPoint is changed', async () => {
                function doSearch() {
                    return adminClient.query<SearchGetAssets.Query, SearchGetAssets.Variables>(
                        SEARCH_GET_ASSETS,
                        {
                            input: {
                                term: 'laptop',
                                take: 1,
                            },
                        },
                    );
                }
                const { search: search1 } = await doSearch();

                expect(search1.items[0].productAsset!.id).toBe('T_1');
                expect(search1.items[0].productAsset!.focalPoint).toBeNull();

                await adminClient.query<UpdateAsset.Mutation, UpdateAsset.Variables>(UPDATE_ASSET, {
                    input: {
                        id: 'T_1',
                        focalPoint: {
                            x: 0.42,
                            y: 0.42,
                        },
                    },
                });

                await awaitRunningJobs(adminClient);

                const { search: search2 } = await doSearch();

                expect(search2.items[0].productAsset!.id).toBe('T_1');
                expect(search2.items[0].productAsset!.focalPoint).toEqual({ x: 0.42, y: 0.42 });
            });

            it('does not include deleted ProductVariants in index', async () => {
                const { search: s1 } = await doAdminSearchQuery({
                    term: 'hard drive',
                    groupByProduct: false,
                });

                const { deleteProductVariant } = await adminClient.query<
                    DeleteProductVariant.Mutation,
                    DeleteProductVariant.Variables
                >(DELETE_PRODUCT_VARIANT, { id: s1.items[0].productVariantId });

                await awaitRunningJobs(adminClient);

                const { search } = await adminClient.query<SearchGetPrices.Query, SearchGetPrices.Variables>(
                    SEARCH_GET_PRICES,
                    { input: { term: 'hard drive', groupByProduct: true } },
                );
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
                await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                    UPDATE_PRODUCT_VARIANTS,
                    {
                        input: [{ id: 'T_1', enabled: false }, { id: 'T_2', enabled: false }],
                    },
                );
                await awaitRunningJobs(adminClient);
                const result = await doAdminSearchQuery({ groupByProduct: true, take: 3 });
                expect(result.search.items.map(pick(['productId', 'enabled']))).toEqual([
                    { productId: 'T_1', enabled: true },
                    { productId: 'T_2', enabled: true },
                    { productId: 'T_3', enabled: true },
                ]);
            });

            it('when grouped, enabled is false if all variants are disabled', async () => {
                await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                    UPDATE_PRODUCT_VARIANTS,
                    {
                        input: [{ id: 'T_4', enabled: false }],
                    },
                );
                await awaitRunningJobs(adminClient);
                const result = await doAdminSearchQuery({ groupByProduct: true, take: 3 });
                expect(result.search.items.map(pick(['productId', 'enabled']))).toEqual([
                    { productId: 'T_1', enabled: false },
                    { productId: 'T_2', enabled: true },
                    { productId: 'T_3', enabled: true },
                ]);
            });

            it('when grouped, enabled is false if product is disabled', async () => {
                await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
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
        });

        describe('channel handling', () => {
            const SECOND_CHANNEL_TOKEN = 'second-channel-token';
            let secondChannel: CreateChannel.CreateChannel;

            beforeAll(async () => {
                const { createChannel } = await adminClient.query<
                    CreateChannel.Mutation,
                    CreateChannel.Variables
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
                secondChannel = createChannel;
            });

            it('adding product to channel', async () => {
                adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
                await adminClient.query<AssignProductsToChannel.Mutation, AssignProductsToChannel.Variables>(
                    ASSIGN_PRODUCT_TO_CHANNEL,
                    {
                        input: { channelId: secondChannel.id, productIds: ['T_1', 'T_2'] },
                    },
                );
                await awaitRunningJobs(adminClient);

                adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
                const { search } = await doAdminSearchQuery({ groupByProduct: true });
                expect(search.items.map(i => i.productId)).toEqual(['T_1', 'T_2']);
            }, 10000);

            it('removing product from channel', async () => {
                adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
                const { removeProductsFromChannel } = await adminClient.query<
                    RemoveProductsFromChannel.Mutation,
                    RemoveProductsFromChannel.Variables
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
