/* tslint:disable:no-non-null-assertion */
import {
    Collection,
    ConfigArgType,
    CreateCollection,
    CreateCollectionInput,
    FacetValue,
    GetAssetList,
    GetCollection,
    LanguageCode,
    MoveCollection,
    ProductWithVariants,
    SortOrder,
    UpdateCollection,
    UpdateProduct,
    UpdateProductVariants,
} from '@vendure/common/lib/generated-types';
import { ROOT_COLLECTION_NAME } from '@vendure/common/lib/shared-constants';
import gql from 'graphql-tag';
import path from 'path';

import {
    CREATE_COLLECTION,
    GET_COLLECTION,
    MOVE_COLLECTION,
    UPDATE_COLLECTION,
} from '../../../admin-ui/src/app/data/definitions/collection-definitions';
import { FACET_VALUE_FRAGMENT } from '../../../admin-ui/src/app/data/definitions/facet-definitions';
import { GET_ASSET_LIST, UPDATE_PRODUCT, UPDATE_PRODUCT_VARIANTS } from '../../../admin-ui/src/app/data/definitions/product-definitions';
import { facetValueCollectionFilter } from '../src/config/collection/default-collection-filters';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestAdminClient } from './test-client';
import { TestServer } from './test-server';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('Collection resolver', () => {
    const client = new TestAdminClient();
    const server = new TestServer();
    let assets: GetAssetList.Items[];
    let facetValues: FacetValue.Fragment[];
    let electronicsCollection: Collection.Fragment;
    let computersCollection: Collection.Fragment;
    let pearCollection: Collection.Fragment;

    beforeAll(async () => {
        const token = await server.init({
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-collections.csv'),
            customerCount: 1,
        });
        await client.init();
        const assetsResult = await client.query<GetAssetList.Query, GetAssetList.Variables>(GET_ASSET_LIST, {
            options: {
                sort: {
                    name: SortOrder.ASC,
                },
            },
        });
        assets = assetsResult.assets.items;
        const facetValuesResult = await client.query(GET_FACET_VALUES);
        facetValues = facetValuesResult.facets.items.reduce(
            (values: any, facet: any) => [...values, ...facet.values],
            [],
        );
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('createCollection', () => {
        it('creates a root collection', async () => {
            const result = await client.query<CreateCollection.Mutation, CreateCollection.Variables>(
                CREATE_COLLECTION,
                {
                    input: {
                        assetIds: [assets[0].id, assets[1].id],
                        featuredAssetId: assets[1].id,
                        filters: [
                            {
                                code: facetValueCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'facetValueIds',
                                        value: `["${getFacetValueId('electronics')}"]`,
                                        type: ConfigArgType.FACET_VALUE_IDS,
                                    },
                                ],
                            },
                        ],
                        translations: [
                            { languageCode: LanguageCode.en, name: 'Electronics', description: '' },
                        ],
                    },
                },
            );

            electronicsCollection = result.createCollection;
            expect(electronicsCollection).toMatchSnapshot();
            expect(electronicsCollection.parent!.name).toBe(ROOT_COLLECTION_NAME);
        });

        it('creates a nested category', async () => {
            const result = await client.query<CreateCollection.Mutation, CreateCollection.Variables>(
                CREATE_COLLECTION,
                {
                    input: {
                        parentId: electronicsCollection.id,
                        translations: [{ languageCode: LanguageCode.en, name: 'Computers', description: '' }],
                        filters: [
                            {
                                code: facetValueCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'facetValueIds',
                                        value: `["${getFacetValueId('computers')}"]`,
                                        type: ConfigArgType.FACET_VALUE_IDS,
                                    },
                                ],
                            },
                        ],
                    },
                },
            );
            computersCollection = result.createCollection;
            expect(computersCollection.parent!.name).toBe(electronicsCollection.name);
        });

        it('creates a 2nd level nested category', async () => {
            const result = await client.query<CreateCollection.Mutation, CreateCollection.Variables>(
                CREATE_COLLECTION,
                {
                    input: {
                        parentId: computersCollection.id,
                        translations: [{ languageCode: LanguageCode.en, name: 'Pear', description: '' }],
                        filters: [
                            {
                                code: facetValueCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'facetValueIds',
                                        value: `["${getFacetValueId('pear')}"]`,
                                        type: ConfigArgType.FACET_VALUE_IDS,
                                    },
                                ],
                            },
                        ],
                    },
                },
            );
            pearCollection = result.createCollection;
            expect(pearCollection.parent!.name).toBe(computersCollection.name);
        });
    });

    it('collection query', async () => {
        const result = await client.query<GetCollection.Query, GetCollection.Variables>(GET_COLLECTION, {
            id: computersCollection.id,
        });
        if (!result.collection) {
            fail(`did not return the collection`);
            return;
        }
        expect(result.collection.id).toBe(computersCollection.id);
    });

    it('breadcrumbs', async () => {
        const result = await client.query(GET_COLLECTION_BREADCRUMBS, {
            id: pearCollection.id,
        });
        if (!result.collection) {
            fail(`did not return the collection`);
            return;
        }
        expect(result.collection.breadcrumbs).toEqual([
            { id: 'T_1', name: ROOT_COLLECTION_NAME },
            { id: electronicsCollection.id, name: electronicsCollection.name },
            { id: computersCollection.id, name: computersCollection.name },
            { id: pearCollection.id, name: pearCollection.name },
        ]);
    });

    it('breadcrumbs for root collection', async () => {
        const result = await client.query(GET_COLLECTION_BREADCRUMBS, {
            id: 'T_1',
        });
        if (!result.collection) {
            fail(`did not return the collection`);
            return;
        }
        expect(result.collection.breadcrumbs).toEqual([{ id: 'T_1', name: ROOT_COLLECTION_NAME }]);
    });

    it('updateCollection', async () => {
        const result = await client.query<UpdateCollection.Mutation, UpdateCollection.Variables>(
            UPDATE_COLLECTION,
            {
                input: {
                    id: pearCollection.id,
                    assetIds: [assets[1].id],
                    featuredAssetId: assets[1].id,
                    translations: [{ languageCode: LanguageCode.en, description: 'Apple stuff ' }],
                },
            },
        );

        expect(result.updateCollection).toMatchSnapshot();
    });

    describe('moveCollection', () => {
        it('moves a collection to a new parent', async () => {
            const result = await client.query<MoveCollection.Mutation, MoveCollection.Variables>(
                MOVE_COLLECTION,
                {
                    input: {
                        collectionId: pearCollection.id,
                        parentId: electronicsCollection.id,
                        index: 0,
                    },
                },
            );

            expect(result.moveCollection.parent!.id).toBe(electronicsCollection.id);

            const positions = await getChildrenOf(electronicsCollection.id);
            expect(positions.map((i: any) => i.id)).toEqual([pearCollection.id, computersCollection.id]);
        });

        it('re-evaluates Collection contents on move', async () => {
            const result = await client.query(GET_COLLECTION_PRODUCT_VARIANTS, { id: pearCollection.id });
            expect(result.collection.productVariants.items.map((i: any) => i.name)).toEqual([
                'Laptop 13 inch 8GB',
                'Laptop 15 inch 8GB',
                'Laptop 13 inch 16GB',
                'Laptop 15 inch 16GB',
                'Instant Camera',
            ]);
        });

        it('alters the position in the current parent', async () => {
            await client.query<MoveCollection.Mutation, MoveCollection.Variables>(MOVE_COLLECTION, {
                input: {
                    collectionId: pearCollection.id,
                    parentId: electronicsCollection.id,
                    index: 1,
                },
            });

            const afterResult = await getChildrenOf(electronicsCollection.id);
            expect(afterResult.map((i: any) => i.id)).toEqual([computersCollection.id, pearCollection.id]);
        });

        it('corrects an out-of-bounds negative index value', async () => {
            await client.query<MoveCollection.Mutation, MoveCollection.Variables>(MOVE_COLLECTION, {
                input: {
                    collectionId: pearCollection.id,
                    parentId: electronicsCollection.id,
                    index: -3,
                },
            });

            const afterResult = await getChildrenOf(electronicsCollection.id);
            expect(afterResult.map((i: any) => i.id)).toEqual([pearCollection.id, computersCollection.id]);
        });

        it('corrects an out-of-bounds positive index value', async () => {
            await client.query<MoveCollection.Mutation, MoveCollection.Variables>(MOVE_COLLECTION, {
                input: {
                    collectionId: pearCollection.id,
                    parentId: electronicsCollection.id,
                    index: 10,
                },
            });

            const afterResult = await getChildrenOf(electronicsCollection.id);
            expect(afterResult.map((i: any) => i.id)).toEqual([computersCollection.id, pearCollection.id]);
        });

        it(
            'throws if attempting to move into self',
            assertThrowsWithMessage(
                () =>
                    client.query<MoveCollection.Mutation, MoveCollection.Variables>(MOVE_COLLECTION, {
                        input: {
                            collectionId: pearCollection.id,
                            parentId: pearCollection.id,
                            index: 0,
                        },
                    }),
                `Cannot move a Collection into itself`,
            ),
        );

        it(
            'throws if attempting to move into a decendant of self',
            assertThrowsWithMessage(
                () =>
                    client.query<MoveCollection.Mutation, MoveCollection.Variables>(MOVE_COLLECTION, {
                        input: {
                            collectionId: pearCollection.id,
                            parentId: pearCollection.id,
                            index: 0,
                        },
                    }),
                `Cannot move a Collection into itself`,
            ),
        );

        async function getChildrenOf(parentId: string): Promise<Array<{ name: string; id: string }>> {
            const result = await client.query(GET_COLLECTIONS);
            return result.collections.items.filter((i: any) => i.parent.id === parentId);
        }
    });

    describe('filters', () => {
        it('Collection with no filters has no productVariants', async () => {
            const result = await client.query(CREATE_COLLECTION_SELECT_VARIANTS, {
                input: {
                    translations: [{ languageCode: LanguageCode.en, name: 'Empty', description: '' }],
                    filters: [],
                } as CreateCollectionInput,
            });
            expect(result.createCollection.productVariants.totalItems).toBe(0);
        });

        describe('facetValue filter', () => {
            it('electronics', async () => {
                const result = await client.query(GET_COLLECTION_PRODUCT_VARIANTS, {
                    id: electronicsCollection.id,
                });
                expect(result.collection.productVariants.items.map((i: any) => i.name)).toEqual([
                    'Laptop 13 inch 8GB',
                    'Laptop 15 inch 8GB',
                    'Laptop 13 inch 16GB',
                    'Laptop 15 inch 16GB',
                    'Curvy Monitor 24 inch',
                    'Curvy Monitor 27 inch',
                    'Gaming PC i7-8700 240GB SSD',
                    'Gaming PC R7-2700 240GB SSD',
                    'Gaming PC i7-8700 120GB SSD',
                    'Gaming PC R7-2700 120GB SSD',
                    'Hard Drive 1TB',
                    'Hard Drive 2TB',
                    'Hard Drive 3TB',
                    'Hard Drive 4TB',
                    'Hard Drive 6TB',
                    'Clacky Keyboard',
                    'USB Cable',
                    'Instant Camera',
                    'Camera Lens',
                    'Tripod',
                    'SLR Camera',
                ]);
            });

            it('computers', async () => {
                const result = await client.query(GET_COLLECTION_PRODUCT_VARIANTS, {
                    id: computersCollection.id,
                });
                expect(result.collection.productVariants.items.map((i: any) => i.name)).toEqual([
                    'Laptop 13 inch 8GB',
                    'Laptop 15 inch 8GB',
                    'Laptop 13 inch 16GB',
                    'Laptop 15 inch 16GB',
                    'Curvy Monitor 24 inch',
                    'Curvy Monitor 27 inch',
                    'Gaming PC i7-8700 240GB SSD',
                    'Gaming PC R7-2700 240GB SSD',
                    'Gaming PC i7-8700 120GB SSD',
                    'Gaming PC R7-2700 120GB SSD',
                    'Hard Drive 1TB',
                    'Hard Drive 2TB',
                    'Hard Drive 3TB',
                    'Hard Drive 4TB',
                    'Hard Drive 6TB',
                    'Clacky Keyboard',
                    'USB Cable',
                ]);
            });

            it('photo and pear', async () => {
                const result = await client.query(CREATE_COLLECTION_SELECT_VARIANTS, {
                    input: {
                        translations: [
                            { languageCode: LanguageCode.en, name: 'Photo Pear', description: '' },
                        ],
                        filters: [
                            {
                                code: facetValueCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'facetValueIds',
                                        value: `["${getFacetValueId('pear')}", "${getFacetValueId(
                                            'photo',
                                        )}"]`,
                                        type: ConfigArgType.FACET_VALUE_IDS,
                                    },
                                ],
                            },
                        ],
                    } as CreateCollectionInput,
                });
                expect(result.createCollection.productVariants.items.map((i: any) => i.name)).toEqual([
                    'Instant Camera',
                ]);
            });
        });

        describe('re-evaluation of contents on changes', () => {
            let products: ProductWithVariants.Fragment[];

            beforeAll(async () => {
                const result = await client.query(gql`
                    query {
                        products {
                            items {
                                id
                                name
                                variants {
                                    id
                                }
                            }
                        }
                    }
                `);
                products = result.products.items;
            });

            it('updates contents when Product is updated', async () => {
                await client.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                    input: {
                        id: products[1].id,
                        facetValueIds: [
                            getFacetValueId('electronics'),
                            getFacetValueId('computers'),
                            getFacetValueId('pear'),
                        ],
                    },
                });

                const result = await client.query(GET_COLLECTION_PRODUCT_VARIANTS, { id: pearCollection.id });
                expect(result.collection.productVariants.items.map((i: any) => i.name)).toEqual([
                    'Laptop 13 inch 8GB',
                    'Laptop 15 inch 8GB',
                    'Laptop 13 inch 16GB',
                    'Laptop 15 inch 16GB',
                    'Curvy Monitor 24 inch',
                    'Curvy Monitor 27 inch',
                    'Instant Camera',
                ]);
            });

            it('updates contents when ProductVariant is updated', async () => {
                const gamingPcFirstVariant = products.find(p => p.name === 'Gaming PC')!.variants[0];
                await client.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                    UPDATE_PRODUCT_VARIANTS,
                    {
                        input: [
                            {
                                id: gamingPcFirstVariant.id,
                                facetValueIds: [getFacetValueId('pear')],
                            },
                        ],
                    },
                );
                const result = await client.query(GET_COLLECTION_PRODUCT_VARIANTS, { id: pearCollection.id });
                expect(result.collection.productVariants.items.map((i: any) => i.name)).toEqual([
                    'Laptop 13 inch 8GB',
                    'Laptop 15 inch 8GB',
                    'Laptop 13 inch 16GB',
                    'Laptop 15 inch 16GB',
                    'Curvy Monitor 24 inch',
                    'Curvy Monitor 27 inch',
                    'Gaming PC i7-8700 240GB SSD',
                    'Instant Camera',
                ]);
            });

            it('correctly filters when ProductVariant and Product both have matching FacetValue', async () => {
                const gamingPcFirstVariant = products.find(p => p.name === 'Gaming PC')!.variants[0];
                await client.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                    UPDATE_PRODUCT_VARIANTS,
                    {
                        input: [
                            {
                                id: gamingPcFirstVariant.id,
                                facetValueIds: [getFacetValueId('electronics'), getFacetValueId('pear')],
                            },
                        ],
                    },
                );
                const result = await client.query(GET_COLLECTION_PRODUCT_VARIANTS, { id: pearCollection.id });
                expect(result.collection.productVariants.items.map((i: any) => i.name)).toEqual([
                    'Laptop 13 inch 8GB',
                    'Laptop 15 inch 8GB',
                    'Laptop 13 inch 16GB',
                    'Laptop 15 inch 16GB',
                    'Curvy Monitor 24 inch',
                    'Curvy Monitor 27 inch',
                    'Gaming PC i7-8700 240GB SSD',
                    'Instant Camera',
                ]);
            });
        });
    });

    describe('Product collections property', () => {
        it('returns all collections to which the Product belongs', async () => {
            const result = await client.query(GET_COLLECTIONS_FOR_PRODUCTS, { term: 'camera' });
            expect(result.products.items[0].collections).toEqual([
                { id: 'T_3', name: 'Electronics' },
                { id: 'T_5', name: 'Pear' },
                { id: 'T_7', name: 'Photo Pear' },
            ]);
        });
    });

    function getFacetValueId(code: string): string {
        const match = facetValues.find(fv => fv.code === code);
        if (!match) {
            throw new Error(`Could not find a FacetValue with the code "${code}"`);
        }
        return match.id;
    }
});

const GET_FACET_VALUES = gql`
    query {
        facets {
            items {
                values {
                    ...FacetValue
                }
            }
        }
    }
    ${FACET_VALUE_FRAGMENT}
`;

const GET_COLLECTIONS = gql`
    query GetCollections {
        collections(languageCode: en) {
            items {
                id
                name
                position
                parent {
                    id
                    name
                }
            }
        }
    }
`;

const GET_COLLECTION_PRODUCT_VARIANTS = gql`
    query GetCollectionProducts($id: ID!) {
        collection(id: $id) {
            productVariants {
                items {
                    id
                    name
                    facetValues {
                        code
                    }
                }
            }
        }
    }
`;

const CREATE_COLLECTION_SELECT_VARIANTS = gql`
    mutation($input: CreateCollectionInput!) {
        createCollection(input: $input) {
            productVariants {
                items {
                    name
                }
                totalItems
            }
        }
    }
`;

const GET_COLLECTION_BREADCRUMBS = gql`
    query GetCollectionBreadcrumbs($id: ID!) {
        collection(id: $id) {
            breadcrumbs {
                id
                name
            }
        }
    }
`;

const GET_COLLECTIONS_FOR_PRODUCTS = gql`
    query GetCollectionsForProducts($term: String!) {
        products(options: { filter: { name: { contains: $term } } }) {
            items {
                id
                name
                collections {
                    id
                    name
                }
            }
        }
    }
`;
