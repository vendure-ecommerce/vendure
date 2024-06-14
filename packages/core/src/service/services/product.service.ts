import { Injectable } from '@nestjs/common';
import {
    AssignProductsToChannelInput,
    CreateProductInput,
    DeletionResponse,
    DeletionResult,
    ProductFilterParameter,
    ProductListOptions,
    RemoveOptionGroupFromProductResult,
    RemoveProductsFromChannelInput,
    UpdateProductInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import { FindOptionsUtils, In, IsNull } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { ErrorResultUnion } from '../../common/error/error-result';
import { EntityNotFoundError, InternalServerError, UserInputError } from '../../common/error/errors';
import { ProductOptionInUseError } from '../../common/error/generated-graphql-admin-errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Channel } from '../../entity/channel/channel.entity';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { ProductTranslation } from '../../entity/product/product-translation.entity';
import { Product } from '../../entity/product/product.entity';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { EventBus } from '../../event-bus/event-bus';
import { ProductChannelEvent } from '../../event-bus/events/product-channel-event';
import { ProductEvent } from '../../event-bus/events/product-event';
import { ProductOptionGroupChangeEvent } from '../../event-bus/events/product-option-group-change-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { SlugValidator } from '../helpers/slug-validator/slug-validator';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';

import { AssetService } from './asset.service';
import { ChannelService } from './channel.service';
import { FacetValueService } from './facet-value.service';
import { ProductOptionGroupService } from './product-option-group.service';
import { ProductVariantService } from './product-variant.service';

/**
 * @description
 * Contains methods relating to {@link Product} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class ProductService {
    private readonly relations = ['featuredAsset', 'assets', 'channels', 'facetValues', 'facetValues.facet'];

    constructor(
        private connection: TransactionalConnection,
        private channelService: ChannelService,
        private assetService: AssetService,
        private productVariantService: ProductVariantService,
        private facetValueService: FacetValueService,
        private listQueryBuilder: ListQueryBuilder,
        private translatableSaver: TranslatableSaver,
        private eventBus: EventBus,
        private slugValidator: SlugValidator,
        private customFieldRelationService: CustomFieldRelationService,
        private translator: TranslatorService,
        private productOptionGroupService: ProductOptionGroupService,
    ) {}

    async findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Product>,
        relations?: RelationPaths<Product>,
    ): Promise<PaginatedList<Translated<Product>>> {
        const effectiveRelations = relations || this.relations.slice();
        const customPropertyMap: { [name: string]: string } = {};
        const hasFacetValueIdFilter = this.listQueryBuilder.filterObjectHasProperty<ProductFilterParameter>(
            options?.filter,
            'facetValueId',
        );
        const hasSkuFilter = this.listQueryBuilder.filterObjectHasProperty<ProductFilterParameter>(
            options?.filter,
            'sku',
        );
        if (hasFacetValueIdFilter) {
            effectiveRelations.push('facetValues');
            customPropertyMap.facetValueId = 'facetValues.id';
        }
        if (hasSkuFilter) {
            effectiveRelations.push('variants');
            customPropertyMap.sku = 'variants.sku';
        }
        return this.listQueryBuilder
            .build(Product, options, {
                relations: effectiveRelations,
                channelId: ctx.channelId,
                where: { deletedAt: IsNull() },
                ctx,
                customPropertyMap,
            })
            .getManyAndCount()
            .then(async ([products, totalItems]) => {
                const items = products.map(product =>
                    this.translator.translate(product, ctx, ['facetValues', ['facetValues', 'facet']]),
                );
                return {
                    items,
                    totalItems,
                };
            });
    }

    async findOne(
        ctx: RequestContext,
        productId: ID,
        relations?: RelationPaths<Product>,
    ): Promise<Translated<Product> | undefined> {
        const effectiveRelations = relations ?? this.relations.slice();
        if (relations && effectiveRelations.includes('facetValues')) {
            // We need the facet to determine with the FacetValues are public
            // when serving via the Shop API.
            effectiveRelations.push('facetValues.facet');
        }
        const product = await this.connection.findOneInChannel(ctx, Product, productId, ctx.channelId, {
            relations: unique(effectiveRelations),
            where: {
                deletedAt: IsNull(),
            },
        });
        if (!product) {
            return;
        }
        return this.translator.translate(product, ctx, ['facetValues', ['facetValues', 'facet']]);
    }

    async findByIds(
        ctx: RequestContext,
        productIds: ID[],
        relations?: RelationPaths<Product>,
    ): Promise<Array<Translated<Product>>> {
        const qb = this.connection
            .getRepository(ctx, Product)
            .createQueryBuilder('product')
            .setFindOptions({ relations: (relations && false) || this.relations });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);
        return qb
            .leftJoin('product.channels', 'channel')
            .andWhere('product.deletedAt IS NULL')
            .andWhere('product.id IN (:...ids)', { ids: productIds })
            .andWhere('channel.id = :channelId', { channelId: ctx.channelId })
            .getMany()
            .then(products =>
                products.map(product =>
                    this.translator.translate(product, ctx, ['facetValues', ['facetValues', 'facet']]),
                ),
            );
    }

    /**
     * @description
     * Returns all Channels to which the Product is assigned.
     */
    async getProductChannels(ctx: RequestContext, productId: ID): Promise<Channel[]> {
        const product = await this.connection.getEntityOrThrow(ctx, Product, productId, {
            relations: ['channels'],
            channelId: ctx.channelId,
        });
        return product.channels;
    }

    getFacetValuesForProduct(ctx: RequestContext, productId: ID): Promise<Array<Translated<FacetValue>>> {
        return this.connection
            .getRepository(ctx, Product)
            .findOne({
                where: { id: productId },
                relations: ['facetValues'],
            })
            .then(variant =>
                !variant ? [] : variant.facetValues.map(o => this.translator.translate(o, ctx, ['facet'])),
            );
    }

    async findOneBySlug(
        ctx: RequestContext,
        slug: string,
        relations?: RelationPaths<Product>,
    ): Promise<Translated<Product> | undefined> {
        const qb = this.connection.getRepository(ctx, Product).createQueryBuilder('product');
        const translationQb = this.connection
            .getRepository(ctx, ProductTranslation)
            .createQueryBuilder('_product_translation')
            .select('_product_translation.baseId')
            .andWhere('_product_translation.slug = :slug', { slug });

        qb.leftJoin('product.translations', 'translation')
            .andWhere('product.deletedAt IS NULL')
            .andWhere('product.id IN (' + translationQb.getQuery() + ')')
            .setParameters(translationQb.getParameters())
            .select('product.id', 'id')
            .addSelect(
                // eslint-disable-next-line max-len
                `CASE translation.languageCode WHEN '${ctx.languageCode}' THEN 2 WHEN '${ctx.channel.defaultLanguageCode}' THEN 1 ELSE 0 END`,
                'sort_order',
            )
            .orderBy('sort_order', 'DESC');
        // We use getRawOne here to simply get the ID as efficiently as possible,
        // which we then pass to the regular findOne() method which will handle
        // all the joins etc.
        const result = await qb.getRawOne();
        if (result) {
            return this.findOne(ctx, result.id, relations);
        } else {
            return undefined;
        }
    }

    async create(ctx: RequestContext, input: CreateProductInput): Promise<Translated<Product>> {
        await this.slugValidator.validateSlugs(ctx, input, ProductTranslation);
        const product = await this.translatableSaver.create({
            ctx,
            input,
            entityType: Product,
            translationType: ProductTranslation,
            beforeSave: async p => {
                await this.channelService.assignToCurrentChannel(p, ctx);
                if (input.facetValueIds) {
                    p.facetValues = await this.facetValueService.findByIds(ctx, input.facetValueIds);
                }
                await this.assetService.updateFeaturedAsset(ctx, p, input);
            },
        });
        await this.customFieldRelationService.updateRelations(ctx, Product, input, product);
        await this.assetService.updateEntityAssets(ctx, product, input);
        await this.eventBus.publish(new ProductEvent(ctx, product, 'created', input));
        return assertFound(this.findOne(ctx, product.id));
    }

    async update(ctx: RequestContext, input: UpdateProductInput): Promise<Translated<Product>> {
        const product = await this.connection.getEntityOrThrow(ctx, Product, input.id, {
            channelId: ctx.channelId,
            relations: ['facetValues', 'facetValues.channels'],
        });
        await this.slugValidator.validateSlugs(ctx, input, ProductTranslation);
        const updatedProduct = await this.translatableSaver.update({
            ctx,
            input,
            entityType: Product,
            translationType: ProductTranslation,
            beforeSave: async p => {
                if (input.facetValueIds) {
                    const facetValuesInOtherChannels = product.facetValues.filter(fv =>
                        fv.channels.every(channel => !idsAreEqual(channel.id, ctx.channelId)),
                    );
                    p.facetValues = [
                        ...facetValuesInOtherChannels,
                        ...(await this.facetValueService.findByIds(ctx, input.facetValueIds)),
                    ];
                }
                await this.assetService.updateFeaturedAsset(ctx, p, input);
                await this.assetService.updateEntityAssets(ctx, p, input);
            },
        });
        await this.customFieldRelationService.updateRelations(ctx, Product, input, updatedProduct);
        await this.eventBus.publish(new ProductEvent(ctx, updatedProduct, 'updated', input));
        return assertFound(this.findOne(ctx, updatedProduct.id));
    }

    async softDelete(ctx: RequestContext, productId: ID): Promise<DeletionResponse> {
        const product = await this.connection.getEntityOrThrow(ctx, Product, productId, {
            relationLoadStrategy: 'query',
            loadEagerRelations: false,
            channelId: ctx.channelId,
            relations: ['variants', 'optionGroups'],
        });
        product.deletedAt = new Date();
        await this.connection.getRepository(ctx, Product).save(product, { reload: false });
        await this.eventBus.publish(new ProductEvent(ctx, product, 'deleted', productId));

        const variantResult = await this.productVariantService.softDelete(
            ctx,
            product.variants.map(v => v.id),
        );
        if (variantResult.result === DeletionResult.NOT_DELETED) {
            await this.connection.rollBackTransaction(ctx);
            return variantResult;
        }
        for (const optionGroup of product.optionGroups) {
            if (!optionGroup.deletedAt) {
                const groupResult = await this.productOptionGroupService.deleteGroupAndOptionsFromProduct(
                    ctx,
                    optionGroup.id,
                    productId,
                );
                if (groupResult.result === DeletionResult.NOT_DELETED) {
                    await this.connection.rollBackTransaction(ctx);
                    return groupResult;
                }
            }
        }
        return {
            result: DeletionResult.DELETED,
        };
    }

    /**
     * @description
     * Assigns a Product to the specified Channel, and optionally uses a `priceFactor` to set the ProductVariantPrices
     * on the new Channel.
     *
     * Internally, this method will also call {@link ProductVariantService} `assignProductVariantsToChannel()` for
     * each of the Product's variants, and will assign the Product's Assets to the Channel too.
     */
    async assignProductsToChannel(
        ctx: RequestContext,
        input: AssignProductsToChannelInput,
    ): Promise<Array<Translated<Product>>> {
        const productsWithVariants = await this.connection.getRepository(ctx, Product).find({
            where: { id: In(input.productIds) },
            relations: ['variants', 'assets'],
        });
        await this.productVariantService.assignProductVariantsToChannel(ctx, {
            productVariantIds: ([] as ID[]).concat(
                ...productsWithVariants.map(p => p.variants.map(v => v.id)),
            ),
            channelId: input.channelId,
            priceFactor: input.priceFactor,
        });
        const assetIds: ID[] = unique(
            ([] as ID[]).concat(...productsWithVariants.map(p => p.assets.map(a => a.assetId))),
        );
        await this.assetService.assignToChannel(ctx, { channelId: input.channelId, assetIds });
        const products = await this.connection
            .getRepository(ctx, Product)
            .find({ where: { id: In(input.productIds) } });
        for (const product of products) {
            await this.eventBus.publish(new ProductChannelEvent(ctx, product, input.channelId, 'assigned'));
        }
        return this.findByIds(
            ctx,
            productsWithVariants.map(p => p.id),
        );
    }

    async removeProductsFromChannel(
        ctx: RequestContext,
        input: RemoveProductsFromChannelInput,
    ): Promise<Array<Translated<Product>>> {
        const productsWithVariants = await this.connection.getRepository(ctx, Product).find({
            where: { id: In(input.productIds) },
            relations: ['variants'],
        });
        await this.productVariantService.removeProductVariantsFromChannel(ctx, {
            productVariantIds: ([] as ID[]).concat(
                ...productsWithVariants.map(p => p.variants.map(v => v.id)),
            ),
            channelId: input.channelId,
        });
        const products = await this.connection
            .getRepository(ctx, Product)
            .find({ where: { id: In(input.productIds) } });
        for (const product of products) {
            await this.eventBus.publish(new ProductChannelEvent(ctx, product, input.channelId, 'removed'));
        }
        return this.findByIds(
            ctx,
            productsWithVariants.map(p => p.id),
        );
    }

    async addOptionGroupToProduct(
        ctx: RequestContext,
        productId: ID,
        optionGroupId: ID,
    ): Promise<Translated<Product>> {
        const product = await this.getProductWithOptionGroups(ctx, productId);
        const optionGroup = await this.connection.getRepository(ctx, ProductOptionGroup).findOne({
            where: { id: optionGroupId },
            relations: ['product'],
        });
        if (!optionGroup) {
            throw new EntityNotFoundError('ProductOptionGroup', optionGroupId);
        }
        if (optionGroup.product) {
            const translated = this.translator.translate(optionGroup.product, ctx);
            throw new UserInputError('error.product-option-group-already-assigned', {
                groupCode: optionGroup.code,
                productName: translated.name,
            });
        }

        if (Array.isArray(product.optionGroups)) {
            product.optionGroups.push(optionGroup);
        } else {
            product.optionGroups = [optionGroup];
        }

        await this.connection.getRepository(ctx, Product).save(product, { reload: false });
        await this.eventBus.publish(
            new ProductOptionGroupChangeEvent(ctx, product, optionGroupId, 'assigned'),
        );
        return assertFound(this.findOne(ctx, productId));
    }

    async removeOptionGroupFromProduct(
        ctx: RequestContext,
        productId: ID,
        optionGroupId: ID,
        force?: boolean,
    ): Promise<ErrorResultUnion<RemoveOptionGroupFromProductResult, Translated<Product>>> {
        const product = await this.getProductWithOptionGroups(ctx, productId);
        const optionGroup = product.optionGroups.find(g => idsAreEqual(g.id, optionGroupId));
        if (!optionGroup) {
            throw new EntityNotFoundError('ProductOptionGroup', optionGroupId);
        }
        const optionIsInUse = product.variants.some(
            variant =>
                variant.deletedAt == null &&
                variant.options.some(option => idsAreEqual(option.groupId, optionGroupId)),
        );
        if (optionIsInUse) {
            if (!force) {
                return new ProductOptionInUseError({
                    optionGroupCode: optionGroup.code,
                    productVariantCount: product.variants.length,
                });
            } else {
                // We will force the removal of this ProductOptionGroup by first
                // removing all ProductOptions from the ProductVariants
                for (const variant of product.variants) {
                    variant.options = variant.options.filter(o => !idsAreEqual(o.groupId, optionGroupId));
                }
                await this.connection.getRepository(ctx, ProductVariant).save(product.variants, {
                    reload: false,
                });
            }
        }
        const result = await this.productOptionGroupService.deleteGroupAndOptionsFromProduct(
            ctx,
            optionGroupId,
            productId,
        );
        product.optionGroups = product.optionGroups.filter(g => g.id !== optionGroupId);
        await this.connection.getRepository(ctx, Product).save(product, { reload: false });
        if (result.result === DeletionResult.NOT_DELETED) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            throw new InternalServerError(result.message!);
        }
        await this.eventBus.publish(
            new ProductOptionGroupChangeEvent(ctx, product, optionGroupId, 'removed'),
        );
        return assertFound(this.findOne(ctx, productId));
    }

    private async getProductWithOptionGroups(ctx: RequestContext, productId: ID): Promise<Product> {
        const product = await this.connection.getRepository(ctx, Product).findOne({
            relationLoadStrategy: 'query',
            loadEagerRelations: false,
            where: { id: productId, deletedAt: IsNull() },
            relations: ['optionGroups', 'variants', 'variants.options'],
        });
        if (!product) {
            throw new EntityNotFoundError('Product', productId);
        }
        return product;
    }
}
