import { Injectable } from '@nestjs/common';
import {
    CreateProductOptionGroupInput,
    DeletionResponse,
    DeletionResult,
    Permission,
    UpdateProductOptionGroupInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Brackets, FindOptionsUtils } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { EntityNotFoundError, ForbiddenError } from '../../common/error/errors';
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
    ) {}

    async findAll(
        ctx: RequestContext,
        filterTerm?: string,
        relations?: RelationPaths<ProductOptionGroup>,
    ): Promise<Array<Translated<ProductOptionGroup>>> {
        const qb = this.connection
            .getRepository(ctx, ProductOptionGroup)
            .createQueryBuilder('group')
            .setFindOptions({ relations: relations ?? ['options'] });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);
        qb.leftJoin('group.channels', 'channels')
            .where('group.deletedAt IS NULL')
            .andWhere(
                new Brackets(qb1 => {
                    qb1.where('group.global = true').orWhere('channels.id = :channelId', {
                        channelId: ctx.channelId,
                    });
                }),
            );

        if (filterTerm) {
            qb.andWhere('group.code LIKE :filterTerm', { filterTerm: `%${filterTerm}%` });
        }
        return qb
            .getMany()
            .then(groups => groups.map(group => this.translator.translate(group, ctx, ['options'])));
    }

    async findOne(
        ctx: RequestContext,
        id: ID,
        relations?: RelationPaths<ProductOptionGroup>,
    ): Promise<Translated<ProductOptionGroup> | undefined> {
        const qb = this.connection
            .getRepository(ctx, ProductOptionGroup)
            .createQueryBuilder('group')
            .setFindOptions({ relations: relations ?? ['options'] });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);
        qb.leftJoin('group.channels', 'channels')
            .where('group.id = :id', { id })
            .andWhere('group.deletedAt IS NULL')
            .andWhere(
                new Brackets(qb1 => {
                    qb1.where('group.global = true').orWhere('channels.id = :channelId', {
                        channelId: ctx.channelId,
                    });
                }),
            );

        return qb
            .getOne()
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
        qb.innerJoin('group.products', 'product', 'product.id = :productId', { productId: id })
            .leftJoin('group.channels', 'channels')
            .andWhere('group.deletedAt IS NULL')
            .andWhere(
                new Brackets(qb1 => {
                    qb1.where('group.global = true').orWhere('channels.id = :channelId', {
                        channelId: ctx.channelId,
                    });
                }),
            )
            .orderBy('group.id', 'ASC');

        return qb
            .getMany()
            .then(groups => groups.map(group => this.translator.translate(group, ctx, ['options'])));
    }

    async create(
        ctx: RequestContext,
        input: Omit<CreateProductOptionGroupInput, 'options'>,
    ): Promise<Translated<ProductOptionGroup>> {
        if (input.global) {
            if (!ctx.userHasPermissions([Permission.CreateGlobalProductOption])) {
                throw new ForbiddenError(LogLevel.Verbose);
            }
        }
        const group = await this.translatableSaver.create({
            ctx,
            input,
            entityType: ProductOptionGroup,
            translationType: ProductOptionGroupTranslation,
            beforeSave: async g => {
                if (!input.global) {
                    await this.channelService.assignToCurrentChannel(g, ctx);
                }
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
        const optionGroup = await this.findOne(ctx, input.id);
        if (!optionGroup) {
            throw new EntityNotFoundError('ProductOptionGroup', input.id);
        }
        if (optionGroup.global && !ctx.userHasPermissions([Permission.UpdateGlobalProductOption])) {
            throw new ForbiddenError(LogLevel.Verbose);
        }

        const group = await this.translatableSaver.update({
            ctx,
            input,
            entityType: ProductOptionGroup,
            translationType: ProductOptionGroupTranslation,
            beforeSave: async g => {
                if (input.global !== undefined) {
                    if (input.global) {
                        await this.channelService.removeFromAssignedChannels(ctx, ProductOptionGroup, g.id);
                    } else {
                        await this.channelService.assignToCurrentChannel(g, ctx);
                    }
                }
            },
        });
        for (const option of optionGroup.options) {
            await this.productOptionService.update(ctx, { id: option.id }, true);
        }
        await this.customFieldRelationService.updateRelations(ctx, ProductOptionGroup, input, group);
        await this.eventBus.publish(new ProductOptionGroupEvent(ctx, group, 'updated', input));
        return assertFound(this.findOne(ctx, group.id));
    }

    /**
     * @description
     * Deletes the ProductOptionGroup and any associated ProductOptions from all products.
     * If the ProductOptionGroup's options are in use by any variants, then a soft-delete will be used
     * to preserve referential integrity. Otherwise a hard-delete will be performed.
     */
    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const optionGroup = await this.connection
            .getRepository(ctx, ProductOptionGroup)
            .createQueryBuilder('group')
            .setFindOptions({ relations: ['options'] })
            .leftJoin('group.channels', 'channels')
            .where('group.id = :id', { id })
            .andWhere('group.deletedAt IS NULL')
            .andWhere(
                new Brackets(qb1 => {
                    qb1.where('group.global = true').orWhere('channels.id = :channelId', {
                        channelId: ctx.channelId,
                    });
                }),
            )
            .getOne();

        if (!optionGroup) {
            throw new EntityNotFoundError('ProductOptionGroup', id);
        }

        if (optionGroup.global) {
            if (!ctx.userHasPermissions([Permission.DeleteGlobalProductOption])) {
                throw new ForbiddenError(LogLevel.Verbose);
            }
        }

        const deletedOptionGroup = new ProductOptionGroup(optionGroup);
        const inUseByActiveProducts = await this.isInUseByOtherProducts(ctx, optionGroup);
        if (0 < inUseByActiveProducts) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: ctx.translate('message.product-option-group-used', {
                    code: optionGroup.code,
                    count: inUseByActiveProducts,
                }),
            };
        }

        const optionsToDelete = optionGroup.options && optionGroup.options.filter(op => !op.deletedAt);

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

    private async isInUseByOtherProducts(
        ctx: RequestContext,
        productOptionGroup: ProductOptionGroup,
    ): Promise<number> {
        return this.connection
            .getRepository(ctx, Product)
            .createQueryBuilder('product')
            .innerJoin('product.optionGroups', 'optionGroup')
            .where('optionGroup.id = :id', { id: productOptionGroup.id })
            .andWhere('product.deletedAt IS NULL')
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
}
