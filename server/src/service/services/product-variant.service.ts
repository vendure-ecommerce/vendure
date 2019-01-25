import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { CreateProductVariantInput, UpdateProductVariantInput } from '../../../../shared/generated-types';
import { ID } from '../../../../shared/shared-types';
import { generateAllCombinations } from '../../../../shared/shared-utils';
import { RequestContext } from '../../api/common/request-context';
import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { EntityNotFoundError, InternalServerError } from '../../common/error/errors';
import { Translated } from '../../common/types/locale-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { TaxCategory } from '../../entity';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { ProductOption } from '../../entity/product-option/product-option.entity';
import { ProductVariantTranslation } from '../../entity/product-variant/product-variant-translation.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Product } from '../../entity/product/product.entity';
import { EventBus } from '../../event-bus/event-bus';
import { CatalogModificationEvent } from '../../event-bus/events/catalog-modification-event';
import { AssetUpdater } from '../helpers/asset-updater/asset-updater';
import { TaxCalculator } from '../helpers/tax-calculator/tax-calculator';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { translateDeep } from '../helpers/utils/translate-entity';

import { FacetValueService } from './facet-value.service';
import { TaxCategoryService } from './tax-category.service';
import { TaxRateService } from './tax-rate.service';
import { ZoneService } from './zone.service';

@Injectable()
export class ProductVariantService {
    constructor(
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
        private taxCategoryService: TaxCategoryService,
        private facetValueService: FacetValueService,
        private taxRateService: TaxRateService,
        private taxCalculator: TaxCalculator,
        private assetUpdater: AssetUpdater,
        private zoneService: ZoneService,
        private translatableSaver: TranslatableSaver,
        private eventBus: EventBus,
    ) {}

    findOne(ctx: RequestContext, productVariantId: ID): Promise<Translated<ProductVariant> | undefined> {
        const relations = ['product', 'product.featuredAsset', 'taxCategory'];
        return this.connection
            .getRepository(ProductVariant)
            .findOne(productVariantId, { relations })
            .then(result => {
                if (result) {
                    return translateDeep(this.applyChannelPriceAndTax(result, ctx), ctx.languageCode);
                }
            });
    }

    getVariantsByProductId(ctx: RequestContext, productId: ID): Promise<Array<Translated<ProductVariant>>> {
        return this.connection
            .getRepository(ProductVariant)
            .find({
                where: {
                    product: { id: productId } as any,
                },
                relations: [
                    'options',
                    'facetValues',
                    'facetValues.facet',
                    'taxCategory',
                    'assets',
                    'featuredAsset',
                ],
            })
            .then(variants =>
                variants.map(variant => {
                    const variantWithPrices = this.applyChannelPriceAndTax(variant, ctx);
                    return translateDeep(variantWithPrices, ctx.languageCode, [
                        'options',
                        'facetValues',
                        ['facetValues', 'facet'],
                    ]);
                }),
            );
    }

    async create(
        ctx: RequestContext,
        product: Product,
        input: CreateProductVariantInput,
    ): Promise<ProductVariant> {
        return await this.translatableSaver.create({
            input,
            entityType: ProductVariant,
            translationType: ProductVariantTranslation,
            beforeSave: async variant => {
                const { optionIds } = input;
                if (optionIds && optionIds.length) {
                    const selectedOptions = await this.connection
                        .getRepository(ProductOption)
                        .findByIds(optionIds);
                    variant.options = selectedOptions;
                }
                if (input.facetValueIds) {
                    variant.facetValues = await this.facetValueService.findByIds(input.facetValueIds);
                }
                variant.product = product;
                variant.taxCategory = { id: input.taxCategoryId } as any;
                await this.assetUpdater.updateEntityAssets(variant, input);
            },
            typeOrmSubscriberData: {
                channelId: ctx.channelId,
                taxCategoryId: input.taxCategoryId,
            },
        });
    }

    async update(ctx: RequestContext, input: UpdateProductVariantInput): Promise<Translated<ProductVariant>> {
        await this.translatableSaver.update({
            input,
            entityType: ProductVariant,
            translationType: ProductVariantTranslation,
            beforeSave: async updatedVariant => {
                if (input.taxCategoryId) {
                    const taxCategory = await this.taxCategoryService.findOne(input.taxCategoryId);
                    if (taxCategory) {
                        updatedVariant.taxCategory = taxCategory;
                    }
                }
                if (input.facetValueIds) {
                    updatedVariant.facetValues = await this.facetValueService.findByIds(input.facetValueIds);
                }
                await this.assetUpdater.updateEntityAssets(updatedVariant, input);
            },
            typeOrmSubscriberData: {
                channelId: ctx.channelId,
                taxCategoryId: input.taxCategoryId,
            },
        });
        const variant = await assertFound(
            this.connection.manager.getRepository(ProductVariant).findOne(input.id, {
                relations: [
                    'options',
                    'facetValues',
                    'facetValues.facet',
                    'taxCategory',
                    'assets',
                    'featuredAsset',
                ],
            }),
        );
        this.eventBus.publish(new CatalogModificationEvent(ctx, variant));
        return translateDeep(this.applyChannelPriceAndTax(variant, ctx), DEFAULT_LANGUAGE_CODE, [
            'options',
            'facetValues',
            ['facetValues', 'facet'],
        ]);
    }

    async generateVariantsForProduct(
        ctx: RequestContext,
        productId: ID,
        defaultTaxCategoryId?: string | null,
        defaultPrice?: number | null,
        defaultSku?: string | null,
    ): Promise<Array<Translated<ProductVariant>>> {
        const product = await this.connection.getRepository(Product).findOne(productId, {
            relations: ['optionGroups', 'optionGroups.options'],
            where: { deletedAt: null },
        });

        if (!product) {
            throw new EntityNotFoundError('Product', productId);
        }
        const defaultTranslation = product.translations.find(t => t.languageCode === DEFAULT_LANGUAGE_CODE);

        const productName = defaultTranslation ? defaultTranslation.name : `product_${productId}`;
        const optionCombinations = product.optionGroups.length
            ? generateAllCombinations(product.optionGroups.map(g => g.options))
            : [[]];

        let taxCategory: TaxCategory;
        if (defaultTaxCategoryId) {
            taxCategory = await getEntityOrThrow(this.connection, TaxCategory, defaultTaxCategoryId);
        } else {
            const taxCategories = await this.taxCategoryService.findAll();
            taxCategory = taxCategories[0];
        }

        const variants: ProductVariant[] = [];
        for (const options of optionCombinations) {
            const name = this.createVariantName(productName, options);
            const variant = await this.create(ctx, product, {
                sku: defaultSku || 'sku-not-set',
                price: defaultPrice || 0,
                optionIds: options.map(o => o.id) as string[],
                taxCategoryId: taxCategory.id as string,
                translations: [
                    {
                        languageCode: ctx.languageCode,
                        name,
                    },
                ],
            });
            variants.push(variant);
        }
        this.eventBus.publish(new CatalogModificationEvent(ctx, product));
        return variants.map(v => translateDeep(v, DEFAULT_LANGUAGE_CODE));
    }

    /**
     * Populates the `price` field with the price for the specified channel.
     */
    applyChannelPriceAndTax(variant: ProductVariant, ctx: RequestContext): ProductVariant {
        const channelPrice = variant.productVariantPrices.find(p => idsAreEqual(p.channelId, ctx.channelId));
        if (!channelPrice) {
            throw new InternalServerError(`error.no-price-found-for-channel`);
        }
        const { taxZoneStrategy } = this.configService.taxOptions;
        const zones = this.zoneService.findAll(ctx);
        const activeTaxZone = taxZoneStrategy.determineTaxZone(zones, ctx.channel);
        const applicableTaxRate = this.taxRateService.getApplicableTaxRate(
            activeTaxZone,
            variant.taxCategory,
        );

        const { price, priceIncludesTax, priceWithTax, priceWithoutTax } = this.taxCalculator.calculate(
            channelPrice.price,
            variant.taxCategory,
            activeTaxZone,
            ctx,
        );

        variant.price = price;
        variant.priceIncludesTax = priceIncludesTax;
        variant.priceWithTax = priceWithTax;
        variant.taxRateApplied = applicableTaxRate;
        variant.currencyCode = ctx.channel.currencyCode;
        return variant;
    }

    private createVariantName(productName: string, options: ProductOption[]): string {
        const optionsSuffix = options
            .map(option => {
                const defaultTranslation = option.translations.find(
                    t => t.languageCode === DEFAULT_LANGUAGE_CODE,
                );
                return defaultTranslation ? defaultTranslation.name : option.code;
            })
            .join(' ');

        return options.length ? `${productName} ${optionsSuffix}` : productName;
    }
}
