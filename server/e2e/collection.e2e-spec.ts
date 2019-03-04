import gql from 'graphql-tag';
import path from 'path';

import {
    CREATE_COLLECTION,
    GET_ASSET_LIST,
    GET_COLLECTION,
    MOVE_COLLECTION,
    UPDATE_COLLECTION,
} from '../../admin-ui/src/app/data/definitions/product-definitions';
import {
    Collection,
    CreateCollection,
    GetAssetList,
    GetCollection,
    LanguageCode,
    MoveCollection,
    SortOrder,
    UpdateCollection,
} from '../../shared/generated-types';
import { ROOT_CATEGORY_NAME } from '../../shared/shared-constants';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestAdminClient } from './test-client';
import { TestServer } from './test-server';
import { assertThrowsWithMessage } from './test-utils';

describe('Collection resolver', () => {
    const client = new TestAdminClient();
    const server = new TestServer();
    let assets: GetAssetList.Items[];
    let electronicsCategory: Collection.Fragment;
    let laptopsCategory: Collection.Fragment;
    let appleCategory: Collection.Fragment;

    beforeAll(async () => {
        const token = await server.init({
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
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
                        facetValueIds: ['T_1'],
                        translations: [
                            { languageCode: LanguageCode.en, name: 'Electronics', description: '' },
                        ],
                    },
                },
            );

            electronicsCategory = result.createCollection;
            expect(electronicsCategory).toMatchSnapshot();
            expect(electronicsCategory.parent.name).toBe(ROOT_CATEGORY_NAME);
        });

        it('creates a nested category', async () => {
            const result = await client.query<CreateCollection.Mutation, CreateCollection.Variables>(
                CREATE_COLLECTION,
                {
                    input: {
                        parentId: electronicsCategory.id,
                        translations: [{ languageCode: LanguageCode.en, name: 'Laptops', description: '' }],
                        facetValueIds: ['T_2'],
                    },
                },
            );
            laptopsCategory = result.createCollection;
            expect(laptopsCategory.parent.name).toBe(electronicsCategory.name);
        });

        it('creates a 2nd level nested category', async () => {
            const result = await client.query<CreateCollection.Mutation, CreateCollection.Variables>(
                CREATE_COLLECTION,
                {
                    input: {
                        parentId: laptopsCategory.id,
                        translations: [{ languageCode: LanguageCode.en, name: 'Apple', description: '' }],
                        facetValueIds: ['T_3', 'T_4'],
                    },
                },
            );
            appleCategory = result.createCollection;
            expect(appleCategory.parent.name).toBe(laptopsCategory.name);
        });
    });

    describe('collection query', () => {
        it('returns a category', async () => {
            const result = await client.query<GetCollection.Query, GetCollection.Variables>(GET_COLLECTION, {
                id: laptopsCategory.id,
            });
            if (!result.collection) {
                fail(`did not return the category`);
                return;
            }
            expect(result.collection.id).toBe(laptopsCategory.id);
        });

        it('resolves descendantFacetValues 1 level deep', async () => {
            const result = await client.query(GET_DECENDANT_FACET_VALUES, { id: laptopsCategory.id });
            if (!result.collection) {
                fail(`did not return the category`);
                return;
            }
            expect(result.collection.descendantFacetValues.map(v => v.id)).toEqual(['T_3', 'T_4']);
        });

        it('resolves descendantFacetValues 2 levels deep', async () => {
            const result = await client.query(GET_DECENDANT_FACET_VALUES, { id: electronicsCategory.id });
            if (!result.collection) {
                fail(`did not return the category`);
                return;
            }
            expect(result.collection.descendantFacetValues.map(v => v.id)).toEqual(['T_2', 'T_3', 'T_4']);
        });

        it('resolves ancestorFacetValues at root', async () => {
            const result = await client.query(GET_ANCESTOR_FACET_VALUES, { id: electronicsCategory.id });
            if (!result.collection) {
                fail(`did not return the category`);
                return;
            }
            expect(result.collection.ancestorFacetValues.map(v => v.id)).toEqual([]);
        });

        it('resolves ancestorFacetValues 1 level deep', async () => {
            const result = await client.query(GET_ANCESTOR_FACET_VALUES, { id: laptopsCategory.id });
            if (!result.collection) {
                fail(`did not return the category`);
                return;
            }
            expect(result.collection.ancestorFacetValues.map(v => v.id)).toEqual(['T_1']);
        });

        it('resolves ancestorFacetValues 2 levels deep', async () => {
            const result = await client.query(GET_ANCESTOR_FACET_VALUES, { id: appleCategory.id });
            if (!result.collection) {
                fail(`did not return the category`);
                return;
            }
            expect(result.collection.ancestorFacetValues.map(v => v.id)).toEqual(['T_1', 'T_2']);
        });
    });

    describe('updateCollection', () => {
        it('updates the details', async () => {
            const result = await client.query<UpdateCollection.Mutation, UpdateCollection.Variables>(
                UPDATE_COLLECTION,
                {
                    input: {
                        id: appleCategory.id,
                        assetIds: [assets[1].id],
                        featuredAssetId: assets[1].id,
                        facetValueIds: ['T_3'],
                        translations: [{ languageCode: LanguageCode.en, description: 'Apple stuff ' }],
                    },
                },
            );

            expect(result.updateCollection).toMatchSnapshot();
        });
    });

    describe('moveCollection', () => {
        it('moves a category to a new parent', async () => {
            const result = await client.query<MoveCollection.Mutation, MoveCollection.Variables>(
                MOVE_COLLECTION,
                {
                    input: {
                        categoryId: appleCategory.id,
                        parentId: electronicsCategory.id,
                        index: 0,
                    },
                },
            );

            expect(result.moveCollection.parent.id).toBe(electronicsCategory.id);

            const positions = await getChildrenOf(electronicsCategory.id);
            expect(positions.map(i => i.id)).toEqual([appleCategory.id, laptopsCategory.id]);
        });

        it('alters the position in the current parent', async () => {
            await client.query<MoveCollection.Mutation, MoveCollection.Variables>(MOVE_COLLECTION, {
                input: {
                    categoryId: appleCategory.id,
                    parentId: electronicsCategory.id,
                    index: 1,
                },
            });

            const afterResult = await getChildrenOf(electronicsCategory.id);
            expect(afterResult.map(i => i.id)).toEqual([laptopsCategory.id, appleCategory.id]);
        });

        it('corrects an out-of-bounds negative index value', async () => {
            await client.query<MoveCollection.Mutation, MoveCollection.Variables>(MOVE_COLLECTION, {
                input: {
                    categoryId: appleCategory.id,
                    parentId: electronicsCategory.id,
                    index: -3,
                },
            });

            const afterResult = await getChildrenOf(electronicsCategory.id);
            expect(afterResult.map(i => i.id)).toEqual([appleCategory.id, laptopsCategory.id]);
        });

        it('corrects an out-of-bounds positive index value', async () => {
            await client.query<MoveCollection.Mutation, MoveCollection.Variables>(MOVE_COLLECTION, {
                input: {
                    categoryId: appleCategory.id,
                    parentId: electronicsCategory.id,
                    index: 10,
                },
            });

            const afterResult = await getChildrenOf(electronicsCategory.id);
            expect(afterResult.map(i => i.id)).toEqual([laptopsCategory.id, appleCategory.id]);
        });

        it(
            'throws if attempting to move into self',
            assertThrowsWithMessage(
                () =>
                    client.query<MoveCollection.Mutation, MoveCollection.Variables>(MOVE_COLLECTION, {
                        input: {
                            categoryId: appleCategory.id,
                            parentId: appleCategory.id,
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
                            categoryId: appleCategory.id,
                            parentId: appleCategory.id,
                            index: 0,
                        },
                    }),
                `Cannot move a Collection into itself`,
            ),
        );

        async function getChildrenOf(parentId: string): Promise<Array<{ name: string; id: string }>> {
            const result = await client.query(GET_CATEGORIES);
            return result.collections.items.filter(i => i.parent.id === parentId);
        }
    });
});

const GET_CATEGORIES = gql`
    query GetCategories {
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

const GET_DECENDANT_FACET_VALUES = gql`
    query GetDescendantFacetValues($id: ID!) {
        collection(id: $id) {
            id
            descendantFacetValues {
                id
                name
            }
        }
    }
`;

const GET_ANCESTOR_FACET_VALUES = gql`
    query GetAncestorFacetValues($id: ID!) {
        collection(id: $id) {
            id
            ancestorFacetValues {
                id
                name
            }
        }
    }
`;
