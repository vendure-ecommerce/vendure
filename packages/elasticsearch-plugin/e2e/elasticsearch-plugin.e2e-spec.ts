/* tslint:disable:no-non-null-assertion */
import { SortOrder } from '@vendure/common/lib/generated-types';
import { pick } from '@vendure/common/lib/pick';
import { DefaultLogger, facetValueCollectionFilter, LogLevel, mergeConfig } from '@vendure/core';
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
    SearchGetPrices,
    SearchInput,
    UpdateAsset,
    UpdateCollection,
    UpdateProduct,
    UpdateProductVariants,
    UpdateTaxRate,
} from '../../core/e2e/graphql/generated-e2e-admin-types';
import { SearchProductsShop } from '../../core/e2e/graphql/generated-e2e-shop-types';
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
} from '../../core/e2e/graphql/shared-definitions';
import { ElasticsearchPlugin } from '../src/plugin';

import { SEARCH_PRODUCTS_SHOP } from './../../core/e2e/graphql/shop-definitions';
import { awaitRunningJobs } from './../../core/e2e/utils/await-running-jobs';
import {
    GetJobInfo,
    JobState,
    Reindex,
    SearchProductsAdmin,
} from './graphql/generated-e2e-elasticsearch-plugin-types';

describe('Elasticsearch plugin', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            port: 4050,
            workerOptions: {
                options: {
                    port: 4055,
                },
            },
            logger: new DefaultLogger({ level: LogLevel.Info }),
            plugins: [
                ElasticsearchPlugin.init({
                    indexPrefix: 'e2e-tests',
                    port: process.env.CI ? +(process.env.E2E_ELASTIC_PORT || 9200) : 9200,
                    host: process.env.CI ? 'http://127.0.0.1' : 'http://192.168.99.100',
                }),
            ],
        }),
    );

    beforeAll(async () => {
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
        await server.destroy();
    });

    function doAdminSearchQuery(input: SearchInput) {
        return adminClient.query<SearchProductsAdmin.Query, SearchProductsAdmin.Variables>(SEARCH_PRODUCTS, {
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
                },
            },
        );
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Instant Camera',
            'Camera Lens',
            'SLR Camera',
        ]);
    }

    async function testMatchFacetValueIds(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProductsShop.Query, SearchProductsShop.Variables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    facetValueIds: ['T_1', 'T_2'],
                    groupByProduct: true,
                    sort: {
                        name: SortOrder.ASC,
                    },
                },
            },
        );
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Clacky Keyboard',
            'Curvy Monitor',
            'Gaming PC',
            'Hard Drive',
            'Laptop',
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
                    sort: {
                        price: SortOrder.ASC,
                    },
                },
            },
        );
        expect(result.search.items).toEqual([
            {
                price: { value: 799 },
                priceWithTax: { value: 959 },
            },
            {
                price: { value: 1498 },
                priceWithTax: { value: 1798 },
            },
            {
                price: { value: 1550 },
                priceWithTax: { value: 1860 },
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
                    term: 'laptop',
                },
            },
        );
        expect(result.search.items).toEqual([
            {
                price: { min: 129900, max: 229900 },
                priceWithTax: { min: 155880, max: 275880 },
            },
        ]);
    }

    describe('shop api', () => {
        it('group by product', () => testGroupByProduct(shopClient));

        it('no grouping', () => testNoGrouping(shopClient));

        it('matches search term', () => testMatchSearchTerm(shopClient));

        it('matches by facetValueId', () => testMatchFacetValueIds(shopClient));

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

        it('matches by facetValueId', () => testMatchFacetValueIds(adminClient));

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

                expect(search2.items.map(i => i.sku).sort()).toEqual([
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
                expect(result.search.items.map(i => i.productName).sort()).toEqual([
                    'Clacky Keyboard',
                    'Curvy Monitor',
                    'Gaming PC',
                    'Hard Drive',
                    'USB Cable',
                ]);
            });

            it('updates index when a Product is deleted', async () => {
                const { search } = await doAdminSearchQuery({ facetValueIds: ['T_2'], groupByProduct: true });
                expect(search.items.map(i => i.productId).sort()).toEqual([
                    'T_2',
                    'T_3',
                    'T_4',
                    'T_5',
                    'T_6',
                ]);
                await adminClient.query<DeleteProduct.Mutation, DeleteProduct.Variables>(DELETE_PRODUCT, {
                    id: 'T_5',
                });
                await awaitRunningJobs(adminClient);
                const { search: search2 } = await doAdminSearchQuery({
                    facetValueIds: ['T_2'],
                    groupByProduct: true,
                });
                expect(search2.items.map(i => i.productId).sort()).toEqual(['T_2', 'T_3', 'T_4', 'T_6']);
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
                const { search: search1 } = await doAdminSearchQuery({
                    term: 'laptop',
                    groupByProduct: true,
                    take: 1,
                    sort: {
                        name: SortOrder.ASC,
                    },
                });

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

                const { search: search2 } = await doAdminSearchQuery({
                    term: 'laptop',
                    groupByProduct: true,
                    take: 1,
                    sort: {
                        name: SortOrder.ASC,
                    },
                });

                expect(search2.items[0].productAsset!.id).toBe('T_1');
                expect(search2.items[0].productAsset!.focalPoint).toEqual({ x: 0.42, y: 0.42 });
            });

            it('does not include deleted ProductVariants in index', async () => {
                const { search: s1 } = await doAdminSearchQuery({
                    term: 'hard drive',
                    groupByProduct: false,
                });

                const variantToDelete = s1.items.find(i => i.sku === 'IHD455T2_updated')!;

                const { deleteProductVariant } = await adminClient.query<
                    DeleteProductVariant.Mutation,
                    DeleteProductVariant.Variables
                >(DELETE_PRODUCT_VARIANT, { id: variantToDelete.productVariantId });

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

            it('returns disabled field when not grouped', async () => {
                const result = await doAdminSearchQuery({ groupByProduct: false, term: 'laptop' });
                expect(result.search.items.map(pick(['productVariantId', 'enabled']))).toEqual([
                    { productVariantId: 'T_1', enabled: true },
                    { productVariantId: 'T_2', enabled: true },
                    { productVariantId: 'T_3', enabled: false },
                    { productVariantId: 'T_4', enabled: true },
                ]);
            });

            it('when grouped, disabled is false if at least one variant is enabled', async () => {
                await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                    UPDATE_PRODUCT_VARIANTS,
                    {
                        input: [{ id: 'T_1', enabled: false }, { id: 'T_2', enabled: false }],
                    },
                );
                await awaitRunningJobs(adminClient);
                const result = await doAdminSearchQuery({ groupByProduct: true, term: 'laptop' });
                expect(result.search.items.map(pick(['productId', 'enabled']))).toEqual([
                    { productId: 'T_1', enabled: true },
                ]);
            });

            it('when grouped, disabled is true if all variants are disabled', async () => {
                await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                    UPDATE_PRODUCT_VARIANTS,
                    {
                        input: [{ id: 'T_4', enabled: false }],
                    },
                );
                await awaitRunningJobs(adminClient);
                const result = await doAdminSearchQuery({ groupByProduct: true, take: 3, term: 'laptop' });
                expect(result.search.items.map(pick(['productId', 'enabled']))).toEqual([
                    { productId: 'T_1', enabled: false },
                ]);
            });

            it('when grouped, disabled is true product is disabled', async () => {
                await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                    input: {
                        id: 'T_3',
                        enabled: false,
                    },
                });
                await awaitRunningJobs(adminClient);
                const result = await doAdminSearchQuery({ groupByProduct: true, term: 'gaming' });
                expect(result.search.items.map(pick(['productId', 'enabled']))).toEqual([
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
                        defaultTaxZoneId: 'T_2',
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
                expect(search.items.map(i => i.productId).sort()).toEqual(['T_1', 'T_2']);
            });

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
            });

            it('reindexes in channel', async () => {
                adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);

                const { reindex } = await adminClient.query<Reindex.Mutation>(REINDEX);
                await awaitRunningJobs(adminClient);

                const { job } = await adminClient.query<GetJobInfo.Query, GetJobInfo.Variables>(
                    GET_JOB_INFO,
                    { id: reindex.id },
                );
                expect(job!.state).toBe(JobState.COMPLETED);

                const { search } = await doAdminSearchQuery({ groupByProduct: true });
                expect(search.items.map(i => i.productId).sort()).toEqual(['T_1']);
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
                productAsset {
                    id
                    preview
                    focalPoint {
                        x
                        y
                    }
                }
                productPreview
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

const REINDEX = gql`
    mutation Reindex {
        reindex {
            id
            name
            state
            progress
            duration
            result
        }
    }
`;

const GET_JOB_INFO = gql`
    query GetJobInfo($id: String!) {
        job(jobId: $id) {
            id
            name
            state
            progress
            duration
            result
        }
    }
`;
