import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { CreateProductVariantInput, DeletionResponse, DeletionResult, UpdateProductVariantInput } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { generateAllCombinations } from '@vendure/common/lib/shared-utils';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { EntityNotFoundError, InternalServerError, UserInputError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { Asset, ProductOptionGroup, ProductVariantPrice, TaxCategory } from '../../entity';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { ProductOption } from '../../entity/product-option/product-option.entity';
import { ProductVariantTranslation } from '../../entity/product-variant/product-variant-translation.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Product } from '../../entity/product/product.entity';
import { EventBus } from '../../event-bus/event-bus';
import { CatalogModificationEvent } from '../../event-bus/events/catalog-modification-event';
import { AssetUpdater } from '../helpers/asset-updater/asset-updater';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TaxCalculator } from '../helpers/tax-calculator/tax-calculator';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { samplesEach } from '../helpers/utils/samples-each';
import { translateDeep } from '../helpers/utils/translate-entity';

import { FacetValueService } from './facet-value.service';
import { GlobalSettingsService } from './global-settings.service';
import { StockMovementService } from './stock-movement.service';
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
        private listQueryBuilder: ListQueryBuilder,
        private globalSettingsService: GlobalSettingsService,
        private stockMovementService: StockMovementService,
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
                    deletedAt: null,
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

    getVariantsByCollectionId(
        ctx: RequestContext,
        collectionId: ID,
        options: ListQueryOptions<ProductVariant>,
    ): Promise<PaginatedList<Translated<ProductVariant>>> {
        const qb = this.listQueryBuilder
            .build(ProductVariant, options, {
                relations: ['taxCategory'],
                channelId: ctx.channelId,
            })
            .leftJoin('productvariant.collections', 'collection')
            .leftJoin('productvariant.product', 'product')
            .andWhere('product.deletedAt IS NULL', { deletedAt: null })
            .andWhere('collection.id = :collectionId', { collectionId });

        if (options && options.filter && options.filter.enabled && options.filter.enabled.eq === true) {
            qb.andWhere('product.enabled = :enabled', { enabled: true });
        }

        return qb.getManyAndCount().then(async ([variants, totalItems]) => {
            const items = variants.map(variant => {
                const variantWithPrices = this.applyChannelPriceAndTax(variant, ctx);
                return translateDeep(variantWithPrices, ctx.languageCode);
            });
            return {
                items,
                totalItems,
            };
        });
    }

    getOptionsForVariant(ctx: RequestContext, variantId: ID): Promise<Array<Translated<ProductOption>>> {
        return this.connection
            .getRepository(ProductVariant)
            .findOne(variantId, { relations: ['options'] })
            .then(variant => (!variant ? [] : variant.options.map(o => translateDeep(o, ctx.languageCode))));
    }

    async getAssetsForVariant(ctx: RequestContext, variantId: ID): Promise<Asset[]> {
        const variant = await getEntityOrThrow(this.connection, ProductVariant, variantId, {
            relations: ['assets'],
        });
        return variant.assets;
    }

    async getFeaturedAssetForVariant(ctx: RequestContext, variantId: ID): Promise<Asset> {
        const variant = await getEntityOrThrow(this.connection, ProductVariant, variantId, {
            relations: ['featuredAsset'],
        });
        return variant.featuredAsset;
    }

    getFacetValuesForVariant(ctx: RequestContext, variantId: ID): Promise<Array<Translated<FacetValue>>> {
        return this.connection
            .getRepository(ProductVariant)
            .findOne(variantId, { relations: ['facetValues', 'facetValues.facet'] })
            .then(variant =>
                !variant ? [] : variant.facetValues.map(o => translateDeep(o, ctx.languageCode, ['facet'])),
            );
    }

    async create(ctx: RequestContext, input: CreateProductVariantInput): Promise<Translated<ProductVariant>> {
        await this.validateVariantOptionIds(input);
        if (!input.optionIds) {
            input.optionIds = [];
        }
        if (input.price == null) {
            input.price = 0;
        }
        input.taxCategoryId = (await this.getTaxCategoryForNewVariant(input.taxCategoryId)).id as string;

        const createdVariant = await this.translatableSaver.create({
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
                if (input.trackInventory == null) {
                    variant.trackInventory = (await this.globalSettingsService.getSettings()).trackInventory;
                }
                variant.product = { id: input.productId } as any;
                variant.taxCategory = { id: input.taxCategoryId } as any;
                await this.assetUpdater.updateEntityAssets(variant, input);
            },
            typeOrmSubscriberData: {
                channelId: ctx.channelId,
                taxCategoryId: input.taxCategoryId,
            },
        });
        if (input.stockOnHand != null && input.stockOnHand !== 0) {
            await this.stockMovementService.adjustProductVariantStock(
                createdVariant.id,
                0,
                input.stockOnHand,
            );
        }
        const variantPrice = new ProductVariantPrice({
            price: createdVariant.price,
            channelId: ctx.channelId,
        });
        variantPrice.variant = createdVariant;
        await this.connection.getRepository(ProductVariantPrice).save(variantPrice);
        return await assertFound(this.findOne(ctx, createdVariant.id));
    }

    async update(ctx: RequestContext, input: UpdateProductVariantInput): Promise<Translated<ProductVariant>> {
        const existingVariant = await getEntityOrThrow(this.connection, ProductVariant, input.id);
        if (input.stockOnHand && input.stockOnHand < 0) {
            throw new UserInputError('error.stockonhand-cannot-be-negative');
        }
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
                if (input.stockOnHand != null) {
                    await this.stockMovementService.adjustProductVariantStock(
                        existingVariant.id,
                        existingVariant.stockOnHand,
                        input.stockOnHand,
                    );
                }
                await this.assetUpdater.updateEntityAssets(updatedVariant, input);
            },
            typeOrmSubscriberData: {
                channelId: ctx.channelId,
                taxCategoryId: input.taxCategoryId,
            },
        });
        if (input.price != null) {
            const variantPriceRepository = this.connection.getRepository(ProductVariantPrice);
            const variantPrice = await variantPriceRepository.findOne({
                where: {
                    variant: input.id,
                    channelId: ctx.channelId,
                },
            });
            if (!variantPrice) {
                throw new InternalServerError(`error.could-not-find-product-variant-price`);
            }
            variantPrice.price = input.price;
            await variantPriceRepository.save(variantPrice);
        }
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
        return translateDeep(this.applyChannelPriceAndTax(variant, ctx), ctx.languageCode, [
            'options',
            'facetValues',
            ['facetValues', 'facet'],
        ]);
    }

    async softDelete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const variant = await getEntityOrThrow(this.connection, ProductVariant, id);
        variant.deletedAt = new Date();
        await this.connection.getRepository(ProductVariant).save(variant);
        this.eventBus.publish(new CatalogModificationEvent(ctx, variant));
        return {
            result: DeletionResult.DELETED,
        };
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

        if (!taxCategory) {
            // there is no TaxCategory set up, so create a default
            taxCategory = await this.taxCategoryService.create({ name: 'Standard Tax' });
        }

        const variants: ProductVariant[] = [];
        for (const options of optionCombinations) {
            const name = this.createVariantName(productName, options);
            const variant = await this.create(ctx, {
                productId: productId as string,
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

    private async validateVariantOptionIds(input: CreateProductVariantInput) {
        const product = await getEntityOrThrow(this.connection, Product, input.productId, {
            relations: ['optionGroups', 'optionGroups.options', 'variants', 'variants.options'],
        });
        const optionIds = [...(input.optionIds || [])];

        if (optionIds.length !== product.optionGroups.length) {
            this.throwIncompatibleOptionsError(product.optionGroups);
        }
        if (!samplesEach(optionIds, product.optionGroups.map(g => g.options.map(o => o.id)))) {
            this.throwIncompatibleOptionsError(product.optionGroups);
        }
        /*product.optionGroups.forEach((group, i) => {
            const optionId = optionIds[i];
            const index = group.options.findIndex(o => idsAreEqual(o.id, optionId));
            if (-1 < index) {
                optionIds[i] = '__matched__';
            } else {
                console.log('input', input);
                console.log('optionIds', optionIds);
                console.log('product.optionGroups', product.optionGroups);
                console.log('product.optionGroups', product.optionGroups.map(g => g.options));
                this.throwIncompatibleOptionsError(product.optionGroups);
            }
        });*/
        product.variants.forEach(variant => {
            const variantOptionIds = this.sortJoin(variant.options, ',', 'id');
            const inputOptionIds = this.sortJoin(input.optionIds || [], ',');
            if (variantOptionIds === inputOptionIds) {
                throw new UserInputError('error.product-variant-options-combination-already-exists', {
                    optionNames: this.sortJoin(variant.options, ', ', 'code'),
                });
            }
        });
    }

    private throwIncompatibleOptionsError(optionGroups: ProductOptionGroup[]) {
        throw new UserInputError('error.product-variant-option-ids-not-compatible', {
            groupNames: this.sortJoin(optionGroups, ', ', 'code'),
        });
    }

    private sortJoin<T>(arr: T[], glue: string, prop?: keyof T): string {
        return arr
            .map(x => prop ? x[prop] : x)
            .sort()
            .join(glue);
    }

    private async getTaxCategoryForNewVariant(
        taxCategoryId: string | null | undefined,
    ): Promise<TaxCategory> {
        let taxCategory: TaxCategory;
        if (taxCategoryId) {
            taxCategory = await getEntityOrThrow(this.connection, TaxCategory, taxCategoryId);
        } else {
            const taxCategories = await this.taxCategoryService.findAll();
            taxCategory = taxCategories[0];
        }
        if (!taxCategory) {
            // there is no TaxCategory set up, so create a default
            taxCategory = await this.taxCategoryService.create({ name: 'Standard Tax' });
        }
        return taxCategory;
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
