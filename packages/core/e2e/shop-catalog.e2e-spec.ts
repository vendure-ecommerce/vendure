/* tslint:disable:no-non-null-assertion */
import gql from 'graphql-tag';
import path from 'path';

import { CREATE_COLLECTION, UPDATE_COLLECTION } from '../../../admin-ui/src/app/data/definitions/collection-definitions';
import { GET_PRODUCT_WITH_VARIANTS, UPDATE_PRODUCT_VARIANTS } from '../../../admin-ui/src/app/data/definitions/product-definitions';
import { ConfigArgType, CreateCollection, LanguageCode, UpdateCollection } from '../../common/lib/generated-types';
import { GetProductWithVariants, UpdateProductVariants } from '../../common/src/generated-types';
import { facetValueCollectionFilter } from '../src/config/collection/default-collection-filters';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestAdminClient, TestShopClient } from './test-client';
import { TestServer } from './test-server';

describe('Shop catalog', () => {
    const shopClient = new TestShopClient();
    const adminClient = new TestAdminClient();
    const server = new TestServer();

    beforeAll(async () => {
        const token = await server.init({
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await shopClient.init();
        await adminClient.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('products', () => {

        beforeAll(async () => {
            // disable the first product
            await adminClient.query(DISABLE_PRODUCT, { id: 'T_1' });

            const monitorProduct = await adminClient
                .query<GetProductWithVariants.Query, GetProductWithVariants.Variables>(GET_PRODUCT_WITH_VARIANTS, {
                    id: 'T_2',
                });
            if (monitorProduct.product) {
                await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(UPDATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            id: monitorProduct.product.variants[0].id,
                            enabled: false,
                        },
                    ],
                });
            }
        });

        it('products list omits disabled products', async () => {
            const result = await shopClient.query(gql`{
                products(options: { take: 3 }) {
                    items { id }
                }
            }`);

            expect(result.products.items.map((item: any) => item.id)).toEqual([ 'T_2', 'T_3', 'T_4']);
        });

        it('product returns null for disabled product', async () => {
            const result = await shopClient.query(gql`{
                product(id: "T_1") { id }
            }`);

            expect(result.product).toBeNull();
        });

        it('omits disabled variants from product response', async () => {
            const result = await shopClient.query(gql`{
                product(id: "T_2") {
                    id
                    variants {
                        id
                        name
                    }
                }
            }`);

            expect(result.product.variants).toEqual([
                { id: 'T_6', name: 'Curvy Monitor 27 inch'},
            ]);
        });
    });

    describe('collections', () => {

        let collection: CreateCollection.CreateCollection;

        beforeAll(async () => {
            const result = await adminClient.query(gql`{
                facets {
                    items {
                        id
                        name
                        values {
                            id
                        }
                    }
                }
            }`);
            const category = result.facets.items[0];
            const { createCollection } = await adminClient.query<CreateCollection.Mutation, CreateCollection.Variables>(
                CREATE_COLLECTION,
                {
                    input: {
                        filters: [
                            {
                                code: facetValueCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'facetValueIds',
                                        value: `["${category.values[3].id}"]`,
                                        type: ConfigArgType.FACET_VALUE_IDS,
                                    },
                                ],
                            },
                        ],
                        translations: [
                            { languageCode: LanguageCode.en, name: 'My Collection', description: '' },
                        ],
                    },
                },
            );
            collection = createCollection;
        });

        it('returns collection with variants', async () => {
            const result = await shopClient.query(GET_COLLECTION_VARIANTS, { id: collection.id });
            expect(result.collection.productVariants.items).toEqual([
                { id: 'T_22', name: 'Road Bike' },
                { id: 'T_23', name: 'Skipping Rope' },
                { id: 'T_24', name: 'Boxing Gloves' },
                { id: 'T_25', name: 'Tent' },
                { id: 'T_26', name: 'Cruiser Skateboard' },
                { id: 'T_27', name: 'Football' },
                { id: 'T_28', name: 'Running Shoe Size 40' },
                { id: 'T_29', name: 'Running Shoe Size 42' },
                { id: 'T_30', name: 'Running Shoe Size 44' },
                { id: 'T_31', name: 'Running Shoe Size 46' },
            ]);
        });

        it('omits variants from disabled products', async () => {
            await adminClient.query(DISABLE_PRODUCT, { id: 'T_17' });

            const result = await shopClient.query(GET_COLLECTION_VARIANTS, { id: collection.id });
            expect(result.collection.productVariants.items).toEqual([
                { id: 'T_22', name: 'Road Bike' },
                { id: 'T_23', name: 'Skipping Rope' },
                { id: 'T_24', name: 'Boxing Gloves' },
                { id: 'T_25', name: 'Tent' },
                { id: 'T_26', name: 'Cruiser Skateboard' },
                { id: 'T_27', name: 'Football' },
            ]);
        });

        it('omits variants from disabled products', async () => {
            await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(UPDATE_PRODUCT_VARIANTS, {
                input: [
                    { id: 'T_22', enabled: false },
                ],
            });

            const result = await shopClient.query(GET_COLLECTION_VARIANTS, { id: collection.id });
            expect(result.collection.productVariants.items).toEqual([
                { id: 'T_23', name: 'Skipping Rope' },
                { id: 'T_24', name: 'Boxing Gloves' },
                { id: 'T_25', name: 'Tent' },
                { id: 'T_26', name: 'Cruiser Skateboard' },
                { id: 'T_27', name: 'Football' },
            ]);
        });

        it('collection list', async () => {
            const result = await shopClient.query(GET_COLLECTION_LIST);

            expect(result.collections.items).toEqual([
                { id: 'T_2', name: 'Plants' },
                { id: 'T_3', name: 'My Collection' },
            ]);
        });

        it('omits private collections', async () => {
            await adminClient.query<UpdateCollection.Mutation, UpdateCollection.Variables>(UPDATE_COLLECTION, {
                input: {
                    id: collection.id,
                    isPrivate: true,
                },
            });
            const result = await shopClient.query(GET_COLLECTION_LIST);

            expect(result.collections.items).toEqual([
                { id: 'T_2', name: 'Plants' },
            ]);
        });

        it('returns null for private collection', async () => {
            const result = await shopClient.query(GET_COLLECTION_VARIANTS, { id: collection.id });

            expect(result.collection).toBeNull();
        });

        it('product.collections list omits private collections', async () => {
            const result = await shopClient.query(gql`{
                product(id: "T_12") {
                    collections {
                        id
                        name
                    }
                }
            }`);

            expect(result.product.collections).toEqual([]);
        });
    });
});

const DISABLE_PRODUCT = gql`
    mutation DisableProduct($id: ID!) {
        updateProduct(input: {
            id: $id
            enabled: false
        }) {
            id
        }
    }
`;

const GET_COLLECTION_VARIANTS = gql`
    query GetCollectionVariants($id: ID!) {
        collection(id: $id) {
            productVariants {
                items {
                    id
                    name
                }
            }
        }
    }
`;

const GET_COLLECTION_LIST = gql`{
    collections {
        items {
            id
            name
        }
    }
}`;
