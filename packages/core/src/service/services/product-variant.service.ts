import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    CreateProductVariantInput,
    DeletionResponse,
    DeletionResult,
    UpdateProductVariantInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { InternalServerError, UserInputError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { OrderLine, ProductOptionGroup, ProductVariantPrice, TaxCategory } from '../../entity';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { ProductOption } from '../../entity/product-option/product-option.entity';
import { ProductVariantTranslation } from '../../entity/product-variant/product-variant-translation.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Product } from '../../entity/product/product.entity';
import { EventBus } from '../../event-bus/event-bus';
import { ProductVariantEvent } from '../../event-bus/events/product-variant-event';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TaxCalculator } from '../helpers/tax-calculator/tax-calculator';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { samplesEach } from '../helpers/utils/samples-each';
import { translateDeep } from '../helpers/utils/translate-entity';

import { AssetService } from './asset.service';
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
        private assetService: AssetService,
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
            .then((result) => {
                if (result) {
                    return translateDeep(this.applyChannelPriceAndTax(result, ctx), ctx.languageCode, [
                        'product',
                    ]);
                }
            });
    }

    findByIds(ctx: RequestContext, ids: ID[]): Promise<Array<Translated<ProductVariant>>> {
        return this.connection.manager
            .getRepository(ProductVariant)
            .findByIds(ids, {
                relations: [
                    'options',
                    'facetValues',
                    'facetValues.facet',
                    'taxCategory',
                    'assets',
                    'featuredAsset',
                ],
            })
            .then((variants) => {
                return variants.map((variant) =>
                    translateDeep(this.applyChannelPriceAndTax(variant, ctx), ctx.languageCode, [
                        'options',
                        'facetValues',
                        ['facetValues', 'facet'],
                    ]),
                );
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
                order: {
                    id: 'ASC',
                },
            })
            .then((variants) =>
                variants.map((variant) => {
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
            const items = variants.map((variant) => {
                const variantWithPrices = this.applyChannelPriceAndTax(variant, ctx);
                return translateDeep(variantWithPrices, ctx.languageCode);
            });
            return {
                items,
                totalItems,
            };
        });
    }

    async getVariantByOrderLineId(ctx: RequestContext, orderLineId: ID): Promise<Translated<ProductVariant>> {
        const { productVariant } = await getEntityOrThrow(this.connection, OrderLine, orderLineId, {
            relations: ['productVariant'],
        });
        return translateDeep(productVariant, ctx.languageCode);
    }

    getOptionsForVariant(ctx: RequestContext, variantId: ID): Promise<Array<Translated<ProductOption>>> {
        return this.connection
            .getRepository(ProductVariant)
            .findOne(variantId, { relations: ['options'] })
            .then((variant) =>
                !variant ? [] : variant.options.map((o) => translateDeep(o, ctx.languageCode)),
            );
    }

    getFacetValuesForVariant(ctx: RequestContext, variantId: ID): Promise<Array<Translated<FacetValue>>> {
        return this.connection
            .getRepository(ProductVariant)
            .findOne(variantId, { relations: ['facetValues', 'facetValues.facet'] })
            .then((variant) =>
                !variant ? [] : variant.facetValues.map((o) => translateDeep(o, ctx.languageCode, ['facet'])),
            );
    }

    /**
     * Returns the Product associated with the ProductVariant. Whereas the `ProductService.findOne()`
     * method performs a large multi-table join with all the typical data needed for a "product detail"
     * page, this method returns on the Product itself.
     */
    async getProductForVariant(ctx: RequestContext, variant: ProductVariant): Promise<Translated<Product>> {
        const product = await getEntityOrThrow(this.connection, Product, variant.productId);
        return translateDeep(product, ctx.languageCode);
    }

    async create(
        ctx: RequestContext,
        input: CreateProductVariantInput[],
    ): Promise<Array<Translated<ProductVariant>>> {
        const ids: ID[] = [];
        for (const productInput of input) {
            const id = await this.createSingle(ctx, productInput);
            ids.push(id);
        }
        const createdVariants = await this.findByIds(ctx, ids);
        this.eventBus.publish(new ProductVariantEvent(ctx, createdVariants, 'updated'));
        return createdVariants;
    }

    async update(
        ctx: RequestContext,
        input: UpdateProductVariantInput[],
    ): Promise<Array<Translated<ProductVariant>>> {
        for (const productInput of input) {
            await this.updateSingle(ctx, productInput);
        }
        const updatedVariants = await this.findByIds(
            ctx,
            input.map((i) => i.id),
        );
        this.eventBus.publish(new ProductVariantEvent(ctx, updatedVariants, 'updated'));
        return updatedVariants;
    }

    private async createSingle(ctx: RequestContext, input: CreateProductVariantInput): Promise<ID> {
        await this.validateVariantOptionIds(ctx, input);
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
            beforeSave: async (variant) => {
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
                await this.assetService.updateFeaturedAsset(variant, input);
            },
            typeOrmSubscriberData: {
                channelId: ctx.channelId,
                taxCategoryId: input.taxCategoryId,
            },
        });
        await this.assetService.updateEntityAssets(createdVariant, input);
        if (input.stockOnHand != null && input.stockOnHand !== 0) {
            await this.stockMovementService.adjustProductVariantStock(
                createdVariant.id,
                0,
                input.stockOnHand,
            );
        }

        await this.createProductVariantPrice(createdVariant.id, createdVariant.price, ctx.channelId);
        return createdVariant.id;
    }

    private async updateSingle(ctx: RequestContext, input: UpdateProductVariantInput): Promise<ID> {
        const existingVariant = await getEntityOrThrow(this.connection, ProductVariant, input.id);
        if (input.stockOnHand && input.stockOnHand < 0) {
            throw new UserInputError('error.stockonhand-cannot-be-negative');
        }
        await this.translatableSaver.update({
            input,
            entityType: ProductVariant,
            translationType: ProductVariantTranslation,
            beforeSave: async (updatedVariant) => {
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
                await this.assetService.updateFeaturedAsset(updatedVariant, input);
                await this.assetService.updateEntityAssets(updatedVariant, input);
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
        return existingVariant.id;
    }

    /**
     * Creates a ProductVariantPrice for the given ProductVariant/Channel combination.
     */
    async createProductVariantPrice(
        productVariantId: ID,
        price: number,
        channelId: ID,
    ): Promise<ProductVariantPrice> {
        const variantPrice = new ProductVariantPrice({
            price,
            channelId,
        });
        variantPrice.variant = new ProductVariant({ id: productVariantId });
        return this.connection.getRepository(ProductVariantPrice).save(variantPrice);
    }

    async softDelete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const variant = await getEntityOrThrow(this.connection, ProductVariant, id);
        variant.deletedAt = new Date();
        await this.connection.getRepository(ProductVariant).save(variant, { reload: false });
        this.eventBus.publish(new ProductVariantEvent(ctx, [variant], 'deleted'));
        return {
            result: DeletionResult.DELETED,
        };
    }

    /**
     * Populates the `price` field with the price for the specified channel.
     */
    applyChannelPriceAndTax(variant: ProductVariant, ctx: RequestContext): ProductVariant {
        const channelPrice = variant.productVariantPrices.find((p) =>
            idsAreEqual(p.channelId, ctx.channelId),
        );
        if (!channelPrice) {
            throw new InternalServerError(`error.no-price-found-for-channel`);
        }
        const { taxZoneStrategy } = this.configService.taxOptions;
        const zones = this.zoneService.findAll(ctx);
        const activeTaxZone = taxZoneStrategy.determineTaxZone(zones, ctx.channel);
        if (!activeTaxZone) {
            throw new InternalServerError(`error.no-active-tax-zone`);
        }
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

    private async validateVariantOptionIds(ctx: RequestContext, input: CreateProductVariantInput) {
        // this could be done with less queries but depending on the data, node will crash
        // https://github.com/vendure-ecommerce/vendure/issues/328
        const optionGroups = (
            await getEntityOrThrow(
                this.connection,
                Product,
                input.productId,
                ctx.channelId,
                {
                    relations: ['optionGroups', 'optionGroups.options'],
                },
                false,
            )
        ).optionGroups;

        const optionIds = input.optionIds || [];

        if (optionIds.length !== optionGroups.length) {
            this.throwIncompatibleOptionsError(optionGroups);
        }
        if (
            !samplesEach(
                optionIds,
                optionGroups.map((g) => g.options.map((o) => o.id)),
            )
        ) {
            this.throwIncompatibleOptionsError(optionGroups);
        }

        const product = await getEntityOrThrow(
            this.connection,
            Product,
            input.productId,
            ctx.channelId,
            {
                relations: ['variants', 'variants.options'],
            },
            false,
        );

        const inputOptionIds = this.sortJoin(optionIds, ',');

        product.variants.forEach((variant) => {
            const variantOptionIds = this.sortJoin(variant.options, ',', 'id');
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
            .map((x) => (prop ? x[prop] : x))
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
}
