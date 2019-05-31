import { omit } from '@vendure/common/lib/omit';
import gql from 'graphql-tag';
import path from 'path';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { PRODUCT_WITH_VARIANTS_FRAGMENT } from './graphql/fragments';
import {
    AddOptionGroupToProduct,
    CreateProduct,
    DeleteProduct,
    DeletionResult,
    GenerateProductVariants,
    GetAssetList,
    GetProductList,
    GetProductSimple,
    GetProductWithVariants,
    LanguageCode,
    ProductWithVariants,
    RemoveOptionGroupFromProduct,
    SortOrder,
    UpdateProduct,
    UpdateProductVariants,
} from './graphql/generated-e2e-admin-types';
import {
    CREATE_PRODUCT,
    DELETE_PRODUCT,
    GET_ASSET_LIST,
    GET_PRODUCT_LIST,
    GET_PRODUCT_SIMPLE,
    GET_PRODUCT_WITH_VARIANTS,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
} from './graphql/shared-definitions';
import { TestAdminClient } from './test-client';
import { TestServer } from './test-server';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

// tslint:disable:no-non-null-assertion

describe('Product resolver', () => {
    const client = new TestAdminClient();
    const server = new TestServer();

    beforeAll(async () => {
        const token = await server.init({
            customerCount: 1,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
        });
        await client.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('products list query', () => {
        it('returns all products when no options passed', async () => {
            const result = await client.query<GetProductList.Query, GetProductList.Variables>(
                GET_PRODUCT_LIST,
                {
                    languageCode: LanguageCode.en,
                },
            );

            expect(result.products.items.length).toBe(20);
            expect(result.products.totalItems).toBe(20);
        });

        it('limits result set with skip & take', async () => {
            const result = await client.query<GetProductList.Query, GetProductList.Variables>(
                GET_PRODUCT_LIST,
                {
                    languageCode: LanguageCode.en,
                    options: {
                        skip: 0,
                        take: 3,
                    },
                },
            );

            expect(result.products.items.length).toBe(3);
            expect(result.products.totalItems).toBe(20);
        });

        it('filters by name', async () => {
            const result = await client.query<GetProductList.Query, GetProductList.Variables>(
                GET_PRODUCT_LIST,
                {
                    languageCode: LanguageCode.en,
                    options: {
                        filter: {
                            name: {
                                contains: 'skateboard',
                            },
                        },
                    },
                },
            );

            expect(result.products.items.length).toBe(1);
            expect(result.products.items[0].name).toBe('Cruiser Skateboard');
        });

        it('sorts by name', async () => {
            const result = await client.query<GetProductList.Query, GetProductList.Variables>(
                GET_PRODUCT_LIST,
                {
                    languageCode: LanguageCode.en,
                    options: {
                        sort: {
                            name: SortOrder.ASC,
                        },
                    },
                },
            );

            expect(result.products.items.map(p => p.name)).toMatchSnapshot();
        });
    });

    describe('product query', () => {
        it('by id', async () => {
            const { product } = await client.query<GetProductSimple.Query, GetProductSimple.Variables>(
                GET_PRODUCT_SIMPLE,
                { id: 'T_2' },
            );

            if (!product) {
                fail('Product not found');
                return;
            }
            expect(product.id).toBe('T_2');
        });

        it('by slug', async () => {
            const { product } = await client.query<GetProductSimple.Query, GetProductSimple.Variables>(
                GET_PRODUCT_SIMPLE,
                { slug: 'curvy-monitor' },
            );

            if (!product) {
                fail('Product not found');
                return;
            }
            expect(product.slug).toBe('curvy-monitor');
        });

        it(
            'throws if neither id nor slug provided',
            assertThrowsWithMessage(async () => {
                await client.query<GetProductSimple.Query, GetProductSimple.Variables>(
                    GET_PRODUCT_SIMPLE,
                    {},
                );
            }, 'Either the product id or slug must be provided'),
        );

        it('returns expected properties', async () => {
            const { product } = await client.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                languageCode: LanguageCode.en,
                id: 'T_2',
            });

            if (!product) {
                fail('Product not found');
                return;
            }
            expect(omit(product, ['variants'])).toMatchSnapshot();
            expect(product.variants.length).toBe(2);
        });

        it('ProductVariant price properties are correct', async () => {
            const result = await client.query<GetProductWithVariants.Query, GetProductWithVariants.Variables>(
                GET_PRODUCT_WITH_VARIANTS,
                {
                    languageCode: LanguageCode.en,
                    id: 'T_2',
                },
            );

            if (!result.product) {
                fail('Product not found');
                return;
            }
            expect(result.product.variants[0].price).toBe(14374);
            expect(result.product.variants[0].taxCategory).toEqual({
                id: 'T_1',
                name: 'Standard Tax',
            });
        });

        it('returns null when id not found', async () => {
            const result = await client.query<GetProductWithVariants.Query, GetProductWithVariants.Variables>(
                GET_PRODUCT_WITH_VARIANTS,
                {
                    languageCode: LanguageCode.en,
                    id: 'bad_id',
                },
            );

            expect(result.product).toBeNull();
        });
    });

    describe('product mutation', () => {
        let newProduct: ProductWithVariants.Fragment;

        it('createProduct creates a new Product', async () => {
            const result = await client.query<CreateProduct.Mutation, CreateProduct.Variables>(
                CREATE_PRODUCT,
                {
                    input: {
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'en Baked Potato',
                                slug: 'en Baked Potato',
                                description: 'A baked potato',
                            },
                            {
                                languageCode: LanguageCode.de,
                                name: 'de Baked Potato',
                                slug: 'de-baked-potato',
                                description: 'Eine baked Erdapfel',
                            },
                        ],
                    },
                },
            );
            newProduct = result.createProduct;
            expect(newProduct).toMatchSnapshot();
        });

        it('createProduct creates a new Product with assets', async () => {
            const assetsResult = await client.query<GetAssetList.Query, GetAssetList.Variables>(
                GET_ASSET_LIST,
            );
            const assetIds = assetsResult.assets.items.slice(0, 2).map(a => a.id);
            const featuredAssetId = assetsResult.assets.items[0].id;

            const result = await client.query<CreateProduct.Mutation, CreateProduct.Variables>(
                CREATE_PRODUCT,
                {
                    input: {
                        assetIds,
                        featuredAssetId,
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'en Has Assets',
                                slug: 'en-has-assets',
                                description: 'A product with assets',
                            },
                        ],
                    },
                },
            );
            expect(result.createProduct.assets.map(a => a.id)).toEqual(assetIds);
            expect(result.createProduct.featuredAsset!.id).toBe(featuredAssetId);
        });

        it('updateProduct updates a Product', async () => {
            const result = await client.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
                UPDATE_PRODUCT,
                {
                    input: {
                        id: newProduct.id,
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'en Mashed Potato',
                                slug: 'en-mashed-potato',
                                description: 'A blob of mashed potato',
                            },
                            {
                                languageCode: LanguageCode.de,
                                name: 'de Mashed Potato',
                                slug: 'de-mashed-potato',
                                description: 'Eine blob von gemashed Erdapfel',
                            },
                        ],
                    },
                },
            );
            expect(result.updateProduct).toMatchSnapshot();
        });

        it('slug is normalized to be url-safe', async () => {
            const result = await client.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
                UPDATE_PRODUCT,
                {
                    input: {
                        id: newProduct.id,
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'en Mashed Potato',
                                slug: 'A (very) nice potato!!',
                                description: 'A blob of mashed potato',
                            },
                        ],
                    },
                },
            );
            expect(result.updateProduct.slug).toBe('a-very-nice-potato');
        });

        it('create with duplicate slug is renamed to be unique', async () => {
            const result = await client.query<CreateProduct.Mutation, CreateProduct.Variables>(
                CREATE_PRODUCT,
                {
                    input: {
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'Another baked potato',
                                slug: 'a-very-nice-potato',
                                description: 'Another baked potato but a bit different',
                            },
                        ],
                    },
                },
            );
            expect(result.createProduct.slug).toBe('a-very-nice-potato-2');
        });

        it('update with duplicate slug is renamed to be unique', async () => {
            const result = await client.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
                UPDATE_PRODUCT,
                {
                    input: {
                        id: newProduct.id,
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'Yet another baked potato',
                                slug: 'a-very-nice-potato-2',
                                description: 'Possibly the final baked potato',
                            },
                        ],
                    },
                },
            );
            expect(result.updateProduct.slug).toBe('a-very-nice-potato-3');
        });

        it('slug duplicate check does not include self', async () => {
            const result = await client.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
                UPDATE_PRODUCT,
                {
                    input: {
                        id: newProduct.id,
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                slug: 'a-very-nice-potato-3',
                            },
                        ],
                    },
                },
            );
            expect(result.updateProduct.slug).toBe('a-very-nice-potato-3');
        });

        it('updateProduct accepts partial input', async () => {
            const result = await client.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
                UPDATE_PRODUCT,
                {
                    input: {
                        id: newProduct.id,
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'en Very Mashed Potato',
                            },
                        ],
                    },
                },
            );
            expect(result.updateProduct.translations.length).toBe(2);
            expect(result.updateProduct.translations[0].name).toBe('en Very Mashed Potato');
            expect(result.updateProduct.translations[0].description).toBe('Possibly the final baked potato');
            expect(result.updateProduct.translations[1].name).toBe('de Mashed Potato');
        });

        it('updateProduct adds Assets to a product and sets featured asset', async () => {
            const assetsResult = await client.query<GetAssetList.Query, GetAssetList.Variables>(
                GET_ASSET_LIST,
            );
            const assetIds = assetsResult.assets.items.map(a => a.id);
            const featuredAssetId = assetsResult.assets.items[2].id;

            const result = await client.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
                UPDATE_PRODUCT,
                {
                    input: {
                        id: newProduct.id,
                        assetIds,
                        featuredAssetId,
                    },
                },
            );
            expect(result.updateProduct.assets.map(a => a.id)).toEqual(assetIds);
            expect(result.updateProduct.featuredAsset!.id).toBe(featuredAssetId);
        });

        it('updateProduct sets a featured asset', async () => {
            const productResult = await client.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: newProduct.id,
                languageCode: LanguageCode.en,
            });
            const assets = productResult.product!.assets;

            const result = await client.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
                UPDATE_PRODUCT,
                {
                    input: {
                        id: newProduct.id,
                        featuredAssetId: assets[0].id,
                    },
                },
            );
            expect(result.updateProduct.featuredAsset!.id).toBe(assets[0].id);
        });

        it('updateProduct updates FacetValues', async () => {
            const result = await client.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
                UPDATE_PRODUCT,
                {
                    input: {
                        id: newProduct.id,
                        facetValueIds: ['T_1'],
                    },
                },
            );
            expect(result.updateProduct.facetValues.length).toEqual(1);
        });

        it(
            'updateProduct errors with an invalid productId',
            assertThrowsWithMessage(
                () =>
                    client.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                        input: {
                            id: '999',
                            translations: [
                                {
                                    languageCode: LanguageCode.en,
                                    name: 'en Mashed Potato',
                                    slug: 'en-mashed-potato',
                                    description: 'A blob of mashed potato',
                                },
                                {
                                    languageCode: LanguageCode.de,
                                    name: 'de Mashed Potato',
                                    slug: 'de-mashed-potato',
                                    description: 'Eine blob von gemashed Erdapfel',
                                },
                            ],
                        },
                    }),
                `No Product with the id '999' could be found`,
            ),
        );

        it('addOptionGroupToProduct adds an option group', async () => {
            const result = await client.query<
                AddOptionGroupToProduct.Mutation,
                AddOptionGroupToProduct.Variables
            >(ADD_OPTION_GROUP_TO_PRODUCT, {
                optionGroupId: 'T_2',
                productId: newProduct.id,
            });
            expect(result.addOptionGroupToProduct.optionGroups.length).toBe(1);
            expect(result.addOptionGroupToProduct.optionGroups[0].id).toBe('T_2');
        });

        it(
            'addOptionGroupToProduct errors with an invalid productId',
            assertThrowsWithMessage(
                () =>
                    client.query<AddOptionGroupToProduct.Mutation, AddOptionGroupToProduct.Variables>(
                        ADD_OPTION_GROUP_TO_PRODUCT,
                        {
                            optionGroupId: 'T_1',
                            productId: '999',
                        },
                    ),
                `No Product with the id '999' could be found`,
            ),
        );

        it(
            'addOptionGroupToProduct errors with an invalid optionGroupId',
            assertThrowsWithMessage(
                () =>
                    client.query<AddOptionGroupToProduct.Mutation, AddOptionGroupToProduct.Variables>(
                        ADD_OPTION_GROUP_TO_PRODUCT,
                        {
                            optionGroupId: '999',
                            productId: newProduct.id,
                        },
                    ),
                `No ProductOptionGroup with the id '999' could be found`,
            ),
        );

        it('removeOptionGroupFromProduct removes an option group', async () => {
            const result = await client.query<
                RemoveOptionGroupFromProduct.Mutation,
                RemoveOptionGroupFromProduct.Variables
            >(REMOVE_OPTION_GROUP_FROM_PRODUCT, {
                optionGroupId: 'T_1',
                productId: 'T_1',
            });
            expect(result.removeOptionGroupFromProduct.optionGroups.length).toBe(1);
            expect(result.removeOptionGroupFromProduct.optionGroups[0].code).toBe('laptop-ram');
        });

        it(
            'removeOptionGroupFromProduct errors with an invalid productId',
            assertThrowsWithMessage(
                () =>
                    client.query<
                        RemoveOptionGroupFromProduct.Mutation,
                        RemoveOptionGroupFromProduct.Variables
                    >(REMOVE_OPTION_GROUP_FROM_PRODUCT, {
                        optionGroupId: '1',
                        productId: '999',
                    }),
                `No Product with the id '999' could be found`,
            ),
        );

        describe('variants', () => {
            let variants: ProductWithVariants.Variants[];

            it(
                'generateVariantsForProduct throws with an invalid productId',
                assertThrowsWithMessage(
                    () =>
                        client.query<GenerateProductVariants.Mutation, GenerateProductVariants.Variables>(
                            GENERATE_PRODUCT_VARIANTS,
                            {
                                productId: '999',
                            },
                        ),
                    `No Product with the id '999' could be found`,
                ),
            );

            it(
                'generateVariantsForProduct throws with an invalid defaultTaxCategoryId',
                assertThrowsWithMessage(
                    () =>
                        client.query<GenerateProductVariants.Mutation, GenerateProductVariants.Variables>(
                            GENERATE_PRODUCT_VARIANTS,
                            {
                                productId: newProduct.id,
                                defaultTaxCategoryId: '999',
                            },
                        ),
                    `No TaxCategory with the id '999' could be found`,
                ),
            );

            it('generateVariantsForProduct generates variants', async () => {
                const result = await client.query<
                    GenerateProductVariants.Mutation,
                    GenerateProductVariants.Variables
                >(GENERATE_PRODUCT_VARIANTS, {
                    productId: newProduct.id,
                    defaultPrice: 123,
                    defaultSku: 'ABC',
                });
                variants = result.generateVariantsForProduct.variants;
                expect(variants.length).toBe(2);
                expect(variants[0].options.length).toBe(1);
                expect(variants[1].options.length).toBe(1);
            });

            it('updateProductVariants updates variants', async () => {
                const firstVariant = variants[0];
                const result = await client.query<
                    UpdateProductVariants.Mutation,
                    UpdateProductVariants.Variables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            id: firstVariant.id,
                            translations: firstVariant.translations,
                            sku: 'ABC',
                            price: 432,
                        },
                    ],
                });
                const updatedVariant = result.updateProductVariants[0];
                if (!updatedVariant) {
                    fail('no updated variant returned.');
                    return;
                }
                expect(updatedVariant.sku).toBe('ABC');
                expect(updatedVariant.price).toBe(432);
            });

            it('updateProductVariants updates assets', async () => {
                const firstVariant = variants[0];
                const result = await client.query<
                    UpdateProductVariants.Mutation,
                    UpdateProductVariants.Variables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            id: firstVariant.id,
                            assetIds: ['T_1', 'T_2'],
                            featuredAssetId: 'T_2',
                        },
                    ],
                });
                const updatedVariant = result.updateProductVariants[0];
                if (!updatedVariant) {
                    fail('no updated variant returned.');
                    return;
                }
                expect(updatedVariant.assets.map(a => a.id)).toEqual(['T_1', 'T_2']);
                expect(updatedVariant.featuredAsset!.id).toBe('T_2');
            });

            it('updateProductVariants updates taxCategory and priceBeforeTax', async () => {
                const firstVariant = variants[0];
                const result = await client.query<
                    UpdateProductVariants.Mutation,
                    UpdateProductVariants.Variables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            id: firstVariant.id,
                            price: 105,
                            taxCategoryId: 'T_2',
                        },
                    ],
                });
                const updatedVariant = result.updateProductVariants[0];
                if (!updatedVariant) {
                    fail('no updated variant returned.');
                    return;
                }
                expect(updatedVariant.price).toBe(105);
                expect(updatedVariant.taxCategory.id).toBe('T_2');
            });

            it('updateProductVariants updates facetValues', async () => {
                const firstVariant = variants[0];
                const result = await client.query<
                    UpdateProductVariants.Mutation,
                    UpdateProductVariants.Variables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            id: firstVariant.id,
                            facetValueIds: ['T_1'],
                        },
                    ],
                });
                const updatedVariant = result.updateProductVariants[0];
                if (!updatedVariant) {
                    fail('no updated variant returned.');
                    return;
                }
                expect(updatedVariant.facetValues.length).toBe(1);
                expect(updatedVariant.facetValues[0].id).toBe('T_1');
            });

            it(
                'updateProductVariants throws with an invalid variant id',
                assertThrowsWithMessage(
                    () =>
                        client.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                            UPDATE_PRODUCT_VARIANTS,
                            {
                                input: [
                                    {
                                        id: 'T_999',
                                        translations: variants[0].translations,
                                        sku: 'ABC',
                                        price: 432,
                                    },
                                ],
                            },
                        ),
                    `No ProductVariant with the id '999' could be found`,
                ),
            );
        });
    });

    describe('deletion', () => {
        let allProducts: GetProductList.Items[];
        let productToDelete: GetProductList.Items;

        beforeAll(async () => {
            const result = await client.query<GetProductList.Query>(GET_PRODUCT_LIST);
            allProducts = result.products.items;
        });

        it('deletes a product', async () => {
            productToDelete = allProducts[0];
            const result = await client.query<DeleteProduct.Mutation, DeleteProduct.Variables>(
                DELETE_PRODUCT,
                { id: productToDelete.id },
            );

            expect(result.deleteProduct).toEqual({ result: DeletionResult.DELETED });
        });

        it('cannot get a deleted product', async () => {
            const result = await client.query<GetProductWithVariants.Query, GetProductWithVariants.Variables>(
                GET_PRODUCT_WITH_VARIANTS,
                {
                    id: productToDelete.id,
                },
            );

            expect(result.product).toBe(null);
        });

        it('deleted product omitted from list', async () => {
            const result = await client.query<GetProductList.Query>(GET_PRODUCT_LIST);

            expect(result.products.items.length).toBe(allProducts.length - 1);
            expect(result.products.items.map(c => c.id).includes(productToDelete.id)).toBe(false);
        });

        it(
            'updateProduct throws for deleted product',
            assertThrowsWithMessage(
                () =>
                    client.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                        input: {
                            id: productToDelete.id,
                            facetValueIds: ['T_1'],
                        },
                    }),
                `No Product with the id '1' could be found`,
            ),
        );

        it(
            'addOptionGroupToProduct throws for deleted product',
            assertThrowsWithMessage(
                () =>
                    client.query<AddOptionGroupToProduct.Mutation, AddOptionGroupToProduct.Variables>(
                        ADD_OPTION_GROUP_TO_PRODUCT,
                        {
                            optionGroupId: 'T_1',
                            productId: productToDelete.id,
                        },
                    ),
                `No Product with the id '1' could be found`,
            ),
        );

        it(
            'removeOptionGroupToProduct throws for deleted product',
            assertThrowsWithMessage(
                () =>
                    client.query<
                        RemoveOptionGroupFromProduct.Mutation,
                        RemoveOptionGroupFromProduct.Variables
                    >(REMOVE_OPTION_GROUP_FROM_PRODUCT, {
                        optionGroupId: 'T_1',
                        productId: productToDelete.id,
                    }),
                `No Product with the id '1' could be found`,
            ),
        );

        it(
            'generateVariantsForProduct throws for deleted product',
            assertThrowsWithMessage(
                () =>
                    client.query<GenerateProductVariants.Mutation, GenerateProductVariants.Variables>(
                        GENERATE_PRODUCT_VARIANTS,
                        {
                            productId: productToDelete.id,
                        },
                    ),
                `No Product with the id '1' could be found`,
            ),
        );
    });
});

export const ADD_OPTION_GROUP_TO_PRODUCT = gql`
    mutation AddOptionGroupToProduct($productId: ID!, $optionGroupId: ID!) {
        addOptionGroupToProduct(productId: $productId, optionGroupId: $optionGroupId) {
            id
            optionGroups {
                id
                code
                options {
                    id
                    code
                }
            }
        }
    }
`;

export const REMOVE_OPTION_GROUP_FROM_PRODUCT = gql`
    mutation RemoveOptionGroupFromProduct($productId: ID!, $optionGroupId: ID!) {
        removeOptionGroupFromProduct(productId: $productId, optionGroupId: $optionGroupId) {
            id
            optionGroups {
                id
                code
                options {
                    id
                    code
                }
            }
        }
    }
`;

export const GENERATE_PRODUCT_VARIANTS = gql`
    mutation GenerateProductVariants(
        $productId: ID!
        $defaultTaxCategoryId: ID
        $defaultPrice: Int
        $defaultSku: String
    ) {
        generateVariantsForProduct(
            productId: $productId
            defaultTaxCategoryId: $defaultTaxCategoryId
            defaultPrice: $defaultPrice
            defaultSku: $defaultSku
        ) {
            ...ProductWithVariants
        }
    }
    ${PRODUCT_WITH_VARIANTS_FRAGMENT}
`;
