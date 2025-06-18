import { Injectable } from '@nestjs/common';
import {
    CreateProductOptionGroupInput,
    DeletionResponse,
    DeletionResult,
    Permission,
    UpdateProductOptionGroupInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { Brackets, FindManyOptions, FindOptionsUtils, IsNull, Like } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { EntityNotFoundError, ListQueryOptions, UserInputError } from '../../common';
import { ForbiddenError } from '../../common/error/errors';
import { Instrument } from '../../common/instrument-decorator';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { Logger, LogLevel } from '../../config/logger/vendure-logger';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Product, ProductVariant } from '../../entity';
import { ProductOptionGroupTranslation } from '../../entity/product-option-group/product-option-group-translation.entity';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { EventBus } from '../../event-bus';
import { ProductOptionGroupEvent } from '../../event-bus/events/product-option-group-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';

import { ChannelService } from './channel.service';
import { ProductOptionService } from './product-option.service';

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
        private channelService: ChannelService,
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    /**
     * @deprecated Use {@link ProductOptionGroupService.findAllList findAllList(ctx, options, relations)} instead
     */
    findAll(
        ctx: RequestContext,
        filterTerm?: string,
        relations?: RelationPaths<ProductOptionGroup>,
    ): Promise<Array<Translated<ProductOptionGroup>>> {
        const findOptions: FindManyOptions = {
            relations: relations ?? ['options'],
        };
        if (filterTerm) {
            findOptions.where = {
                code: Like(`%${filterTerm}%`),
            };
        }
        return this.connection
            .getRepository(ctx, ProductOptionGroup)
            .find(findOptions)
            .then(groups => groups.map(group => this.translator.translate(group, ctx, ['options'])));
    }

    findAllList(
        ctx: RequestContext,
        options?: ListQueryOptions<ProductOptionGroup>,
        relations?: RelationPaths<ProductOptionGroup>,
    ): Promise<PaginatedList<Translated<ProductOptionGroup>>> {
        return this.listQueryBuilder
            .build(ProductOptionGroup, options, {
                ctx,
                relations: relations ?? ['options'],
                channelId: ctx.channelId,
            })
            .getManyAndCount()
            .then(([items, totalItems]) => {
                return {
                    items: items.map(item => this.translator.translate(item, ctx, ['options'])),
                    totalItems,
                };
            });
    }

    findOne(
        ctx: RequestContext,
        id: ID,
        relations?: RelationPaths<ProductOptionGroup>,
    ): Promise<Translated<ProductOptionGroup> | undefined> {
        return this.connection
            .getRepository(ctx, ProductOptionGroup)
            .findOne({
                where: {
                    id,
                    deletedAt: IsNull(),
                },
                relations: relations ?? ['options'],
            })
            .then(group => (group && this.translator.translate(group, ctx, ['options'])) ?? undefined);
    }

    async getOptionGroupsByProductId(
        ctx: RequestContext,
        id: ID,
    ): Promise<Array<Translated<ProductOptionGroup>>> {
        const qb = this.connection
            .getRepository(ctx, ProductOptionGroup)
            .createQueryBuilder('group')
            .setFindOptions({ relations: ['options'] });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);
        return qb
            .leftJoin('group.products', 'products')
            .where('group.deletedAt IS NULL')
            .andWhere(
                new Brackets(qb1 => {
                    qb1.where('group.productId = :productId', { productId: id }).orWhere(
                        'products.id = :productId',
                        { productId: id },
                    );
                }),
            )
            .orderBy('group.id', 'ASC')
            .getMany()
            .then(groups => groups.map(group => this.translator.translate(group, ctx, ['options'])));
    }

    async create(
        ctx: RequestContext,
        input: Omit<CreateProductOptionGroupInput, 'options'>,
    ): Promise<Translated<ProductOptionGroup>> {
        const isCreatingGlobal = input.global === true;
        if (isCreatingGlobal && !ctx.userHasPermissions([Permission.CreateGlobalProductOption])) {
            throw new ForbiddenError(LogLevel.Verbose);
        }
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
        const optionGroup = await this.getGroupOrThrow(ctx, input.id);
        if (optionGroup.global === true && !ctx.userHasPermissions([Permission.UpdateGlobalProductOption])) {
            throw new ForbiddenError(LogLevel.Verbose);
        }
        if (
            !optionGroup.global &&
            input.global &&
            !ctx.userHasPermissions([Permission.CreateGlobalProductOption])
        ) {
            throw new ForbiddenError(LogLevel.Verbose);
        }
        if (optionGroup.productId && input.global) {
            throw new UserInputError('message.product-option-group-cannot-be-global', {
                groupCode: optionGroup.code,
            });
        }
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
    async deleteGroupAndOptions(ctx: RequestContext, id: ID, productId?: ID): Promise<DeletionResponse> {
        const optionGroup = await this.connection.getEntityOrThrow(ctx, ProductOptionGroup, id, {
            where: productId ? { productId } : { channels: { id: ctx.channelId } },
            relations: ['options', 'product'],
        });
        const isDeletingGlobal = optionGroup.global === true;
        if (isDeletingGlobal && !ctx.userHasPermissions([Permission.DeleteGlobalProductOption])) {
            throw new ForbiddenError(LogLevel.Verbose);
        }

        const deletedOptionGroup = new ProductOptionGroup(optionGroup);
        const isInUse = await this.optionGroupIsInUse(ctx, optionGroup, productId);
        if (isInUse) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: ctx.translate('message.product-option-group-used', {
                    code: optionGroup.code,
                    count: isInUse,
                }),
            };
        }

        const optionsToDelete = optionGroup.options.filter(op => !op.deletedAt);
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

    private optionGroupIsInUse(ctx: RequestContext, optionGroup: ProductOptionGroup, productId?: ID) {
        if (productId) {
            return this.connection
                .getRepository(ctx, Product)
                .createQueryBuilder('product')
                .leftJoin('product.optionGroups', 'optionGroup')
                .where('product.deletedAt IS NULL')
                .andWhere('optionGroup.id = :id', { id: optionGroup.id })
                .andWhere('product.id != :productId', { productId })
                .getCount();
        } else {
            return this.connection
                .getRepository(ctx, Product)
                .createQueryBuilder('product')
                .leftJoin('product.productOptionGroups', 'productOptionGroups')
                .where('product.deletedAt IS NULL')
                .andWhere('productOptionGroups.id = :id', { id: optionGroup.id })
                .getCount();
        }
    }

    private async groupOptionsAreInUse(ctx: RequestContext, productOptionGroup: ProductOptionGroup) {
        return this.connection
            .getRepository(ctx, ProductVariant)
            .createQueryBuilder('variant')
            .leftJoin('variant.options', 'option')
            .where('option.groupId = :groupId', { groupId: productOptionGroup.id })
            .getCount();
    }

    private async getGroupOrThrow(ctx: RequestContext, groupId: ID): Promise<ProductOptionGroup> {
        const optionGroup = await this.connection.getEntityOrThrow(ctx, ProductOptionGroup, groupId, {
            relations: ['channels'],
        });
        if (!(optionGroup.channels.some(c => c.id === ctx.channelId) || optionGroup.productId)) {
            throw new EntityNotFoundError(ProductOptionGroup.name, groupId);
        }
        return optionGroup;
    }
}
