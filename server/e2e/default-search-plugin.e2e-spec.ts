import gql from 'graphql-tag';
import path from 'path';

import {
    CREATE_COLLECTION,
    UPDATE_COLLECTION,
} from '../../admin-ui/src/app/data/definitions/collection-definitions';
import { SEARCH_PRODUCTS, UPDATE_PRODUCT } from '../../admin-ui/src/app/data/definitions/product-definitions';
import {
    ConfigArgType,
    CreateCollection,
    LanguageCode,
    SearchProducts,
    UpdateCollection,
    UpdateProduct,
} from '../../shared/generated-types';
import { SimpleGraphQLClient } from '../mock-data/simple-graphql-client';
import { facetValueCollectionFilter } from '../src/config/collection/default-collection-filters';
import { DefaultSearchPlugin } from '../src/plugin/default-search-plugin/default-search-plugin';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
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
        const result = await client.query<SearchProducts.Query, SearchProducts.Variables>(SEARCH_PRODUCTS, {
            input: {
                groupByProduct: true,
            },
        });
        expect(result.search.totalItems).toBe(20);
    }

    async function testNoGrouping(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProducts.Query, SearchProducts.Variables>(SEARCH_PRODUCTS, {
            input: {
                groupByProduct: false,
            },
        });
        expect(result.search.totalItems).toBe(34);
    }

    async function testMatchSearchTerm(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProducts.Query, SearchProducts.Variables>(SEARCH_PRODUCTS, {
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
        const result = await client.query<SearchProducts.Query, SearchProducts.Variables>(SEARCH_PRODUCTS, {
            input: {
                facetIds: ['T_1', 'T_2'],
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
        const result = await client.query<SearchProducts.Query, SearchProducts.Variables>(SEARCH_PRODUCTS, {
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

    describe('shop api', () => {
        it('group by product', () => testGroupByProduct(shopClient));

        it('no grouping', () => testNoGrouping(shopClient));

        it('matches search term', () => testMatchSearchTerm(shopClient));

        it('matches by facetId', () => testMatchFacetIds(shopClient));

        it('matches by collectionId', () => testMatchCollectionId(shopClient));

        it('returns correct facetValues when not grouped by product', async () => {
            const result = await shopClient.query(SEARCH_GET_FACET_VALUES, {
                input: {
                    groupByProduct: false,
                },
            });
            expect(result.search.facetValues).toEqual([
                { id: 'T_1', name: 'electronics' },
                { id: 'T_2', name: 'computers' },
                { id: 'T_3', name: 'photo' },
                { id: 'T_4', name: 'sports equipment' },
                { id: 'T_5', name: 'home & garden' },
                { id: 'T_6', name: 'plants' },
            ]);
        });

        it('returns correct facetValues when grouped by product', async () => {
            const result = await shopClient.query(SEARCH_GET_FACET_VALUES, {
                input: {
                    groupByProduct: true,
                },
            });
            expect(result.search.facetValues).toEqual([
                { id: 'T_1', name: 'electronics' },
                { id: 'T_2', name: 'computers' },
                { id: 'T_3', name: 'photo' },
                { id: 'T_4', name: 'sports equipment' },
                { id: 'T_5', name: 'home & garden' },
                { id: 'T_6', name: 'plants' },
            ]);
        });
    });

    describe('admin api', () => {
        it('group by product', () => testGroupByProduct(adminClient));

        it('no grouping', () => testNoGrouping(adminClient));

        it('matches search term', () => testMatchSearchTerm(adminClient));

        it('matches by facetId', () => testMatchFacetIds(adminClient));

        it('matches by collectionId', () => testMatchCollectionId(adminClient));

        it('updates index when a Product is changed', async () => {
            await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                input: {
                    id: 'T_1',
                    facetValueIds: [],
                },
            });

            const result = await adminClient.query<SearchProducts.Query, SearchProducts.Variables>(
                SEARCH_PRODUCTS,
                {
                    input: {
                        facetIds: ['T_2'],
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
                                ],
                            },
                        ],
                    },
                },
            );

            const result = await adminClient.query<SearchProducts.Query, SearchProducts.Variables>(
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
                            ],
                        },
                    ],
                },
            });

            const result = await adminClient.query<SearchProducts.Query, SearchProducts.Variables>(
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
    });
});

export const SEARCH_GET_FACET_VALUES = gql`
    query SearchProducts($input: SearchInput!) {
        search(input: $input) {
            totalItems
            facetValues {
                id
                name
            }
        }
    }
`;
