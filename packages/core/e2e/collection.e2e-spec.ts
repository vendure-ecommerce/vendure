/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ROOT_COLLECTION_NAME } from '@vendure/common/lib/shared-constants';
import {
    DefaultJobQueuePlugin,
    facetValueCollectionFilter,
    productIdCollectionFilter,
    variantIdCollectionFilter,
    variantNameCollectionFilter,
} from '@vendure/core';
import { createTestEnvironment, E2E_DEFAULT_CHANNEL_TOKEN } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';
import { pick } from '../../common/lib/pick';

import { COLLECTION_FRAGMENT, FACET_VALUE_FRAGMENT } from './graphql/fragments';
import * as Codegen from './graphql/generated-e2e-admin-types';
import {
    ChannelFragment,
    CollectionFragment,
    CurrencyCode,
    DeletionResult,
    FacetValueFragment,
    LanguageCode,
    SortOrder,
} from './graphql/generated-e2e-admin-types';
import {
    ASSIGN_COLLECTIONS_TO_CHANNEL,
    CREATE_CHANNEL,
    CREATE_COLLECTION,
    DELETE_PRODUCT,
    DELETE_PRODUCT_VARIANT,
    GET_ASSET_LIST,
    GET_COLLECTION,
    GET_COLLECTIONS,
    UPDATE_COLLECTION,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
} from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';
import { awaitRunningJobs } from './utils/await-running-jobs';
import { sortById } from './utils/test-order-utils';

describe('Collection resolver', () => {
    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig(),
        plugins: [DefaultJobQueuePlugin],
    });

    let assets: Codegen.GetAssetListQuery['assets']['items'];
    let facetValues: FacetValueFragment[];
    let electronicsCollection: CollectionFragment;
    let computersCollection: CollectionFragment;
    let pearCollection: CollectionFragment;
    let electronicsBreadcrumbsCollection: CollectionFragment;
    let computersBreadcrumbsCollection: CollectionFragment;
    let pearBreadcrumbsCollection: CollectionFragment;
    const SECOND_CHANNEL_TOKEN = 'second_channel_token';
    let secondChannel: ChannelFragment;

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-collections.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
        const assetsResult = await adminClient.query<
            Codegen.GetAssetListQuery,
            Codegen.GetAssetListQueryVariables
        >(GET_ASSET_LIST, {
            options: {
                sort: {
                    name: SortOrder.ASC,
                },
            },
        });
        assets = assetsResult.assets.items;
        const facetValuesResult = await adminClient.query<Codegen.GetFacetValuesQuery>(GET_FACET_VALUES);
        facetValues = facetValuesResult.facets.items.reduce(
            (values, facet) => [...values, ...facet.values],
            [] as FacetValueFragment[],
        );
        const { createChannel } = await adminClient.query<
            Codegen.CreateChannelMutation,
            Codegen.CreateChannelMutationVariables
        >(CREATE_CHANNEL, {
            input: {
                code: 'second-channel',
                token: SECOND_CHANNEL_TOKEN,
                defaultLanguageCode: LanguageCode.en,
                currencyCode: CurrencyCode.USD,
                pricesIncludeTax: true,
                defaultShippingZoneId: 'T_1',
                defaultTaxZoneId: 'T_1',
            },
        });
        secondChannel = createChannel;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    /**
     * Test case for https://github.com/vendure-ecommerce/vendure/issues/97
     */
    it('collection breadcrumbs works after bootstrap', async () => {
        const result = await adminClient.query<Codegen.GetCollectionBreadcrumbsQuery>(
            GET_COLLECTION_BREADCRUMBS,
            {
                id: 'T_1',
            },
        );
        expect(result.collection!.breadcrumbs[0].name).toBe(ROOT_COLLECTION_NAME);
    });

    describe('createCollection', () => {
        it('creates a root collection', async () => {
            const result = await adminClient.query<
                Codegen.CreateCollectionMutation,
                Codegen.CreateCollectionMutationVariables
            >(CREATE_COLLECTION, {
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
                                    value: 'false',
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
            });

            electronicsCollection = result.createCollection;
            expect(electronicsCollection).toMatchSnapshot();
            expect(electronicsCollection.parent!.name).toBe(ROOT_COLLECTION_NAME);
        });

        it('creates a nested collection', async () => {
            const result = await adminClient.query<
                Codegen.CreateCollectionMutation,
                Codegen.CreateCollectionMutationVariables
            >(CREATE_COLLECTION, {
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
                                    value: 'false',
                                },
                            ],
                        },
                    ],
                },
            });
            computersCollection = result.createCollection;
            expect(computersCollection.parent!.name).toBe(electronicsCollection.name);
        });

        it('creates a 2nd level nested collection', async () => {
            const result = await adminClient.query<
                Codegen.CreateCollectionMutation,
                Codegen.CreateCollectionMutationVariables
            >(CREATE_COLLECTION, {
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
                                    value: 'false',
                                },
                            ],
                        },
                    ],
                },
            });
            pearCollection = result.createCollection;
            expect(pearCollection.parent!.name).toBe(computersCollection.name);
        });

        it('slug is normalized to be url-safe', async () => {
            const { createCollection } = await adminClient.query<
                Codegen.CreateCollectionMutation,
                Codegen.CreateCollectionMutationVariables
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
                'zubehoer',
            );
        });

        it('create with duplicate slug is renamed to be unique', async () => {
            const { createCollection } = await adminClient.query<
                Codegen.CreateCollectionMutation,
                Codegen.CreateCollectionMutationVariables
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
                'zubehoer-2',
            );
        });

        it('creates the duplicate slug without suffix in another channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { createCollection } = await adminClient.query<
                Codegen.CreateCollectionMutation,
                Codegen.CreateCollectionMutationVariables
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
                'accessories',
            );
            expect(createCollection.translations.find(t => t.languageCode === LanguageCode.de)?.slug).toBe(
                'zubehoer',
            );
        });

        it('creates a root collection to become a 1st level collection later #779', async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const result = await adminClient.query<
                Codegen.CreateCollectionMutation,
                Codegen.CreateCollectionMutationVariables
            >(CREATE_COLLECTION, {
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
                                    value: 'false',
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
            });

            computersBreadcrumbsCollection = result.createCollection;
            expect(computersBreadcrumbsCollection.parent!.name).toBe(ROOT_COLLECTION_NAME);
        });
        it('creates a root collection to be a parent collection for 1st level collection with id greater than child collection #779', async () => {
            const result = await adminClient.query<
                Codegen.CreateCollectionMutation,
                Codegen.CreateCollectionMutationVariables
            >(CREATE_COLLECTION, {
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
                                    value: 'false',
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
            });

            electronicsBreadcrumbsCollection = result.createCollection;
            expect(electronicsBreadcrumbsCollection.parent!.name).toBe(ROOT_COLLECTION_NAME);
        });
        it('creates a 2nd level nested collection #779', async () => {
            const result = await adminClient.query<
                Codegen.CreateCollectionMutation,
                Codegen.CreateCollectionMutationVariables
            >(CREATE_COLLECTION, {
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
                                    value: 'false',
                                },
                            ],
                        },
                    ],
                },
            });
            pearBreadcrumbsCollection = result.createCollection;
            expect(pearBreadcrumbsCollection.parent!.name).toBe(computersBreadcrumbsCollection.name);
        });
    });

    describe('updateCollection', () => {
        it('updates with assets', async () => {
            const { updateCollection } = await adminClient.query<
                Codegen.UpdateCollectionMutation,
                Codegen.UpdateCollectionMutationVariables
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
                Codegen.UpdateCollectionMutation,
                Codegen.UpdateCollectionMutationVariables
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
                Codegen.UpdateCollectionMutation,
                Codegen.UpdateCollectionMutationVariables
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
            const result = await adminClient.query<
                Codegen.GetCollectionQuery,
                Codegen.GetCollectionQueryVariables
            >(GET_COLLECTION, {
                id: computersCollection.id,
            });
            if (!result.collection) {
                fail('did not return the collection');
                return;
            }
            expect(result.collection.id).toBe(computersCollection.id);
        });

        it('collection by slug', async () => {
            const result = await adminClient.query<
                Codegen.GetCollectionQuery,
                Codegen.GetCollectionQueryVariables
            >(GET_COLLECTION, {
                slug: computersCollection.slug,
            });
            if (!result.collection) {
                fail('did not return the collection');
                return;
            }
            expect(result.collection.id).toBe(computersCollection.id);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/538
        it('falls back to default language slug', async () => {
            const result = await adminClient.query<
                Codegen.GetCollectionQuery,
                Codegen.GetCollectionQueryVariables
            >(
                GET_COLLECTION,
                {
                    slug: computersCollection.slug,
                },
                { languageCode: LanguageCode.de },
            );
            if (!result.collection) {
                fail('did not return the collection');
                return;
            }
            expect(result.collection.id).toBe(computersCollection.id);
        });

        it(
            'throws if neither id nor slug provided',
            assertThrowsWithMessage(async () => {
                await adminClient.query<Codegen.GetCollectionQuery, Codegen.GetCollectionQueryVariables>(
                    GET_COLLECTION,
                    {},
                );
            }, 'Either the Collection id or slug must be provided'),
        );

        it(
            'throws if id and slug do not refer to the same Product',
            assertThrowsWithMessage(async () => {
                await adminClient.query<Codegen.GetCollectionQuery, Codegen.GetCollectionQueryVariables>(
                    GET_COLLECTION,
                    {
                        id: computersCollection.id,
                        slug: pearCollection.slug,
                    },
                );
            }, 'The provided id and slug refer to different Collections'),
        );

        it('parent field', async () => {
            const result = await adminClient.query<
                Codegen.GetCollectionQuery,
                Codegen.GetCollectionQueryVariables
            >(GET_COLLECTION, {
                id: computersCollection.id,
            });
            if (!result.collection) {
                fail('did not return the collection');
                return;
            }
            expect(result.collection.parent!.name).toBe('Electronics');
        });

        // Tests fix for https://github.com/vendure-ecommerce/vendure/issues/361
        it('parent field resolved by CollectionEntityResolver', async () => {
            const { product } = await adminClient.query<
                Codegen.GetProductCollectionsWithParentQuery,
                Codegen.GetProductCollectionsWithParentQueryVariables
            >(GET_PRODUCT_COLLECTIONS_WITH_PARENT, {
                id: 'T_1',
            });

            expect(product?.collections.length).toBe(6);
            expect(product?.collections.sort(sortById)).toEqual([
                {
                    id: 'T_10',
                    name: 'Electronics Breadcrumbs',
                    parent: {
                        id: 'T_1',
                        name: '__root_collection__',
                    },
                },
                {
                    id: 'T_11',
                    name: 'Pear Breadcrumbs',
                    parent: {
                        id: 'T_9',
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
                    id: 'T_9',
                    name: 'Computers Breadcrumbs',
                    parent: {
                        id: 'T_1',
                        name: '__root_collection__',
                    },
                },
            ]);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/981
        it('nested parent field in shop API', async () => {
            const { collections } = await shopClient.query<Codegen.GetCollectionNestedParentsQuery>(
                GET_COLLECTION_NESTED_PARENTS,
            );

            expect(collections.items[0].parent?.name).toBe(ROOT_COLLECTION_NAME);
        });

        it('children field', async () => {
            const result = await adminClient.query<
                Codegen.GetCollectionQuery,
                Codegen.GetCollectionQueryVariables
            >(GET_COLLECTION, {
                id: electronicsCollection.id,
            });
            if (!result.collection) {
                fail('did not return the collection');
                return;
            }
            expect(result.collection.children!.length).toBe(1);
            expect(result.collection.children![0].name).toBe('Computers');
        });

        it('breadcrumbs', async () => {
            const result = await adminClient.query<
                Codegen.GetCollectionBreadcrumbsQuery,
                Codegen.GetCollectionBreadcrumbsQueryVariables
            >(GET_COLLECTION_BREADCRUMBS, {
                id: pearCollection.id,
            });
            if (!result.collection) {
                fail('did not return the collection');
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
                Codegen.GetCollectionBreadcrumbsQuery,
                Codegen.GetCollectionBreadcrumbsQueryVariables
            >(GET_COLLECTION_BREADCRUMBS, {
                id: 'T_1',
            });
            if (!result.collection) {
                fail('did not return the collection');
                return;
            }
            expect(result.collection.breadcrumbs).toEqual([
                { id: 'T_1', name: ROOT_COLLECTION_NAME, slug: ROOT_COLLECTION_NAME },
            ]);
        });

        it('collections.assets', async () => {
            const { collections } = await adminClient.query<Codegen.GetCollectionsWithAssetsQuery>(gql`
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
            const { collection } = await adminClient.query<
                Codegen.GetCollectionQuery,
                Codegen.GetCollectionQueryVariables
            >(GET_COLLECTION, {
                id: computersCollection.id,
                variantListOptions: {
                    sort: {
                        price: SortOrder.ASC,
                    },
                },
            });
            expect(collection!.productVariants.items.map(i => i.price)).toEqual([
                3799, 5374, 6900, 7489, 7896, 9299, 13435, 14374, 16994, 93120, 94920, 108720, 109995, 129900,
                139900, 219900, 229900,
            ]);
        });
    });

    describe('moveCollection', () => {
        it('moves a collection to a new parent', async () => {
            const result = await adminClient.query<
                Codegen.MoveCollectionMutation,
                Codegen.MoveCollectionMutationVariables
            >(MOVE_COLLECTION, {
                input: {
                    collectionId: pearCollection.id,
                    parentId: electronicsCollection.id,
                    index: 0,
                },
            });

            expect(result.moveCollection.parent!.id).toBe(electronicsCollection.id);

            const positions = await getChildrenOf(electronicsCollection.id);
            expect(positions.map(i => i.id)).toEqual([pearCollection.id, computersCollection.id]);
        });

        it('re-evaluates Collection contents on move', async () => {
            await awaitRunningJobs(adminClient, 5000);

            const result = await adminClient.query<
                Codegen.GetCollectionProductsQuery,
                Codegen.GetCollectionProductsQueryVariables
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
            const result = await adminClient.query<
                Codegen.MoveCollectionMutation,
                Codegen.MoveCollectionMutationVariables
            >(MOVE_COLLECTION, {
                input: {
                    collectionId: computersBreadcrumbsCollection.id,
                    parentId: electronicsBreadcrumbsCollection.id,
                    index: 0,
                },
            });

            expect(result.moveCollection.parent!.id).toBe(electronicsBreadcrumbsCollection.id);

            const positions = await getChildrenOf(electronicsBreadcrumbsCollection.id);
            expect(positions.map(i => i.id)).toEqual([computersBreadcrumbsCollection.id]);
        });

        it('breadcrumbs for collection with ids out of order', async () => {
            const result = await adminClient.query<
                Codegen.GetCollectionBreadcrumbsQuery,
                Codegen.GetCollectionBreadcrumbsQueryVariables
            >(GET_COLLECTION_BREADCRUMBS, {
                id: pearBreadcrumbsCollection.id,
            });
            if (!result.collection) {
                fail('did not return the collection');
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
            await adminClient.query<Codegen.MoveCollectionMutation, Codegen.MoveCollectionMutationVariables>(
                MOVE_COLLECTION,
                {
                    input: {
                        collectionId: computersCollection.id,
                        parentId: electronicsCollection.id,
                        index: 0,
                    },
                },
            );

            const afterResult = await getChildrenOf(electronicsCollection.id);
            expect(afterResult.map(i => i.id)).toEqual([computersCollection.id, pearCollection.id]);
        });

        it('alters the position in the current parent 2', async () => {
            await adminClient.query<Codegen.MoveCollectionMutation, Codegen.MoveCollectionMutationVariables>(
                MOVE_COLLECTION,
                {
                    input: {
                        collectionId: pearCollection.id,
                        parentId: electronicsCollection.id,
                        index: 0,
                    },
                },
            );

            const afterResult = await getChildrenOf(electronicsCollection.id);
            expect(afterResult.map(i => i.id)).toEqual([pearCollection.id, computersCollection.id]);
        });

        it('corrects an out-of-bounds negative index value', async () => {
            await adminClient.query<Codegen.MoveCollectionMutation, Codegen.MoveCollectionMutationVariables>(
                MOVE_COLLECTION,
                {
                    input: {
                        collectionId: pearCollection.id,
                        parentId: electronicsCollection.id,
                        index: -3,
                    },
                },
            );

            const afterResult = await getChildrenOf(electronicsCollection.id);
            expect(afterResult.map(i => i.id)).toEqual([pearCollection.id, computersCollection.id]);
        });

        it('corrects an out-of-bounds positive index value', async () => {
            await adminClient.query<Codegen.MoveCollectionMutation, Codegen.MoveCollectionMutationVariables>(
                MOVE_COLLECTION,
                {
                    input: {
                        collectionId: pearCollection.id,
                        parentId: electronicsCollection.id,
                        index: 10,
                    },
                },
            );

            const afterResult = await getChildrenOf(electronicsCollection.id);
            expect(afterResult.map(i => i.id)).toEqual([computersCollection.id, pearCollection.id]);
        });

        it(
            'throws if attempting to move into self',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<
                        Codegen.MoveCollectionMutation,
                        Codegen.MoveCollectionMutationVariables
                    >(MOVE_COLLECTION, {
                        input: {
                            collectionId: pearCollection.id,
                            parentId: pearCollection.id,
                            index: 0,
                        },
                    }),
                'Cannot move a Collection into itself',
            ),
        );

        it(
            'throws if attempting to move into a descendant of self',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<
                        Codegen.MoveCollectionMutation,
                        Codegen.MoveCollectionMutationVariables
                    >(MOVE_COLLECTION, {
                        input: {
                            collectionId: pearCollection.id,
                            parentId: pearCollection.id,
                            index: 0,
                        },
                    }),
                'Cannot move a Collection into itself',
            ),
        );

        // https://github.com/vendure-ecommerce/vendure/issues/1595
        it('children correctly ordered', async () => {
            await adminClient.query<Codegen.MoveCollectionMutation, Codegen.MoveCollectionMutationVariables>(
                MOVE_COLLECTION,
                {
                    input: {
                        collectionId: computersCollection.id,
                        parentId: 'T_1',
                        index: 4,
                    },
                },
            );
            const result = await adminClient.query<
                Codegen.GetCollectionQuery,
                Codegen.GetCollectionQueryVariables
            >(GET_COLLECTION, {
                id: 'T_1',
            });
            if (!result.collection) {
                fail('did not return the collection');
                return;
            }
            expect(result.collection.children?.map(c => (c as any).position)).toEqual([0, 1, 2, 3, 4, 5, 6]);
        });

        async function getChildrenOf(parentId: string): Promise<Array<{ name: string; id: string }>> {
            const result = await adminClient.query<Codegen.GetCollectionsQuery>(GET_COLLECTIONS);
            return result.collections.items.filter(i => i.parent!.id === parentId);
        }
    });

    describe('deleteCollection', () => {
        let collectionToDeleteParent: Codegen.CreateCollectionMutation['createCollection'];
        let collectionToDeleteChild: Codegen.CreateCollectionMutation['createCollection'];
        let laptopProductId: string;

        beforeAll(async () => {
            const result1 = await adminClient.query<
                Codegen.CreateCollectionMutation,
                Codegen.CreateCollectionMutationVariables
            >(CREATE_COLLECTION, {
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
            });
            collectionToDeleteParent = result1.createCollection;

            const result2 = await adminClient.query<
                Codegen.CreateCollectionMutation,
                Codegen.CreateCollectionMutationVariables
            >(CREATE_COLLECTION, {
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
            });
            collectionToDeleteChild = result2.createCollection;
            await awaitRunningJobs(adminClient, 5000);
        });

        it(
            'throws for invalid collection id',
            assertThrowsWithMessage(async () => {
                await adminClient.query<
                    Codegen.DeleteCollectionMutation,
                    Codegen.DeleteCollectionMutationVariables
                >(DELETE_COLLECTION, {
                    id: 'T_999',
                });
            }, 'No Collection with the id "999" could be found'),
        );

        it('collection and product related prior to deletion', async () => {
            const { collection } = await adminClient.query<
                Codegen.GetCollectionProductsQuery,
                Codegen.GetCollectionProductsQueryVariables
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
                Codegen.GetProductCollectionsQuery,
                Codegen.GetProductCollectionsQueryVariables
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
                    id: 'T_9',
                    name: 'Computers Breadcrumbs',
                },
                {
                    id: 'T_10',
                    name: 'Electronics Breadcrumbs',
                },
                {
                    id: 'T_11',
                    name: 'Pear Breadcrumbs',
                },
                {
                    id: 'T_12',
                    name: 'Delete Me Parent',
                },
                {
                    id: 'T_13',
                    name: 'Delete Me Child',
                },
            ]);
        });

        it('deleteCollection works', async () => {
            const { deleteCollection } = await adminClient.query<
                Codegen.DeleteCollectionMutation,
                Codegen.DeleteCollectionMutationVariables
            >(DELETE_COLLECTION, {
                id: collectionToDeleteParent.id,
            });

            expect(deleteCollection.result).toBe(DeletionResult.DELETED);
        });

        it('deleted parent collection is null', async () => {
            const { collection } = await adminClient.query<
                Codegen.GetCollectionQuery,
                Codegen.GetCollectionQueryVariables
            >(GET_COLLECTION, {
                id: collectionToDeleteParent.id,
            });
            expect(collection).toBeNull();
        });

        it('deleted child collection is null', async () => {
            const { collection } = await adminClient.query<
                Codegen.GetCollectionQuery,
                Codegen.GetCollectionQueryVariables
            >(GET_COLLECTION, {
                id: collectionToDeleteChild.id,
            });
            expect(collection).toBeNull();
        });

        it('product no longer lists collection', async () => {
            const { product } = await adminClient.query<
                Codegen.GetProductCollectionsQuery,
                Codegen.GetProductCollectionsQueryVariables
            >(GET_PRODUCT_COLLECTIONS, {
                id: laptopProductId,
            });

            expect(product!.collections).toEqual([
                { id: 'T_3', name: 'Electronics' },
                { id: 'T_4', name: 'Computers' },
                { id: 'T_5', name: 'Pear' },
                {
                    id: 'T_9',
                    name: 'Computers Breadcrumbs',
                },
                {
                    id: 'T_10',
                    name: 'Electronics Breadcrumbs',
                },
                {
                    id: 'T_11',
                    name: 'Pear Breadcrumbs',
                },
            ]);
        });
    });

    describe('filters', () => {
        it('Collection with no filters has no productVariants', async () => {
            const result = await adminClient.query<
                Codegen.CreateCollectionSelectVariantsMutation,
                Codegen.CreateCollectionSelectVariantsMutationVariables
            >(CREATE_COLLECTION_SELECT_VARIANTS, {
                input: {
                    translations: [
                        { languageCode: LanguageCode.en, name: 'Empty', description: '', slug: 'empty' },
                    ],
                    filters: [],
                } as Codegen.CreateCollectionInput,
            });
            expect(result.createCollection.productVariants.totalItems).toBe(0);
        });

        describe('facetValue filter', () => {
            it('electronics', async () => {
                const result = await adminClient.query<
                    Codegen.GetCollectionProductsQuery,
                    Codegen.GetCollectionProductsQueryVariables
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
                    Codegen.GetCollectionProductsQuery,
                    Codegen.GetCollectionProductsQueryVariables
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
                    Codegen.CreateCollectionSelectVariantsMutation,
                    Codegen.CreateCollectionSelectVariantsMutationVariables
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
                                        value: 'false',
                                    },
                                ],
                            },
                        ],
                    } as Codegen.CreateCollectionInput,
                });

                await awaitRunningJobs(adminClient, 5000);
                const { collection } = await adminClient.query<
                    Codegen.GetCollectionQuery,
                    Codegen.GetCollectionQueryVariables
                >(GET_COLLECTION, {
                    id: result.createCollection.id,
                });

                expect(collection!.productVariants.items.map(i => i.name)).toEqual(['Instant Camera']);
            });

            it('photo OR pear', async () => {
                const result = await adminClient.query<
                    Codegen.CreateCollectionSelectVariantsMutation,
                    Codegen.CreateCollectionSelectVariantsMutationVariables
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
                                        value: 'true',
                                    },
                                ],
                            },
                        ],
                    } as Codegen.CreateCollectionInput,
                });

                await awaitRunningJobs(adminClient, 5000);
                const { collection } = await adminClient.query<
                    Codegen.GetCollectionQuery,
                    Codegen.GetCollectionQueryVariables
                >(GET_COLLECTION, {
                    id: result.createCollection.id,
                });

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
                    Codegen.CreateCollectionSelectVariantsMutation,
                    Codegen.CreateCollectionSelectVariantsMutationVariables
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
                                        value: 'true',
                                    },
                                ],
                            },
                        ],
                    } as Codegen.CreateCollectionInput,
                });

                await awaitRunningJobs(adminClient, 5000);
                const { collection } = await adminClient.query<
                    Codegen.GetCollectionQuery,
                    Codegen.GetCollectionQueryVariables
                >(GET_COLLECTION, {
                    id: result.createCollection.id,
                });

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
            ): Promise<CollectionFragment> {
                const { createCollection } = await adminClient.query<
                    Codegen.CreateCollectionMutation,
                    Codegen.CreateCollectionMutationVariables
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
                    Codegen.GetCollectionProductsQuery,
                    Codegen.GetCollectionProductsQueryVariables
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
                    Codegen.GetCollectionProductsQuery,
                    Codegen.GetCollectionProductsQueryVariables
                >(GET_COLLECTION_PRODUCT_VARIANTS, {
                    id: collection.id,
                });
                expect(result.collection!.productVariants.items.map(i => i.name)).toEqual(['Camera Lens']);
            });

            it('endsWith operator', async () => {
                const collection = await createVariantNameFilteredCollection('endsWith', 'camera');

                const result = await adminClient.query<
                    Codegen.GetCollectionProductsQuery,
                    Codegen.GetCollectionProductsQueryVariables
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
                    Codegen.GetCollectionProductsQuery,
                    Codegen.GetCollectionProductsQueryVariables
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
                    'Boots',
                ]);
            });

            // https://github.com/vendure-ecommerce/vendure/issues/927
            it('nested variantName filter', async () => {
                const parent = await createVariantNameFilteredCollection('contains', 'lap');

                const parentResult = await adminClient.query<
                    Codegen.GetCollectionProductsQuery,
                    Codegen.GetCollectionProductsQueryVariables
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
                    Codegen.GetCollectionProductsQuery,
                    Codegen.GetCollectionProductsQueryVariables
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

        describe('variantId filter', () => {
            it('contains expects variants', async () => {
                const { createCollection } = await adminClient.query<
                    Codegen.CreateCollectionMutation,
                    Codegen.CreateCollectionMutationVariables
                >(CREATE_COLLECTION, {
                    input: {
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'variantId filter test',
                                description: '',
                                slug: 'variantId-filter-test',
                            },
                        ],
                        filters: [
                            {
                                code: variantIdCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'variantIds',
                                        value: '["T_1", "T_4"]',
                                    },
                                ],
                            },
                        ],
                    },
                });
                await awaitRunningJobs(adminClient, 5000);

                const result = await adminClient.query<
                    Codegen.GetCollectionProductsQuery,
                    Codegen.GetCollectionProductsQueryVariables
                >(GET_COLLECTION_PRODUCT_VARIANTS, {
                    id: createCollection.id,
                });
                expect(result.collection!.productVariants.items.map(i => i.id).sort()).toEqual([
                    'T_1',
                    'T_4',
                ]);
            });
        });

        describe('productId filter', () => {
            it('contains expects variants', async () => {
                const { createCollection } = await adminClient.query<
                    Codegen.CreateCollectionMutation,
                    Codegen.CreateCollectionMutationVariables
                >(CREATE_COLLECTION, {
                    input: {
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'productId filter test',
                                description: '',
                                slug: 'productId-filter-test',
                            },
                        ],
                        filters: [
                            {
                                code: productIdCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'productIds',
                                        value: '["T_2"]',
                                    },
                                ],
                            },
                        ],
                    },
                });
                await awaitRunningJobs(adminClient, 5000);

                const result = await adminClient.query<
                    Codegen.GetCollectionProductsQuery,
                    Codegen.GetCollectionProductsQueryVariables
                >(GET_COLLECTION_PRODUCT_VARIANTS, {
                    id: createCollection.id,
                });
                expect(result.collection!.productVariants.items.map(i => i.id).sort()).toEqual([
                    'T_5',
                    'T_6',
                ]);
            });
        });

        describe('re-evaluation of contents on changes', () => {
            let products: Codegen.GetProductsWithVariantIdsQuery['products']['items'];

            beforeAll(async () => {
                const result = await adminClient.query<Codegen.GetProductsWithVariantIdsQuery>(gql`
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
                await adminClient.query<
                    Codegen.UpdateProductMutation,
                    Codegen.UpdateProductMutationVariables
                >(UPDATE_PRODUCT, {
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
                    Codegen.GetCollectionProductsQuery,
                    Codegen.GetCollectionProductsQueryVariables
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
                await adminClient.query<
                    Codegen.UpdateProductVariantsMutation,
                    Codegen.UpdateProductVariantsMutationVariables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            id: gamingPc240GB.id,
                            facetValueIds: [getFacetValueId('pear')],
                        },
                    ],
                });

                await awaitRunningJobs(adminClient, 5000);

                const result = await adminClient.query<
                    Codegen.GetCollectionProductsQuery,
                    Codegen.GetCollectionProductsQueryVariables
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
                await adminClient.query<
                    Codegen.UpdateProductVariantsMutation,
                    Codegen.UpdateProductVariantsMutationVariables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            id: gamingPc240GB.id,
                            facetValueIds: [getFacetValueId('electronics'), getFacetValueId('pear')],
                        },
                    ],
                });

                await awaitRunningJobs(adminClient, 5000);

                const result = await adminClient.query<
                    Codegen.GetCollectionProductsQuery,
                    Codegen.GetCollectionProductsQueryVariables
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

        describe('filter inheritance', () => {
            let clothesCollectionId: string;

            it('filter inheritance of nested collections (issue #158)', async () => {
                const { createCollection: pearElectronics } = await adminClient.query<
                    Codegen.CreateCollectionSelectVariantsMutation,
                    Codegen.CreateCollectionSelectVariantsMutationVariables
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
                                        value: 'false',
                                    },
                                ],
                            },
                        ],
                    } as Codegen.CreateCollectionInput,
                });

                await awaitRunningJobs(adminClient, 5000);

                const result = await adminClient.query<
                    Codegen.GetCollectionProductsQuery,
                    Codegen.GetCollectionProductsQueryVariables
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

            it('child collection with no inheritance', async () => {
                const { createCollection: clothesCollection } = await adminClient.query<
                    Codegen.CreateCollectionSelectVariantsMutation,
                    Codegen.CreateCollectionSelectVariantsMutationVariables
                >(CREATE_COLLECTION_SELECT_VARIANTS, {
                    input: {
                        parentId: electronicsCollection.id,
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'clothes',
                                description: '',
                                slug: 'clothes',
                            },
                        ],
                        inheritFilters: false,
                        filters: [
                            {
                                code: facetValueCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'facetValueIds',
                                        value: `["${getFacetValueId('clothing')}"]`,
                                    },
                                    {
                                        name: 'containsAny',
                                        value: 'false',
                                    },
                                ],
                            },
                        ],
                    } as Codegen.CreateCollectionInput,
                });

                await awaitRunningJobs(adminClient, 5000);

                clothesCollectionId = clothesCollection.id;

                const result = await adminClient.query<
                    Codegen.GetCollectionProductsQuery,
                    Codegen.GetCollectionProductsQueryVariables
                >(GET_COLLECTION_PRODUCT_VARIANTS, { id: clothesCollection.id });
                expect(result.collection!.productVariants.items.map(i => i.name)).toEqual(['Hat', 'Boots']);
            });

            it('grandchild collection with inheritance (root -> no inherit -> inherit', async () => {
                const { createCollection: footwearCollection } = await adminClient.query<
                    Codegen.CreateCollectionSelectVariantsMutation,
                    Codegen.CreateCollectionSelectVariantsMutationVariables
                >(CREATE_COLLECTION_SELECT_VARIANTS, {
                    input: {
                        parentId: clothesCollectionId,
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'footwear',
                                description: '',
                                slug: 'footwear',
                            },
                        ],
                        inheritFilters: true,
                        filters: [
                            {
                                code: facetValueCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'facetValueIds',
                                        value: `["${getFacetValueId('footwear')}"]`,
                                    },
                                    {
                                        name: 'containsAny',
                                        value: 'false',
                                    },
                                ],
                            },
                        ],
                    } as Codegen.CreateCollectionInput,
                });

                await awaitRunningJobs(adminClient, 5000);

                const result = await adminClient.query<
                    Codegen.GetCollectionProductsQuery,
                    Codegen.GetCollectionProductsQueryVariables
                >(GET_COLLECTION_PRODUCT_VARIANTS, { id: footwearCollection.id });
                expect(result.collection!.productVariants.items.map(i => i.name)).toEqual(['Boots']);
            });
        });

        describe('previewCollectionVariants', () => {
            it('returns correct contents', async () => {
                const { previewCollectionVariants } = await adminClient.query<
                    Codegen.PreviewCollectionVariantsQuery,
                    Codegen.PreviewCollectionVariantsQueryVariables
                >(PREVIEW_COLLECTION_VARIANTS, {
                    input: {
                        parentId: electronicsCollection.parent?.id,
                        inheritFilters: true,
                        filters: [
                            {
                                code: facetValueCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'facetValueIds',
                                        value: `["${getFacetValueId('electronics')}","${getFacetValueId(
                                            'pear',
                                        )}"]`,
                                    },
                                    {
                                        name: 'containsAny',
                                        value: 'false',
                                    },
                                ],
                            },
                        ],
                    },
                });
                expect(previewCollectionVariants.items.map(i => i.name).sort()).toEqual([
                    'Curvy Monitor 24 inch',
                    'Curvy Monitor 27 inch',
                    'Gaming PC i7-8700 240GB SSD',
                    'Instant Camera',
                    'Laptop 13 inch 16GB',
                    'Laptop 13 inch 8GB',
                    'Laptop 15 inch 16GB',
                    'Laptop 15 inch 8GB',
                ]);
            });

            it('works with list options', async () => {
                const { previewCollectionVariants } = await adminClient.query<
                    Codegen.PreviewCollectionVariantsQuery,
                    Codegen.PreviewCollectionVariantsQueryVariables
                >(PREVIEW_COLLECTION_VARIANTS, {
                    input: {
                        parentId: electronicsCollection.parent?.id,
                        inheritFilters: true,
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
                                        value: 'false',
                                    },
                                ],
                            },
                        ],
                    },
                    options: {
                        sort: {
                            name: SortOrder.ASC,
                        },
                        filter: {
                            name: {
                                contains: 'mon',
                            },
                        },
                        take: 5,
                    },
                });
                expect(previewCollectionVariants.items).toEqual([
                    { id: 'T_5', name: 'Curvy Monitor 24 inch' },
                    { id: 'T_6', name: 'Curvy Monitor 27 inch' },
                ]);
            });

            it('takes parent filters into account', async () => {
                const { previewCollectionVariants } = await adminClient.query<
                    Codegen.PreviewCollectionVariantsQuery,
                    Codegen.PreviewCollectionVariantsQueryVariables
                >(PREVIEW_COLLECTION_VARIANTS, {
                    input: {
                        parentId: electronicsCollection.id,
                        inheritFilters: true,
                        filters: [
                            {
                                code: variantNameCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'operator',
                                        value: 'startsWith',
                                    },
                                    {
                                        name: 'term',
                                        value: 'h',
                                    },
                                ],
                            },
                        ],
                    },
                });
                expect(previewCollectionVariants.items.map(i => i.name).sort()).toEqual([
                    'Hard Drive 1TB',
                    'Hard Drive 2TB',
                    'Hard Drive 3TB',
                    'Hard Drive 4TB',
                    'Hard Drive 6TB',
                ]);
            });

            it('ignores parent filters id inheritFilters set to false', async () => {
                const { previewCollectionVariants } = await adminClient.query<
                    Codegen.PreviewCollectionVariantsQuery,
                    Codegen.PreviewCollectionVariantsQueryVariables
                >(PREVIEW_COLLECTION_VARIANTS, {
                    input: {
                        parentId: electronicsCollection.id,
                        inheritFilters: false,
                        filters: [
                            {
                                code: variantNameCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'operator',
                                        value: 'startsWith',
                                    },
                                    {
                                        name: 'term',
                                        value: 'h',
                                    },
                                ],
                            },
                        ],
                    },
                });
                expect(previewCollectionVariants.items.map(i => i.name).sort()).toEqual([
                    'Hard Drive 1TB',
                    'Hard Drive 2TB',
                    'Hard Drive 3TB',
                    'Hard Drive 4TB',
                    'Hard Drive 6TB',
                    'Hat',
                ]);
            });

            it('with no parentId, operates at the root level', async () => {
                const { previewCollectionVariants } = await adminClient.query<
                    Codegen.PreviewCollectionVariantsQuery,
                    Codegen.PreviewCollectionVariantsQueryVariables
                >(PREVIEW_COLLECTION_VARIANTS, {
                    input: {
                        inheritFilters: true,
                        filters: [
                            {
                                code: variantNameCollectionFilter.code,
                                arguments: [
                                    {
                                        name: 'operator',
                                        value: 'startsWith',
                                    },
                                    {
                                        name: 'term',
                                        value: 'h',
                                    },
                                ],
                            },
                        ],
                    },
                });
                expect(previewCollectionVariants.items.map(i => i.name).sort()).toEqual([
                    'Hard Drive 1TB',
                    'Hard Drive 2TB',
                    'Hard Drive 3TB',
                    'Hard Drive 4TB',
                    'Hard Drive 6TB',
                    'Hat',
                ]);
            });
        });
    });
    describe('Product collections property', () => {
        it('returns all collections to which the Product belongs', async () => {
            const result = await adminClient.query<
                Codegen.GetCollectionsForProductsQuery,
                Codegen.GetCollectionsForProductsQueryVariables
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
                    id: 'T_10',
                    name: 'Electronics Breadcrumbs',
                },
                {
                    id: 'T_15',
                    name: 'Photo AND Pear',
                },
                {
                    id: 'T_16',
                    name: 'Photo OR Pear',
                },
                {
                    id: 'T_18',
                    name: 'contains camera',
                },
                {
                    id: 'T_20',
                    name: 'endsWith camera',
                },
                {
                    id: 'T_26',
                    name: 'pear electronics',
                },
            ]);
        });
    });

    describe('productVariants list', () => {
        it('does not list variants from deleted products', async () => {
            await adminClient.query<Codegen.DeleteProductMutation, Codegen.DeleteProductMutationVariables>(
                DELETE_PRODUCT,
                {
                    id: 'T_2', // curvy monitor
                },
            );
            await awaitRunningJobs(adminClient, 5000);
            const { collection } = await adminClient.query<
                Codegen.GetCollectionProductsQuery,
                Codegen.GetCollectionProductsQueryVariables
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

        // https://github.com/vendure-ecommerce/vendure/issues/1213
        it('does not list deleted variants', async () => {
            await adminClient.query<
                Codegen.DeleteProductVariantMutation,
                Codegen.DeleteProductVariantMutationVariables
            >(DELETE_PRODUCT_VARIANT, {
                id: 'T_18', // Instant Camera
            });
            await awaitRunningJobs(adminClient, 5000);
            const { collection } = await adminClient.query<
                Codegen.GetCollectionProductsQuery,
                Codegen.GetCollectionProductsQueryVariables
            >(GET_COLLECTION_PRODUCT_VARIANTS, {
                id: pearCollection.id,
            });
            expect(collection!.productVariants.items.map(i => i.name)).toEqual([
                'Laptop 13 inch 8GB',
                'Laptop 15 inch 8GB',
                'Laptop 13 inch 16GB',
                'Laptop 15 inch 16GB',
                'Gaming PC i7-8700 240GB SSD',
                // 'Instant Camera',
            ]);
        });

        it('does not list disabled variants in Shop API', async () => {
            await adminClient.query<
                Codegen.UpdateProductVariantsMutation,
                Codegen.UpdateProductVariantsMutationVariables
            >(UPDATE_PRODUCT_VARIANTS, {
                input: [{ id: 'T_1', enabled: false }],
            });
            await awaitRunningJobs(adminClient, 5000);

            const { collection } = await shopClient.query<
                Codegen.GetCollectionProductsQuery,
                Codegen.GetCollectionProductsQueryVariables
            >(GET_COLLECTION_PRODUCT_VARIANTS, {
                id: pearCollection.id,
            });
            expect(collection!.productVariants.items.map(i => i.id).includes('T_1')).toBe(false);
        });

        it('does not list variants of disabled products in Shop API', async () => {
            await adminClient.query<Codegen.UpdateProductMutation, Codegen.UpdateProductMutationVariables>(
                UPDATE_PRODUCT,
                {
                    input: { id: 'T_1', enabled: false },
                },
            );
            await awaitRunningJobs(adminClient, 5000);

            const { collection } = await shopClient.query<
                Codegen.GetCollectionProductsQuery,
                Codegen.GetCollectionProductsQueryVariables
            >(GET_COLLECTION_PRODUCT_VARIANTS, {
                id: pearCollection.id,
            });
            expect(collection!.productVariants.items.map(i => i.id).includes('T_1')).toBe(false);
            expect(collection!.productVariants.items.map(i => i.id).includes('T_2')).toBe(false);
            expect(collection!.productVariants.items.map(i => i.id).includes('T_3')).toBe(false);
            expect(collection!.productVariants.items.map(i => i.id).includes('T_4')).toBe(false);
        });

        it('handles other languages', async () => {
            await adminClient.query<Codegen.UpdateProductMutation, Codegen.UpdateProductMutationVariables>(
                UPDATE_PRODUCT,
                {
                    input: { id: 'T_1', enabled: true },
                },
            );
            await adminClient.query<
                Codegen.UpdateProductVariantsMutation,
                Codegen.UpdateProductVariantsMutationVariables
            >(UPDATE_PRODUCT_VARIANTS, {
                input: [
                    {
                        id: 'T_2',
                        translations: [{ languageCode: LanguageCode.de, name: 'Taschenrechner 15 Zoll' }],
                    },
                ],
            });
            const { collection } = await shopClient.query<
                Codegen.GetCollectionProductsQuery,
                Codegen.GetCollectionProductsQueryVariables
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
            ]);
        });
    });

    describe('channel assignment & removal', () => {
        let testCollection: CollectionFragment;

        beforeAll(async () => {
            const { createCollection } = await adminClient.query<
                Codegen.CreateCollectionMutation,
                Codegen.CreateCollectionMutationVariables
            >(CREATE_COLLECTION, {
                input: {
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
                                    value: 'false',
                                },
                            ],
                        },
                    ],
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'Channels Test Collection',
                            description: '',
                            slug: 'channels-test-collection',
                        },
                    ],
                },
            });

            testCollection = createCollection;
        });

        it('assign to channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { collections: before } = await adminClient.query<
                Codegen.GetCollectionListAdminQuery,
                Codegen.GetCollectionListAdminQueryVariables
            >(GET_COLLECTION_LIST);
            expect(before.items.length).toBe(1);
            expect(before.items.map(i => i.id).includes(testCollection.id)).toBe(false);

            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { assignCollectionsToChannel } = await adminClient.query<
                Codegen.AssignCollectionsToChannelMutation,
                Codegen.AssignCollectionsToChannelMutationVariables
            >(ASSIGN_COLLECTIONS_TO_CHANNEL, {
                input: {
                    channelId: secondChannel.id,
                    collectionIds: [testCollection.id],
                },
            });

            expect(assignCollectionsToChannel.map(c => c.id)).toEqual([testCollection.id]);

            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { collections: after } = await adminClient.query<
                Codegen.GetCollectionListAdminQuery,
                Codegen.GetCollectionListAdminQueryVariables
            >(GET_COLLECTION_LIST);
            expect(after.items.length).toBe(2);
            expect(after.items.map(i => i.id).includes(testCollection.id)).toBe(true);
        });

        it('remove from channel', async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { removeCollectionsFromChannel } = await adminClient.query<
                Codegen.RemoveCollectionsFromChannelMutation,
                Codegen.RemoveCollectionsFromChannelMutationVariables
            >(REMOVE_COLLECTIONS_FROM_CHANNEL, {
                input: {
                    channelId: secondChannel.id,
                    collectionIds: [testCollection.id],
                },
            });

            expect(removeCollectionsFromChannel.map(c => c.id)).toEqual([testCollection.id]);

            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { collections: after } = await adminClient.query<
                Codegen.GetCollectionListAdminQuery,
                Codegen.GetCollectionListAdminQueryVariables
            >(GET_COLLECTION_LIST);
            expect(after.items.length).toBe(1);
            expect(after.items.map(i => i.id).includes(testCollection.id)).toBe(false);
        });
    });

    describe('deleteCollections (multiple)', () => {
        let top: CollectionFragment;
        let child: CollectionFragment;
        let grandchild: CollectionFragment;
        beforeAll(async () => {
            async function createNewCollection(name: string, parentId?: string) {
                const { createCollection } = await adminClient.query<
                    Codegen.CreateCollectionMutation,
                    Codegen.CreateCollectionMutationVariables
                >(CREATE_COLLECTION, {
                    input: {
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name,
                                description: '',
                                slug: name,
                            },
                        ],
                        filters: [],
                    },
                });
                return createCollection;
            }

            top = await createNewCollection('top');
            child = await createNewCollection('child', top.id);
            grandchild = await createNewCollection('grandchild', child.id);
        });

        it('deletes all selected collections', async () => {
            const { collections: before } = await adminClient.query<
                Codegen.GetCollectionListQuery,
                Codegen.GetCollectionListQueryVariables
            >(GET_COLLECTION_LIST);

            expect(before.items.sort(sortById).map(pick(['name']))).toEqual([
                { name: 'top' },
                { name: 'child' },
                { name: 'grandchild' },
                { name: 'Accessories' },
            ]);

            const { deleteCollections } = await adminClient.query<
                Codegen.DeleteCollectionsBulkMutation,
                Codegen.DeleteCollectionsBulkMutationVariables
            >(DELETE_COLLECTIONS_BULK, {
                ids: [top.id, child.id, grandchild.id],
            });

            expect(deleteCollections).toEqual([
                { result: DeletionResult.DELETED, message: null },
                { result: DeletionResult.DELETED, message: null },
                { result: DeletionResult.DELETED, message: null },
            ]);

            const { collections: after } = await adminClient.query<
                Codegen.GetCollectionListQuery,
                Codegen.GetCollectionListQueryVariables
            >(GET_COLLECTION_LIST);

            expect(after.items.map(pick(['id', 'name'])).sort(sortById)).toEqual([
                { id: 'T_8', name: 'Accessories' },
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

export const GET_COLLECTION_LIST = gql`
    query GetCollectionListAdmin($options: CollectionListOptions) {
        collections(options: $options) {
            items {
                ...Collection
            }
            totalItems
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

const PREVIEW_COLLECTION_VARIANTS = gql`
    query PreviewCollectionVariants(
        $input: PreviewCollectionVariantsInput!
        $options: ProductVariantListOptions
    ) {
        previewCollectionVariants(input: $input, options: $options) {
            items {
                id
                name
            }
            totalItems
        }
    }
`;

const REMOVE_COLLECTIONS_FROM_CHANNEL = gql`
    mutation RemoveCollectionsFromChannel($input: RemoveCollectionsFromChannelInput!) {
        removeCollectionsFromChannel(input: $input) {
            ...Collection
        }
    }
    ${COLLECTION_FRAGMENT}
`;

const DELETE_COLLECTIONS_BULK = gql`
    mutation DeleteCollectionsBulk($ids: [ID!]!) {
        deleteCollections(ids: $ids) {
            message
            result
        }
    }
`;
