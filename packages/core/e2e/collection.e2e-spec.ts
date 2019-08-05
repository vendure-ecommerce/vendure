/* tslint:disable:no-non-null-assertion */
import { ROOT_COLLECTION_NAME } from '@vendure/common/lib/shared-constants';
import gql from 'graphql-tag';
import path from 'path';

import { pick } from '../../common/lib/pick';
import { StringOperator } from '../src/common/configurable-operation';
import {
    facetValueCollectionFilter,
    variantNameCollectionFilter,
} from '../src/config/collection/default-collection-filters';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { COLLECTION_FRAGMENT, FACET_VALUE_FRAGMENT } from './graphql/fragments';
import {
    Collection,
    CreateCollection,
    CreateCollectionInput,
    CreateCollectionSelectVariants,
    DeleteCollection,
    DeleteProduct,
    DeletionResult,
    FacetValueFragment,
    GetAssetList,
    GetCollection,
    GetCollectionBreadcrumbs,
    GetCollectionProducts,
    GetCollections,
    GetCollectionsForProducts,
    GetFacetValues,
    GetProductCollections,
    GetProductsWithVariantIds,
    LanguageCode,
    MoveCollection,
    SortOrder,
    UpdateCollection,
    UpdateProduct,
    UpdateProductVariants,
} from './graphql/generated-e2e-admin-types';
import {
    CREATE_COLLECTION,
    DELETE_PRODUCT,
    GET_ASSET_LIST,
    UPDATE_COLLECTION,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
} from './graphql/shared-definitions';
import { TestAdminClient } from './test-client';
import { TestServer } from './test-server';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('Collection resolver', () => {
    const client = new TestAdminClient();
    const server = new TestServer();
    let assets: GetAssetList.Items[];
    let facetValues: FacetValueFragment[];
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
        const facetValuesResult = await client.query<GetFacetValues.Query>(GET_FACET_VALUES);
        facetValues = facetValuesResult.facets.items.reduce(
            (values, facet) => [...values, ...facet.values],
            [] as FacetValueFragment[],
        );
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    /**
     * Test case for https://github.com/vendure-ecommerce/vendure/issues/97
     */
    it('collection breadcrumbs works after bootstrap', async () => {
        const result = await client.query<GetCollectionBreadcrumbs.Query>(GET_COLLECTION_BREADCRUMBS, {
            id: 'T_1',
        });
        expect(result.collection!.breadcrumbs[0].name).toBe(ROOT_COLLECTION_NAME);
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

    it('parent field', async () => {
        const result = await client.query<GetCollection.Query, GetCollection.Variables>(GET_COLLECTION, {
            id: computersCollection.id,
        });
        if (!result.collection) {
            fail(`did not return the collection`);
            return;
        }
        expect(result.collection.parent!.name).toBe('Electronics');
    });

    it('children field', async () => {
        const result = await client.query<GetCollection.Query, GetCollection.Variables>(GET_COLLECTION, {
            id: electronicsCollection.id,
        });
        if (!result.collection) {
            fail(`did not return the collection`);
            return;
        }
        expect(result.collection.children!.length).toBe(1);
        expect(result.collection.children![0].name).toBe('Computers');
    });

    it('breadcrumbs', async () => {
        const result = await client.query<GetCollectionBreadcrumbs.Query, GetCollectionBreadcrumbs.Variables>(
            GET_COLLECTION_BREADCRUMBS,
            {
                id: pearCollection.id,
            },
        );
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
        const result = await client.query<GetCollectionBreadcrumbs.Query, GetCollectionBreadcrumbs.Variables>(
            GET_COLLECTION_BREADCRUMBS,
            {
                id: 'T_1',
            },
        );
        if (!result.collection) {
            fail(`did not return the collection`);
            return;
        }
        expect(result.collection.breadcrumbs).toEqual([{ id: 'T_1', name: ROOT_COLLECTION_NAME }]);
    });

    it('updateCollection', async () => {
        const { updateCollection } = await client.query<
            UpdateCollection.Mutation,
            UpdateCollection.Variables
        >(UPDATE_COLLECTION, {
            input: {
                id: pearCollection.id,
                assetIds: [assets[1].id],
                featuredAssetId: assets[1].id,
                translations: [{ languageCode: LanguageCode.en, description: 'Apple stuff ' }],
            },
        });

        expect(updateCollection).toMatchSnapshot();
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
            expect(positions.map(i => i.id)).toEqual([pearCollection.id, computersCollection.id]);
        });

        it('re-evaluates Collection contents on move', async () => {
            const result = await client.query<GetCollectionProducts.Query, GetCollectionProducts.Variables>(
                GET_COLLECTION_PRODUCT_VARIANTS,
                { id: pearCollection.id },
            );
            expect(result.collection!.productVariants.items.map(i => i.name)).toEqual([
                'Laptop 13 inch 8GB',
                'Laptop 15 inch 8GB',
                'Laptop 13 inch 16GB',
                'Laptop 15 inch 16GB',
                'Instant Camera',
            ]);
        });

        it('alters the position in the current parent 1', async () => {
            await client.query<MoveCollection.Mutation, MoveCollection.Variables>(MOVE_COLLECTION, {
                input: {
                    collectionId: computersCollection.id,
                    parentId: electronicsCollection.id,
                    index: 0,
                },
            });

            const afterResult = await getChildrenOf(electronicsCollection.id);
            expect(afterResult.map(i => i.id)).toEqual([computersCollection.id, pearCollection.id]);
        });

        it('alters the position in the current parent 2', async () => {
            await client.query<MoveCollection.Mutation, MoveCollection.Variables>(MOVE_COLLECTION, {
                input: {
                    collectionId: pearCollection.id,
                    parentId: electronicsCollection.id,
                    index: 0,
                },
            });

            const afterResult = await getChildrenOf(electronicsCollection.id);
            expect(afterResult.map(i => i.id)).toEqual([pearCollection.id, computersCollection.id]);
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
            expect(afterResult.map(i => i.id)).toEqual([pearCollection.id, computersCollection.id]);
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
            expect(afterResult.map(i => i.id)).toEqual([computersCollection.id, pearCollection.id]);
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
            const result = await client.query<GetCollections.Query>(GET_COLLECTIONS);
            return result.collections.items.filter(i => i.parent!.id === parentId);
        }
    });

    describe('deleteCollection', () => {
        let collectionToDelete: CreateCollection.CreateCollection;
        let laptopProductId: string;

        beforeAll(async () => {
            const { createCollection } = await client.query<
                CreateCollection.Mutation,
                CreateCollection.Variables
            >(CREATE_COLLECTION, {
                input: {
                    filters: [
                        {
                            code: variantNameCollectionFilter.code,
                            arguments: [
                                {
                                    name: 'operator',
                                    value: 'contains',
                                    type: 'stringOperator',
                                },
                                {
                                    name: 'term',
                                    value: 'laptop',
                                    type: 'string',
                                },
                            ],
                        },
                    ],
                    translations: [{ languageCode: LanguageCode.en, name: 'Delete Me', description: '' }],
                },
            });
            collectionToDelete = createCollection;
        });

        it(
            'throws for invalid collection id',
            assertThrowsWithMessage(async () => {
                await client.query<DeleteCollection.Mutation, DeleteCollection.Variables>(DELETE_COLLECTION, {
                    id: 'T_999',
                });
            }, "No Collection with the id '999' could be found"),
        );

        it('collection and product related prior to deletion', async () => {
            const { collection } = await client.query<
                GetCollectionProducts.Query,
                GetCollectionProducts.Variables
            >(GET_COLLECTION_PRODUCT_VARIANTS, {
                id: collectionToDelete.id,
            });
            expect(collection!.productVariants.items.map(pick(['name']))).toEqual([
                { name: 'Laptop 13 inch 8GB' },
                { name: 'Laptop 15 inch 8GB' },
                { name: 'Laptop 13 inch 16GB' },
                { name: 'Laptop 15 inch 16GB' },
            ]);

            laptopProductId = collection!.productVariants.items[0].productId;

            const { product } = await client.query<
                GetProductCollections.Query,
                GetProductCollections.Variables
            >(GET_PRODUCT_COLLECTIONS, {
                id: laptopProductId,
            });

            expect(product!.collections).toEqual([
                { id: 'T_3', name: 'Electronics' },
                { id: 'T_4', name: 'Computers' },
                { id: 'T_5', name: 'Pear' },
                { id: 'T_6', name: 'Delete Me' },
            ]);
        });

        it('deleteCollection works', async () => {
            const { deleteCollection } = await client.query<
                DeleteCollection.Mutation,
                DeleteCollection.Variables
            >(DELETE_COLLECTION, {
                id: collectionToDelete.id,
            });

            expect(deleteCollection.result).toBe(DeletionResult.DELETED);
        });

        it('deleted collection is null', async () => {
            const { collection } = await client.query<GetCollection.Query, GetCollection.Variables>(
                GET_COLLECTION,
                {
                    id: collectionToDelete.id,
                },
            );
            expect(collection).toBeNull();
        });

        it('product no longer lists collection', async () => {
            const { product } = await client.query<
                GetProductCollections.Query,
                GetProductCollections.Variables
            >(GET_PRODUCT_COLLECTIONS, {
                id: laptopProductId,
            });

            expect(product!.collections).toEqual([
                { id: 'T_3', name: 'Electronics' },
                { id: 'T_4', name: 'Computers' },
                { id: 'T_5', name: 'Pear' },
            ]);
        });
    });

    describe('filters', () => {
        it('Collection with no filters has no productVariants', async () => {
            const result = await client.query<
                CreateCollectionSelectVariants.Mutation,
                CreateCollectionSelectVariants.Variables
            >(CREATE_COLLECTION_SELECT_VARIANTS, {
                input: {
                    translations: [{ languageCode: LanguageCode.en, name: 'Empty', description: '' }],
                    filters: [],
                } as CreateCollectionInput,
            });
            expect(result.createCollection.productVariants.totalItems).toBe(0);
        });

        describe('facetValue filter', () => {
            it('electronics', async () => {
                const result = await client.query<
                    GetCollectionProducts.Query,
                    GetCollectionProducts.Variables
                >(GET_COLLECTION_PRODUCT_VARIANTS, {
                    id: electronicsCollection.id,
                });
                expect(result.collection!.productVariants.items.map(i => i.name)).toEqual([
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
                const result = await client.query<
                    GetCollectionProducts.Query,
                    GetCollectionProducts.Variables
                >(GET_COLLECTION_PRODUCT_VARIANTS, {
                    id: computersCollection.id,
                });
                expect(result.collection!.productVariants.items.map(i => i.name)).toEqual([
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

            it('photo AND pear', async () => {
                const result = await client.query<
                    CreateCollectionSelectVariants.Mutation,
                    CreateCollectionSelectVariants.Variables
                >(CREATE_COLLECTION_SELECT_VARIANTS, {
                    input: {
                        translations: [
                            { languageCode: LanguageCode.en, name: 'Photo AND Pear', description: '' },
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
                    } as CreateCollectionInput,
                });
                expect(result.createCollection.productVariants.items.map(i => i.name)).toEqual([
                    'Instant Camera',
                ]);
            });

            it('photo OR pear', async () => {
                const result = await client.query<
                    CreateCollectionSelectVariants.Mutation,
                    CreateCollectionSelectVariants.Variables
                >(CREATE_COLLECTION_SELECT_VARIANTS, {
                    input: {
                        translations: [
                            { languageCode: LanguageCode.en, name: 'Photo OR Pear', description: '' },
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
                                        type: 'facetValueIds',
                                    },
                                    {
                                        name: 'containsAny',
                                        value: `true`,
                                        type: 'boolean',
                                    },
                                ],
                            },
                        ],
                    } as CreateCollectionInput,
                });
                expect(result.createCollection.productVariants.items.map(i => i.name)).toEqual([
                    'Laptop 13 inch 8GB',
                    'Laptop 15 inch 8GB',
                    'Laptop 13 inch 16GB',
                    'Laptop 15 inch 16GB',
                    'Instant Camera',
                    'Camera Lens',
                    'Tripod',
                    'SLR Camera',
                ]);
            });
        });

        describe('variantName filter', () => {
            async function createVariantNameFilteredCollection(
                operator: StringOperator,
                term: string,
            ): Promise<Collection.Fragment> {
                const { createCollection } = await client.query<
                    CreateCollection.Mutation,
                    CreateCollection.Variables
                >(CREATE_COLLECTION, {
                    input: {
                        translations: [
                            { languageCode: LanguageCode.en, name: `${operator} ${term}`, description: '' },
                        ],
                        filters: [
                            {
                                code: variantNameCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'operator',
                                        value: operator,
                                        type: 'stringOperator',
                                    },
                                    {
                                        name: 'term',
                                        value: term,
                                        type: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                });
                return createCollection;
            }

            it('contains operator', async () => {
                const collection = await createVariantNameFilteredCollection('contains', 'camera');

                const result = await client.query<
                    GetCollectionProducts.Query,
                    GetCollectionProducts.Variables
                >(GET_COLLECTION_PRODUCT_VARIANTS, {
                    id: collection.id,
                });
                expect(result.collection!.productVariants.items.map(i => i.name)).toEqual([
                    'Instant Camera',
                    'Camera Lens',
                    'SLR Camera',
                ]);
            });

            it('startsWith operator', async () => {
                const collection = await createVariantNameFilteredCollection('startsWith', 'camera');

                const result = await client.query<
                    GetCollectionProducts.Query,
                    GetCollectionProducts.Variables
                >(GET_COLLECTION_PRODUCT_VARIANTS, {
                    id: collection.id,
                });
                expect(result.collection!.productVariants.items.map(i => i.name)).toEqual(['Camera Lens']);
            });

            it('endsWith operator', async () => {
                const collection = await createVariantNameFilteredCollection('endsWith', 'camera');

                const result = await client.query<
                    GetCollectionProducts.Query,
                    GetCollectionProducts.Variables
                >(GET_COLLECTION_PRODUCT_VARIANTS, {
                    id: collection.id,
                });
                expect(result.collection!.productVariants.items.map(i => i.name)).toEqual([
                    'Instant Camera',
                    'SLR Camera',
                ]);
            });

            it('doesNotContain operator', async () => {
                const collection = await createVariantNameFilteredCollection('doesNotContain', 'camera');

                const result = await client.query<
                    GetCollectionProducts.Query,
                    GetCollectionProducts.Variables
                >(GET_COLLECTION_PRODUCT_VARIANTS, {
                    id: collection.id,
                });
                expect(result.collection!.productVariants.items.map(i => i.name)).toEqual([
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
                    'Tripod',
                ]);
            });
        });

        describe('re-evaluation of contents on changes', () => {
            let products: GetProductsWithVariantIds.Items[];

            beforeAll(async () => {
                const result = await client.query<GetProductsWithVariantIds.Query>(gql`
                    query GetProductsWithVariantIds {
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

                const result = await client.query<
                    GetCollectionProducts.Query,
                    GetCollectionProducts.Variables
                >(GET_COLLECTION_PRODUCT_VARIANTS, { id: pearCollection.id });
                expect(result.collection!.productVariants.items.map(i => i.name)).toEqual([
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
                const result = await client.query<
                    GetCollectionProducts.Query,
                    GetCollectionProducts.Variables
                >(GET_COLLECTION_PRODUCT_VARIANTS, { id: pearCollection.id });
                expect(result.collection!.productVariants.items.map(i => i.name)).toEqual([
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
                const result = await client.query<
                    GetCollectionProducts.Query,
                    GetCollectionProducts.Variables
                >(GET_COLLECTION_PRODUCT_VARIANTS, { id: pearCollection.id });
                expect(result.collection!.productVariants.items.map(i => i.name)).toEqual([
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
            const result = await client.query<
                GetCollectionsForProducts.Query,
                GetCollectionsForProducts.Variables
            >(GET_COLLECTIONS_FOR_PRODUCTS, { term: 'camera' });
            expect(result.products.items[0].collections).toEqual([
                { id: 'T_3', name: 'Electronics' },
                { id: 'T_5', name: 'Pear' },
                { id: 'T_8', name: 'Photo AND Pear' },
                { id: 'T_9', name: 'Photo OR Pear' },
                { id: 'T_10', name: 'contains camera' },
                { id: 'T_12', name: 'endsWith camera' },
            ]);
        });
    });

    it('collection does not list deleted products', async () => {
        await client.query<DeleteProduct.Mutation, DeleteProduct.Variables>(DELETE_PRODUCT, {
            id: 'T_2', // curvy monitor
        });
        const { collection } = await client.query<
            GetCollectionProducts.Query,
            GetCollectionProducts.Variables
        >(GET_COLLECTION_PRODUCT_VARIANTS, {
            id: pearCollection.id,
        });
        expect(collection!.productVariants.items.map(i => i.name)).toEqual([
            'Laptop 13 inch 8GB',
            'Laptop 15 inch 8GB',
            'Laptop 13 inch 16GB',
            'Laptop 15 inch 16GB',
            'Gaming PC i7-8700 240GB SSD',
            'Instant Camera',
        ]);
    });

    function getFacetValueId(code: string): string {
        const match = facetValues.find(fv => fv.code === code);
        if (!match) {
            throw new Error(`Could not find a FacetValue with the code "${code}"`);
        }
        return match.id;
    }
});

export const GET_COLLECTION = gql`
    query GetCollection($id: ID!) {
        collection(id: $id) {
            ...Collection
        }
    }
    ${COLLECTION_FRAGMENT}
`;

export const MOVE_COLLECTION = gql`
    mutation MoveCollection($input: MoveCollectionInput!) {
        moveCollection(input: $input) {
            ...Collection
        }
    }
    ${COLLECTION_FRAGMENT}
`;

const GET_FACET_VALUES = gql`
    query GetFacetValues {
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
        collections {
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
                    productId
                }
            }
        }
    }
`;

const CREATE_COLLECTION_SELECT_VARIANTS = gql`
    mutation CreateCollectionSelectVariants($input: CreateCollectionInput!) {
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

const DELETE_COLLECTION = gql`
    mutation DeleteCollection($id: ID!) {
        deleteCollection(id: $id) {
            result
            message
        }
    }
`;

const GET_PRODUCT_COLLECTIONS = gql`
    query GetProductCollections($id: ID!) {
        product(id: $id) {
            id
            collections {
                id
                name
            }
        }
    }
`;
