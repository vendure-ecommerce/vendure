/* tslint:disable:no-non-null-assertion */
import { ROOT_COLLECTION_NAME } from '@vendure/common/lib/shared-constants';
import {
    DefaultJobQueuePlugin,
    facetValueCollectionFilter,
    variantNameCollectionFilter,
} from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
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
    GetCollectionNestedParents,
    GetCollectionProducts,
    GetCollections,
    GetCollectionsForProducts,
    GetCollectionsWithAssets,
    GetFacetValues,
    GetProductCollections,
    GetProductCollectionsWithParent,
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
import { sortById } from './utils/test-order-utils';

describe('Collection resolver', () => {
    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig,
        plugins: [DefaultJobQueuePlugin],
    });

    let assets: GetAssetList.Items[];
    let facetValues: FacetValueFragment[];
    let electronicsCollection: Collection.Fragment;
    let computersCollection: Collection.Fragment;
    let pearCollection: Collection.Fragment;
    let electronicsBreadcrumbsCollection: Collection.Fragment;
    let computersBreadcrumbsCollection: Collection.Fragment;
    let pearBreadcrumbsCollection: Collection.Fragment;

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
                                    },
                                    {
                                        name: 'containsAny',
                                        value: `false`,
                                    },
                                ],
                            },
                        ],
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'Electronics',
                                description: '',
                                slug: 'electronics',
                            },
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
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'Computers',
                                description: '',
                                slug: 'computers',
                            },
                        ],
                        filters: [
                            {
                                code: facetValueCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'facetValueIds',
                                        value: `["${getFacetValueId('computers')}"]`,
                                    },
                                    {
                                        name: 'containsAny',
                                        value: `false`,
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
                        translations: [
                            { languageCode: LanguageCode.en, name: 'Pear', description: '', slug: 'pear' },
                        ],
                        filters: [
                            {
                                code: facetValueCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'facetValueIds',
                                        value: `["${getFacetValueId('pear')}"]`,
                                    },
                                    {
                                        name: 'containsAny',
                                        value: `false`,
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

        it('slug is normalized to be url-safe', async () => {
            const { createCollection } = await adminClient.query<
                CreateCollection.Mutation,
                CreateCollection.Variables
            >(CREATE_COLLECTION, {
                input: {
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'Accessories',
                            description: '',
                            slug: 'Accessories!',
                        },
                        {
                            languageCode: LanguageCode.de,
                            name: 'Zubehör',
                            description: '',
                            slug: 'Zubehör!',
                        },
                    ],
                    filters: [],
                },
            });

            expect(createCollection.slug).toBe('accessories');
            expect(createCollection.translations.find(t => t.languageCode === LanguageCode.en)?.slug).toBe(
                'accessories',
            );
            expect(createCollection.translations.find(t => t.languageCode === LanguageCode.de)?.slug).toBe(
                'zubehor',
            );
        });

        it('create with duplicate slug is renamed to be unique', async () => {
            const { createCollection } = await adminClient.query<
                CreateCollection.Mutation,
                CreateCollection.Variables
            >(CREATE_COLLECTION, {
                input: {
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'Accessories',
                            description: '',
                            slug: 'Accessories',
                        },
                        {
                            languageCode: LanguageCode.de,
                            name: 'Zubehör',
                            description: '',
                            slug: 'Zubehör',
                        },
                    ],
                    filters: [],
                },
            });

            expect(createCollection.translations.find(t => t.languageCode === LanguageCode.en)?.slug).toBe(
                'accessories-2',
            );
            expect(createCollection.translations.find(t => t.languageCode === LanguageCode.de)?.slug).toBe(
                'zubehor-2',
            );
        });
        it('creates a root collection to became a 1st level collection later #779', async () => {
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
                                        value: `["${getFacetValueId('computers')}"]`,
                                    },
                                    {
                                        name: 'containsAny',
                                        value: `false`,
                                    },
                                ],
                            },
                        ],
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'Computers Breadcrumbs',
                                description: '',
                                slug: 'computers_breadcrumbs',
                            },
                        ],
                    },
                },
            );

            computersBreadcrumbsCollection = result.createCollection;
            expect(computersBreadcrumbsCollection.parent!.name).toBe(ROOT_COLLECTION_NAME);
        });
        it('creates a root collection to be a parent collection for 1st level collection with id greater than child collection #779', async () => {
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
                                    },
                                    {
                                        name: 'containsAny',
                                        value: `false`,
                                    },
                                ],
                            },
                        ],
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'Electronics Breadcrumbs',
                                description: '',
                                slug: 'electronics_breadcrumbs',
                            },
                        ],
                    },
                },
            );

            electronicsBreadcrumbsCollection = result.createCollection;
            expect(electronicsBreadcrumbsCollection.parent!.name).toBe(ROOT_COLLECTION_NAME);
        });
        it('creates a 2nd level nested collection #779', async () => {
            const result = await adminClient.query<CreateCollection.Mutation, CreateCollection.Variables>(
                CREATE_COLLECTION,
                {
                    input: {
                        parentId: computersBreadcrumbsCollection.id,
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'Pear Breadcrumbs',
                                description: '',
                                slug: 'pear_breadcrumbs',
                            },
                        ],
                        filters: [
                            {
                                code: facetValueCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'facetValueIds',
                                        value: `["${getFacetValueId('pear')}"]`,
                                    },
                                    {
                                        name: 'containsAny',
                                        value: `false`,
                                    },
                                ],
                            },
                        ],
                    },
                },
            );
            pearBreadcrumbsCollection = result.createCollection;
            expect(pearBreadcrumbsCollection.parent!.name).toBe(computersBreadcrumbsCollection.name);
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
                    translations: [
                        { languageCode: LanguageCode.en, description: 'Apple stuff ', slug: 'apple-stuff' },
                    ],
                },
            });

            await awaitRunningJobs(adminClient, 5000);
            expect(updateCollection).toMatchSnapshot();

            pearCollection = updateCollection;
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
            await awaitRunningJobs(adminClient, 5000);
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
            await awaitRunningJobs(adminClient, 5000);
            expect(updateCollection.assets).toEqual([]);
            expect(updateCollection.featuredAsset).toBeNull();
        });
    });

    describe('querying', () => {
        it('collection by id', async () => {
            const result = await adminClient.query<GetCollection.Query, GetCollection.Variables>(
                GET_COLLECTION,
                {
                    id: computersCollection.id,
                },
            );
            if (!result.collection) {
                fail(`did not return the collection`);
                return;
            }
            expect(result.collection.id).toBe(computersCollection.id);
        });

        it('collection by slug', async () => {
            const result = await adminClient.query<GetCollection.Query, GetCollection.Variables>(
                GET_COLLECTION,
                {
                    slug: computersCollection.slug,
                },
            );
            if (!result.collection) {
                fail(`did not return the collection`);
                return;
            }
            expect(result.collection.id).toBe(computersCollection.id);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/538
        it('falls back to default language slug', async () => {
            const result = await adminClient.query<GetCollection.Query, GetCollection.Variables>(
                GET_COLLECTION,
                {
                    slug: computersCollection.slug,
                },
                { languageCode: LanguageCode.de },
            );
            if (!result.collection) {
                fail(`did not return the collection`);
                return;
            }
            expect(result.collection.id).toBe(computersCollection.id);
        });

        it(
            'throws if neither id nor slug provided',
            assertThrowsWithMessage(async () => {
                await adminClient.query<GetCollection.Query, GetCollection.Variables>(GET_COLLECTION, {});
            }, 'Either the Collection id or slug must be provided'),
        );

        it(
            'throws if id and slug do not refer to the same Product',
            assertThrowsWithMessage(async () => {
                await adminClient.query<GetCollection.Query, GetCollection.Variables>(GET_COLLECTION, {
                    id: computersCollection.id,
                    slug: pearCollection.slug,
                });
            }, 'The provided id and slug refer to different Collections'),
        );

        it('parent field', async () => {
            const result = await adminClient.query<GetCollection.Query, GetCollection.Variables>(
                GET_COLLECTION,
                {
                    id: computersCollection.id,
                },
            );
            if (!result.collection) {
                fail(`did not return the collection`);
                return;
            }
            expect(result.collection.parent!.name).toBe('Electronics');
        });

        // Tests fix for https://github.com/vendure-ecommerce/vendure/issues/361
        it('parent field resolved by CollectionEntityResolver', async () => {
            const { product } = await adminClient.query<
                GetProductCollectionsWithParent.Query,
                GetProductCollectionsWithParent.Variables
            >(GET_PRODUCT_COLLECTIONS_WITH_PARENT, {
                id: 'T_1',
            });

            expect(product?.collections.length).toBe(6);
            expect(product?.collections.sort(sortById)).toEqual([
                {
                    id: 'T_10',
                    name: 'Pear Breadcrumbs',
                    parent: {
                        id: 'T_8',
                        name: 'Computers Breadcrumbs',
                    },
                },
                {
                    id: 'T_3',
                    name: 'Electronics',
                    parent: {
                        id: 'T_1',
                        name: '__root_collection__',
                    },
                },
                {
                    id: 'T_4',
                    name: 'Computers',
                    parent: {
                        id: 'T_3',
                        name: 'Electronics',
                    },
                },
                {
                    id: 'T_5',
                    name: 'Pear',
                    parent: {
                        id: 'T_4',
                        name: 'Computers',
                    },
                },
                {
                    id: 'T_8',
                    name: 'Computers Breadcrumbs',
                    parent: {
                        id: 'T_1',
                        name: '__root_collection__',
                    },
                },
                {
                    id: 'T_9',
                    name: 'Electronics Breadcrumbs',
                    parent: {
                        id: 'T_1',
                        name: '__root_collection__',
                    },
                },
            ]);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/981
        it('nested parent field in shop API', async () => {
            const { collections } = await shopClient.query<GetCollectionNestedParents.Query>(
                GET_COLLECTION_NESTED_PARENTS,
            );

            expect(collections.items[0].parent?.name).toBe(ROOT_COLLECTION_NAME);
        });

        it('children field', async () => {
            const result = await adminClient.query<GetCollection.Query, GetCollection.Variables>(
                GET_COLLECTION,
                {
                    id: electronicsCollection.id,
                },
            );
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
                { id: 'T_1', name: ROOT_COLLECTION_NAME, slug: ROOT_COLLECTION_NAME },
                {
                    id: electronicsCollection.id,
                    name: electronicsCollection.name,
                    slug: electronicsCollection.slug,
                },
                {
                    id: computersCollection.id,
                    name: computersCollection.name,
                    slug: computersCollection.slug,
                },
                { id: pearCollection.id, name: pearCollection.name, slug: pearCollection.slug },
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
            expect(result.collection.breadcrumbs).toEqual([
                { id: 'T_1', name: ROOT_COLLECTION_NAME, slug: ROOT_COLLECTION_NAME },
            ]);
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

        // https://github.com/vendure-ecommerce/vendure/issues/642
        it('sorting on Collection.productVariants.price', async () => {
            const { collection } = await adminClient.query<GetCollection.Query, GetCollection.Variables>(
                GET_COLLECTION,
                {
                    id: computersCollection.id,
                    variantListOptions: {
                        sort: {
                            price: SortOrder.ASC,
                        },
                    },
                },
            );
            expect(collection!.productVariants.items.map(i => i.price)).toEqual([
                3799,
                5374,
                6900,
                7489,
                7896,
                9299,
                13435,
                14374,
                16994,
                93120,
                94920,
                108720,
                109995,
                129900,
                139900,
                219900,
                229900,
            ]);
        });
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
            await awaitRunningJobs(adminClient, 5000);

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

        it('moves a 1st level collection to a new parent to check breadcrumbs', async () => {
            const result = await adminClient.query<MoveCollection.Mutation, MoveCollection.Variables>(
                MOVE_COLLECTION,
                {
                    input: {
                        collectionId: computersBreadcrumbsCollection.id,
                        parentId: electronicsBreadcrumbsCollection.id,
                        index: 0,
                    },
                },
            );

            expect(result.moveCollection.parent!.id).toBe(electronicsBreadcrumbsCollection.id);

            const positions = await getChildrenOf(electronicsBreadcrumbsCollection.id);
            expect(positions.map(i => i.id)).toEqual([computersBreadcrumbsCollection.id]);
        });

        it('breadcrumbs for collection with ids out of order', async () => {
            const result = await adminClient.query<
                GetCollectionBreadcrumbs.Query,
                GetCollectionBreadcrumbs.Variables
            >(GET_COLLECTION_BREADCRUMBS, {
                id: pearBreadcrumbsCollection.id,
            });
            if (!result.collection) {
                fail(`did not return the collection`);
                return;
            }
            expect(result.collection.breadcrumbs).toEqual([
                { id: 'T_1', name: ROOT_COLLECTION_NAME, slug: ROOT_COLLECTION_NAME },
                {
                    id: electronicsBreadcrumbsCollection.id,
                    name: electronicsBreadcrumbsCollection.name,
                    slug: electronicsBreadcrumbsCollection.slug,
                },
                {
                    id: computersBreadcrumbsCollection.id,
                    name: computersBreadcrumbsCollection.name,
                    slug: computersBreadcrumbsCollection.slug,
                },
                {
                    id: pearBreadcrumbsCollection.id,
                    name: pearBreadcrumbsCollection.name,
                    slug: pearBreadcrumbsCollection.slug,
                },
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
            'throws if attempting to move into a descendant of self',
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
                                    },
                                    {
                                        name: 'term',
                                        value: 'laptop',
                                    },
                                ],
                            },
                        ],
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'Delete Me Parent',
                                description: '',
                                slug: 'delete-me-parent',
                            },
                        ],
                        assetIds: ['T_1'],
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
                            {
                                languageCode: LanguageCode.en,
                                name: 'Delete Me Child',
                                description: '',
                                slug: 'delete-me-child',
                            },
                        ],
                        parentId: collectionToDeleteParent.id,
                        assetIds: ['T_2'],
                    },
                },
            );
            collectionToDeleteChild = result2.createCollection;
            await awaitRunningJobs(adminClient, 5000);
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
                {
                    id: 'T_3',
                    name: 'Electronics',
                },
                {
                    id: 'T_4',
                    name: 'Computers',
                },
                {
                    id: 'T_5',
                    name: 'Pear',
                },
                {
                    id: 'T_8',
                    name: 'Computers Breadcrumbs',
                },
                {
                    id: 'T_9',
                    name: 'Electronics Breadcrumbs',
                },
                {
                    id: 'T_10',
                    name: 'Pear Breadcrumbs',
                },
                {
                    id: 'T_11',
                    name: 'Delete Me Parent',
                },
                {
                    id: 'T_12',
                    name: 'Delete Me Child',
                },
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
                {
                    id: 'T_8',
                    name: 'Computers Breadcrumbs',
                },
                {
                    id: 'T_9',
                    name: 'Electronics Breadcrumbs',
                },
                {
                    id: 'T_10',
                    name: 'Pear Breadcrumbs',
                },
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
                    translations: [
                        { languageCode: LanguageCode.en, name: 'Empty', description: '', slug: 'empty' },
                    ],
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
                            {
                                languageCode: LanguageCode.en,
                                name: 'Photo AND Pear',
                                description: '',
                                slug: 'photo-and-pear',
                            },
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
                                    },
                                    {
                                        name: 'containsAny',
                                        value: `false`,
                                    },
                                ],
                            },
                        ],
                    } as CreateCollectionInput,
                });

                await awaitRunningJobs(adminClient, 5000);
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
                            {
                                languageCode: LanguageCode.en,
                                name: 'Photo OR Pear',
                                description: '',
                                slug: 'photo-or-pear',
                            },
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
                                    },
                                    {
                                        name: 'containsAny',
                                        value: `true`,
                                    },
                                ],
                            },
                        ],
                    } as CreateCollectionInput,
                });

                await awaitRunningJobs(adminClient, 5000);
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
                                slug: 'bell-or-pear',
                            },
                        ],
                        filters: [
                            {
                                code: facetValueCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'facetValueIds',
                                        value: `["${getFacetValueId('pear')}", "${getFacetValueId('bell')}"]`,
                                    },
                                    {
                                        name: 'containsAny',
                                        value: `true`,
                                    },
                                ],
                            },
                        ],
                    } as CreateCollectionInput,
                });

                await awaitRunningJobs(adminClient, 5000);
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
                parentId?: string,
            ): Promise<Collection.Fragment> {
                const { createCollection } = await adminClient.query<
                    CreateCollection.Mutation,
                    CreateCollection.Variables
                >(CREATE_COLLECTION, {
                    input: {
                        parentId,
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: `${operator} ${term}`,
                                description: '',
                                slug: `${operator} ${term}`,
                            },
                        ],
                        filters: [
                            {
                                code: variantNameCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'operator',
                                        value: operator,
                                    },
                                    {
                                        name: 'term',
                                        value: term,
                                    },
                                ],
                            },
                        ],
                    },
                });
                await awaitRunningJobs(adminClient, 5000);
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

            // https://github.com/vendure-ecommerce/vendure/issues/927
            it('nested variantName filter', async () => {
                const parent = await createVariantNameFilteredCollection('contains', 'lap');

                const parentResult = await adminClient.query<
                    GetCollectionProducts.Query,
                    GetCollectionProducts.Variables
                >(GET_COLLECTION_PRODUCT_VARIANTS, {
                    id: parent.id,
                });

                expect(parentResult.collection?.productVariants.items.map(i => i.name)).toEqual([
                    'Laptop 13 inch 8GB',
                    'Laptop 15 inch 8GB',
                    'Laptop 13 inch 16GB',
                    'Laptop 15 inch 16GB',
                ]);

                const child = await createVariantNameFilteredCollection('contains', 'GB', parent.id);

                const childResult = await adminClient.query<
                    GetCollectionProducts.Query,
                    GetCollectionProducts.Variables
                >(GET_COLLECTION_PRODUCT_VARIANTS, {
                    id: child.id,
                });

                expect(childResult.collection?.productVariants.items.map(i => i.name)).toEqual([
                    'Laptop 13 inch 8GB',
                    'Laptop 15 inch 8GB',
                    'Laptop 13 inch 16GB',
                    'Laptop 15 inch 16GB',
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

                await awaitRunningJobs(adminClient, 5000);

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

                await awaitRunningJobs(adminClient, 5000);

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

                await awaitRunningJobs(adminClient, 5000);

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
                        {
                            languageCode: LanguageCode.en,
                            name: 'pear electronics',
                            description: '',
                            slug: 'pear-electronics',
                        },
                    ],
                    filters: [
                        {
                            code: facetValueCollectionFilter.code,
                            arguments: [
                                {
                                    name: 'facetValueIds',
                                    value: `["${getFacetValueId('pear')}"]`,
                                },
                                {
                                    name: 'containsAny',
                                    value: `false`,
                                },
                            ],
                        },
                    ],
                } as CreateCollectionInput,
            });

            await awaitRunningJobs(adminClient, 5000);

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
                {
                    id: 'T_3',
                    name: 'Electronics',
                },
                {
                    id: 'T_5',
                    name: 'Pear',
                },
                {
                    id: 'T_9',
                    name: 'Electronics Breadcrumbs',
                },
                {
                    id: 'T_14',
                    name: 'Photo AND Pear',
                },
                {
                    id: 'T_15',
                    name: 'Photo OR Pear',
                },
                {
                    id: 'T_17',
                    name: 'contains camera',
                },
                {
                    id: 'T_19',
                    name: 'endsWith camera',
                },
                {
                    id: 'T_23',
                    name: 'pear electronics',
                },
            ]);
        });
    });

    describe('productVariants list', () => {
        it('does not list variants from deleted products', async () => {
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

        it('does not list disabled variants in Shop API', async () => {
            await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                UPDATE_PRODUCT_VARIANTS,
                {
                    input: [{ id: 'T_1', enabled: false }],
                },
            );
            await awaitRunningJobs(adminClient, 5000);

            const { collection } = await shopClient.query<
                GetCollectionProducts.Query,
                GetCollectionProducts.Variables
            >(GET_COLLECTION_PRODUCT_VARIANTS, {
                id: pearCollection.id,
            });
            expect(collection!.productVariants.items.map(i => i.id).includes('T_1')).toBe(false);
        });

        it('handles other languages', async () => {
            await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                UPDATE_PRODUCT_VARIANTS,
                {
                    input: [
                        {
                            id: 'T_2',
                            translations: [{ languageCode: LanguageCode.de, name: 'Taschenrechner 15 Zoll' }],
                        },
                    ],
                },
            );
            const { collection } = await shopClient.query<
                GetCollectionProducts.Query,
                GetCollectionProducts.Variables
            >(
                GET_COLLECTION_PRODUCT_VARIANTS,
                {
                    id: pearCollection.id,
                },
                { languageCode: LanguageCode.de },
            );
            expect(collection!.productVariants.items.map(i => i.name)).toEqual([
                'Taschenrechner 15 Zoll',
                'Laptop 13 inch 16GB',
                'Laptop 15 inch 16GB',
                'Gaming PC i7-8700 240GB SSD',
                'Instant Camera',
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

export const GET_COLLECTION = gql`
    query GetCollection($id: ID, $slug: String, $variantListOptions: ProductVariantListOptions) {
        collection(id: $id, slug: $slug) {
            ...Collection
            productVariants(options: $variantListOptions) {
                items {
                    id
                    name
                    price
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
                slug
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

const GET_PRODUCT_COLLECTIONS_WITH_PARENT = gql`
    query GetProductCollectionsWithParent($id: ID!) {
        product(id: $id) {
            id
            collections {
                id
                name
                parent {
                    id
                    name
                }
            }
        }
    }
`;

const GET_COLLECTION_NESTED_PARENTS = gql`
    query GetCollectionNestedParents {
        collections {
            items {
                id
                name
                parent {
                    name
                    parent {
                        name
                        parent {
                            name
                        }
                    }
                }
            }
        }
    }
`;
