import { Injectable } from '@nestjs/common';
import {
    AssignProductsToChannelInput,
    CreateProductInput,
    DeletionResponse,
    DeletionResult,
    RemoveOptionGroupFromProductResult,
    RemoveProductsFromChannelInput,
    UpdateProductInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import { FindOptionsUtils } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { ErrorResultUnion } from '../../common/error/error-result';
import { EntityNotFoundError } from '../../common/error/errors';
import { ProductOptionInUseError } from '../../common/error/generated-graphql-admin-errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { Channel } from '../../entity/channel/channel.entity';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { ProductTranslation } from '../../entity/product/product-translation.entity';
import { Product } from '../../entity/product/product.entity';
import { EventBus } from '../../event-bus/event-bus';
import { ProductEvent } from '../../event-bus/events/product-event';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { SlugValidator } from '../helpers/slug-validator/slug-validator';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { translateDeep } from '../helpers/utils/translate-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

import { AssetService } from './asset.service';
import { ChannelService } from './channel.service';
import { CollectionService } from './collection.service';
import { FacetValueService } from './facet-value.service';
import { ProductVariantService } from './product-variant.service';
import { RoleService } from './role.service';
import { TaxRateService } from './tax-rate.service';

@Injectable()
export class ProductService {
    private readonly relations = ['featuredAsset', 'assets', 'facetValues', 'facetValues.facet'];

    constructor(
        private connection: TransactionalConnection,
        private channelService: ChannelService,
        private roleService: RoleService,
        private assetService: AssetService,
        private productVariantService: ProductVariantService,
        private facetValueService: FacetValueService,
        private taxRateService: TaxRateService,
        private collectionService: CollectionService,
        private listQueryBuilder: ListQueryBuilder,
        private translatableSaver: TranslatableSaver,
        private eventBus: EventBus,
        private slugValidator: SlugValidator,
    ) {}

    async findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Product>,
    ): Promise<PaginatedList<Translated<Product>>> {
        return this.listQueryBuilder
            .build(Product, options, {
                relations: this.relations,
                channelId: ctx.channelId,
                where: { deletedAt: null },
                ctx,
            })
            .leftJoin('product.variants', 'variant')
            .innerJoinAndSelect('variant.channels', 'channel', 'channel.id = :channelId', {
                channelId: ctx.channelId,
            })
            .getManyAndCount()
            .then(async ([products, totalItems]) => {
                const items = products.map(product =>
                    translateDeep(product, ctx.languageCode, ['facetValues', ['facetValues', 'facet']]),
                );
                return {
                    items,
                    totalItems,
                };
            });
    }

    async findOne(ctx: RequestContext, productId: ID): Promise<Translated<Product> | undefined> {
        const qb = this.connection.getRepository(ctx, Product).createQueryBuilder('product');
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, { relations: this.relations });
        // tslint:disable-next-line:no-non-null-assertion
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);
        return qb
            .leftJoin('product.variants', 'variant')
            .innerJoinAndSelect('variant.channels', 'channel', 'channel.id = :channelId', {
                channelId: ctx.channelId,
            })
            .andWhere('product.id = :productId', { productId })
            .andWhere('product.deletedAt IS NULL')
            .getOne()
            .then(product => {
                return product
                    ? translateDeep(product, ctx.languageCode, ['facetValues', ['facetValues', 'facet']])
                    : undefined;
            });
    }

    async findByIds(ctx: RequestContext, productIds: ID[]): Promise<Array<Translated<Product>>> {
        const qb = this.connection.getRepository(ctx, Product).createQueryBuilder('product');
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, { relations: this.relations });
        // tslint:disable-next-line:no-non-null-assertion
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);
        return qb
            .leftJoin('product.variants', 'variant')
            .innerJoinAndSelect('variant.channels', 'channel', 'channel.id = :channelId', {
                channelId: ctx.channelId,
            })
            .andWhere('product.deletedAt IS NULL')
            .andWhere('product.id IN (:...ids)', { ids: productIds })
            .getMany()
            .then(products =>
                products.map(product =>
                    translateDeep(product, ctx.languageCode, ['facetValues', ['facetValues', 'facet']]),
                ),
            );
    }

    // private async isProductInChannel(ctx: RequestContext, productId: ID, channelId: ID): Promise<boolean> {
    //     const channelIds = (await this.getProductChannels(ctx, productId))
    //         .map(channel => channel.id);
    //     return channelIds.includes(channelId);
    // }

    async getProductChannels(ctx: RequestContext, productId: ID): Promise<Channel[]> {
        const productVariantChannels = ([] as Channel[]).concat(
            ...(await this.productVariantService.getVariantsByProductId(ctx, productId)).map(
                pv => pv.channels,
            ),
        );
        return unique(productVariantChannels, 'code');
    }

    getFacetValuesForProduct(ctx: RequestContext, productId: ID): Promise<Array<Translated<FacetValue>>> {
        return this.connection
            .getRepository(ctx, Product)
            .findOne(productId, { relations: ['facetValues', 'facetValues.facet'] })
            .then(variant =>
                !variant ? [] : variant.facetValues.map(o => translateDeep(o, ctx.languageCode, ['facet'])),
            );
    }

    async findOneBySlug(ctx: RequestContext, slug: string): Promise<Translated<Product> | undefined> {
        const translation = await this.connection.getRepository(ctx, ProductTranslation).findOne({
            relations: ['base'],
            where: {
                languageCode: ctx.languageCode,
                slug,
            },
        });
        if (!translation) {
            return;
        }
        return this.findOne(ctx, translation.base.id);
    }

    async create(ctx: RequestContext, input: CreateProductInput): Promise<Translated<Product>> {
        await this.slugValidator.validateSlugs(ctx, input, ProductTranslation);
        const product = await this.translatableSaver.create({
            ctx,
            input,
            entityType: Product,
            translationType: ProductTranslation,
            beforeSave: async p => {
                if (input.facetValueIds) {
                    p.facetValues = await this.facetValueService.findByIds(ctx, input.facetValueIds);
                }
                await this.assetService.updateFeaturedAsset(ctx, p, input);
            },
        });
        await this.assetService.updateEntityAssets(ctx, product, input);
        this.eventBus.publish(new ProductEvent(ctx, product, 'created'));
        await this.productVariantService.create(
            ctx,
            input.variants.map(variant => {
                return { productId: product.id, ...variant };
            }),
        );
        return assertFound(this.findOne(ctx, product.id));
    }

    async update(ctx: RequestContext, input: UpdateProductInput): Promise<Translated<Product>> {
        await this.connection.getEntityOrThrow(ctx, Product, input.id);
        await this.slugValidator.validateSlugs(ctx, input, ProductTranslation);
        const product = await this.translatableSaver.update({
            ctx,
            input,
            entityType: Product,
            translationType: ProductTranslation,
            beforeSave: async p => {
                if (input.facetValueIds) {
                    p.facetValues = await this.facetValueService.findByIds(ctx, input.facetValueIds);
                }
                await this.assetService.updateFeaturedAsset(ctx, p, input);
                await this.assetService.updateEntityAssets(ctx, p, input);
            },
        });
        this.eventBus.publish(new ProductEvent(ctx, product, 'updated'));
        return assertFound(this.findOne(ctx, product.id));
    }

    async softDelete(ctx: RequestContext, productId: ID): Promise<DeletionResponse> {
        // TODO: product should only be deleted if no active ProductVariants?
        const product = await this.connection.getEntityOrThrow(ctx, Product, productId);
        product.deletedAt = new Date();
        await this.connection.getRepository(ctx, Product).save(product, { reload: false });
        this.eventBus.publish(new ProductEvent(ctx, product, 'deleted'));
        return {
            result: DeletionResult.DELETED,
        };
    }

    async assignProductsToChannel(
        ctx: RequestContext,
        input: AssignProductsToChannelInput,
    ): Promise<Array<Translated<Product>>> {
        const productsWithVariants = await this.connection
            .getRepository(ctx, Product)
            .findByIds(input.productIds, {
                relations: ['variants'],
            });
        await this.productVariantService.assignProductVariantsToChannel(ctx, {
            productVariantIds: ([] as ID[]).concat(
                ...productsWithVariants.map(p => p.variants.map(v => v.id)),
            ),
            channelId: input.channelId,
            priceFactor: input.priceFactor,
        });
        return this.findByIds(
            ctx,
            productsWithVariants.map(p => p.id),
        );
    }

    async removeProductsFromChannel(
        ctx: RequestContext,
        input: RemoveProductsFromChannelInput,
    ): Promise<Array<Translated<Product>>> {
        const productsWithVariants = await this.connection
            .getRepository(ctx, Product)
            .findByIds(input.productIds, {
                relations: ['variants'],
            });
        await this.productVariantService.removeProductVariantsFromChannel(ctx, {
            productVariantIds: ([] as ID[]).concat(
                ...productsWithVariants.map(p => p.variants.map(v => v.id)),
            ),
            channelId: input.channelId,
        });
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
        const optionGroup = await this.connection
            .getRepository(ctx, ProductOptionGroup)
            .findOne(optionGroupId);
        if (!optionGroup) {
            throw new EntityNotFoundError('ProductOptionGroup', optionGroupId);
        }

        if (Array.isArray(product.optionGroups)) {
            product.optionGroups.push(optionGroup);
        } else {
            product.optionGroups = [optionGroup];
        }

        await this.connection.getRepository(ctx, Product).save(product, { reload: false });
        return assertFound(this.findOne(ctx, productId));
    }

    async removeOptionGroupFromProduct(
        ctx: RequestContext,
        productId: ID,
        optionGroupId: ID,
    ): Promise<ErrorResultUnion<RemoveOptionGroupFromProductResult, Translated<Product>>> {
        const product = await this.getProductWithOptionGroups(ctx, productId);
        const optionGroup = product.optionGroups.find(g => idsAreEqual(g.id, optionGroupId));
        if (!optionGroup) {
            throw new EntityNotFoundError('ProductOptionGroup', optionGroupId);
        }
        if (product.variants.length) {
            return new ProductOptionInUseError(optionGroup.code, product.variants.length);
        }
        product.optionGroups = product.optionGroups.filter(g => g.id !== optionGroupId);

        await this.connection.getRepository(ctx, Product).save(product, { reload: false });
        return assertFound(this.findOne(ctx, productId));
    }

    private async getProductWithOptionGroups(ctx: RequestContext, productId: ID): Promise<Product> {
        const product = await this.connection.getRepository(ctx, Product).findOne(productId, {
            relations: ['optionGroups', 'variants', 'variants.options'],
            where: { deletedAt: null },
        });
        if (!product) {
            throw new EntityNotFoundError('Product', productId);
        }
        return product;
    }
}
