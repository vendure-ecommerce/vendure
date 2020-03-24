/* tslint:disable:no-non-null-assertion */
import { ROOT_COLLECTION_NAME } from '@vendure/common/lib/shared-constants';
import { facetValueCollectionFilter, variantNameCollectionFilter } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';
import { pick } from '../../common/lib/pick';

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
    GetCollectionsWithAssets,
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
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';
import { awaitRunningJobs } from './utils/await-running-jobs';

describe('Collection resolver', () => {
    const { server, adminClient } = createTestEnvironment(testConfig);

    let assets: GetAssetList.Items[];
    let facetValues: FacetValueFragment[];
    let electronicsCollection: Collection.Fragment;
    let computersCollection: Collection.Fragment;
    let pearCollection: Collection.Fragment;

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-collections.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
        const assetsResult = await adminClient.query<GetAssetList.Query, GetAssetList.Variables>(
            GET_ASSET_LIST,
            {
                options: {
                    sort: {
                        name: SortOrder.ASC,
                    },
                },
            },
        );
        assets = assetsResult.assets.items;
        const facetValuesResult = await adminClient.query<GetFacetValues.Query>(GET_FACET_VALUES);
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
        const result = await adminClient.query<GetCollectionBreadcrumbs.Query>(GET_COLLECTION_BREADCRUMBS, {
            id: 'T_1',
        });
        expect(result.collection!.breadcrumbs[0].name).toBe(ROOT_COLLECTION_NAME);
    });

    describe('createCollection', () => {
        it('creates a root collection', async () => {
            const result = await adminClient.query<CreateCollection.Mutation, CreateCollection.Variables>(
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

        it('creates a nested collection', async () => {
            const result = await adminClient.query<CreateCollection.Mutation, CreateCollection.Variables>(
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

        it('creates a 2nd level nested collection', async () => {
            const result = await adminClient.query<CreateCollection.Mutation, CreateCollection.Variables>(
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

    describe('updateCollection', () => {
        it('updates with assets', async () => {
            const { updateCollection } = await adminClient.query<
                UpdateCollection.Mutation,
                UpdateCollection.Variables
            >(UPDATE_COLLECTION, {
                input: {
                    id: pearCollection.id,
                    assetIds: [assets[1].id, assets[2].id],
                    featuredAssetId: assets[1].id,
                    translations: [{ languageCode: LanguageCode.en, description: 'Apple stuff ' }],
                },
            });

            expect(updateCollection).toMatchSnapshot();
        });

        it('updating existing assets', async () => {
            const { updateCollection } = await adminClient.query<
                UpdateCollection.Mutation,
                UpdateCollection.Variables
            >(UPDATE_COLLECTION, {
                input: {
                    id: pearCollection.id,
                    assetIds: [assets[3].id, assets[0].id],
                    featuredAssetId: assets[3].id,
                },
            });

            expect(updateCollection.assets.map(a => a.id)).toEqual([assets[3].id, assets[0].id]);
        });

        it('removes all assets', async () => {
            const { updateCollection } = await adminClient.query<
                UpdateCollection.Mutation,
                UpdateCollection.Variables
            >(UPDATE_COLLECTION, {
                input: {
                    id: pearCollection.id,
                    assetIds: [],
                },
            });

            expect(updateCollection.assets).toEqual([]);
            expect(updateCollection.featuredAsset).toBeNull();
        });
    });

    it('collection query', async () => {
        const result = await adminClient.query<GetCollection.Query, GetCollection.Variables>(GET_COLLECTION, {
            id: computersCollection.id,
        });
        if (!result.collection) {
            fail(`did not return the collection`);
            return;
        }
        expect(result.collection.id).toBe(computersCollection.id);
    });

    it('parent field', async () => {
        const result = await adminClient.query<GetCollection.Query, GetCollection.Variables>(GET_COLLECTION, {
            id: computersCollection.id,
        });
        if (!result.collection) {
            fail(`did not return the collection`);
            return;
        }
        expect(result.collection.parent!.name).toBe('Electronics');
    });

    it('children field', async () => {
        const result = await adminClient.query<GetCollection.Query, GetCollection.Variables>(GET_COLLECTION, {
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
        const result = await adminClient.query<
            GetCollectionBreadcrumbs.Query,
            GetCollectionBreadcrumbs.Variables
        >(GET_COLLECTION_BREADCRUMBS, {
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
        const result = await adminClient.query<
            GetCollectionBreadcrumbs.Query,
            GetCollectionBreadcrumbs.Variables
        >(GET_COLLECTION_BREADCRUMBS, {
            id: 'T_1',
        });
        if (!result.collection) {
            fail(`did not return the collection`);
            return;
        }
        expect(result.collection.breadcrumbs).toEqual([{ id: 'T_1', name: ROOT_COLLECTION_NAME }]);
    });

    it('collections.assets', async () => {
        const { collections } = await adminClient.query<GetCollectionsWithAssets.Query>(gql`
            query GetCollectionsWithAssets {
                collections {
                    items {
                        assets {
                            name
                        }
                    }
                }
            }
        `);

        expect(collections.items[0].assets).toBeDefined();
    });

    describe('moveCollection', () => {
        it('moves a collection to a new parent', async () => {
            const result = await adminClient.query<MoveCollection.Mutation, MoveCollection.Variables>(
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
            const result = await adminClient.query<
                GetCollectionProducts.Query,
                GetCollectionProducts.Variables
            >(GET_COLLECTION_PRODUCT_VARIANTS, { id: pearCollection.id });
            expect(result.collection!.productVariants.items.map(i => i.name)).toEqual([
                'Laptop 13 inch 8GB',
                'Laptop 15 inch 8GB',
                'Laptop 13 inch 16GB',
                'Laptop 15 inch 16GB',
                'Instant Camera',
            ]);
        });

        it('alters the position in the current parent 1', async () => {
            await adminClient.query<MoveCollection.Mutation, MoveCollection.Variables>(MOVE_COLLECTION, {
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
            await adminClient.query<MoveCollection.Mutation, MoveCollection.Variables>(MOVE_COLLECTION, {
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
            await adminClient.query<MoveCollection.Mutation, MoveCollection.Variables>(MOVE_COLLECTION, {
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
            await adminClient.query<MoveCollection.Mutation, MoveCollection.Variables>(MOVE_COLLECTION, {
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
                    adminClient.query<MoveCollection.Mutation, MoveCollection.Variables>(MOVE_COLLECTION, {
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
                    adminClient.query<MoveCollection.Mutation, MoveCollection.Variables>(MOVE_COLLECTION, {
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
            const result = await adminClient.query<GetCollections.Query>(GET_COLLECTIONS);
            return result.collections.items.filter(i => i.parent!.id === parentId);
        }
    });

    describe('deleteCollection', () => {
        let collectionToDeleteParent: CreateCollection.CreateCollection;
        let collectionToDeleteChild: CreateCollection.CreateCollection;
        let laptopProductId: string;

        beforeAll(async () => {
            const result1 = await adminClient.query<CreateCollection.Mutation, CreateCollection.Variables>(
                CREATE_COLLECTION,
                {
                    input: {
                        filters: [
                            {
                                code: variantNameCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'operator',
                                        value: 'contains',
                                        type: 'string',
                                    },
                                    {
                                        name: 'term',
                                        value: 'laptop',
                                        type: 'string',
                                    },
                                ],
                            },
                        ],
                        translations: [
                            { languageCode: LanguageCode.en, name: 'Delete Me Parent', description: '' },
                        ],
                    },
                },
            );
            collectionToDeleteParent = result1.createCollection;

            const result2 = await adminClient.query<CreateCollection.Mutation, CreateCollection.Variables>(
                CREATE_COLLECTION,
                {
                    input: {
                        filters: [],
                        translations: [
                            { languageCode: LanguageCode.en, name: 'Delete Me Child', description: '' },
                        ],
                        parentId: collectionToDeleteParent.id,
                    },
                },
            );
            collectionToDeleteChild = result2.createCollection;
        });

        it(
            'throws for invalid collection id',
            assertThrowsWithMessage(async () => {
                await adminClient.query<DeleteCollection.Mutation, DeleteCollection.Variables>(
                    DELETE_COLLECTION,
                    {
                        id: 'T_999',
                    },
                );
            }, "No Collection with the id '999' could be found"),
        );

        it('collection and product related prior to deletion', async () => {
            const { collection } = await adminClient.query<
                GetCollectionProducts.Query,
                GetCollectionProducts.Variables
            >(GET_COLLECTION_PRODUCT_VARIANTS, {
                id: collectionToDeleteParent.id,
            });
            expect(collection!.productVariants.items.map(pick(['name']))).toEqual([
                { name: 'Laptop 13 inch 8GB' },
                { name: 'Laptop 15 inch 8GB' },
                { name: 'Laptop 13 inch 16GB' },
                { name: 'Laptop 15 inch 16GB' },
            ]);

            laptopProductId = collection!.productVariants.items[0].productId;

            const { product } = await adminClient.query<
                GetProductCollections.Query,
                GetProductCollections.Variables
            >(GET_PRODUCT_COLLECTIONS, {
                id: laptopProductId,
            });

            expect(product!.collections).toEqual([
                { id: 'T_3', name: 'Electronics' },
                { id: 'T_4', name: 'Computers' },
                { id: 'T_5', name: 'Pear' },
                { id: 'T_6', name: 'Delete Me Parent' },
                { id: 'T_7', name: 'Delete Me Child' },
            ]);
        });

        it('deleteCollection works', async () => {
            const { deleteCollection } = await adminClient.query<
                DeleteCollection.Mutation,
                DeleteCollection.Variables
            >(DELETE_COLLECTION, {
                id: collectionToDeleteParent.id,
            });

            expect(deleteCollection.result).toBe(DeletionResult.DELETED);
        });

        it('deleted parent collection is null', async () => {
            const { collection } = await adminClient.query<GetCollection.Query, GetCollection.Variables>(
                GET_COLLECTION,
                {
                    id: collectionToDeleteParent.id,
                },
            );
            expect(collection).toBeNull();
        });

        it('deleted child collection is null', async () => {
            const { collection } = await adminClient.query<GetCollection.Query, GetCollection.Variables>(
                GET_COLLECTION,
                {
                    id: collectionToDeleteChild.id,
                },
            );
            expect(collection).toBeNull();
        });

        it('product no longer lists collection', async () => {
            const { product } = await adminClient.query<
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
            const result = await adminClient.query<
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
                const result = await adminClient.query<
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
                const result = await adminClient.query<
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
                const result = await adminClient.query<
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

                await awaitRunningJobs(adminClient);
                const { collection } = await adminClient.query<GetCollection.Query, GetCollection.Variables>(
                    GET_COLLECTION,
                    {
                        id: result.createCollection.id,
                    },
                );

                expect(collection!.productVariants.items.map(i => i.name)).toEqual(['Instant Camera']);
            });

            it('photo OR pear', async () => {
                const result = await adminClient.query<
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

                await awaitRunningJobs(adminClient);
                const { collection } = await adminClient.query<GetCollection.Query, GetCollection.Variables>(
                    GET_COLLECTION,
                    {
                        id: result.createCollection.id,
                    },
                );

                expect(collection!.productVariants.items.map(i => i.name)).toEqual([
                    'Laptop 13 inch 8GB',
                    'Laptop 15 inch 8GB',
                    'Laptop 13 inch 16GB',
                    'Laptop 15 inch 16GB',
                    'Instant Camera',
                    'Camera Lens',
                    'Tripod',
                    'SLR Camera',
                    'Hat',
                ]);
            });

            it('bell OR pear in computers', async () => {
                const result = await adminClient.query<
                    CreateCollectionSelectVariants.Mutation,
                    CreateCollectionSelectVariants.Variables
                >(CREATE_COLLECTION_SELECT_VARIANTS, {
                    input: {
                        parentId: computersCollection.id,
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'Bell OR Pear Computers',
                                description: '',
                            },
                        ],
                        filters: [
                            {
                                code: facetValueCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'facetValueIds',
                                        value: `["${getFacetValueId('pear')}", "${getFacetValueId('bell')}"]`,
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

                await awaitRunningJobs(adminClient);
                const { collection } = await adminClient.query<GetCollection.Query, GetCollection.Variables>(
                    GET_COLLECTION,
                    {
                        id: result.createCollection.id,
                    },
                );

                expect(collection!.productVariants.items.map(i => i.name)).toEqual([
                    'Laptop 13 inch 8GB',
                    'Laptop 15 inch 8GB',
                    'Laptop 13 inch 16GB',
                    'Laptop 15 inch 16GB',
                    'Curvy Monitor 24 inch',
                    'Curvy Monitor 27 inch',
                ]);
            });
        });

        describe('variantName filter', () => {
            async function createVariantNameFilteredCollection(
                operator: string,
                term: string,
            ): Promise<Collection.Fragment> {
                const { createCollection } = await adminClient.query<
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
                                        type: 'string',
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
                await awaitRunningJobs(adminClient);
                return createCollection;
            }

            it('contains operator', async () => {
                const collection = await createVariantNameFilteredCollection('contains', 'camera');

                const result = await adminClient.query<
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

                const result = await adminClient.query<
                    GetCollectionProducts.Query,
                    GetCollectionProducts.Variables
                >(GET_COLLECTION_PRODUCT_VARIANTS, {
                    id: collection.id,
                });
                expect(result.collection!.productVariants.items.map(i => i.name)).toEqual(['Camera Lens']);
            });

            it('endsWith operator', async () => {
                const collection = await createVariantNameFilteredCollection('endsWith', 'camera');

                const result = await adminClient.query<
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

                const result = await adminClient.query<
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
                    'Hat',
                ]);
            });
        });

        describe('re-evaluation of contents on changes', () => {
            let products: GetProductsWithVariantIds.Items[];

            beforeAll(async () => {
                const result = await adminClient.query<GetProductsWithVariantIds.Query>(gql`
                    query GetProductsWithVariantIds {
                        products(options: { sort: { id: ASC } }) {
                            items {
                                id
                                name
                                variants {
                                    id
                                    name
                                }
                            }
                        }
                    }
                `);
                products = result.products.items;
            });

            it('updates contents when Product is updated', async () => {
                await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                    input: {
                        id: products[1].id,
                        facetValueIds: [
                            getFacetValueId('electronics'),
                            getFacetValueId('computers'),
                            getFacetValueId('pear'),
                        ],
                    },
                });

                await awaitRunningJobs(adminClient);

                const result = await adminClient.query<
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
                const gamingPc240GB = products
                    .find(p => p.name === 'Gaming PC')!
                    .variants.find(v => v.name.includes('240GB'))!;
                await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                    UPDATE_PRODUCT_VARIANTS,
                    {
                        input: [
                            {
                                id: gamingPc240GB.id,
                                facetValueIds: [getFacetValueId('pear')],
                            },
                        ],
                    },
                );

                await awaitRunningJobs(adminClient);

                const result = await adminClient.query<
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
                const gamingPc240GB = products
                    .find(p => p.name === 'Gaming PC')!
                    .variants.find(v => v.name.includes('240GB'))!;
                await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                    UPDATE_PRODUCT_VARIANTS,
                    {
                        input: [
                            {
                                id: gamingPc240GB.id,
                                facetValueIds: [getFacetValueId('electronics'), getFacetValueId('pear')],
                            },
                        ],
                    },
                );

                await awaitRunningJobs(adminClient);

                const result = await adminClient.query<
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

        it('filter inheritance of nested collections (issue #158)', async () => {
            const a = 1;
            const { createCollection: pearElectronics } = await adminClient.query<
                CreateCollectionSelectVariants.Mutation,
                CreateCollectionSelectVariants.Variables
            >(CREATE_COLLECTION_SELECT_VARIANTS, {
                input: {
                    parentId: electronicsCollection.id,
                    translations: [
                        { languageCode: LanguageCode.en, name: 'pear electronics', description: '' },
                    ],
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
                } as CreateCollectionInput,
            });

            await awaitRunningJobs(adminClient);

            const result = await adminClient.query<
                GetCollectionProducts.Query,
                GetCollectionProducts.Variables
            >(GET_COLLECTION_PRODUCT_VARIANTS, { id: pearElectronics.id });
            expect(result.collection!.productVariants.items.map(i => i.name)).toEqual([
                'Laptop 13 inch 8GB',
                'Laptop 15 inch 8GB',
                'Laptop 13 inch 16GB',
                'Laptop 15 inch 16GB',
                'Curvy Monitor 24 inch',
                'Curvy Monitor 27 inch',
                'Gaming PC i7-8700 240GB SSD',
                'Instant Camera',
                // no "Hat"
            ]);
        });
    });

    describe('Product collections property', () => {
        it('returns all collections to which the Product belongs', async () => {
            const result = await adminClient.query<
                GetCollectionsForProducts.Query,
                GetCollectionsForProducts.Variables
            >(GET_COLLECTIONS_FOR_PRODUCTS, { term: 'camera' });
            expect(result.products.items[0].collections).toEqual([
                { id: 'T_3', name: 'Electronics' },
                { id: 'T_5', name: 'Pear' },
                { id: 'T_9', name: 'Photo AND Pear' },
                { id: 'T_10', name: 'Photo OR Pear' },
                { id: 'T_12', name: 'contains camera' },
                { id: 'T_14', name: 'endsWith camera' },
                { id: 'T_16', name: 'pear electronics' },
            ]);
        });
    });

    it('collection does not list deleted products', async () => {
        await adminClient.query<DeleteProduct.Mutation, DeleteProduct.Variables>(DELETE_PRODUCT, {
            id: 'T_2', // curvy monitor
        });
        const { collection } = await adminClient.query<
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
            productVariants {
                items {
                    id
                    name
                }
            }
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
            productVariants(options: { sort: { id: ASC } }) {
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
            id
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
