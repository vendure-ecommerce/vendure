import { Injectable } from '@nestjs/common';
import {
    AssignProductOptionGroupsToChannelInput,
    CreateProductOptionGroupInput,
    DeletionResponse,
    DeletionResult,
    LanguageCode,
    Permission,
    RemoveProductOptionGroupFromChannelResult,
    RemoveProductOptionGroupsFromChannelInput,
    UpdateProductOptionGroupInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { IsNull } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import {
    ErrorResultUnion,
    ForbiddenError,
    Instrument,
    ProductOptionGroupInUseError,
    UserInputError,
} from '../../common';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { Logger } from '../../config/logger/vendure-logger';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { ProductOptionGroupTranslation } from '../../entity/product-option-group/product-option-group-translation.entity';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { ProductOption } from '../../entity/product-option/product-option.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Product } from '../../entity/product/product.entity';
import { EventBus } from '../../event-bus';
import { ProductOptionGroupEvent } from '../../event-bus/events/product-option-group-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';

import { ChannelService } from './channel.service';
import { ProductOptionService } from './product-option.service';
import { RoleService } from './role.service';

/**
 * @description
 * Contains methods relating to {@link ProductOptionGroup} entities.
 *
 * @docsCategory services
 */
@Injectable()
@Instrument()
export class ProductOptionGroupService {
    constructor(
        private connection: TransactionalConnection,
        private translatableSaver: TranslatableSaver,
        private customFieldRelationService: CustomFieldRelationService,
        private productOptionService: ProductOptionService,
        private eventBus: EventBus,
        private translator: TranslatorService,
        private readonly channelService: ChannelService,
        private readonly listQueryBuilder: ListQueryBuilder,
        private readonly roleService: RoleService,
    ) {}

    async findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<ProductOptionGroup>,
        relations?: RelationPaths<ProductOptionGroup>,
    ): Promise<PaginatedList<Translated<ProductOptionGroup>>> {
        return this.listQueryBuilder
            .build(ProductOptionGroup, options, {
                relations: relations ?? ['options', 'channels'],
                channelId: ctx.channelId,
                where: { deletedAt: IsNull() },
                ctx,
            })
            .getManyAndCount()
            .then(([groups, totalItems]) => {
                const items = groups.map(group => this.translator.translate(group, ctx, ['options']));
                return {
                    items,
                    totalItems,
                };
            });
    }

    async findOne(
        ctx: RequestContext,
        id: ID,
        relations?: RelationPaths<ProductOptionGroup>,
        findOneOptions?: { includeSoftDeleted: boolean },
    ): Promise<Translated<ProductOptionGroup> | undefined> {
        return this.connection
            .findOneInChannel(ctx, ProductOptionGroup, id, ctx.channelId, {
                relations: relations ?? ['options', 'channels'],
                where: {
                    deletedAt: !findOneOptions?.includeSoftDeleted ? IsNull() : undefined,
                },
            })
            .then(group => (group && this.translator.translate(group, ctx, ['options'])) ?? undefined);
    }

    async findByCode(
        ctx: RequestContext,
        code: string,
        languageCode: LanguageCode,
    ): Promise<Translated<ProductOptionGroup> | undefined> {
        const relations = ['translations', 'options', 'channels'];
        const group = await this.connection.getRepository(ctx, ProductOptionGroup).findOne({
            where: { code, deletedAt: IsNull() },
            relations,
        });

        if (group) {
            return this.translator.translate(group, ctx, ['options']);
        }
        return undefined;
    }

    getOptionGroupsByProductId(ctx: RequestContext, id: ID): Promise<Array<Translated<ProductOptionGroup>>> {
        return this.connection
            .getRepository(ctx, ProductOptionGroup)
            .createQueryBuilder('optionGroup')
            .leftJoinAndSelect('optionGroup.translations', 'groupTranslations')
            .leftJoinAndSelect('optionGroup.options', 'options')
            .leftJoinAndSelect('options.translations', 'optionTranslations')
            .leftJoin('optionGroup.products', 'product')
            .where('product.id = :productId', { productId: id })
            .andWhere('optionGroup.deletedAt IS NULL')
            .orderBy('optionGroup.id', 'ASC')
            .getMany()
            .then(groups => groups.map(group => this.translator.translate(group, ctx, ['options'])));
    }

    async create(
        ctx: RequestContext,
        input: Omit<CreateProductOptionGroupInput, 'options'>,
    ): Promise<Translated<ProductOptionGroup>> {
        const group = await this.translatableSaver.create({
            ctx,
            input,
            entityType: ProductOptionGroup,
            translationType: ProductOptionGroupTranslation,
            beforeSave: async g => {
                await this.channelService.assignToCurrentChannel(g, ctx);
            },
        });
        const groupWithRelations = await this.customFieldRelationService.updateRelations(
            ctx,
            ProductOptionGroup,
            input,
            group,
        );
        await this.eventBus.publish(new ProductOptionGroupEvent(ctx, groupWithRelations, 'created', input));
        return assertFound(this.findOne(ctx, group.id));
    }

    async update(
        ctx: RequestContext,
        input: UpdateProductOptionGroupInput,
    ): Promise<Translated<ProductOptionGroup>> {
        const group = await this.translatableSaver.update({
            ctx,
            input,
            entityType: ProductOptionGroup,
            translationType: ProductOptionGroupTranslation,
        });
        await this.customFieldRelationService.updateRelations(ctx, ProductOptionGroup, input, group);
        await this.eventBus.publish(new ProductOptionGroupEvent(ctx, group, 'updated', input));
        return assertFound(this.findOne(ctx, group.id));
    }

    /**
     * @description
     * Deletes the ProductOptionGroup and any associated ProductOptions. If the ProductOptionGroup
     * is still referenced by a soft-deleted Product, then a soft-delete will be used to preserve
     * referential integrity. Otherwise a hard-delete will be performed.
     */
    async deleteGroupAndOptionsFromProduct(ctx: RequestContext, id: ID, productId: ID) {
        const optionGroup = await this.connection.getEntityOrThrow(ctx, ProductOptionGroup, id, {
            relationLoadStrategy: 'query',
            loadEagerRelations: false,
            relations: ['options', 'products'],
        });
        const deletedOptionGroup = new ProductOptionGroup(optionGroup);
        const inUseByActiveProducts = await this.isInUseByOtherProducts(ctx, optionGroup, productId);
        if (0 < inUseByActiveProducts) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: ctx.translate('message.product-option-group-used-by-products', {
                    code: optionGroup.code,
                    count: inUseByActiveProducts,
                }),
            };
        }

        const optionsToDelete = optionGroup.options && optionGroup.options.filter(group => !group.deletedAt);

        for (const option of optionsToDelete) {
            const { result, message } = await this.productOptionService.delete(ctx, option.id);
            if (result === DeletionResult.NOT_DELETED) {
                await this.connection.rollBackTransaction(ctx);
                return { result, message };
            }
        }
        const hasOptionsWhichAreInUse = await this.groupOptionsAreInUse(ctx, optionGroup);
        if (0 < hasOptionsWhichAreInUse) {
            // soft delete
            optionGroup.deletedAt = new Date();
            await this.connection.getRepository(ctx, ProductOptionGroup).save(optionGroup, { reload: false });
        } else {
            // hard delete

            const product = await this.connection.getRepository(ctx, Product).findOne({
                relationLoadStrategy: 'query',
                loadEagerRelations: false,
                where: { id: productId },
                relations: ['optionGroups'],
            });
            if (product) {
                product.optionGroups = product.optionGroups.filter(og => !idsAreEqual(og.id, id));
                await this.connection.getRepository(ctx, Product).save(product, { reload: false });
            }

            try {
                await this.connection.getRepository(ctx, ProductOptionGroup).remove(optionGroup);
            } catch (e: any) {
                Logger.error(e.message, undefined, e.stack);
            }
        }
        await this.eventBus.publish(new ProductOptionGroupEvent(ctx, deletedOptionGroup, 'deleted', id));
        return {
            result: DeletionResult.DELETED,
        };
    }

    private async isInUseByOtherProducts(
        ctx: RequestContext,
        productOptionGroup: ProductOptionGroup,
        targetProductId: ID,
    ): Promise<number> {
        return this.connection
            .getRepository(ctx, Product)
            .createQueryBuilder('product')
            .leftJoin('product.optionGroups', 'optionGroup')
            .where('product.deletedAt IS NULL')
            .andWhere('optionGroup.id = :id', { id: productOptionGroup.id })
            .andWhere('product.id != :productId', { productId: targetProductId })
            .getCount();
    }

    private async groupOptionsAreInUse(ctx: RequestContext, productOptionGroup: ProductOptionGroup) {
        return this.connection
            .getRepository(ctx, ProductVariant)
            .createQueryBuilder('variant')
            .leftJoin('variant.options', 'option')
            .where('option.groupId = :groupId', { groupId: productOptionGroup.id })
            .getCount();
    }

    /**
     * @description
     * Assigns ProductOptionGroups to the specified Channel
     */
    async assignProductOptionGroupsToChannel(
        ctx: RequestContext,
        input: AssignProductOptionGroupsToChannelInput,
    ): Promise<Array<Translated<ProductOptionGroup>>> {
        const hasPermission = await this.roleService.userHasAnyPermissionsOnChannel(ctx, input.channelId, [
            Permission.UpdateCatalog,
        ]);
        if (!hasPermission) {
            throw new ForbiddenError();
        }
        if (input.productOptionGroupIds.length === 0) {
            throw new UserInputError('error.product-option-group-ids-cannot-be-empty');
        }
        const groupsToAssign = await this.connection
            .getRepository(ctx, ProductOptionGroup)
            .createQueryBuilder('productOptionGroup')
            .leftJoinAndSelect('productOptionGroup.options', 'options', 'options.deletedAt IS NULL')
            .where('productOptionGroup.id IN (:...ids)', { ids: input.productOptionGroupIds })
            .getMany();

        const optionsToAssign = groupsToAssign.reduce(
            (options, group) => [...options, ...group.options],
            [] as ProductOption[],
        );

        await Promise.all<any>([
            ...groupsToAssign.map(async group => {
                return this.channelService.assignToChannels(ctx, ProductOptionGroup, group.id, [
                    input.channelId,
                ]);
            }),
            ...optionsToAssign.map(async option =>
                this.channelService.assignToChannels(ctx, ProductOption, option.id, [input.channelId]),
            ),
        ]);
        return this.connection
            .findByIdsInChannel(
                ctx,
                ProductOptionGroup,
                groupsToAssign.map(g => g.id),
                ctx.channelId,
                { relations: ['options'] },
            )
            .then(groups => groups.map(group => this.translator.translate(group, ctx, ['options'])));
    }

    /**
     * @description
     * Remove ProductOptionGroups from the specified Channel
     */
    async removeProductOptionGroupsFromChannel(
        ctx: RequestContext,
        input: RemoveProductOptionGroupsFromChannelInput,
    ): Promise<Array<ErrorResultUnion<RemoveProductOptionGroupFromChannelResult, ProductOptionGroup>>> {
        const hasPermission = await this.roleService.userHasAnyPermissionsOnChannel(ctx, input.channelId, [
            Permission.DeleteCatalog,
        ]);
        if (!hasPermission) {
            throw new ForbiddenError();
        }
        if (input.productOptionGroupIds.length === 0) {
            throw new UserInputError('error.product-option-group-ids-cannot-be-empty');
        }
        const defaultChannel = await this.channelService.getDefaultChannel(ctx);
        if (idsAreEqual(input.channelId, defaultChannel.id)) {
            throw new UserInputError('error.items-cannot-be-removed-from-default-channel');
        }
        const groupsToRemove = await this.connection
            .getRepository(ctx, ProductOptionGroup)
            .createQueryBuilder('productOptionGroup')
            .leftJoinAndSelect('productOptionGroup.options', 'options', 'options.deletedAt IS NULL')
            .where('productOptionGroup.id IN (:...ids)', { ids: input.productOptionGroupIds })
            .getMany();

        const results: Array<
            ErrorResultUnion<RemoveProductOptionGroupFromChannelResult, ProductOptionGroup>
        > = [];

        for (const group of groupsToRemove) {
            let productCount = 0;
            let variantCount = 0;

            // Check if the option group is in use in the target channel
            productCount = await this.connection
                .getRepository(ctx, Product)
                .createQueryBuilder('product')
                .leftJoin('product.optionGroups', 'optionGroup')
                .leftJoin('product.channels', 'channel')
                .where('optionGroup.id = :groupId', { groupId: group.id })
                .andWhere('channel.id = :channelId', { channelId: input.channelId })
                .andWhere('product.deletedAt IS NULL')
                .getCount();

            // Check if any variants are using options from this group in the target channel
            if (group.options.length) {
                variantCount = await this.connection
                    .getRepository(ctx, ProductVariant)
                    .createQueryBuilder('variant')
                    .leftJoin('variant.options', 'option')
                    .leftJoin('variant.channels', 'channel')
                    .where('option.groupId = :groupId', { groupId: group.id })
                    .andWhere('channel.id = :channelId', { channelId: input.channelId })
                    .andWhere('variant.deletedAt IS NULL')
                    .getCount();
            }

            const isInUse = !!(productCount || variantCount);
            let result: Translated<ProductOptionGroup> | undefined;

            if (!isInUse || input.force) {
                await this.channelService.removeFromChannels(ctx, ProductOptionGroup, group.id, [
                    input.channelId,
                ]);
                await Promise.all(
                    group.options.map(option =>
                        this.channelService.removeFromChannels(ctx, ProductOption, option.id, [
                            input.channelId,
                        ]),
                    ),
                );
                result = await this.findOne(ctx, group.id);
                if (result) {
                    results.push(result);
                }
            } else {
                results.push(
                    new ProductOptionGroupInUseError({
                        optionGroupCode: group.code,
                        productCount,
                        variantCount,
                    }),
                );
            }
        }

        return results;
    }

    /**
     * @description
     * Deletes a ProductOptionGroup and all its associated ProductOptions.
     */
    async delete(ctx: RequestContext, id: ID, force: boolean = false): Promise<DeletionResponse> {
        const optionGroup = await this.connection.getEntityOrThrow(ctx, ProductOptionGroup, id, {
            relations: ['options', 'channels'],
            channelId: ctx.channelId,
        });
        const deletedOptionGroup = new ProductOptionGroup(optionGroup);

        // Check if the option group is in use by products
        const productCount = await this.connection
            .getRepository(ctx, Product)
            .createQueryBuilder('product')
            .leftJoin('product.optionGroups', 'optionGroup')
            .where('optionGroup.id = :groupId', { groupId: id })
            .andWhere('product.deletedAt IS NULL')
            .getCount();

        // Check if any variants are using options from this group
        let variantCount = 0;
        if (optionGroup.options && optionGroup.options.length > 0) {
            variantCount = await this.connection
                .getRepository(ctx, ProductVariant)
                .createQueryBuilder('variant')
                .leftJoin('variant.options', 'option')
                .where('option.groupId = :groupId', { groupId: id })
                .andWhere('variant.deletedAt IS NULL')
                .getCount();
        }

        const isInUse = !!(productCount || variantCount);
        const both = productCount && variantCount ? 'both' : 'single';
        const i18nVars = {
            products: productCount,
            variants: variantCount,
            both,
            optionGroupCode: optionGroup.code,
        };
        let message = '';
        let result: DeletionResult;

        if (!isInUse) {
            // Delete all associated options first
            for (const option of optionGroup.options || []) {
                await this.productOptionService.delete(ctx, option.id);
            }
            await this.connection.getRepository(ctx, ProductOptionGroup).remove(optionGroup);
            await this.eventBus.publish(new ProductOptionGroupEvent(ctx, deletedOptionGroup, 'deleted', id));
            result = DeletionResult.DELETED;
        } else if (force) {
            // Force delete: remove all associations and delete
            // First, remove the option group from all products
            const products = await this.connection
                .getRepository(ctx, Product)
                .createQueryBuilder('product')
                .leftJoinAndSelect('product.optionGroups', 'optionGroup')
                .where('optionGroup.id = :groupId', { groupId: id })
                .getMany();

            for (const product of products) {
                product.optionGroups = product.optionGroups.filter(og => !idsAreEqual(og.id, id));
                await this.connection.getRepository(ctx, Product).save(product, { reload: false });
            }

            // Delete all associated options (this will handle variants)
            for (const option of optionGroup.options || []) {
                await this.productOptionService.delete(ctx, option.id);
            }

            await this.connection.getRepository(ctx, ProductOptionGroup).remove(optionGroup);
            await this.eventBus.publish(new ProductOptionGroupEvent(ctx, deletedOptionGroup, 'deleted', id));
            message = ctx.translate('message.product-option-group-force-deleted', i18nVars);
            result = DeletionResult.DELETED;
        } else {
            message = ctx.translate('message.product-option-group-used', i18nVars);
            result = DeletionResult.NOT_DELETED;
        }

        return {
            result,
            message,
        };
    }

    /**
     * @description
     * Deletes multiple ProductOptionGroups.
     */
    async deleteMultiple(ctx: RequestContext, ids: ID[], force: boolean = false): Promise<DeletionResponse> {
        const deletedGroups = [];
        const failedDeletions = [];

        for (const id of ids) {
            const optionGroup = await this.connection.findOneInChannel(
                ctx,
                ProductOptionGroup,
                id,
                ctx.channelId,
            );
            if (!optionGroup) {
                failedDeletions.push(id);
                continue;
            }
            const result = await this.delete(ctx, id, force);
            if (result.result === DeletionResult.DELETED) {
                deletedGroups.push(id);
            } else {
                failedDeletions.push(id);
            }
        }

        if (failedDeletions.length === ids.length) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: ctx.translate('message.product-option-groups-cannot-be-deleted', {
                    count: failedDeletions.length,
                }),
            };
        }

        return {
            result: DeletionResult.DELETED,
            message: failedDeletions.length
                ? ctx.translate('message.product-option-groups-partially-deleted', {
                      deletedCount: deletedGroups.length,
                      notDeletedCount: failedDeletions.length,
                  })
                : undefined,
        };
    }
}
