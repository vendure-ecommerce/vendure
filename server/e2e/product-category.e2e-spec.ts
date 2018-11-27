import gql from 'graphql-tag';
import {
    CreateProductCategory,
    GetAssetList,
    LanguageCode,
    MoveProductCategory,
    ProductCategory,
    UpdateProductCategory,
} from 'shared/generated-types';
import { ROOT_CATEGORY_NAME } from 'shared/shared-constants';

import {
    CREATE_PRODUCT_CATEGORY,
    GET_ASSET_LIST,
    MOVE_PRODUCT_CATEGORY,
    UPDATE_PRODUCT_CATEGORY,
} from '../../admin-ui/src/app/data/definitions/product-definitions';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestClient } from './test-client';
import { TestServer } from './test-server';

describe('ProductCategory resolver', () => {
    const client = new TestClient();
    const server = new TestServer();
    let assets: GetAssetList.Items[];
    let electronicsCategory: ProductCategory.Fragment;
    let laptopsCategory: ProductCategory.Fragment;
    let appleCategory: ProductCategory.Fragment;

    beforeAll(async () => {
        const token = await server.init({
            productCount: 5,
            customerCount: 1,
        });
        await client.init();
        const assetsResult = await client.query<GetAssetList.Query, GetAssetList.Variables>(GET_ASSET_LIST);
        assets = assetsResult.assets.items;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('createProductCategory', () => {
        it('creates a root category', async () => {
            const result = await client.query<
                CreateProductCategory.Mutation,
                CreateProductCategory.Variables
            >(CREATE_PRODUCT_CATEGORY, {
                input: {
                    assetIds: [assets[0].id, assets[1].id],
                    featuredAssetId: assets[1].id,
                    translations: [{ languageCode: LanguageCode.en, name: 'Electronics', description: '' }],
                },
            });

            electronicsCategory = result.createProductCategory;
            expect(electronicsCategory).toMatchSnapshot();
            expect(electronicsCategory.parent.name).toBe(ROOT_CATEGORY_NAME);
        });

        it('creates a nested category', async () => {
            const result = await client.query<
                CreateProductCategory.Mutation,
                CreateProductCategory.Variables
            >(CREATE_PRODUCT_CATEGORY, {
                input: {
                    parentId: electronicsCategory.id,
                    translations: [{ languageCode: LanguageCode.en, name: 'Laptops', description: '' }],
                },
            });
            laptopsCategory = result.createProductCategory;
            expect(laptopsCategory.parent.name).toBe(electronicsCategory.name);
        });

        it('creates a 2nd level nested category', async () => {
            const result = await client.query<
                CreateProductCategory.Mutation,
                CreateProductCategory.Variables
            >(CREATE_PRODUCT_CATEGORY, {
                input: {
                    parentId: laptopsCategory.id,
                    translations: [{ languageCode: LanguageCode.en, name: 'Apple', description: '' }],
                },
            });
            appleCategory = result.createProductCategory;
            expect(appleCategory.parent.name).toBe(laptopsCategory.name);
        });
    });

    describe('updateProductCategory', () => {
        it('updates the details', async () => {
            const result = await client.query<
                UpdateProductCategory.Mutation,
                UpdateProductCategory.Variables
            >(UPDATE_PRODUCT_CATEGORY, {
                input: {
                    id: appleCategory.id,
                    assetIds: [assets[1].id],
                    featuredAssetId: assets[1].id,
                    translations: [{ languageCode: LanguageCode.en, description: 'Apple stuff ' }],
                },
            });

            expect(result.updateProductCategory).toMatchSnapshot();
        });
    });

    describe('moveProductCategory', () => {
        it('moves a category to a new parent', async () => {
            const result = await client.query<MoveProductCategory.Mutation, MoveProductCategory.Variables>(
                MOVE_PRODUCT_CATEGORY,
                {
                    input: {
                        categoryId: appleCategory.id,
                        parentId: electronicsCategory.id,
                        index: 0,
                    },
                },
            );

            expect(result.moveProductCategory.parent.id).toBe(electronicsCategory.id);

            const positions = await getChildrenOf(electronicsCategory.id);
            expect(positions.map(i => i.id)).toEqual([appleCategory.id, laptopsCategory.id]);
        });

        it('alters the position in the current parent', async () => {
            await client.query<MoveProductCategory.Mutation, MoveProductCategory.Variables>(
                MOVE_PRODUCT_CATEGORY,
                {
                    input: {
                        categoryId: appleCategory.id,
                        parentId: electronicsCategory.id,
                        index: 1,
                    },
                },
            );

            const afterResult = await getChildrenOf(electronicsCategory.id);
            expect(afterResult.map(i => i.id)).toEqual([laptopsCategory.id, appleCategory.id]);
        });

        it('corrects an out-of-bounds negative index value', async () => {
            await client.query<MoveProductCategory.Mutation, MoveProductCategory.Variables>(
                MOVE_PRODUCT_CATEGORY,
                {
                    input: {
                        categoryId: appleCategory.id,
                        parentId: electronicsCategory.id,
                        index: -3,
                    },
                },
            );

            const afterResult = await getChildrenOf(electronicsCategory.id);
            expect(afterResult.map(i => i.id)).toEqual([appleCategory.id, laptopsCategory.id]);
        });

        it('corrects an out-of-bounds positive index value', async () => {
            await client.query<MoveProductCategory.Mutation, MoveProductCategory.Variables>(
                MOVE_PRODUCT_CATEGORY,
                {
                    input: {
                        categoryId: appleCategory.id,
                        parentId: electronicsCategory.id,
                        index: 10,
                    },
                },
            );

            const afterResult = await getChildrenOf(electronicsCategory.id);
            expect(afterResult.map(i => i.id)).toEqual([laptopsCategory.id, appleCategory.id]);
        });

        it('throws if attempting to move into self', async () => {
            try {
                await client.query<MoveProductCategory.Mutation, MoveProductCategory.Variables>(
                    MOVE_PRODUCT_CATEGORY,
                    {
                        input: {
                            categoryId: appleCategory.id,
                            parentId: appleCategory.id,
                            index: 0,
                        },
                    },
                );
                fail('Should have thrown');
            } catch (err) {
                expect(err.message).toEqual(
                    expect.stringContaining(`Cannot move a ProductCategory into itself`),
                );
            }
        });

        it('throws if attempting to move into a decendant of self', async () => {
            try {
                await client.query<MoveProductCategory.Mutation, MoveProductCategory.Variables>(
                    MOVE_PRODUCT_CATEGORY,
                    {
                        input: {
                            categoryId: appleCategory.id,
                            parentId: appleCategory.id,
                            index: 0,
                        },
                    },
                );
                fail('Should have thrown');
            } catch (err) {
                expect(err.message).toEqual(
                    expect.stringContaining(`Cannot move a ProductCategory into itself`),
                );
            }
        });

        async function getChildrenOf(parentId: string): Promise<Array<{ name: string; id: string }>> {
            const result = await client.query(GET_CATEGORIES);
            return result.productCategories.items.filter(i => i.parent.id === parentId);
        }
    });
});

const GET_CATEGORIES = gql`
    query GetCategories {
        productCategories(languageCode: en) {
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
