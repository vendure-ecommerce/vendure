import {
    ConfigArgType,
    CreateCollection,
    LanguageCode,
    SearchInput,
    SearchProducts,
    UpdateCollection,
    UpdateProduct,
    UpdateTaxRate,
} from ''@vendure/common/lib/$1'generated-types';
import gql from 'graphql-tag';
import path from 'path';

import {
    CREATE_COLLECTION,
    UPDATE_COLLECTION,
} from '../../../admin-ui/src/app/data/definitions/collection-definitions';
import { SEARCH_PRODUCTS, UPDATE_PRODUCT } from '../../../admin-ui/src/app/data/definitions/product-definitions';
import { UPDATE_TAX_RATE } from '../../../admin-ui/src/app/data/definitions/settings-definitions';
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

    async function testSinglePrices(client: SimpleGraphQLClient) {
        const result = await client.query(SEARCH_GET_PRICES, {
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
        const result = await client.query(SEARCH_GET_PRICES, {
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
            const result = await shopClient.query(SEARCH_GET_FACET_VALUES, {
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
            const result = await shopClient.query(SEARCH_GET_FACET_VALUES, {
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
    });

    describe('admin api', () => {
        it('group by product', () => testGroupByProduct(adminClient));

        it('no grouping', () => testNoGrouping(adminClient));

        it('matches search term', () => testMatchSearchTerm(adminClient));

        it('matches by facetId', () => testMatchFacetIds(adminClient));

        it('matches by collectionId', () => testMatchCollectionId(adminClient));

        it('single prices', () => testSinglePrices(shopClient));

        it('price ranges', () => testPriceRanges(shopClient));

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

        it('updates index when a taxRate is changed', async () => {
            await adminClient.query<UpdateTaxRate.Mutation, UpdateTaxRate.Variables>(UPDATE_TAX_RATE, {
                input: {
                    // Default Channel's defaultTaxZone is Europe (id 2) and the id of the standard TaxRate
                    // to Europe is 2.
                    id: 'T_2',
                    value: 50,
                },
            });
            const result = await adminClient.query(SEARCH_GET_PRICES, {
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
    });
});

export const SEARCH_GET_FACET_VALUES = gql`
    query SearchProducts($input: SearchInput!) {
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
