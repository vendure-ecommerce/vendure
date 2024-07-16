import {
    CreateProductInput,
    CreateProductOptionInput,
    CreateProductVariantInput,
    LanguageCode,
    Permission,
    ProductTranslationInput,
} from '@vendure/common/lib/generated-types';
import { IsNull } from 'typeorm';

import { idsAreEqual } from '../../../common';
import { InternalServerError } from '../../../common/error/errors';
import { Injector } from '../../../common/injector';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { Product } from '../../../entity/product/product.entity';
import { ProductOptionGroup } from '../../../entity/product-option-group/product-option-group.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { ProductOptionGroupService } from '../../../service/services/product-option-group.service';
import { ProductOptionService } from '../../../service/services/product-option.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { ProductService } from '../../../service/services/product.service';
import { EntityDuplicator } from '../entity-duplicator';

let connection: TransactionalConnection;
let productService: ProductService;
let productVariantService: ProductVariantService;
let productOptionGroupService: ProductOptionGroupService;
let productOptionService: ProductOptionService;

/**
 * @description
 * Duplicates a Product and its associated ProductVariants.
 */
export const productDuplicator = new EntityDuplicator({
    code: 'product-duplicator',
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'Default duplicator for Products',
        },
    ],
    requiresPermission: [Permission.CreateProduct, Permission.CreateCatalog],
    forEntities: ['Product'],
    args: {
        includeVariants: {
            type: 'boolean',
            defaultValue: true,
            label: [{ languageCode: LanguageCode.en, value: 'Include variants' }],
        },
    },
    init(injector: Injector) {
        connection = injector.get(TransactionalConnection);
        productService = injector.get(ProductService);
        productVariantService = injector.get(ProductVariantService);
        productOptionGroupService = injector.get(ProductOptionGroupService);
        productOptionService = injector.get(ProductOptionService);
    },
    async duplicate({ ctx, id, args }) {
        const product = await connection.getEntityOrThrow(ctx, Product, id, {
            relations: {
                featuredAsset: true,
                assets: true,
                channels: true,
                facetValues: {
                    facet: true,
                },
                optionGroups: {
                    options: true,
                },
            },
        });
        const translations: ProductTranslationInput[] = product.translations.map(translation => {
            return {
                name: translation.name + ' (copy)',
                slug: translation.slug + '-copy',
                description: translation.description,
                languageCode: translation.languageCode,
                customFields: translation.customFields,
            };
        });
        const productInput: CreateProductInput = {
            featuredAssetId: product.featuredAsset?.id,
            enabled: false,
            assetIds: product.assets.map(value => value.assetId),
            facetValueIds: product.facetValues.map(value => value.id),
            translations,
            customFields: product.customFields,
        };

        const duplicatedProduct = await productService.create(ctx, productInput);

        if (args.includeVariants) {
            const productVariants = await connection.getRepository(ctx, ProductVariant).find({
                where: {
                    productId: id,
                    deletedAt: IsNull(),
                },
                relations: {
                    options: {
                        group: true,
                    },
                    assets: true,
                    featuredAsset: true,
                    stockLevels: true,
                    facetValues: true,
                    productVariantPrices: true,
                    taxCategory: true,
                },
            });
            if (product.optionGroups && product.optionGroups.length) {
                for (const optionGroup of product.optionGroups) {
                    const newOptionGroup = await productOptionGroupService.create(ctx, {
                        code: optionGroup.code,
                        translations: optionGroup.translations.map(translation => {
                            return {
                                languageCode: translation.languageCode,
                                name: translation.name,
                                customFields: translation.customFields,
                            };
                        }),
                    });
                    const options: CreateProductOptionInput[] = optionGroup.options.map(option => {
                        return {
                            code: option.code,
                            productOptionGroupId: newOptionGroup.id,
                            translations: option.translations.map(translation => {
                                return {
                                    languageCode: translation.languageCode,
                                    name: translation.name,
                                    customFields: translation.customFields,
                                };
                            }),
                        };
                    });
                    if (options && options.length) {
                        for (const option of options) {
                            const newOption = await productOptionService.create(ctx, newOptionGroup, option);
                            newOptionGroup.options.push(newOption);
                        }
                    }
                    await productService.addOptionGroupToProduct(
                        ctx,
                        duplicatedProduct.id,
                        newOptionGroup.id,
                    );
                }
            }
            const newOptionGroups = await connection.getRepository(ctx, ProductOptionGroup).find({
                where: {
                    product: { id: duplicatedProduct.id },
                },
                relations: {
                    options: true,
                },
            });
            const variantInput: CreateProductVariantInput[] = productVariants.map((variant, i) => {
                const options = variant.options.map(existingOption => {
                    const newOption = newOptionGroups
                        .find(og => og.code === existingOption.group.code)
                        ?.options.find(o => o.code === existingOption.code);
                    if (!newOption) {
                        throw new InternalServerError(
                            `An error occurred when creating option ${existingOption.code}`,
                        );
                    }
                    return newOption;
                });
                const price =
                    variant.productVariantPrices.find(p => idsAreEqual(p.channelId, ctx.channelId))?.price ??
                    variant.productVariantPrices[0]?.price;
                return {
                    productId: duplicatedProduct.id,
                    price: price ?? variant.price,
                    sku: `${variant.sku}-copy`,
                    stockOnHand: 1,
                    featuredAssetId: variant.featuredAsset?.id,
                    taxCategoryId: variant.taxCategory?.id,
                    useGlobalOutOfStockThreshold: variant.useGlobalOutOfStockThreshold,
                    trackInventory: variant.trackInventory,
                    assetIds: variant.assets.map(value => value.assetId),
                    translations: variant.translations.map(translation => {
                        return {
                            languageCode: translation.languageCode,
                            name: translation.name,
                        };
                    }),
                    optionIds: options.map(option => option.id),
                    facetValueIds: variant.facetValues.map(value => value.id),
                    stockLevels: variant.stockLevels.map(stockLevel => ({
                        stockLocationId: stockLevel.stockLocationId,
                        stockOnHand: stockLevel.stockOnHand,
                    })),
                };
            });
            const duplicatedProductVariants = await productVariantService.create(ctx, variantInput);
            duplicatedProduct.variants = duplicatedProductVariants;
        }

        return duplicatedProduct;
    },
});
