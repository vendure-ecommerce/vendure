import { omit } from '@vendure/common/lib/omit';
import { pick } from '@vendure/common/lib/pick';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { PRODUCT_WITH_OPTIONS_FRAGMENT } from './graphql/fragments';
import {
    AddOptionGroupToProduct,
    CreateProduct,
    CreateProductVariants,
    DeleteProduct,
    DeleteProductVariant,
    DeletionResult,
    ErrorCode,
    GetAssetList,
    GetOptionGroup,
    GetProductList,
    GetProductSimple,
    GetProductVariant,
    GetProductVariantList,
    GetProductWithVariants,
    LanguageCode,
    ProductVariantFragment,
    ProductWithOptionsFragment,
    ProductWithVariants,
    RemoveOptionGroupFromProduct,
    SortOrder,
    UpdateProduct,
    UpdateProductVariants,
} from './graphql/generated-e2e-admin-types';
import {
    ADD_OPTION_GROUP_TO_PRODUCT,
    CREATE_PRODUCT,
    CREATE_PRODUCT_VARIANTS,
    DELETE_PRODUCT,
    DELETE_PRODUCT_VARIANT,
    GET_ASSET_LIST,
    GET_PRODUCT_LIST,
    GET_PRODUCT_SIMPLE,
    GET_PRODUCT_WITH_VARIANTS,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
} from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

// tslint:disable:no-non-null-assertion

describe('Product resolver', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(testConfig);

    const removeOptionGuard: ErrorResultGuard<ProductWithOptionsFragment> = createErrorResultGuard(
        input => !!input.optionGroups,
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            customerCount: 1,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('products list query', () => {
        it('returns all products when no options passed', async () => {
            const result = await adminClient.query<GetProductList.Query, GetProductList.Variables>(
                GET_PRODUCT_LIST,
                {},
            );

            expect(result.products.items.length).toBe(20);
            expect(result.products.totalItems).toBe(20);
        });

        it('limits result set with skip & take', async () => {
            const result = await adminClient.query<GetProductList.Query, GetProductList.Variables>(
                GET_PRODUCT_LIST,
                {
                    options: {
                        skip: 0,
                        take: 3,
                    },
                },
            );

            expect(result.products.items.length).toBe(3);
            expect(result.products.totalItems).toBe(20);
        });

        it('filters by name admin', async () => {
            const result = await adminClient.query<GetProductList.Query, GetProductList.Variables>(
                GET_PRODUCT_LIST,
                {
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

        it('filters multiple admin', async () => {
            const result = await adminClient.query<GetProductList.Query, GetProductList.Variables>(
                GET_PRODUCT_LIST,
                {
                    options: {
                        filter: {
                            name: {
                                contains: 'camera',
                            },
                            slug: {
                                contains: 'tent',
                            },
                        },
                    },
                },
            );

            expect(result.products.items.length).toBe(0);
        });

        it('sorts by name admin', async () => {
            const result = await adminClient.query<GetProductList.Query, GetProductList.Variables>(
                GET_PRODUCT_LIST,
                {
                    options: {
                        sort: {
                            name: SortOrder.ASC,
                        },
                    },
                },
            );

            expect(result.products.items.map(p => p.name)).toEqual([
                'Bonsai Tree',
                'Boxing Gloves',
                'Camera Lens',
                'Clacky Keyboard',
                'Cruiser Skateboard',
                'Curvy Monitor',
                'Football',
                'Gaming PC',
                'Hard Drive',
                'Instant Camera',
                'Laptop',
                'Orchid',
                'Road Bike',
                'Running Shoe',
                'Skipping Rope',
                'Slr Camera',
                'Spiky Cactus',
                'Tent',
                'Tripod',
                'USB Cable',
            ]);
        });

        it('filters by name shop', async () => {
            const result = await shopClient.query<GetProductList.Query, GetProductList.Variables>(
                GET_PRODUCT_LIST,
                {
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

        it('sorts by name shop', async () => {
            const result = await shopClient.query<GetProductList.Query, GetProductList.Variables>(
                GET_PRODUCT_LIST,
                {
                    options: {
                        sort: {
                            name: SortOrder.ASC,
                        },
                    },
                },
            );

            expect(result.products.items.map(p => p.name)).toEqual([
                'Bonsai Tree',
                'Boxing Gloves',
                'Camera Lens',
                'Clacky Keyboard',
                'Cruiser Skateboard',
                'Curvy Monitor',
                'Football',
                'Gaming PC',
                'Hard Drive',
                'Instant Camera',
                'Laptop',
                'Orchid',
                'Road Bike',
                'Running Shoe',
                'Skipping Rope',
                'Slr Camera',
                'Spiky Cactus',
                'Tent',
                'Tripod',
                'USB Cable',
            ]);
        });
    });

    describe('product query', () => {
        it('by id', async () => {
            const { product } = await adminClient.query<GetProductSimple.Query, GetProductSimple.Variables>(
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
            const { product } = await adminClient.query<GetProductSimple.Query, GetProductSimple.Variables>(
                GET_PRODUCT_SIMPLE,
                { slug: 'curvy-monitor' },
            );

            if (!product) {
                fail('Product not found');
                return;
            }
            expect(product.slug).toBe('curvy-monitor');
        });

        // https://github.com/vendure-ecommerce/vendure/issues/538
        it('falls back to default language slug', async () => {
            const { product } = await adminClient.query<GetProductSimple.Query, GetProductSimple.Variables>(
                GET_PRODUCT_SIMPLE,
                { slug: 'curvy-monitor' },
                { languageCode: LanguageCode.de },
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
                await adminClient.query<GetProductSimple.Query, GetProductSimple.Variables>(
                    GET_PRODUCT_SIMPLE,
                    {},
                );
            }, 'Either the Product id or slug must be provided'),
        );

        it(
            'throws if id and slug do not refer to the same Product',
            assertThrowsWithMessage(async () => {
                await adminClient.query<GetProductSimple.Query, GetProductSimple.Variables>(
                    GET_PRODUCT_SIMPLE,
                    {
                        id: 'T_2',
                        slug: 'laptop',
                    },
                );
            }, 'The provided id and slug refer to different Products'),
        );

        it('returns expected properties', async () => {
            const { product } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
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
            const result = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: 'T_2',
            });

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
            const result = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: 'bad_id',
            });

            expect(result.product).toBeNull();
        });
    });

    describe('productVariants list query', () => {
        it('returns list', async () => {
            const { productVariants } = await adminClient.query<
                GetProductVariantList.Query,
                GetProductVariantList.Variables
            >(GET_PRODUCT_VARIANT_LIST, {
                options: {
                    take: 3,
                    sort: {
                        name: SortOrder.ASC,
                    },
                },
            });

            expect(productVariants.items).toEqual([
                {
                    id: 'T_34',
                    name: 'Bonsai Tree',
                    price: 1999,
                    sku: 'B01MXFLUSV',
                },
                {
                    id: 'T_24',
                    name: 'Boxing Gloves',
                    price: 3304,
                    sku: 'B000ZYLPPU',
                },
                {
                    id: 'T_19',
                    name: 'Camera Lens',
                    price: 10400,
                    sku: 'B0012UUP02',
                },
            ]);
        });

        it('sort by price', async () => {
            const { productVariants } = await adminClient.query<
                GetProductVariantList.Query,
                GetProductVariantList.Variables
            >(GET_PRODUCT_VARIANT_LIST, {
                options: {
                    take: 3,
                    sort: {
                        price: SortOrder.ASC,
                    },
                },
            });

            expect(productVariants.items).toEqual([
                {
                    id: 'T_23',
                    name: 'Skipping Rope',
                    price: 799,
                    sku: 'B07CNGXVXT',
                },
                {
                    id: 'T_20',
                    name: 'Tripod',
                    price: 1498,
                    sku: 'B00XI87KV8',
                },
                {
                    id: 'T_32',
                    name: 'Spiky Cactus',
                    price: 1550,
                    sku: 'SC011001',
                },
            ]);
        });
    });

    describe('productVariant query', () => {
        it('by id', async () => {
            const { productVariant } = await adminClient.query<
                GetProductVariant.Query,
                GetProductVariant.Variables
            >(GET_PRODUCT_VARIANT, {
                id: 'T_1',
            });

            expect(productVariant?.id).toBe('T_1');
            expect(productVariant?.name).toBe('Laptop 13 inch 8GB');
        });
        it('returns null when id not found', async () => {
            const { productVariant } = await adminClient.query<
                GetProductVariant.Query,
                GetProductVariant.Variables
            >(GET_PRODUCT_VARIANT, {
                id: 'T_999',
            });

            expect(productVariant).toBeNull();
        });
    });

    describe('product mutation', () => {
        let newProduct: ProductWithVariants.Fragment;
        let newProductWithAssets: ProductWithVariants.Fragment;

        it('createProduct creates a new Product', async () => {
            const result = await adminClient.query<CreateProduct.Mutation, CreateProduct.Variables>(
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
            expect(omit(result.createProduct, ['translations'])).toMatchSnapshot();
            expect(result.createProduct.translations.map(t => t.description).sort()).toEqual([
                'A baked potato',
                'Eine baked Erdapfel',
            ]);
            newProduct = result.createProduct;
        });

        it('createProduct creates a new Product with assets', async () => {
            const assetsResult = await adminClient.query<GetAssetList.Query, GetAssetList.Variables>(
                GET_ASSET_LIST,
            );
            const assetIds = assetsResult.assets.items.slice(0, 2).map(a => a.id);
            const featuredAssetId = assetsResult.assets.items[0].id;

            const result = await adminClient.query<CreateProduct.Mutation, CreateProduct.Variables>(
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
            newProductWithAssets = result.createProduct;
        });

        it('createProduct creates a disabled Product', async () => {
            const result = await adminClient.query<CreateProduct.Mutation, CreateProduct.Variables>(
                CREATE_PRODUCT,
                {
                    input: {
                        enabled: false,
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'en Small apple',
                                slug: 'en-small-apple',
                                description: 'A small apple',
                            },
                        ],
                    },
                },
            );
            expect(result.createProduct.enabled).toBe(false);
            newProduct = result.createProduct;
        });

        it('updateProduct updates a Product', async () => {
            const result = await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
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
            expect(result.updateProduct.translations.map(t => t.description).sort()).toEqual([
                'A blob of mashed potato',
                'Eine blob von gemashed Erdapfel',
            ]);
        });

        it('slug is normalized to be url-safe', async () => {
            const result = await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
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
            const result = await adminClient.query<CreateProduct.Mutation, CreateProduct.Variables>(
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
            const result = await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
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
            const result = await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
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
            const result = await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
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
            expect(
                result.updateProduct.translations.find(t => t.languageCode === LanguageCode.de)!.name,
            ).toBe('de Mashed Potato');
            expect(
                result.updateProduct.translations.find(t => t.languageCode === LanguageCode.en)!.name,
            ).toBe('en Very Mashed Potato');
            expect(
                result.updateProduct.translations.find(t => t.languageCode === LanguageCode.en)!.description,
            ).toBe('Possibly the final baked potato');
        });

        it('updateProduct adds Assets to a product and sets featured asset', async () => {
            const assetsResult = await adminClient.query<GetAssetList.Query, GetAssetList.Variables>(
                GET_ASSET_LIST,
            );
            const assetIds = assetsResult.assets.items.map(a => a.id);
            const featuredAssetId = assetsResult.assets.items[2].id;

            const result = await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
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
            const productResult = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: newProduct.id,
            });
            const assets = productResult.product!.assets;

            const result = await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
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

        it('updateProduct updates assets', async () => {
            const result = await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
                UPDATE_PRODUCT,
                {
                    input: {
                        id: newProduct.id,
                        featuredAssetId: 'T_1',
                        assetIds: ['T_1', 'T_2'],
                    },
                },
            );
            expect(result.updateProduct.assets.map(a => a.id)).toEqual(['T_1', 'T_2']);
        });

        it('updateProduct updates FacetValues', async () => {
            const result = await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
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
                    adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
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
            const result = await adminClient.query<
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
                    adminClient.query<AddOptionGroupToProduct.Mutation, AddOptionGroupToProduct.Variables>(
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
                    adminClient.query<AddOptionGroupToProduct.Mutation, AddOptionGroupToProduct.Variables>(
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
            const { addOptionGroupToProduct } = await adminClient.query<
                AddOptionGroupToProduct.Mutation,
                AddOptionGroupToProduct.Variables
            >(ADD_OPTION_GROUP_TO_PRODUCT, {
                optionGroupId: 'T_1',
                productId: newProductWithAssets.id,
            });
            expect(addOptionGroupToProduct.optionGroups.length).toBe(1);

            const { removeOptionGroupFromProduct } = await adminClient.query<
                RemoveOptionGroupFromProduct.Mutation,
                RemoveOptionGroupFromProduct.Variables
            >(REMOVE_OPTION_GROUP_FROM_PRODUCT, {
                optionGroupId: 'T_1',
                productId: newProductWithAssets.id,
            });
            removeOptionGuard.assertSuccess(removeOptionGroupFromProduct);

            expect(removeOptionGroupFromProduct.id).toBe(newProductWithAssets.id);
            expect(removeOptionGroupFromProduct.optionGroups.length).toBe(0);
        });

        it('removeOptionGroupFromProduct return error result if the optionGroup is being used by variants', async () => {
            const { removeOptionGroupFromProduct } = await adminClient.query<
                RemoveOptionGroupFromProduct.Mutation,
                RemoveOptionGroupFromProduct.Variables
            >(REMOVE_OPTION_GROUP_FROM_PRODUCT, {
                optionGroupId: 'T_3',
                productId: 'T_2',
            });
            removeOptionGuard.assertErrorResult(removeOptionGroupFromProduct);

            expect(removeOptionGroupFromProduct.message).toBe(
                `Cannot remove ProductOptionGroup "curvy-monitor-monitor-size" as it is used by 2 ProductVariants`,
            );
            expect(removeOptionGroupFromProduct.errorCode).toBe(ErrorCode.PRODUCT_OPTION_IN_USE_ERROR);
            expect(removeOptionGroupFromProduct.optionGroupCode).toBe('curvy-monitor-monitor-size');
            expect(removeOptionGroupFromProduct.productVariantCount).toBe(2);
        });

        it(
            'removeOptionGroupFromProduct errors with an invalid productId',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<
                        RemoveOptionGroupFromProduct.Mutation,
                        RemoveOptionGroupFromProduct.Variables
                    >(REMOVE_OPTION_GROUP_FROM_PRODUCT, {
                        optionGroupId: '1',
                        productId: '999',
                    }),
                `No Product with the id '999' could be found`,
            ),
        );

        it(
            'removeOptionGroupFromProduct errors with an invalid optionGroupId',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<
                        RemoveOptionGroupFromProduct.Mutation,
                        RemoveOptionGroupFromProduct.Variables
                    >(REMOVE_OPTION_GROUP_FROM_PRODUCT, {
                        optionGroupId: '999',
                        productId: newProduct.id,
                    }),
                `No ProductOptionGroup with the id '999' could be found`,
            ),
        );

        describe('variants', () => {
            let variants: CreateProductVariants.CreateProductVariants[];
            let optionGroup2: GetOptionGroup.ProductOptionGroup;
            let optionGroup3: GetOptionGroup.ProductOptionGroup;

            beforeAll(async () => {
                await adminClient.query<AddOptionGroupToProduct.Mutation, AddOptionGroupToProduct.Variables>(
                    ADD_OPTION_GROUP_TO_PRODUCT,
                    {
                        optionGroupId: 'T_3',
                        productId: newProduct.id,
                    },
                );
                const result1 = await adminClient.query<GetOptionGroup.Query, GetOptionGroup.Variables>(
                    GET_OPTION_GROUP,
                    { id: 'T_2' },
                );
                const result2 = await adminClient.query<GetOptionGroup.Query, GetOptionGroup.Variables>(
                    GET_OPTION_GROUP,
                    { id: 'T_3' },
                );
                optionGroup2 = result1.productOptionGroup!;
                optionGroup3 = result2.productOptionGroup!;
            });

            it(
                'createProductVariants throws if optionIds not compatible with product',
                assertThrowsWithMessage(async () => {
                    await adminClient.query<CreateProductVariants.Mutation, CreateProductVariants.Variables>(
                        CREATE_PRODUCT_VARIANTS,
                        {
                            input: [
                                {
                                    productId: newProduct.id,
                                    sku: 'PV1',
                                    optionIds: [],
                                    translations: [{ languageCode: LanguageCode.en, name: 'Variant 1' }],
                                },
                            ],
                        },
                    );
                }, 'ProductVariant optionIds must include one optionId from each of the groups: curvy-monitor-monitor-size, laptop-ram'),
            );

            it(
                'createProductVariants throws if optionIds are duplicated',
                assertThrowsWithMessage(async () => {
                    await adminClient.query<CreateProductVariants.Mutation, CreateProductVariants.Variables>(
                        CREATE_PRODUCT_VARIANTS,
                        {
                            input: [
                                {
                                    productId: newProduct.id,
                                    sku: 'PV1',
                                    optionIds: [optionGroup2.options[0].id, optionGroup2.options[1].id],
                                    translations: [{ languageCode: LanguageCode.en, name: 'Variant 1' }],
                                },
                            ],
                        },
                    );
                }, 'ProductVariant optionIds must include one optionId from each of the groups: curvy-monitor-monitor-size, laptop-ram'),
            );

            it('createProductVariants works', async () => {
                const { createProductVariants } = await adminClient.query<
                    CreateProductVariants.Mutation,
                    CreateProductVariants.Variables
                >(CREATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            productId: newProduct.id,
                            sku: 'PV1',
                            optionIds: [optionGroup2.options[0].id, optionGroup3.options[0].id],
                            translations: [{ languageCode: LanguageCode.en, name: 'Variant 1' }],
                        },
                    ],
                });
                expect(createProductVariants[0]!.name).toBe('Variant 1');
                expect(createProductVariants[0]!.options.map(pick(['id']))).toContainEqual({
                    id: optionGroup2.options[0].id,
                });
                expect(createProductVariants[0]!.options.map(pick(['id']))).toContainEqual({
                    id: optionGroup3.options[0].id,
                });
            });

            it('createProductVariants adds multiple variants at once', async () => {
                const { createProductVariants } = await adminClient.query<
                    CreateProductVariants.Mutation,
                    CreateProductVariants.Variables
                >(CREATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            productId: newProduct.id,
                            sku: 'PV2',
                            optionIds: [optionGroup2.options[1].id, optionGroup3.options[0].id],
                            translations: [{ languageCode: LanguageCode.en, name: 'Variant 2' }],
                        },
                        {
                            productId: newProduct.id,
                            sku: 'PV3',
                            optionIds: [optionGroup2.options[1].id, optionGroup3.options[1].id],
                            translations: [{ languageCode: LanguageCode.en, name: 'Variant 3' }],
                        },
                    ],
                });
                const variant2 = createProductVariants.find(v => v!.name === 'Variant 2')!;
                const variant3 = createProductVariants.find(v => v!.name === 'Variant 3')!;
                expect(variant2.options.map(pick(['id']))).toContainEqual({ id: optionGroup2.options[1].id });
                expect(variant2.options.map(pick(['id']))).toContainEqual({ id: optionGroup3.options[0].id });
                expect(variant3.options.map(pick(['id']))).toContainEqual({ id: optionGroup2.options[1].id });
                expect(variant3.options.map(pick(['id']))).toContainEqual({ id: optionGroup3.options[1].id });

                variants = createProductVariants.filter(notNullOrUndefined);
            });

            it(
                'createProductVariants throws if options combination already exists',
                assertThrowsWithMessage(async () => {
                    await adminClient.query<CreateProductVariants.Mutation, CreateProductVariants.Variables>(
                        CREATE_PRODUCT_VARIANTS,
                        {
                            input: [
                                {
                                    productId: newProduct.id,
                                    sku: 'PV2',
                                    optionIds: [optionGroup2.options[0].id, optionGroup3.options[0].id],
                                    translations: [{ languageCode: LanguageCode.en, name: 'Variant 2' }],
                                },
                            ],
                        },
                    );
                }, 'A ProductVariant already exists with the options:'),
            );

            it('updateProductVariants updates variants', async () => {
                const firstVariant = variants[0];
                const { updateProductVariants } = await adminClient.query<
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
                const updatedVariant = updateProductVariants[0];
                if (!updatedVariant) {
                    fail('no updated variant returned.');
                    return;
                }
                expect(updatedVariant.sku).toBe('ABC');
                expect(updatedVariant.price).toBe(432);
            });

            it('updateProductVariants updates assets', async () => {
                const firstVariant = variants[0];
                const result = await adminClient.query<
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

            it('updateProductVariants updates assets again', async () => {
                const firstVariant = variants[0];
                const result = await adminClient.query<
                    UpdateProductVariants.Mutation,
                    UpdateProductVariants.Variables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            id: firstVariant.id,
                            assetIds: ['T_4', 'T_3'],
                            featuredAssetId: 'T_4',
                        },
                    ],
                });
                const updatedVariant = result.updateProductVariants[0];
                if (!updatedVariant) {
                    fail('no updated variant returned.');
                    return;
                }
                expect(updatedVariant.assets.map(a => a.id)).toEqual(['T_4', 'T_3']);
                expect(updatedVariant.featuredAsset!.id).toBe('T_4');
            });

            it('updateProductVariants updates taxCategory and price', async () => {
                const firstVariant = variants[0];
                const result = await adminClient.query<
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
                const result = await adminClient.query<
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
                        adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
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

            let deletedVariant: ProductVariantFragment;

            it('deleteProductVariant', async () => {
                const result1 = await adminClient.query<
                    GetProductWithVariants.Query,
                    GetProductWithVariants.Variables
                >(GET_PRODUCT_WITH_VARIANTS, {
                    id: newProduct.id,
                });
                const sortedVariantIds = result1.product!.variants.map(v => v.id).sort();
                expect(sortedVariantIds).toEqual(['T_35', 'T_36', 'T_37']);

                const { deleteProductVariant } = await adminClient.query<
                    DeleteProductVariant.Mutation,
                    DeleteProductVariant.Variables
                >(DELETE_PRODUCT_VARIANT, {
                    id: sortedVariantIds[0],
                });

                expect(deleteProductVariant.result).toBe(DeletionResult.DELETED);

                const result2 = await adminClient.query<
                    GetProductWithVariants.Query,
                    GetProductWithVariants.Variables
                >(GET_PRODUCT_WITH_VARIANTS, {
                    id: newProduct.id,
                });
                expect(result2.product!.variants.map(v => v.id).sort()).toEqual(['T_36', 'T_37']);

                deletedVariant = result1.product?.variants.find(v => v.id === 'T_35')!;
            });

            /** Testing https://github.com/vendure-ecommerce/vendure/issues/412 **/
            it('createProductVariants ignores deleted variants when checking for existing combinations', async () => {
                const { createProductVariants } = await adminClient.query<
                    CreateProductVariants.Mutation,
                    CreateProductVariants.Variables
                >(CREATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            productId: newProduct.id,
                            sku: 'RE1',
                            optionIds: [deletedVariant.options[0].id, deletedVariant.options[1].id],
                            translations: [{ languageCode: LanguageCode.en, name: 'Re-created Variant' }],
                        },
                    ],
                });

                expect(createProductVariants.length).toBe(1);
                expect(createProductVariants[0]!.options.map(o => o.code).sort()).toEqual(
                    deletedVariant.options.map(o => o.code).sort(),
                );
            });
        });
    });

    describe('deletion', () => {
        let allProducts: GetProductList.Items[];
        let productToDelete: GetProductList.Items;

        beforeAll(async () => {
            const result = await adminClient.query<GetProductList.Query, GetProductList.Variables>(
                GET_PRODUCT_LIST,
                {
                    options: {
                        sort: {
                            id: SortOrder.ASC,
                        },
                    },
                },
            );
            allProducts = result.products.items;
        });

        it('deletes a product', async () => {
            productToDelete = allProducts[0];
            const result = await adminClient.query<DeleteProduct.Mutation, DeleteProduct.Variables>(
                DELETE_PRODUCT,
                { id: productToDelete.id },
            );

            expect(result.deleteProduct).toEqual({ result: DeletionResult.DELETED });
        });

        it('cannot get a deleted product', async () => {
            const result = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: productToDelete.id,
            });

            expect(result.product).toBe(null);
        });

        it('deleted product omitted from list', async () => {
            const result = await adminClient.query<GetProductList.Query>(GET_PRODUCT_LIST);

            expect(result.products.items.length).toBe(allProducts.length - 1);
            expect(result.products.items.map(c => c.id).includes(productToDelete.id)).toBe(false);
        });

        it(
            'updateProduct throws for deleted product',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
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
                    adminClient.query<AddOptionGroupToProduct.Mutation, AddOptionGroupToProduct.Variables>(
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
                    adminClient.query<
                        RemoveOptionGroupFromProduct.Mutation,
                        RemoveOptionGroupFromProduct.Variables
                    >(REMOVE_OPTION_GROUP_FROM_PRODUCT, {
                        optionGroupId: 'T_1',
                        productId: productToDelete.id,
                    }),
                `No Product with the id '1' could be found`,
            ),
        );

        // https://github.com/vendure-ecommerce/vendure/issues/558
        it('slug of a deleted product can be re-used', async () => {
            const result = await adminClient.query<CreateProduct.Mutation, CreateProduct.Variables>(
                CREATE_PRODUCT,
                {
                    input: {
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'Product reusing deleted slug',
                                slug: productToDelete.slug,
                                description: 'stuff',
                            },
                        ],
                    },
                },
            );
            expect(result.createProduct.slug).toBe(productToDelete.slug);
        });
    });
});

export const REMOVE_OPTION_GROUP_FROM_PRODUCT = gql`
    mutation RemoveOptionGroupFromProduct($productId: ID!, $optionGroupId: ID!) {
        removeOptionGroupFromProduct(productId: $productId, optionGroupId: $optionGroupId) {
            ...ProductWithOptions
            ... on ProductOptionInUseError {
                errorCode
                message
                optionGroupCode
                productVariantCount
            }
        }
    }
    ${PRODUCT_WITH_OPTIONS_FRAGMENT}
`;

export const GET_OPTION_GROUP = gql`
    query GetOptionGroup($id: ID!) {
        productOptionGroup(id: $id) {
            id
            code
            options {
                id
                code
            }
        }
    }
`;

export const GET_PRODUCT_VARIANT = gql`
    query GetProductVariant($id: ID!) {
        productVariant(id: $id) {
            id
            name
        }
    }
`;

export const GET_PRODUCT_VARIANT_LIST = gql`
    query GetProductVariantLIST($options: ProductVariantListOptions) {
        productVariants(options: $options) {
            items {
                id
                name
                sku
                price
            }
            totalItems
        }
    }
`;
