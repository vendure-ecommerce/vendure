import { Injectable } from '@nestjs/common';
import {
    AssignProductVariantsToChannelInput,
    CreateProductVariantInput,
    DeletionResponse,
    DeletionResult,
    GlobalFlag,
    Permission,
    RemoveProductVariantsFromChannelInput,
    UpdateProductVariantInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { RequestContextCacheService } from '../../cache/request-context-cache.service';
import { ForbiddenError, InternalServerError, UserInputError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import {
    Channel,
    Order,
    OrderLine,
    ProductOptionGroup,
    ProductVariantPrice,
    TaxCategory,
} from '../../entity';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { ProductOption } from '../../entity/product-option/product-option.entity';
import { ProductVariantTranslation } from '../../entity/product-variant/product-variant-translation.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Product } from '../../entity/product/product.entity';
import { EventBus } from '../../event-bus/event-bus';
import { ProductVariantChannelEvent } from '../../event-bus/events/product-variant-channel-event';
import { ProductVariantEvent } from '../../event-bus/events/product-variant-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { ProductPriceApplicator } from '../helpers/product-price-applicator/product-price-applicator';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { samplesEach } from '../helpers/utils/samples-each';
import { translateDeep } from '../helpers/utils/translate-entity';

import { AssetService } from './asset.service';
import { ChannelService } from './channel.service';
import { FacetValueService } from './facet-value.service';
import { GlobalSettingsService } from './global-settings.service';
import { RoleService } from './role.service';
import { StockMovementService } from './stock-movement.service';
import { TaxCategoryService } from './tax-category.service';

/**
 * @description
 * Contains methods relating to {@link ProductVariant} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class ProductVariantService {
    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private taxCategoryService: TaxCategoryService,
        private facetValueService: FacetValueService,
        private assetService: AssetService,
        private translatableSaver: TranslatableSaver,
        private eventBus: EventBus,
        private listQueryBuilder: ListQueryBuilder,
        private globalSettingsService: GlobalSettingsService,
        private stockMovementService: StockMovementService,
        private channelService: ChannelService,
        private roleService: RoleService,
        private customFieldRelationService: CustomFieldRelationService,
        private requestCache: RequestContextCacheService,
        private productPriceApplicator: ProductPriceApplicator,
    ) {}

    async findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<ProductVariant>,
    ): Promise<PaginatedList<Translated<ProductVariant>>> {
        const relations = ['featuredAsset', 'taxCategory', 'channels'];
        return this.listQueryBuilder
            .build(ProductVariant, options, {
                relations,
                channelId: ctx.channelId,
                where: { deletedAt: null },
                ctx,
            })
            .getManyAndCount()
            .then(async ([variants, totalItems]) => {
                const items = await Promise.all(
                    variants.map(async variant =>
                        translateDeep(await this.applyChannelPriceAndTax(variant, ctx), ctx.languageCode),
                    ),
                );
                return {
                    items,
                    totalItems,
                };
            });
    }

    findOne(ctx: RequestContext, productVariantId: ID): Promise<Translated<ProductVariant> | undefined> {
        const relations = ['product', 'product.featuredAsset', 'taxCategory'];
        return this.connection
            .findOneInChannel(ctx, ProductVariant, productVariantId, ctx.channelId, {
                relations,
                where: { deletedAt: null },
            })
            .then(async result => {
                if (result) {
                    return translateDeep(await this.applyChannelPriceAndTax(result, ctx), ctx.languageCode, [
                        'product',
                    ]);
                }
            });
    }

    findByIds(ctx: RequestContext, ids: ID[]): Promise<Array<Translated<ProductVariant>>> {
        return this.connection
            .findByIdsInChannel(ctx, ProductVariant, ids, ctx.channelId, {
                relations: [
                    'options',
                    'facetValues',
                    'facetValues.facet',
                    'taxCategory',
                    'assets',
                    'featuredAsset',
                ],
            })
            .then(variants => {
                return Promise.all(
                    variants.map(async variant =>
                        translateDeep(await this.applyChannelPriceAndTax(variant, ctx), ctx.languageCode, [
                            'options',
                            'facetValues',
                            ['facetValues', 'facet'],
                        ]),
                    ),
                );
            });
    }

    getVariantsByProductId(
        ctx: RequestContext,
        productId: ID,
        options: ListQueryOptions<ProductVariant> = {},
    ): Promise<PaginatedList<Translated<ProductVariant>>> {
        const relations = [
            'options',
            'facetValues',
            'facetValues.facet',
            'taxCategory',
            'assets',
            'featuredAsset',
        ];

        const qb = this.listQueryBuilder
            .build(ProductVariant, options, {
                relations,
                orderBy: { id: 'ASC' },
                where: { deletedAt: null },
                ctx,
            })
            .innerJoinAndSelect('productvariant.channels', 'channel', 'channel.id = :channelId', {
                channelId: ctx.channelId,
            })
            .innerJoinAndSelect('productvariant.product', 'product', 'product.id = :productId', {
                productId,
            });

        if (ctx.apiType === 'shop') {
            qb.andWhere('productvariant.enabled = :enabled', { enabled: true });
        }

        return qb.getManyAndCount().then(async ([variants, totalItems]) => {
            const items = await Promise.all(
                variants.map(async variant => {
                    const variantWithPrices = await this.applyChannelPriceAndTax(variant, ctx);
                    return translateDeep(variantWithPrices, ctx.languageCode, [
                        'options',
                        'facetValues',
                        ['facetValues', 'facet'],
                    ]);
                }),
            );

            return {
                items,
                totalItems,
            };
        });
    }

    /**
     * @description
     * Returns a {@link PaginatedList} of all ProductVariants associated with the given Collection.
     */
    getVariantsByCollectionId(
        ctx: RequestContext,
        collectionId: ID,
        options: ListQueryOptions<ProductVariant>,
    ): Promise<PaginatedList<Translated<ProductVariant>>> {
        const qb = this.listQueryBuilder
            .build(ProductVariant, options, {
                relations: ['taxCategory', 'channels'],
                channelId: ctx.channelId,
                ctx,
            })
            .leftJoin('productvariant.collections', 'collection')
            .leftJoin('productvariant.product', 'product')
            .andWhere('product.deletedAt IS NULL')
            .andWhere('productvariant.deletedAt IS NULL')
            .andWhere('collection.id = :collectionId', { collectionId });

        if (options && options.filter && options.filter.enabled && options.filter.enabled.eq === true) {
            qb.andWhere('product.enabled = :enabled', { enabled: true });
        }

        return qb.getManyAndCount().then(async ([variants, totalItems]) => {
            const items = await Promise.all(
                variants.map(async variant => {
                    const variantWithPrices = await this.applyChannelPriceAndTax(variant, ctx);
                    return translateDeep(variantWithPrices, ctx.languageCode);
                }),
            );
            return {
                items,
                totalItems,
            };
        });
    }

    /**
     * @description
     * Returns all Channels to which the ProductVariant is assigned.
     */
    async getProductVariantChannels(ctx: RequestContext, productVariantId: ID): Promise<Channel[]> {
        const variant = await this.connection.getEntityOrThrow(ctx, ProductVariant, productVariantId, {
            relations: ['channels'],
            channelId: ctx.channelId,
        });
        return variant.channels;
    }

    /**
     * @description
     * Returns the ProductVariant associated with the given {@link OrderLine}.
     */
    async getVariantByOrderLineId(ctx: RequestContext, orderLineId: ID): Promise<Translated<ProductVariant>> {
        const { productVariant } = await this.connection.getEntityOrThrow(ctx, OrderLine, orderLineId, {
            relations: ['productVariant'],
        });
        return translateDeep(productVariant, ctx.languageCode);
    }

    /**
     * @description
     * Returns the {@link ProductOption}s for the given ProductVariant.
     */
    getOptionsForVariant(ctx: RequestContext, variantId: ID): Promise<Array<Translated<ProductOption>>> {
        return this.connection
            .findOneInChannel(ctx, ProductVariant, variantId, ctx.channelId, {
                relations: ['options'],
            })
            .then(variant => (!variant ? [] : variant.options.map(o => translateDeep(o, ctx.languageCode))));
    }

    getFacetValuesForVariant(ctx: RequestContext, variantId: ID): Promise<Array<Translated<FacetValue>>> {
        return this.connection
            .findOneInChannel(ctx, ProductVariant, variantId, ctx.channelId, {
                relations: ['facetValues', 'facetValues.facet', 'facetValues.channels'],
            })
            .then(variant =>
                !variant ? [] : variant.facetValues.map(o => translateDeep(o, ctx.languageCode, ['facet'])),
            );
    }

    /**
     * @description
     * Returns the Product associated with the ProductVariant. Whereas the `ProductService.findOne()`
     * method performs a large multi-table join with all the typical data needed for a "product detail"
     * page, this method returns only the Product itself.
     */
    async getProductForVariant(ctx: RequestContext, variant: ProductVariant): Promise<Translated<Product>> {
        const product = await this.connection.getEntityOrThrow(ctx, Product, variant.productId, {
            includeSoftDeleted: true,
        });
        return translateDeep(product, ctx.languageCode);
    }

    /**
     * @description
     * Returns the number of saleable units of the ProductVariant, i.e. how many are available
     * for purchase by Customers. This is determined by the ProductVariant's `stockOnHand` value,
     * as well as the local and global `outOfStockThreshold` settings.
     */
    async getSaleableStockLevel(ctx: RequestContext, variant: ProductVariant): Promise<number> {
        const { outOfStockThreshold, trackInventory } = await this.requestCache.get(
            ctx,
            'globalSettings',
            () => this.globalSettingsService.getSettings(ctx),
        );

        const inventoryNotTracked =
            variant.trackInventory === GlobalFlag.FALSE ||
            (variant.trackInventory === GlobalFlag.INHERIT && trackInventory === false);
        if (inventoryNotTracked) {
            return Number.MAX_SAFE_INTEGER;
        }

        const effectiveOutOfStockThreshold = variant.useGlobalOutOfStockThreshold
            ? outOfStockThreshold
            : variant.outOfStockThreshold;

        return variant.stockOnHand - variant.stockAllocated - effectiveOutOfStockThreshold;
    }

    /**
     * @description
     * Returns the stockLevel to display to the customer, as specified by the configured
     * {@link StockDisplayStrategy}.
     */
    async getDisplayStockLevel(ctx: RequestContext, variant: ProductVariant): Promise<string> {
        const { stockDisplayStrategy } = this.configService.catalogOptions;
        const saleableStockLevel = await this.getSaleableStockLevel(ctx, variant);
        return stockDisplayStrategy.getStockLevel(ctx, variant, saleableStockLevel);
    }

    /**
     * @description
     * Returns the number of fulfillable units of the ProductVariant, equivalent to stockOnHand
     * for those variants which are tracking inventory.
     */
    async getFulfillableStockLevel(ctx: RequestContext, variant: ProductVariant): Promise<number> {
        const { outOfStockThreshold, trackInventory } = await this.globalSettingsService.getSettings(ctx);
        const inventoryNotTracked =
            variant.trackInventory === GlobalFlag.FALSE ||
            (variant.trackInventory === GlobalFlag.INHERIT && trackInventory === false);
        if (inventoryNotTracked) {
            return Number.MAX_SAFE_INTEGER;
        }

        return variant.stockOnHand;
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
        this.eventBus.publish(new ProductVariantEvent(ctx, createdVariants, 'created', input));
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
            input.map(i => i.id),
        );
        this.eventBus.publish(new ProductVariantEvent(ctx, updatedVariants, 'updated', input));
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
        input.taxCategoryId = (await this.getTaxCategoryForNewVariant(ctx, input.taxCategoryId)).id;
        const inputWithoutPrice = {
            ...input,
        };
        delete inputWithoutPrice.price;
        const createdVariant = await this.translatableSaver.create({
            ctx,
            input: inputWithoutPrice,
            entityType: ProductVariant,
            translationType: ProductVariantTranslation,
            beforeSave: async variant => {
                const { optionIds } = input;
                if (optionIds && optionIds.length) {
                    const selectedOptions = await this.connection
                        .getRepository(ctx, ProductOption)
                        .findByIds(optionIds);
                    variant.options = selectedOptions;
                }
                if (input.facetValueIds) {
                    variant.facetValues = await this.facetValueService.findByIds(ctx, input.facetValueIds);
                }
                variant.product = { id: input.productId } as any;
                variant.taxCategory = { id: input.taxCategoryId } as any;
                await this.assetService.updateFeaturedAsset(ctx, variant, input);
                await this.channelService.assignToCurrentChannel(variant, ctx);
            },
            typeOrmSubscriberData: {
                channelId: ctx.channelId,
                taxCategoryId: input.taxCategoryId,
            },
        });
        await this.customFieldRelationService.updateRelations(ctx, ProductVariant, input, createdVariant);
        await this.assetService.updateEntityAssets(ctx, createdVariant, input);
        if (input.stockOnHand != null && input.stockOnHand !== 0) {
            await this.stockMovementService.adjustProductVariantStock(
                ctx,
                createdVariant.id,
                0,
                input.stockOnHand,
            );
        }

        const defaultChannelId = (await this.channelService.getDefaultChannel()).id;
        await this.createOrUpdateProductVariantPrice(ctx, createdVariant.id, input.price, ctx.channelId);
        if (!idsAreEqual(ctx.channelId, defaultChannelId)) {
            // When creating a ProductVariant _not_ in the default Channel, we still need to
            // create a ProductVariantPrice for it in the default Channel, otherwise errors will
            // result when trying to query it there.
            await this.createOrUpdateProductVariantPrice(
                ctx,
                createdVariant.id,
                input.price,
                defaultChannelId,
            );
        }
        return createdVariant.id;
    }

    private async updateSingle(ctx: RequestContext, input: UpdateProductVariantInput): Promise<ID> {
        const existingVariant = await this.connection.getEntityOrThrow(ctx, ProductVariant, input.id, {
            channelId: ctx.channelId,
            relations: ['facetValues', 'facetValues.channels'],
        });
        if (input.stockOnHand && input.stockOnHand < 0) {
            throw new UserInputError('error.stockonhand-cannot-be-negative');
        }
        const inputWithoutPrice = {
            ...input,
        };
        delete inputWithoutPrice.price;
        const updatedVariant = await this.translatableSaver.update({
            ctx,
            input: inputWithoutPrice,
            entityType: ProductVariant,
            translationType: ProductVariantTranslation,
            beforeSave: async v => {
                if (input.taxCategoryId) {
                    const taxCategory = await this.taxCategoryService.findOne(ctx, input.taxCategoryId);
                    if (taxCategory) {
                        v.taxCategory = taxCategory;
                    }
                }
                if (input.facetValueIds) {
                    const facetValuesInOtherChannels = existingVariant.facetValues.filter(fv =>
                        fv.channels.every(channel => !idsAreEqual(channel.id, ctx.channelId)),
                    );
                    v.facetValues = [
                        ...facetValuesInOtherChannels,
                        ...(await this.facetValueService.findByIds(ctx, input.facetValueIds)),
                    ];
                }
                if (input.stockOnHand != null) {
                    await this.stockMovementService.adjustProductVariantStock(
                        ctx,
                        existingVariant.id,
                        existingVariant.stockOnHand,
                        input.stockOnHand,
                    );
                }
                await this.assetService.updateFeaturedAsset(ctx, v, input);
                await this.assetService.updateEntityAssets(ctx, v, input);
            },
            typeOrmSubscriberData: {
                channelId: ctx.channelId,
                taxCategoryId: input.taxCategoryId,
            },
        });
        await this.customFieldRelationService.updateRelations(ctx, ProductVariant, input, updatedVariant);
        if (input.price != null) {
            const variantPriceRepository = this.connection.getRepository(ctx, ProductVariantPrice);
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
        return updatedVariant.id;
    }

    /**
     * @description
     * Creates a {@link ProductVariantPrice} for the given ProductVariant/Channel combination.
     */
    async createOrUpdateProductVariantPrice(
        ctx: RequestContext,
        productVariantId: ID,
        price: number,
        channelId: ID,
    ): Promise<ProductVariantPrice> {
        let variantPrice = await this.connection.getRepository(ctx, ProductVariantPrice).findOne({
            where: {
                variant: productVariantId,
                channelId,
            },
        });
        if (!variantPrice) {
            variantPrice = new ProductVariantPrice({
                channelId,
                variant: new ProductVariant({ id: productVariantId }),
            });
        }
        variantPrice.price = price;
        return this.connection.getRepository(ctx, ProductVariantPrice).save(variantPrice);
    }

    async softDelete(ctx: RequestContext, id: ID | ID[]): Promise<DeletionResponse> {
        const ids = Array.isArray(id) ? id : [id];
        const variants = await this.connection.getRepository(ctx, ProductVariant).findByIds(ids);
        for (const variant of variants) {
            variant.deletedAt = new Date();
        }
        await this.connection.getRepository(ctx, ProductVariant).save(variants, { reload: false });
        this.eventBus.publish(new ProductVariantEvent(ctx, variants, 'deleted', id));
        return {
            result: DeletionResult.DELETED,
        };
    }

    /**
     * @description
     * This method is intended to be used by the ProductVariant GraphQL entity resolver to resolve the
     * price-related fields which need to be populated at run-time using the `applyChannelPriceAndTax`
     * method.
     *
     * Is optimized to make as few DB calls as possible using caching based on the open request.
     */
    async hydratePriceFields<F extends 'currencyCode' | 'price' | 'priceWithTax' | 'taxRateApplied'>(
        ctx: RequestContext,
        variant: ProductVariant,
        priceField: F,
    ): Promise<ProductVariant[F]> {
        const cacheKey = `hydrate-variant-price-fields-${variant.id}`;
        let populatePricesPromise = this.requestCache.get<Promise<ProductVariant>>(ctx, cacheKey);

        if (!populatePricesPromise) {
            populatePricesPromise = new Promise(async (resolve, reject) => {
                try {
                    if (!variant.productVariantPrices?.length) {
                        const variantWithPrices = await this.connection.getEntityOrThrow(
                            ctx,
                            ProductVariant,
                            variant.id,
                            { relations: ['productVariantPrices'] },
                        );
                        variant.productVariantPrices = variantWithPrices.productVariantPrices;
                    }
                    if (!variant.taxCategory) {
                        const variantWithTaxCategory = await this.connection.getEntityOrThrow(
                            ctx,
                            ProductVariant,
                            variant.id,
                            { relations: ['taxCategory'] },
                        );
                        variant.taxCategory = variantWithTaxCategory.taxCategory;
                    }
                    resolve(await this.applyChannelPriceAndTax(variant, ctx));
                } catch (e) {
                    reject(e);
                }
            });
            this.requestCache.set(ctx, cacheKey, populatePricesPromise);
        }
        const hydratedVariant = await populatePricesPromise;
        return hydratedVariant[priceField];
    }

    /**
     * @description
     * Populates the `price` field with the price for the specified channel.
     */
    async applyChannelPriceAndTax(
        variant: ProductVariant,
        ctx: RequestContext,
        order?: Order,
    ): Promise<ProductVariant> {
        return this.productPriceApplicator.applyChannelPriceAndTax(variant, ctx, order);
    }

    /**
     * @description
     * Assigns the specified ProductVariants to the specified Channel. In doing so, it will create a new
     * {@link ProductVariantPrice} and also assign the associated Product and any Assets to the Channel too.
     */
    async assignProductVariantsToChannel(
        ctx: RequestContext,
        input: AssignProductVariantsToChannelInput,
    ): Promise<Array<Translated<ProductVariant>>> {
        const hasPermission = await this.roleService.userHasPermissionOnChannel(
            ctx,
            input.channelId,
            Permission.UpdateCatalog,
        );
        if (!hasPermission) {
            throw new ForbiddenError();
        }
        const variants = await this.connection
            .getRepository(ctx, ProductVariant)
            .findByIds(input.productVariantIds, { relations: ['taxCategory', 'assets'] });
        const priceFactor = input.priceFactor != null ? input.priceFactor : 1;
        for (const variant of variants) {
            if (variant.deletedAt) {
                continue;
            }
            await this.applyChannelPriceAndTax(variant, ctx);
            await this.channelService.assignToChannels(ctx, Product, variant.productId, [input.channelId]);
            await this.channelService.assignToChannels(ctx, ProductVariant, variant.id, [input.channelId]);
            const targetChannel = await this.channelService.findOne(ctx, input.channelId);
            const price = targetChannel?.pricesIncludeTax ? variant.priceWithTax : variant.price;
            await this.createOrUpdateProductVariantPrice(
                ctx,
                variant.id,
                Math.round(price * priceFactor),
                input.channelId,
            );
            const assetIds = variant.assets?.map(a => a.assetId) || [];
            await this.assetService.assignToChannel(ctx, { channelId: input.channelId, assetIds });
        }
        const result = await this.findByIds(
            ctx,
            variants.map(v => v.id),
        );
        for (const variant of variants) {
            this.eventBus.publish(new ProductVariantChannelEvent(ctx, variant, input.channelId, 'assigned'));
        }
        return result;
    }

    async removeProductVariantsFromChannel(
        ctx: RequestContext,
        input: RemoveProductVariantsFromChannelInput,
    ): Promise<Array<Translated<ProductVariant>>> {
        const hasPermission = await this.roleService.userHasPermissionOnChannel(
            ctx,
            input.channelId,
            Permission.UpdateCatalog,
        );
        if (!hasPermission) {
            throw new ForbiddenError();
        }
        const defaultChannel = await this.channelService.getDefaultChannel();
        if (idsAreEqual(input.channelId, defaultChannel.id)) {
            throw new UserInputError('error.products-cannot-be-removed-from-default-channel');
        }
        const variants = await this.connection
            .getRepository(ctx, ProductVariant)
            .findByIds(input.productVariantIds);
        for (const variant of variants) {
            await this.channelService.removeFromChannels(ctx, ProductVariant, variant.id, [input.channelId]);
            await this.connection.getRepository(ctx, ProductVariantPrice).delete({
                channelId: input.channelId,
                variant,
            });
            // If none of the ProductVariants is assigned to the Channel, remove the Channel from Product
            const productVariants = await this.connection.getRepository(ctx, ProductVariant).find({
                where: {
                    productId: variant.productId,
                },
                relations: ['channels'],
            });
            const productChannelsFromVariants = ([] as Channel[]).concat(
                ...productVariants.map(pv => pv.channels),
            );
            if (!productChannelsFromVariants.find(c => c.id === input.channelId)) {
                await this.channelService.removeFromChannels(ctx, Product, variant.productId, [
                    input.channelId,
                ]);
            }
        }
        const result = await this.findByIds(
            ctx,
            variants.map(v => v.id),
        );
        // Publish the events at the latest possible stage to decrease the chance of race conditions
        // whereby an event listener triggers a query which does not yet have access to the changes
        // within the current transaction.
        for (const variant of variants) {
            this.eventBus.publish(new ProductVariantChannelEvent(ctx, variant, input.channelId, 'removed'));
        }
        return result;
    }

    private async validateVariantOptionIds(ctx: RequestContext, input: CreateProductVariantInput) {
        // this could be done with less queries but depending on the data, node will crash
        // https://github.com/vendure-ecommerce/vendure/issues/328
        const optionGroups = (
            await this.connection.getEntityOrThrow(ctx, Product, input.productId, {
                channelId: ctx.channelId,
                relations: ['optionGroups', 'optionGroups.options'],
                loadEagerRelations: false,
            })
        ).optionGroups;

        const optionIds = input.optionIds || [];

        if (optionIds.length !== optionGroups.length) {
            this.throwIncompatibleOptionsError(optionGroups);
        }
        if (
            !samplesEach(
                optionIds,
                optionGroups.map(g => g.options.map(o => o.id)),
            )
        ) {
            this.throwIncompatibleOptionsError(optionGroups);
        }

        const product = await this.connection.getEntityOrThrow(ctx, Product, input.productId, {
            channelId: ctx.channelId,
            relations: ['variants', 'variants.options'],
            loadEagerRelations: false,
        });

        const inputOptionIds = this.sortJoin(optionIds, ',');

        product.variants
            .filter(v => !v.deletedAt)
            .forEach(variant => {
                const variantOptionIds = this.sortJoin(variant.options, ',', 'id');
                if (variantOptionIds === inputOptionIds) {
                    throw new UserInputError('error.product-variant-options-combination-already-exists', {
                        variantName: translateDeep(variant, ctx.languageCode).name,
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
            .map(x => (prop ? x[prop] : x))
            .sort()
            .join(glue);
    }

    private async getTaxCategoryForNewVariant(
        ctx: RequestContext,
        taxCategoryId: ID | null | undefined,
    ): Promise<TaxCategory> {
        let taxCategory: TaxCategory;
        if (taxCategoryId) {
            taxCategory = await this.connection.getEntityOrThrow(ctx, TaxCategory, taxCategoryId);
        } else {
            const taxCategories = await this.taxCategoryService.findAll(ctx);
            taxCategory = taxCategories.find(t => t.isDefault === true) ?? taxCategories[0];
        }
        if (!taxCategory) {
            // there is no TaxCategory set up, so create a default
            taxCategory = await this.taxCategoryService.create(ctx, { name: 'Standard Tax' });
        }
        return taxCategory;
    }
}
