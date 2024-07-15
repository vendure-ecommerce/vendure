import { omit } from '@vendure/common/lib/omit';
import { pick } from '@vendure/common/lib/pick';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { PRODUCT_VARIANT_FRAGMENT, PRODUCT_WITH_OPTIONS_FRAGMENT } from './graphql/fragments';
import * as Codegen from './graphql/generated-e2e-admin-types';
import {
    DeletionResult,
    ErrorCode,
    LanguageCode,
    SortOrder,
    UpdateChannelDocument,
} from './graphql/generated-e2e-admin-types';
import {
    ADD_OPTION_GROUP_TO_PRODUCT,
    CREATE_PRODUCT,
    CREATE_PRODUCT_OPTION_GROUP,
    CREATE_PRODUCT_VARIANTS,
    DELETE_PRODUCT,
    DELETE_PRODUCT_VARIANT,
    GET_ASSET_LIST,
    GET_PRODUCT_LIST,
    GET_PRODUCT_SIMPLE,
    GET_PRODUCT_VARIANT_LIST,
    GET_PRODUCT_WITH_VARIANTS,
    UPDATE_GLOBAL_SETTINGS,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
} from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

describe('Product resolver', () => {
    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig(),
    });

    const removeOptionGuard: ErrorResultGuard<Codegen.ProductWithOptionsFragment> = createErrorResultGuard(
        input => !!input.optionGroups,
    );

    const updateChannelGuard: ErrorResultGuard<Codegen.ChannelFragment> = createErrorResultGuard(
        input => !!input.id,
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
            const result = await adminClient.query<
                Codegen.GetProductListQuery,
                Codegen.GetProductListQueryVariables
            >(GET_PRODUCT_LIST, {});

            expect(result.products.items.length).toBe(20);
            expect(result.products.totalItems).toBe(20);
        });

        it('limits result set with skip & take', async () => {
            const result = await adminClient.query<
                Codegen.GetProductListQuery,
                Codegen.GetProductListQueryVariables
            >(GET_PRODUCT_LIST, {
                options: {
                    skip: 0,
                    take: 3,
                },
            });

            expect(result.products.items.length).toBe(3);
            expect(result.products.totalItems).toBe(20);
        });

        it('filters by name admin', async () => {
            const result = await adminClient.query<
                Codegen.GetProductListQuery,
                Codegen.GetProductListQueryVariables
            >(GET_PRODUCT_LIST, {
                options: {
                    filter: {
                        name: {
                            contains: 'skateboard',
                        },
                    },
                },
            });

            expect(result.products.items.length).toBe(1);
            expect(result.products.items[0].name).toBe('Cruiser Skateboard');
        });

        it('filters multiple admin', async () => {
            const result = await adminClient.query<
                Codegen.GetProductListQuery,
                Codegen.GetProductListQueryVariables
            >(GET_PRODUCT_LIST, {
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
            });

            expect(result.products.items.length).toBe(0);
        });

        it('sorts by name admin', async () => {
            const result = await adminClient.query<
                Codegen.GetProductListQuery,
                Codegen.GetProductListQueryVariables
            >(GET_PRODUCT_LIST, {
                options: {
                    sort: {
                        name: SortOrder.ASC,
                    },
                },
            });

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
            const result = await shopClient.query<
                Codegen.GetProductListQuery,
                Codegen.GetProductListQueryVariables
            >(GET_PRODUCT_LIST, {
                options: {
                    filter: {
                        name: {
                            contains: 'skateboard',
                        },
                    },
                },
            });

            expect(result.products.items.length).toBe(1);
            expect(result.products.items[0].name).toBe('Cruiser Skateboard');
        });

        it('filters by sku admin', async () => {
            const result = await adminClient.query<
                Codegen.GetProductListQuery,
                Codegen.GetProductListQueryVariables
            >(GET_PRODUCT_LIST, {
                options: {
                    filter: {
                        sku: {
                            contains: 'IHD455T1',
                        },
                    },
                },
            });

            expect(result.products.items.length).toBe(1);
            expect(result.products.items[0].name).toBe('Hard Drive');
        });

        it('sorts by name shop', async () => {
            const result = await shopClient.query<
                Codegen.GetProductListQuery,
                Codegen.GetProductListQueryVariables
            >(GET_PRODUCT_LIST, {
                options: {
                    sort: {
                        name: SortOrder.ASC,
                    },
                },
            });

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
            const { product } = await adminClient.query<
                Codegen.GetProductSimpleQuery,
                Codegen.GetProductSimpleQueryVariables
            >(GET_PRODUCT_SIMPLE, { id: 'T_2' });

            if (!product) {
                fail('Product not found');
                return;
            }
            expect(product.id).toBe('T_2');
        });

        it('by slug', async () => {
            const { product } = await adminClient.query<
                Codegen.GetProductSimpleQuery,
                Codegen.GetProductSimpleQueryVariables
            >(GET_PRODUCT_SIMPLE, { slug: 'curvy-monitor' });

            if (!product) {
                fail('Product not found');
                return;
            }
            expect(product.slug).toBe('curvy-monitor');
        });

        // https://github.com/vendure-ecommerce/vendure/issues/820
        it('by slug with multiple assets', async () => {
            const { product: product1 } = await adminClient.query<
                Codegen.GetProductSimpleQuery,
                Codegen.GetProductSimpleQueryVariables
            >(GET_PRODUCT_SIMPLE, { id: 'T_1' });
            const result = await adminClient.query<
                Codegen.UpdateProductMutation,
                Codegen.UpdateProductMutationVariables
            >(UPDATE_PRODUCT, {
                input: {
                    id: product1!.id,
                    assetIds: ['T_1', 'T_2', 'T_3'],
                },
            });
            const { product } = await adminClient.query<
                Codegen.GetProductWithVariantsQuery,
                Codegen.GetProductWithVariantsQueryVariables
            >(GET_PRODUCT_WITH_VARIANTS, { slug: product1!.slug });

            if (!product) {
                fail('Product not found');
                return;
            }
            expect(product.assets.map(a => a.id)).toEqual(['T_1', 'T_2', 'T_3']);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/538
        it('falls back to default language slug', async () => {
            const { product } = await adminClient.query<
                Codegen.GetProductSimpleQuery,
                Codegen.GetProductSimpleQueryVariables
            >(GET_PRODUCT_SIMPLE, { slug: 'curvy-monitor' }, { languageCode: LanguageCode.de });

            if (!product) {
                fail('Product not found');
                return;
            }
            expect(product.slug).toBe('curvy-monitor');
        });

        it(
            'throws if neither id nor slug provided',
            assertThrowsWithMessage(async () => {
                await adminClient.query<
                    Codegen.GetProductSimpleQuery,
                    Codegen.GetProductSimpleQueryVariables
                >(GET_PRODUCT_SIMPLE, {});
            }, 'Either the Product id or slug must be provided'),
        );

        it(
            'throws if id and slug do not refer to the same Product',
            assertThrowsWithMessage(async () => {
                await adminClient.query<
                    Codegen.GetProductSimpleQuery,
                    Codegen.GetProductSimpleQueryVariables
                >(GET_PRODUCT_SIMPLE, {
                    id: 'T_2',
                    slug: 'laptop',
                });
            }, 'The provided id and slug refer to different Products'),
        );

        it('returns expected properties', async () => {
            const { product } = await adminClient.query<
                Codegen.GetProductWithVariantsQuery,
                Codegen.GetProductWithVariantsQueryVariables
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
                Codegen.GetProductWithVariantsQuery,
                Codegen.GetProductWithVariantsQueryVariables
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
                Codegen.GetProductWithVariantsQuery,
                Codegen.GetProductWithVariantsQueryVariables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: 'bad_id',
            });

            expect(result.product).toBeNull();
        });

        it('returns null when slug not found', async () => {
            const result = await adminClient.query<
                Codegen.GetProductWithVariantsQuery,
                Codegen.GetProductWithVariantsQueryVariables
            >(GET_PRODUCT_WITH_VARIANTS, {
                slug: 'bad_slug',
            });

            expect(result.product).toBeNull();
        });

        describe('product query with translations', () => {
            let translatedProduct: Codegen.ProductWithVariantsFragment;
            let en_translation: Codegen.ProductWithVariantsFragment['translations'][number];
            let de_translation: Codegen.ProductWithVariantsFragment['translations'][number];

            beforeAll(async () => {
                const result = await adminClient.query<
                    Codegen.CreateProductMutation,
                    Codegen.CreateProductMutationVariables
                >(CREATE_PRODUCT, {
                    input: {
                        translations: [
                            {
                                languageCode: LanguageCode.en,
                                name: 'en Pineapple',
                                slug: 'en-pineapple',
                                description: 'A delicious pineapple',
                            },
                            {
                                languageCode: LanguageCode.de,
                                name: 'de Ananas',
                                slug: 'de-ananas',
                                description: 'Eine köstliche Ananas',
                            },
                        ],
                    },
                });
                translatedProduct = result.createProduct;
                en_translation = translatedProduct.translations.find(
                    t => t.languageCode === LanguageCode.en,
                )!;
                de_translation = translatedProduct.translations.find(
                    t => t.languageCode === LanguageCode.de,
                )!;
            });

            it('en slug without translation arg', async () => {
                const { product } = await adminClient.query<
                    Codegen.GetProductSimpleQuery,
                    Codegen.GetProductSimpleQueryVariables
                >(GET_PRODUCT_SIMPLE, { slug: en_translation.slug });

                if (!product) {
                    fail('Product not found');
                    return;
                }
                expect(product.slug).toBe(en_translation.slug);
            });

            it('de slug without translation arg', async () => {
                const { product } = await adminClient.query<
                    Codegen.GetProductSimpleQuery,
                    Codegen.GetProductSimpleQueryVariables
                >(GET_PRODUCT_SIMPLE, { slug: de_translation.slug });

                if (!product) {
                    fail('Product not found');
                    return;
                }
                expect(product.slug).toBe(en_translation.slug);
            });

            it('en slug with translation en', async () => {
                const { product } = await adminClient.query<
                    Codegen.GetProductSimpleQuery,
                    Codegen.GetProductSimpleQueryVariables
                >(GET_PRODUCT_SIMPLE, { slug: en_translation.slug }, { languageCode: LanguageCode.en });

                if (!product) {
                    fail('Product not found');
                    return;
                }
                expect(product.slug).toBe(en_translation.slug);
            });

            it('de slug with translation en', async () => {
                const { product } = await adminClient.query<
                    Codegen.GetProductSimpleQuery,
                    Codegen.GetProductSimpleQueryVariables
                >(GET_PRODUCT_SIMPLE, { slug: de_translation.slug }, { languageCode: LanguageCode.en });

                if (!product) {
                    fail('Product not found');
                    return;
                }
                expect(product.slug).toBe(en_translation.slug);
            });

            it('en slug with translation de', async () => {
                const { product } = await adminClient.query<
                    Codegen.GetProductSimpleQuery,
                    Codegen.GetProductSimpleQueryVariables
                >(GET_PRODUCT_SIMPLE, { slug: en_translation.slug }, { languageCode: LanguageCode.de });

                if (!product) {
                    fail('Product not found');
                    return;
                }
                expect(product.slug).toBe(de_translation.slug);
            });

            it('de slug with translation de', async () => {
                const { product } = await adminClient.query<
                    Codegen.GetProductSimpleQuery,
                    Codegen.GetProductSimpleQueryVariables
                >(GET_PRODUCT_SIMPLE, { slug: de_translation.slug }, { languageCode: LanguageCode.de });

                if (!product) {
                    fail('Product not found');
                    return;
                }
                expect(product.slug).toBe(de_translation.slug);
            });

            it('de slug with translation ru', async () => {
                const { product } = await adminClient.query<
                    Codegen.GetProductSimpleQuery,
                    Codegen.GetProductSimpleQueryVariables
                >(GET_PRODUCT_SIMPLE, { slug: de_translation.slug }, { languageCode: LanguageCode.ru });

                if (!product) {
                    fail('Product not found');
                    return;
                }
                expect(product.slug).toBe(en_translation.slug);
            });
        });

        describe('product.variants', () => {
            it('returns product variants', async () => {
                const { product } = await adminClient.query<
                    Codegen.GetProductWithVariantsQuery,
                    Codegen.GetProductWithVariantsQueryVariables
                >(GET_PRODUCT_WITH_VARIANTS, {
                    id: 'T_1',
                });

                expect(product?.variants.length).toBe(4);
            });

            it('returns product variants in existing language', async () => {
                const { product } = await adminClient.query<
                    Codegen.GetProductWithVariantsQuery,
                    Codegen.GetProductWithVariantsQueryVariables
                >(
                    GET_PRODUCT_WITH_VARIANTS,
                    {
                        id: 'T_1',
                    },
                    { languageCode: LanguageCode.en },
                );

                expect(product?.variants.length).toBe(4);
            });

            it('returns product variants in non-existing language', async () => {
                const { product } = await adminClient.query<
                    Codegen.GetProductWithVariantsQuery,
                    Codegen.GetProductWithVariantsQueryVariables
                >(
                    GET_PRODUCT_WITH_VARIANTS,
                    {
                        id: 'T_1',
                    },
                    { languageCode: LanguageCode.ru },
                );

                expect(product?.variants.length).toBe(4);
            });
        });

        describe('product.variants', () => {
            it('returns product variants', async () => {
                const { product } = await adminClient.query<
                    Codegen.GetProductWithVariantsQuery,
                    Codegen.GetProductWithVariantsQueryVariables
                >(GET_PRODUCT_WITH_VARIANTS, {
                    id: 'T_1',
                });

                expect(product?.variants.length).toBe(4);
            });

            it('returns product variants in existing language', async () => {
                const { product } = await adminClient.query<
                    Codegen.GetProductWithVariantsQuery,
                    Codegen.GetProductWithVariantsQueryVariables
                >(
                    GET_PRODUCT_WITH_VARIANTS,
                    {
                        id: 'T_1',
                    },
                    { languageCode: LanguageCode.en },
                );

                expect(product?.variants.length).toBe(4);
            });

            it('returns product variants in non-existing language', async () => {
                const { product } = await adminClient.query<
                    Codegen.GetProductWithVariantsQuery,
                    Codegen.GetProductWithVariantsQueryVariables
                >(
                    GET_PRODUCT_WITH_VARIANTS,
                    {
                        id: 'T_1',
                    },
                    { languageCode: LanguageCode.ru },
                );

                expect(product?.variants.length).toBe(4);
            });
        });

        describe('product.variantList', () => {
            it('returns product variants', async () => {
                const { product } = await adminClient.query<
                    Codegen.GetProductWithVariantListQuery,
                    Codegen.GetProductWithVariantListQueryVariables
                >(GET_PRODUCT_WITH_VARIANT_LIST, {
                    id: 'T_1',
                });

                expect(product?.variantList.items.length).toBe(4);
                expect(product?.variantList.totalItems).toBe(4);
            });

            it('returns product variants in existing language', async () => {
                const { product } = await adminClient.query<
                    Codegen.GetProductWithVariantListQuery,
                    Codegen.GetProductWithVariantListQueryVariables
                >(
                    GET_PRODUCT_WITH_VARIANT_LIST,
                    {
                        id: 'T_1',
                    },
                    { languageCode: LanguageCode.en },
                );

                expect(product?.variantList.items.length).toBe(4);
            });

            it('returns product variants in non-existing language', async () => {
                const { product } = await adminClient.query<
                    Codegen.GetProductWithVariantListQuery,
                    Codegen.GetProductWithVariantListQueryVariables
                >(
                    GET_PRODUCT_WITH_VARIANT_LIST,
                    {
                        id: 'T_1',
                    },
                    { languageCode: LanguageCode.ru },
                );

                expect(product?.variantList.items.length).toBe(4);
            });

            it('filter & sort', async () => {
                const { product } = await adminClient.query<
                    Codegen.GetProductWithVariantListQuery,
                    Codegen.GetProductWithVariantListQueryVariables
                >(GET_PRODUCT_WITH_VARIANT_LIST, {
                    id: 'T_1',
                    variantListOptions: {
                        filter: {
                            name: {
                                contains: '15',
                            },
                        },
                        sort: {
                            price: SortOrder.DESC,
                        },
                    },
                });

                expect(product?.variantList.items.map(i => i.name)).toEqual([
                    'Laptop 15 inch 16GB',
                    'Laptop 15 inch 8GB',
                ]);
            });
        });
    });

    describe('productVariants list query', () => {
        it('returns list', async () => {
            const { productVariants } = await adminClient.query<
                Codegen.GetProductVariantListQuery,
                Codegen.GetProductVariantListQueryVariables
            >(GET_PRODUCT_VARIANT_LIST, {
                options: {
                    take: 3,
                    sort: {
                        name: SortOrder.ASC,
                    },
                },
            });

            expect(
                productVariants.items.map(i => pick(i, ['id', 'name', 'price', 'priceWithTax', 'sku'])),
            ).toEqual([
                {
                    id: 'T_34',
                    name: 'Bonsai Tree',
                    price: 1999,
                    priceWithTax: 2399,
                    sku: 'B01MXFLUSV',
                },
                {
                    id: 'T_24',
                    name: 'Boxing Gloves',
                    price: 3304,
                    priceWithTax: 3965,
                    sku: 'B000ZYLPPU',
                },
                {
                    id: 'T_19',
                    name: 'Camera Lens',
                    price: 10400,
                    priceWithTax: 12480,
                    sku: 'B0012UUP02',
                },
            ]);
        });

        it('sort by price', async () => {
            const { productVariants } = await adminClient.query<
                Codegen.GetProductVariantListQuery,
                Codegen.GetProductVariantListQueryVariables
            >(GET_PRODUCT_VARIANT_LIST, {
                options: {
                    take: 3,
                    sort: {
                        price: SortOrder.ASC,
                    },
                },
            });

            expect(
                productVariants.items.map(i => pick(i, ['id', 'name', 'price', 'priceWithTax', 'sku'])),
            ).toEqual([
                {
                    id: 'T_23',
                    name: 'Skipping Rope',
                    price: 799,
                    priceWithTax: 959,
                    sku: 'B07CNGXVXT',
                },
                {
                    id: 'T_20',
                    name: 'Tripod',
                    price: 1498,
                    priceWithTax: 1798,
                    sku: 'B00XI87KV8',
                },
                {
                    id: 'T_32',
                    name: 'Spiky Cactus',
                    price: 1550,
                    priceWithTax: 1860,
                    sku: 'SC011001',
                },
            ]);
        });

        it('sort by priceWithTax', async () => {
            const { productVariants } = await adminClient.query<
                Codegen.GetProductVariantListQuery,
                Codegen.GetProductVariantListQueryVariables
            >(GET_PRODUCT_VARIANT_LIST, {
                options: {
                    take: 3,
                    sort: {
                        priceWithTax: SortOrder.ASC,
                    },
                },
            });

            expect(
                productVariants.items.map(i => pick(i, ['id', 'name', 'price', 'priceWithTax', 'sku'])),
            ).toEqual([
                {
                    id: 'T_23',
                    name: 'Skipping Rope',
                    price: 799,
                    priceWithTax: 959,
                    sku: 'B07CNGXVXT',
                },
                {
                    id: 'T_20',
                    name: 'Tripod',
                    price: 1498,
                    priceWithTax: 1798,
                    sku: 'B00XI87KV8',
                },
                {
                    id: 'T_32',
                    name: 'Spiky Cactus',
                    price: 1550,
                    priceWithTax: 1860,
                    sku: 'SC011001',
                },
            ]);
        });

        it('filter by price', async () => {
            const { productVariants } = await adminClient.query<
                Codegen.GetProductVariantListQuery,
                Codegen.GetProductVariantListQueryVariables
            >(GET_PRODUCT_VARIANT_LIST, {
                options: {
                    take: 3,
                    filter: {
                        price: {
                            between: {
                                start: 1400,
                                end: 1500,
                            },
                        },
                    },
                },
            });

            expect(
                productVariants.items.map(i => pick(i, ['id', 'name', 'price', 'priceWithTax', 'sku'])),
            ).toEqual([
                {
                    id: 'T_20',
                    name: 'Tripod',
                    price: 1498,
                    priceWithTax: 1798,
                    sku: 'B00XI87KV8',
                },
            ]);
        });

        it('filter by priceWithTax', async () => {
            const { productVariants } = await adminClient.query<
                Codegen.GetProductVariantListQuery,
                Codegen.GetProductVariantListQueryVariables
            >(GET_PRODUCT_VARIANT_LIST, {
                options: {
                    take: 3,
                    filter: {
                        priceWithTax: {
                            between: {
                                start: 1400,
                                end: 1500,
                            },
                        },
                    },
                },
            });

            // Note the results are incorrect. This is a design trade-off. See the
            // commend on the ProductVariant.priceWithTax annotation for explanation.
            expect(
                productVariants.items.map(i => pick(i, ['id', 'name', 'price', 'priceWithTax', 'sku'])),
            ).toEqual([
                {
                    id: 'T_20',
                    name: 'Tripod',
                    price: 1498,
                    priceWithTax: 1798,
                    sku: 'B00XI87KV8',
                },
            ]);
        });

        it('returns variants for particular product by id', async () => {
            const { productVariants } = await adminClient.query<
                Codegen.GetProductVariantListQuery,
                Codegen.GetProductVariantListQueryVariables
            >(GET_PRODUCT_VARIANT_LIST, {
                options: {
                    take: 3,
                    sort: {
                        price: SortOrder.ASC,
                    },
                },
                productId: 'T_1',
            });

            expect(
                productVariants.items.map(i => pick(i, ['id', 'name', 'price', 'priceWithTax', 'sku'])),
            ).toEqual([
                {
                    id: 'T_1',
                    name: 'Laptop 13 inch 8GB',
                    price: 129900,
                    priceWithTax: 155880,
                    sku: 'L2201308',
                },
                {
                    id: 'T_2',
                    name: 'Laptop 15 inch 8GB',
                    price: 139900,
                    priceWithTax: 167880,
                    sku: 'L2201508',
                },
                {
                    id: 'T_3',
                    name: 'Laptop 13 inch 16GB',
                    priceWithTax: 263880,
                    price: 219900,
                    sku: 'L2201316',
                },
            ]);
        });
    });

    describe('productVariant query', () => {
        it('by id', async () => {
            const { productVariant } = await adminClient.query<
                Codegen.GetProductVariantQuery,
                Codegen.GetProductVariantQueryVariables
            >(GET_PRODUCT_VARIANT, {
                id: 'T_1',
            });

            expect(productVariant?.id).toBe('T_1');
            expect(productVariant?.name).toBe('Laptop 13 inch 8GB');
        });
        it('returns null when id not found', async () => {
            const { productVariant } = await adminClient.query<
                Codegen.GetProductVariantQuery,
                Codegen.GetProductVariantQueryVariables
            >(GET_PRODUCT_VARIANT, {
                id: 'T_999',
            });

            expect(productVariant).toBeNull();
        });
    });

    describe('product mutation', () => {
        let newTranslatedProduct: Codegen.ProductWithVariantsFragment;
        let newProduct: Codegen.ProductWithVariantsFragment;
        let newProductWithAssets: Codegen.ProductWithVariantsFragment;

        it('createProduct creates a new Product', async () => {
            const result = await adminClient.query<
                Codegen.CreateProductMutation,
                Codegen.CreateProductMutationVariables
            >(CREATE_PRODUCT, {
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
            });
            expect(omit(result.createProduct, ['translations'])).toMatchSnapshot();
            expect(result.createProduct.translations.map(t => t.description).sort()).toEqual([
                'A baked potato',
                'Eine baked Erdapfel',
            ]);
            newTranslatedProduct = result.createProduct;
        });

        it('createProduct creates a new Product with assets', async () => {
            const assetsResult = await adminClient.query<
                Codegen.GetAssetListQuery,
                Codegen.GetAssetListQueryVariables
            >(GET_ASSET_LIST);
            const assetIds = assetsResult.assets.items.slice(0, 2).map(a => a.id);
            const featuredAssetId = assetsResult.assets.items[0].id;

            const result = await adminClient.query<
                Codegen.CreateProductMutation,
                Codegen.CreateProductMutationVariables
            >(CREATE_PRODUCT, {
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
            });
            expect(result.createProduct.assets.map(a => a.id)).toEqual(assetIds);
            expect(result.createProduct.featuredAsset!.id).toBe(featuredAssetId);
            newProductWithAssets = result.createProduct;
        });

        it('createProduct creates a disabled Product', async () => {
            const result = await adminClient.query<
                Codegen.CreateProductMutation,
                Codegen.CreateProductMutationVariables
            >(CREATE_PRODUCT, {
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
            });
            expect(result.createProduct.enabled).toBe(false);
            newProduct = result.createProduct;
        });

        it('updateProduct updates a Product', async () => {
            const result = await adminClient.query<
                Codegen.UpdateProductMutation,
                Codegen.UpdateProductMutationVariables
            >(UPDATE_PRODUCT, {
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
            });
            expect(result.updateProduct.translations.map(t => t.description).sort()).toEqual([
                'A blob of mashed potato',
                'Eine blob von gemashed Erdapfel',
            ]);
        });

        it('slug is normalized to be url-safe', async () => {
            const result = await adminClient.query<
                Codegen.UpdateProductMutation,
                Codegen.UpdateProductMutationVariables
            >(UPDATE_PRODUCT, {
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
            });
            expect(result.updateProduct.slug).toBe('a-very-nice-potato');
        });

        it('create with duplicate slug is renamed to be unique', async () => {
            const result = await adminClient.query<
                Codegen.CreateProductMutation,
                Codegen.CreateProductMutationVariables
            >(CREATE_PRODUCT, {
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
            });
            expect(result.createProduct.slug).toBe('a-very-nice-potato-2');
        });

        it('update with duplicate slug is renamed to be unique', async () => {
            const result = await adminClient.query<
                Codegen.UpdateProductMutation,
                Codegen.UpdateProductMutationVariables
            >(UPDATE_PRODUCT, {
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
            });
            expect(result.updateProduct.slug).toBe('a-very-nice-potato-3');
        });

        it('slug duplicate check does not include self', async () => {
            const result = await adminClient.query<
                Codegen.UpdateProductMutation,
                Codegen.UpdateProductMutationVariables
            >(UPDATE_PRODUCT, {
                input: {
                    id: newProduct.id,
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            slug: 'a-very-nice-potato-3',
                        },
                    ],
                },
            });
            expect(result.updateProduct.slug).toBe('a-very-nice-potato-3');
        });

        it('updateProduct accepts partial input', async () => {
            const result = await adminClient.query<
                Codegen.UpdateProductMutation,
                Codegen.UpdateProductMutationVariables
            >(UPDATE_PRODUCT, {
                input: {
                    id: newProduct.id,
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'en Very Mashed Potato',
                        },
                    ],
                },
            });
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
            const assetsResult = await adminClient.query<
                Codegen.GetAssetListQuery,
                Codegen.GetAssetListQueryVariables
            >(GET_ASSET_LIST);
            const assetIds = assetsResult.assets.items.map(a => a.id);
            const featuredAssetId = assetsResult.assets.items[2].id;

            const result = await adminClient.query<
                Codegen.UpdateProductMutation,
                Codegen.UpdateProductMutationVariables
            >(UPDATE_PRODUCT, {
                input: {
                    id: newProduct.id,
                    assetIds,
                    featuredAssetId,
                },
            });
            expect(result.updateProduct.assets.map(a => a.id)).toEqual(assetIds);
            expect(result.updateProduct.featuredAsset!.id).toBe(featuredAssetId);
        });

        it('updateProduct sets a featured asset', async () => {
            const productResult = await adminClient.query<
                Codegen.GetProductWithVariantsQuery,
                Codegen.GetProductWithVariantsQueryVariables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: newProduct.id,
            });
            const assets = productResult.product!.assets;

            const result = await adminClient.query<
                Codegen.UpdateProductMutation,
                Codegen.UpdateProductMutationVariables
            >(UPDATE_PRODUCT, {
                input: {
                    id: newProduct.id,
                    featuredAssetId: assets[0].id,
                },
            });
            expect(result.updateProduct.featuredAsset!.id).toBe(assets[0].id);
        });

        it('updateProduct updates assets', async () => {
            const result = await adminClient.query<
                Codegen.UpdateProductMutation,
                Codegen.UpdateProductMutationVariables
            >(UPDATE_PRODUCT, {
                input: {
                    id: newProduct.id,
                    featuredAssetId: 'T_1',
                    assetIds: ['T_1', 'T_2'],
                },
            });
            expect(result.updateProduct.assets.map(a => a.id)).toEqual(['T_1', 'T_2']);
        });

        it('updateProduct updates FacetValues', async () => {
            const result = await adminClient.query<
                Codegen.UpdateProductMutation,
                Codegen.UpdateProductMutationVariables
            >(UPDATE_PRODUCT, {
                input: {
                    id: newProduct.id,
                    facetValueIds: ['T_1'],
                },
            });
            expect(result.updateProduct.facetValues.length).toEqual(1);
        });

        it(
            'updateProduct errors with an invalid productId',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<Codegen.UpdateProductMutation, Codegen.UpdateProductMutationVariables>(
                        UPDATE_PRODUCT,
                        {
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
                        },
                    ),
                'No Product with the id "999" could be found',
            ),
        );

        it('addOptionGroupToProduct adds an option group', async () => {
            const optionGroup = await createOptionGroup('Quark-type', ['Charm', 'Strange']);
            const result = await adminClient.query<
                Codegen.AddOptionGroupToProductMutation,
                Codegen.AddOptionGroupToProductMutationVariables
            >(ADD_OPTION_GROUP_TO_PRODUCT, {
                optionGroupId: optionGroup.id,
                productId: newProduct.id,
            });
            expect(result.addOptionGroupToProduct.optionGroups.length).toBe(1);
            expect(result.addOptionGroupToProduct.optionGroups[0].id).toBe(optionGroup.id);

            // not really testing this, but just cleaning up for later tests
            const { removeOptionGroupFromProduct } = await adminClient.query<
                Codegen.RemoveOptionGroupFromProductMutation,
                Codegen.RemoveOptionGroupFromProductMutationVariables
            >(REMOVE_OPTION_GROUP_FROM_PRODUCT, {
                optionGroupId: optionGroup.id,
                productId: newProduct.id,
            });
            removeOptionGuard.assertSuccess(removeOptionGroupFromProduct);
        });

        it(
            'addOptionGroupToProduct errors with an invalid productId',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<
                        Codegen.AddOptionGroupToProductMutation,
                        Codegen.AddOptionGroupToProductMutationVariables
                    >(ADD_OPTION_GROUP_TO_PRODUCT, {
                        optionGroupId: 'T_1',
                        productId: 'T_999',
                    }),
                'No Product with the id "999" could be found',
            ),
        );

        it(
            'addOptionGroupToProduct errors if the OptionGroup is already assigned to another Product',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<
                        Codegen.AddOptionGroupToProductMutation,
                        Codegen.AddOptionGroupToProductMutationVariables
                    >(ADD_OPTION_GROUP_TO_PRODUCT, {
                        optionGroupId: 'T_1',
                        productId: 'T_2',
                    }),
                'The ProductOptionGroup "laptop-screen-size" is already assigned to the Product "Laptop"',
            ),
        );

        it(
            'addOptionGroupToProduct errors with an invalid optionGroupId',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<
                        Codegen.AddOptionGroupToProductMutation,
                        Codegen.AddOptionGroupToProductMutationVariables
                    >(ADD_OPTION_GROUP_TO_PRODUCT, {
                        optionGroupId: '999',
                        productId: newProduct.id,
                    }),
                'No ProductOptionGroup with the id "999" could be found',
            ),
        );

        it('removeOptionGroupFromProduct removes an option group', async () => {
            const optionGroup = await createOptionGroup('Length', ['Short', 'Long']);
            const { addOptionGroupToProduct } = await adminClient.query<
                Codegen.AddOptionGroupToProductMutation,
                Codegen.AddOptionGroupToProductMutationVariables
            >(ADD_OPTION_GROUP_TO_PRODUCT, {
                optionGroupId: optionGroup.id,
                productId: newProductWithAssets.id,
            });
            expect(addOptionGroupToProduct.optionGroups.length).toBe(1);
            const { removeOptionGroupFromProduct } = await adminClient.query<
                Codegen.RemoveOptionGroupFromProductMutation,
                Codegen.RemoveOptionGroupFromProductMutationVariables
            >(REMOVE_OPTION_GROUP_FROM_PRODUCT, {
                optionGroupId: optionGroup.id,
                productId: newProductWithAssets.id,
            });
            removeOptionGuard.assertSuccess(removeOptionGroupFromProduct);

            expect(removeOptionGroupFromProduct.id).toBe(newProductWithAssets.id);
            expect(removeOptionGroupFromProduct.optionGroups.length).toBe(0);
        });

        it('removeOptionGroupFromProduct return error result if the optionGroup is being used by variants', async () => {
            const { removeOptionGroupFromProduct } = await adminClient.query<
                Codegen.RemoveOptionGroupFromProductMutation,
                Codegen.RemoveOptionGroupFromProductMutationVariables
            >(REMOVE_OPTION_GROUP_FROM_PRODUCT, {
                optionGroupId: 'T_3',
                productId: 'T_2',
            });
            removeOptionGuard.assertErrorResult(removeOptionGroupFromProduct);

            expect(removeOptionGroupFromProduct.message).toBe(
                'Cannot remove ProductOptionGroup "curvy-monitor-monitor-size" as it is used by 2 ProductVariants. Use the `force` argument to remove it anyway',
            );
            expect(removeOptionGroupFromProduct.errorCode).toBe(ErrorCode.PRODUCT_OPTION_IN_USE_ERROR);
            expect(removeOptionGroupFromProduct.optionGroupCode).toBe('curvy-monitor-monitor-size');
            expect(removeOptionGroupFromProduct.productVariantCount).toBe(2);
        });

        it('removeOptionGroupFromProduct succeeds if all related ProductVariants are also deleted', async () => {
            const { product } = await adminClient.query<
                Codegen.GetProductWithVariantsQuery,
                Codegen.GetProductWithVariantsQueryVariables
            >(GET_PRODUCT_WITH_VARIANTS, { id: 'T_2' });

            // Delete all variants for that product
            for (const variant of product!.variants) {
                await adminClient.query<
                    Codegen.DeleteProductVariantMutation,
                    Codegen.DeleteProductVariantMutationVariables
                >(DELETE_PRODUCT_VARIANT, {
                    id: variant.id,
                });
            }

            const { removeOptionGroupFromProduct } = await adminClient.query<
                Codegen.RemoveOptionGroupFromProductMutation,
                Codegen.RemoveOptionGroupFromProductMutationVariables
            >(REMOVE_OPTION_GROUP_FROM_PRODUCT, {
                optionGroupId: product!.optionGroups[0].id,
                productId: product!.id,
            });

            removeOptionGuard.assertSuccess(removeOptionGroupFromProduct);
        });

        it(
            'removeOptionGroupFromProduct errors with an invalid productId',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<
                        Codegen.RemoveOptionGroupFromProductMutation,
                        Codegen.RemoveOptionGroupFromProductMutationVariables
                    >(REMOVE_OPTION_GROUP_FROM_PRODUCT, {
                        optionGroupId: '1',
                        productId: '999',
                    }),
                'No Product with the id "999" could be found',
            ),
        );

        it(
            'removeOptionGroupFromProduct errors with an invalid optionGroupId',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<
                        Codegen.RemoveOptionGroupFromProductMutation,
                        Codegen.RemoveOptionGroupFromProductMutationVariables
                    >(REMOVE_OPTION_GROUP_FROM_PRODUCT, {
                        optionGroupId: '999',
                        productId: newProduct.id,
                    }),
                'No ProductOptionGroup with the id "999" could be found',
            ),
        );

        describe('variants', () => {
            let variants: Codegen.CreateProductVariantsMutation['createProductVariants'];
            let optionGroup2: NonNullable<Codegen.GetOptionGroupQuery['productOptionGroup']>;
            let optionGroup3: NonNullable<Codegen.GetOptionGroupQuery['productOptionGroup']>;

            beforeAll(async () => {
                optionGroup2 = await createOptionGroup('group-2', ['group2-option-1', 'group2-option-2']);
                optionGroup3 = await createOptionGroup('group-3', ['group3-option-1', 'group3-option-2']);
                await adminClient.query<
                    Codegen.AddOptionGroupToProductMutation,
                    Codegen.AddOptionGroupToProductMutationVariables
                >(ADD_OPTION_GROUP_TO_PRODUCT, {
                    optionGroupId: optionGroup2.id,
                    productId: newProduct.id,
                });
                await adminClient.query<
                    Codegen.AddOptionGroupToProductMutation,
                    Codegen.AddOptionGroupToProductMutationVariables
                >(ADD_OPTION_GROUP_TO_PRODUCT, {
                    optionGroupId: optionGroup3.id,
                    productId: newProduct.id,
                });
            });

            it(
                'createProductVariants throws if optionIds not compatible with product',
                assertThrowsWithMessage(async () => {
                    await adminClient.query<
                        Codegen.CreateProductVariantsMutation,
                        Codegen.CreateProductVariantsMutationVariables
                    >(CREATE_PRODUCT_VARIANTS, {
                        input: [
                            {
                                productId: newProduct.id,
                                sku: 'PV1',
                                optionIds: [],
                                translations: [{ languageCode: LanguageCode.en, name: 'Variant 1' }],
                            },
                        ],
                    });
                }, 'ProductVariant optionIds must include one optionId from each of the groups: group-2, group-3'),
            );

            it(
                'createProductVariants throws if optionIds are duplicated',
                assertThrowsWithMessage(async () => {
                    await adminClient.query<
                        Codegen.CreateProductVariantsMutation,
                        Codegen.CreateProductVariantsMutationVariables
                    >(CREATE_PRODUCT_VARIANTS, {
                        input: [
                            {
                                productId: newProduct.id,
                                sku: 'PV1',
                                optionIds: [optionGroup2.options[0].id, optionGroup2.options[1].id],
                                translations: [{ languageCode: LanguageCode.en, name: 'Variant 1' }],
                            },
                        ],
                    });
                }, 'ProductVariant optionIds must include one optionId from each of the groups: group-2, group-3'),
            );

            it('createProductVariants works', async () => {
                const { createProductVariants } = await adminClient.query<
                    Codegen.CreateProductVariantsMutation,
                    Codegen.CreateProductVariantsMutationVariables
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
                    Codegen.CreateProductVariantsMutation,
                    Codegen.CreateProductVariantsMutationVariables
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
                    await adminClient.query<
                        Codegen.CreateProductVariantsMutation,
                        Codegen.CreateProductVariantsMutationVariables
                    >(CREATE_PRODUCT_VARIANTS, {
                        input: [
                            {
                                productId: newProduct.id,
                                sku: 'PV2',
                                optionIds: [optionGroup2.options[0].id, optionGroup3.options[0].id],
                                translations: [{ languageCode: LanguageCode.en, name: 'Variant 2' }],
                            },
                        ],
                    });
                }, 'A ProductVariant with the selected options already exists: Variant 1'),
            );

            it('updateProductVariants updates variants', async () => {
                const firstVariant = variants[0];
                const { updateProductVariants } = await adminClient.query<
                    Codegen.UpdateProductVariantsMutation,
                    Codegen.UpdateProductVariantsMutationVariables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            id: firstVariant!.id,
                            translations: firstVariant!.translations,
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

            // https://github.com/vendure-ecommerce/vendure/issues/1101
            it('after update, the updatedAt should be modified', async () => {
                // Pause for a second to ensure the updatedAt date is more than 1s
                // later than the createdAt date, since sqlite does not seem to store
                // down to millisecond resolution.
                await new Promise(resolve => setTimeout(resolve, 1000));

                const firstVariant = variants[0];
                const { updateProductVariants } = await adminClient.query<
                    Codegen.UpdateProductVariantsMutation,
                    Codegen.UpdateProductVariantsMutationVariables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            id: firstVariant!.id,
                            translations: firstVariant!.translations,
                            sku: 'ABCD',
                            price: 432,
                        },
                    ],
                });

                const updatedVariant = updateProductVariants.find(v => v?.id === variants[0]!.id);

                expect(updatedVariant?.updatedAt).not.toBe(updatedVariant?.createdAt);
            });

            it('updateProductVariants updates assets', async () => {
                const firstVariant = variants[0];
                const result = await adminClient.query<
                    Codegen.UpdateProductVariantsMutation,
                    Codegen.UpdateProductVariantsMutationVariables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            id: firstVariant!.id,
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
                    Codegen.UpdateProductVariantsMutation,
                    Codegen.UpdateProductVariantsMutationVariables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            id: firstVariant!.id,
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
                    Codegen.UpdateProductVariantsMutation,
                    Codegen.UpdateProductVariantsMutationVariables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            id: firstVariant!.id,
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
                    Codegen.UpdateProductVariantsMutation,
                    Codegen.UpdateProductVariantsMutationVariables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            id: firstVariant!.id,
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
                        adminClient.query<
                            Codegen.UpdateProductVariantsMutation,
                            Codegen.UpdateProductVariantsMutationVariables
                        >(UPDATE_PRODUCT_VARIANTS, {
                            input: [
                                {
                                    id: 'T_999',
                                    translations: variants[0]!.translations,
                                    sku: 'ABC',
                                    price: 432,
                                },
                            ],
                        }),
                    'No ProductVariant with the id "999" could be found',
                ),
            );

            describe('adding options to existing variants', () => {
                let variantToModify: NonNullable<
                    Codegen.CreateProductVariantsMutation['createProductVariants'][number]
                >;
                let initialOptionIds: string[];
                let newOptionGroup: Codegen.CreateProductOptionGroupMutation['createProductOptionGroup'];

                beforeAll(() => {
                    variantToModify = variants[0]!;
                    initialOptionIds = variantToModify.options.map(o => o.id);
                });
                it('assert initial state', async () => {
                    expect(variantToModify.options.map(o => o.code)).toEqual([
                        'group2-option-2',
                        'group3-option-1',
                    ]);
                });

                it(
                    'passing optionIds from an invalid OptionGroup throws',
                    assertThrowsWithMessage(async () => {
                        await adminClient.query<
                            Codegen.UpdateProductVariantsMutation,
                            Codegen.UpdateProductVariantsMutationVariables
                        >(UPDATE_PRODUCT_VARIANTS, {
                            input: [
                                {
                                    id: variantToModify.id,
                                    optionIds: [...variantToModify.options.map(o => o.id), 'T_1'],
                                },
                            ],
                        });
                    }, 'ProductVariant optionIds must include one optionId from each of the groups: group-2, group-3'),
                );

                it(
                    'passing optionIds that match an existing variant throws',
                    assertThrowsWithMessage(async () => {
                        await adminClient.query<
                            Codegen.UpdateProductVariantsMutation,
                            Codegen.UpdateProductVariantsMutationVariables
                        >(UPDATE_PRODUCT_VARIANTS, {
                            input: [
                                {
                                    id: variantToModify.id,
                                    optionIds: variants[1]!.options.map(o => o.id),
                                },
                            ],
                        });
                    }, 'A ProductVariant with the selected options already exists: Variant 3'),
                );

                it('addOptionGroupToProduct and then update existing ProductVariant with a new option', async () => {
                    const optionGroup4 = await createOptionGroup('group-4', [
                        'group4-option-1',
                        'group4-option-2',
                    ]);
                    newOptionGroup = optionGroup4;
                    const result = await adminClient.query<
                        Codegen.AddOptionGroupToProductMutation,
                        Codegen.AddOptionGroupToProductMutationVariables
                    >(ADD_OPTION_GROUP_TO_PRODUCT, {
                        optionGroupId: optionGroup4.id,
                        productId: newProduct.id,
                    });
                    expect(result.addOptionGroupToProduct.optionGroups.length).toBe(3);
                    expect(result.addOptionGroupToProduct.optionGroups[2].id).toBe(optionGroup4.id);

                    const { updateProductVariants } = await adminClient.query<
                        Codegen.UpdateProductVariantsMutation,
                        Codegen.UpdateProductVariantsMutationVariables
                    >(UPDATE_PRODUCT_VARIANTS, {
                        input: [
                            {
                                id: variantToModify.id,
                                optionIds: [
                                    ...variantToModify.options.map(o => o.id),
                                    optionGroup4.options[0].id,
                                ],
                            },
                        ],
                    });

                    expect(updateProductVariants[0]!.options.map(o => o.code)).toEqual([
                        'group2-option-2',
                        'group3-option-1',
                        'group4-option-1',
                    ]);
                });

                it('removeOptionGroup fails because option is in use', async () => {
                    const { removeOptionGroupFromProduct } = await adminClient.query<
                        Codegen.RemoveOptionGroupFromProductMutation,
                        Codegen.RemoveOptionGroupFromProductMutationVariables
                    >(REMOVE_OPTION_GROUP_FROM_PRODUCT, {
                        optionGroupId: newOptionGroup.id,
                        productId: newProduct.id,
                    });
                    removeOptionGuard.assertErrorResult(removeOptionGroupFromProduct);

                    expect(removeOptionGroupFromProduct.message).toBe(
                        'Cannot remove ProductOptionGroup "group-4" as it is used by 3 ProductVariants. Use the `force` argument to remove it anyway',
                    );
                });

                it('removeOptionGroup with force argument', async () => {
                    const { removeOptionGroupFromProduct } = await adminClient.query<
                        Codegen.RemoveOptionGroupFromProductMutation,
                        Codegen.RemoveOptionGroupFromProductMutationVariables
                    >(REMOVE_OPTION_GROUP_FROM_PRODUCT, {
                        optionGroupId: newOptionGroup.id,
                        productId: newProduct.id,
                        force: true,
                    });
                    removeOptionGuard.assertSuccess(removeOptionGroupFromProduct);

                    expect(removeOptionGroupFromProduct.optionGroups.length).toBe(2);

                    const { product } = await adminClient.query<
                        Codegen.GetProductWithVariantsQuery,
                        Codegen.GetProductWithVariantsQueryVariables
                    >(GET_PRODUCT_WITH_VARIANTS, {
                        id: newProduct.id,
                    });
                    function assertNoOptionGroup(
                        variant: Codegen.ProductVariantFragment,
                        optionGroupId: string,
                    ) {
                        expect(variant.options.map(o => o.groupId).every(id => id !== optionGroupId)).toBe(
                            true,
                        );
                    }
                    assertNoOptionGroup(product!.variants[0]!, newOptionGroup.id);
                    assertNoOptionGroup(product!.variants[1]!, newOptionGroup.id);
                    assertNoOptionGroup(product!.variants[2]!, newOptionGroup.id);
                });
            });

            let deletedVariant: Codegen.ProductVariantFragment;

            it('deleteProductVariant', async () => {
                const result1 = await adminClient.query<
                    Codegen.GetProductWithVariantsQuery,
                    Codegen.GetProductWithVariantsQueryVariables
                >(GET_PRODUCT_WITH_VARIANTS, {
                    id: newProduct.id,
                });
                const sortedVariantIds = result1.product!.variants.map(v => v.id).sort();
                expect(sortedVariantIds).toEqual(['T_35', 'T_36', 'T_37']);

                const { deleteProductVariant } = await adminClient.query<
                    Codegen.DeleteProductVariantMutation,
                    Codegen.DeleteProductVariantMutationVariables
                >(DELETE_PRODUCT_VARIANT, {
                    id: sortedVariantIds[0],
                });

                expect(deleteProductVariant.result).toBe(DeletionResult.DELETED);

                const result2 = await adminClient.query<
                    Codegen.GetProductWithVariantsQuery,
                    Codegen.GetProductWithVariantsQueryVariables
                >(GET_PRODUCT_WITH_VARIANTS, {
                    id: newProduct.id,
                });
                expect(result2.product!.variants.map(v => v.id).sort()).toEqual(['T_36', 'T_37']);

                deletedVariant = result1.product!.variants.find(v => v.id === 'T_35')!;
            });

            /** Testing https://github.com/vendure-ecommerce/vendure/issues/412 **/
            it('createProductVariants ignores deleted variants when checking for existing combinations', async () => {
                const { createProductVariants } = await adminClient.query<
                    Codegen.CreateProductVariantsMutation,
                    Codegen.CreateProductVariantsMutationVariables
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

            // https://github.com/vendure-ecommerce/vendure/issues/980
            it('creating variants in a non-default language', async () => {
                const { createProduct } = await adminClient.query<
                    Codegen.CreateProductMutation,
                    Codegen.CreateProductMutationVariables
                >(CREATE_PRODUCT, {
                    input: {
                        translations: [
                            {
                                languageCode: LanguageCode.de,
                                name: 'Ananas',
                                slug: 'ananas',
                                description: 'Yummy Ananas',
                            },
                        ],
                    },
                });

                const { createProductVariants } = await adminClient.query<
                    Codegen.CreateProductVariantsMutation,
                    Codegen.CreateProductVariantsMutationVariables
                >(CREATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            productId: createProduct.id,
                            sku: 'AN1110111',
                            optionIds: [],
                            translations: [{ languageCode: LanguageCode.de, name: 'Ananas Klein' }],
                        },
                    ],
                });

                expect(createProductVariants.length).toBe(1);
                expect(createProductVariants[0]?.name).toBe('Ananas Klein');

                const { product } = await adminClient.query<
                    Codegen.GetProductWithVariantsQuery,
                    Codegen.GetProductWithVariantsQueryVariables
                >(
                    GET_PRODUCT_WITH_VARIANTS,
                    {
                        id: createProduct.id,
                    },
                    { languageCode: LanguageCode.en },
                );

                expect(product?.variants.length).toBe(1);
            });

            // https://github.com/vendure-ecommerce/vendure/issues/1631
            describe('changing the Channel default language', () => {
                let productId: string;

                function getProductWithVariantsInLanguage(
                    id: string,
                    languageCode: LanguageCode,
                    variantListOptions?: Codegen.ProductVariantListOptions,
                ) {
                    return adminClient.query<
                        Codegen.GetProductWithVariantListQuery,
                        Codegen.GetProductWithVariantListQueryVariables
                    >(GET_PRODUCT_WITH_VARIANT_LIST, { id, variantListOptions }, { languageCode });
                }

                beforeAll(async () => {
                    await adminClient.query<
                        Codegen.UpdateGlobalSettingsMutation,
                        Codegen.UpdateGlobalSettingsMutationVariables
                    >(UPDATE_GLOBAL_SETTINGS, {
                        input: {
                            availableLanguages: [LanguageCode.en, LanguageCode.de],
                        },
                    });
                    const { createProduct } = await adminClient.query<
                        Codegen.CreateProductMutation,
                        Codegen.CreateProductMutationVariables
                    >(CREATE_PRODUCT, {
                        input: {
                            translations: [
                                {
                                    languageCode: LanguageCode.en,
                                    name: 'Bottle',
                                    slug: 'bottle',
                                    description: 'A container for liquids',
                                },
                            ],
                        },
                    });

                    productId = createProduct.id;
                    await adminClient.query<
                        Codegen.CreateProductVariantsMutation,
                        Codegen.CreateProductVariantsMutationVariables
                    >(CREATE_PRODUCT_VARIANTS, {
                        input: [
                            {
                                productId,
                                sku: 'BOTTLE111',
                                optionIds: [],
                                translations: [{ languageCode: LanguageCode.en, name: 'Bottle' }],
                            },
                        ],
                    });
                });

                afterAll(async () => {
                    // Restore the default language to English for the subsequent tests
                    await adminClient.query(UpdateChannelDocument, {
                        input: {
                            id: 'T_1',
                            defaultLanguageCode: LanguageCode.en,
                        },
                    });
                });

                it('returns all variants', async () => {
                    const { product: product1 } = await adminClient.query<
                        Codegen.GetProductWithVariantsQuery,
                        Codegen.GetProductWithVariantsQueryVariables
                    >(
                        GET_PRODUCT_WITH_VARIANTS,
                        {
                            id: productId,
                        },
                        { languageCode: LanguageCode.en },
                    );
                    expect(product1?.variants.length).toBe(1);

                    // Change the default language of the channel to "de"
                    const { updateChannel } = await adminClient.query(UpdateChannelDocument, {
                        input: {
                            id: 'T_1',
                            defaultLanguageCode: LanguageCode.de,
                        },
                    });
                    updateChannelGuard.assertSuccess(updateChannel);
                    expect(updateChannel.defaultLanguageCode).toBe(LanguageCode.de);

                    // Fetch the product in en, it should still return 1 variant
                    const { product: product2 } = await getProductWithVariantsInLanguage(
                        productId,
                        LanguageCode.en,
                    );
                    expect(product2?.variantList.items.length).toBe(1);

                    // Fetch the product in de, it should still return 1 variant
                    const { product: product3 } = await getProductWithVariantsInLanguage(
                        productId,
                        LanguageCode.de,
                    );
                    expect(product3?.variantList.items.length).toBe(1);
                });

                it('returns all variants when sorting on variant name', async () => {
                    // Fetch the product in en, it should still return 1 variant
                    const { product: product1 } = await getProductWithVariantsInLanguage(
                        productId,
                        LanguageCode.en,
                        { sort: { name: SortOrder.ASC } },
                    );
                    expect(product1?.variantList.items.length).toBe(1);

                    // Fetch the product in de, it should still return 1 variant
                    const { product: product2 } = await getProductWithVariantsInLanguage(
                        productId,
                        LanguageCode.de,
                        { sort: { name: SortOrder.ASC } },
                    );
                    expect(product2?.variantList.items.length).toBe(1);
                });
            });
        });
    });

    describe('deletion', () => {
        let allProducts: Codegen.GetProductListQuery['products']['items'];
        let productToDelete: NonNullable<Codegen.GetProductWithVariantsQuery['product']>;

        beforeAll(async () => {
            const result = await adminClient.query<
                Codegen.GetProductListQuery,
                Codegen.GetProductListQueryVariables
            >(GET_PRODUCT_LIST, {
                options: {
                    sort: {
                        id: SortOrder.ASC,
                    },
                },
            });
            allProducts = result.products.items;
        });

        it('deletes a product', async () => {
            const { product } = await adminClient.query<
                Codegen.GetProductWithVariantsQuery,
                Codegen.GetProductWithVariantsQueryVariables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: allProducts[0].id,
            });
            const result = await adminClient.query<
                Codegen.DeleteProductMutation,
                Codegen.DeleteProductMutationVariables
            >(DELETE_PRODUCT, { id: product!.id });

            expect(result.deleteProduct).toEqual({ result: DeletionResult.DELETED });

            productToDelete = product!;
        });

        it('cannot get a deleted product', async () => {
            const { product } = await adminClient.query<
                Codegen.GetProductWithVariantsQuery,
                Codegen.GetProductWithVariantsQueryVariables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: productToDelete.id,
            });

            expect(product).toBe(null);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/1096
        it('variants of deleted product are also deleted', async () => {
            for (const variant of productToDelete.variants) {
                const { productVariant } = await adminClient.query<
                    Codegen.GetProductVariantQuery,
                    Codegen.GetProductVariantQueryVariables
                >(GET_PRODUCT_VARIANT, {
                    id: variant.id,
                });

                expect(productVariant).toBe(null);
            }
        });

        it('deleted product omitted from list', async () => {
            const result = await adminClient.query<Codegen.GetProductListQuery>(GET_PRODUCT_LIST);

            expect(result.products.items.length).toBe(allProducts.length - 1);
            expect(result.products.items.map(c => c.id).includes(productToDelete.id)).toBe(false);
        });

        it(
            'updateProduct throws for deleted product',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<Codegen.UpdateProductMutation, Codegen.UpdateProductMutationVariables>(
                        UPDATE_PRODUCT,
                        {
                            input: {
                                id: productToDelete.id,
                                facetValueIds: ['T_1'],
                            },
                        },
                    ),
                'No Product with the id "1" could be found',
            ),
        );

        it(
            'addOptionGroupToProduct throws for deleted product',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<
                        Codegen.AddOptionGroupToProductMutation,
                        Codegen.AddOptionGroupToProductMutationVariables
                    >(ADD_OPTION_GROUP_TO_PRODUCT, {
                        optionGroupId: 'T_1',
                        productId: productToDelete.id,
                    }),
                'No Product with the id "1" could be found',
            ),
        );

        it(
            'removeOptionGroupToProduct throws for deleted product',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<
                        Codegen.RemoveOptionGroupFromProductMutation,
                        Codegen.RemoveOptionGroupFromProductMutationVariables
                    >(REMOVE_OPTION_GROUP_FROM_PRODUCT, {
                        optionGroupId: 'T_1',
                        productId: productToDelete.id,
                    }),
                'No Product with the id "1" could be found',
            ),
        );

        // https://github.com/vendure-ecommerce/vendure/issues/558
        it('slug of a deleted product can be re-used', async () => {
            const result = await adminClient.query<
                Codegen.CreateProductMutation,
                Codegen.CreateProductMutationVariables
            >(CREATE_PRODUCT, {
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
            });
            expect(result.createProduct.slug).toBe(productToDelete.slug);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/1505
        it('attempting to re-use deleted slug twice is not allowed', async () => {
            const result = await adminClient.query<
                Codegen.CreateProductMutation,
                Codegen.CreateProductMutationVariables
            >(CREATE_PRODUCT, {
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
            });

            expect(result.createProduct.slug).not.toBe(productToDelete.slug);
            expect(result.createProduct.slug).toBe('laptop-2');
        });

        // https://github.com/vendure-ecommerce/vendure/issues/800
        it('product can be fetched by slug of a deleted product', async () => {
            const { product } = await adminClient.query<
                Codegen.GetProductSimpleQuery,
                Codegen.GetProductSimpleQueryVariables
            >(GET_PRODUCT_SIMPLE, { slug: productToDelete.slug });

            if (!product) {
                fail('Product not found');
                return;
            }
            expect(product.slug).toBe(productToDelete.slug);
        });
    });

    async function createOptionGroup(name: string, options: string[]) {
        const { createProductOptionGroup } = await adminClient.query<
            Codegen.CreateProductOptionGroupMutation,
            Codegen.CreateProductOptionGroupMutationVariables
        >(CREATE_PRODUCT_OPTION_GROUP, {
            input: {
                code: name.toLowerCase(),
                translations: [{ languageCode: LanguageCode.en, name }],
                options: options.map(option => ({
                    code: option.toLowerCase(),
                    translations: [{ languageCode: LanguageCode.en, name: option }],
                })),
            },
        });
        return createProductOptionGroup;
    }
});

export const REMOVE_OPTION_GROUP_FROM_PRODUCT = gql`
    mutation RemoveOptionGroupFromProduct($productId: ID!, $optionGroupId: ID!, $force: Boolean) {
        removeOptionGroupFromProduct(productId: $productId, optionGroupId: $optionGroupId, force: $force) {
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

export const GET_PRODUCT_WITH_VARIANT_LIST = gql`
    query GetProductWithVariantList($id: ID, $variantListOptions: ProductVariantListOptions) {
        product(id: $id) {
            id
            variantList(options: $variantListOptions) {
                items {
                    ...ProductVariant
                }
                totalItems
            }
        }
    }
    ${PRODUCT_VARIANT_FRAGMENT}
`;
