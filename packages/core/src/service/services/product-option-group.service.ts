import { Injectable } from '@nestjs/common';
import {
    CreateProductOptionGroupInput,
    DeletionResponse,
    DeletionResult,
    Permission,
    UpdateProductOptionGroupInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Brackets, SelectQueryBuilder } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { EntityNotFoundError, ForbiddenError } from '../../common/error/errors';
import { Instrument } from '../../common/instrument-decorator';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { Logger, LogLevel } from '../../config/logger/vendure-logger';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { ProductVariant } from '../../entity';
import { ProductOptionGroupTranslation } from '../../entity/product-option-group/product-option-group-translation.entity';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { EventBus } from '../../event-bus';
import { ProductOptionGroupEvent } from '../../event-bus/events/product-option-group-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';

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
    ) {}

    async findAll(
        ctx: RequestContext,
        filterTerm?: string,
        relations?: RelationPaths<ProductOptionGroup>,
    ): Promise<Array<Translated<ProductOptionGroup>>> {
        const qb = this.connection
            .getRepository(ctx, ProductOptionGroup)
            .createQueryBuilder('optionGroup')
            .innerJoinAndSelect('optionGroup.translations', 'groupTranslations')
            .leftJoinAndSelect('optionGroup.channels', 'groupChannels')
            .leftJoinAndSelect('optionGroup.options', 'options', 'options.deletedAt IS NULL')
            .leftJoinAndSelect('options.translations', 'optionTranslations')
            .leftJoinAndSelect('options.channels', 'optionChannels')
            .where('optionGroup.deletedAt IS NULL')
            .andWhere(
                new Brackets(qb1 => {
                    qb1.where('optionGroup.global = true').orWhere('groupChannels.id = :channelId', {
                        channelId: ctx.channelId,
                    });
                }),
            )
            .andWhere(
                new Brackets(qb2 => {
                    qb2.where('options.id IS NULL')
                        .orWhere('options.global = true')
                        .orWhere('optionChannels.id = :channelId', {
                            channelId: ctx.channelId,
                        });
                }),
            );

        if (filterTerm) {
            qb.andWhere('optionGroup.code LIKE :filterTerm', { filterTerm: `%${filterTerm}%` });
        }
        if (relations) {
            this.applyRelations(qb, relations);
        }
        const groups = await qb.getMany();
        return groups.map(group => this.translator.translate(group, ctx, ['options']));
    }

    async findOne(
        ctx: RequestContext,
        id: ID,
        relations?: RelationPaths<ProductOptionGroup>,
    ): Promise<Translated<ProductOptionGroup> | undefined> {
        const qb = this.connection
            .getRepository(ctx, ProductOptionGroup)
            .createQueryBuilder('optionGroup')
            .innerJoinAndSelect('optionGroup.translations', 'groupTranslations')
            .leftJoinAndSelect('optionGroup.channels', 'groupChannels')
            .leftJoinAndSelect('optionGroup.options', 'options', 'options.deletedAt IS NULL')
            .leftJoinAndSelect('options.translations', 'optionTranslations')
            .leftJoinAndSelect('options.channels', 'optionChannels')
            .where('optionGroup.id = :id', { id })
            .andWhere('optionGroup.deletedAt IS NULL')
            .andWhere(
                new Brackets(qb1 => {
                    qb1.where('optionGroup.global = true').orWhere('groupChannels.id = :channelId', {
                        channelId: ctx.channelId,
                    });
                }),
            )
            .andWhere(
                new Brackets(qb2 => {
                    qb2.where('options.id IS NULL')
                        .orWhere('options.global = true')
                        .orWhere('optionChannels.id = :channelId', {
                            channelId: ctx.channelId,
                        });
                }),
            );

        if (relations) {
            this.applyRelations(qb, relations);
        }
        const group = await qb.getOne();
        return group ? this.translator.translate(group, ctx, ['options']) : undefined;
    }

    async getOptionGroupsByProductId(
        ctx: RequestContext,
        id: ID,
    ): Promise<Array<Translated<ProductOptionGroup>>> {
        const qb = this.connection
            .getRepository(ctx, ProductOptionGroup)
            .createQueryBuilder('optionGroup')
            .innerJoinAndSelect('optionGroup.translations', 'optionGroupTranslations')
            .leftJoinAndSelect('optionGroup.channels', 'optionGroupChannels')
            .leftJoinAndSelect('optionGroup.options', 'options', 'options.deletedAt IS NULL')
            .leftJoinAndSelect('options.translations', 'optionTranslations')
            .leftJoinAndSelect('options.channels', 'optionChannels')
            .innerJoin('optionGroup.products', 'product', 'product.id = :productId', { productId: id })
            .where('optionGroup.deletedAt IS NULL')
            .andWhere(
                new Brackets(q => {
                    q.where('optionGroup.global = true').orWhere('optionGroupChannels.id = :channelId', {
                        channelId: ctx.channelId,
                    });
                }),
            )
            .andWhere(
                new Brackets(q => {
                    q.where('options.id IS NULL')
                        .orWhere('options.global = true')
                        .orWhere('optionChannels.id = :channelId', {
                            channelId: ctx.channelId,
                        });
                }),
            )
            .orderBy('optionGroup.id', 'ASC');

        const groups = await qb.getMany();
        return groups.map(group => this.translator.translate(group, ctx, ['options']));
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
        });
        const groupWithRelations = await this.customFieldRelationService.updateRelations(
            ctx,
            ProductOptionGroup,
            input,
            group,
        );

        if (!input.global) {
            await this.connection
                .getRepository(ctx, ProductOptionGroup)
                .createQueryBuilder()
                .relation(ProductOptionGroup, 'channels')
                .of(group)
                .add(ctx.channelId);
        }
        await this.eventBus.publish(new ProductOptionGroupEvent(ctx, groupWithRelations, 'created', input));
        return assertFound(this.findOne(ctx, group.id));
    }

    async update(
        ctx: RequestContext,
        input: UpdateProductOptionGroupInput,
    ): Promise<Translated<ProductOptionGroup>> {
        const existingGroup = await this.findOne(ctx, input.id);
        if (!existingGroup) {
            throw new EntityNotFoundError('ProductOptionGroup', input.id);
        }
        const group = await this.translatableSaver.update({
            ctx,
            input,
            entityType: ProductOptionGroup,
            translationType: ProductOptionGroupTranslation,
        });
        await this.customFieldRelationService.updateRelations(ctx, ProductOptionGroup, input, group);
        if (input.global !== undefined) {
            if (!ctx.userHasPermissions([Permission.UpdateGlobalProductOption])) {
                throw new ForbiddenError(LogLevel.Verbose);
            }
            const channelRepo = this.connection.getRepository(ctx, ProductOptionGroup);
            if (input.global) {
                await channelRepo
                    .createQueryBuilder()
                    .relation(ProductOptionGroup, 'channels')
                    .of(group)
                    .remove(group.channels);
            } else {
                await channelRepo
                    .createQueryBuilder()
                    .relation(ProductOptionGroup, 'channels')
                    .of(group)
                    .add(ctx.channelId);
            }
        }
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
        const optionGroup = await this.connection.getEntityOrThrow(ctx, ProductOptionGroup, id, {
            relationLoadStrategy: 'query',
            loadEagerRelations: false,
            relations: ['options', 'products'],
        });

        if (optionGroup.global) {
            if (!ctx.userHasPermissions([Permission.DeleteGlobalProductOption])) {
                throw new ForbiddenError(LogLevel.Verbose);
            }
        }

        const deletedOptionGroup = new ProductOptionGroup(optionGroup);
        const hasOptionsWhichAreInUse = await this.groupOptionsAreInUse(ctx, optionGroup);
        if (0 < hasOptionsWhichAreInUse) {
            // soft delete
            optionGroup.deletedAt = new Date();
            await this.connection.getRepository(ctx, ProductOptionGroup).save(optionGroup, { reload: false });
        } else {
            // hard delete
            const optionsToDelete =
                optionGroup.options && optionGroup.options.filter(group => !group.deletedAt);
            for (const option of optionsToDelete) {
                const { result, message } = await this.productOptionService.delete(ctx, option.id);
                if (result === DeletionResult.NOT_DELETED) {
                    await this.connection.rollBackTransaction(ctx);
                    return { result, message };
                }
            }

            await this.connection
                .getRepository(ctx, ProductOptionGroup)
                .createQueryBuilder()
                .relation(ProductOptionGroup, 'products')
                .of(optionGroup)
                .remove(optionGroup.products);

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

    private async groupOptionsAreInUse(ctx: RequestContext, productOptionGroup: ProductOptionGroup) {
        return this.connection
            .getRepository(ctx, ProductVariant)
            .createQueryBuilder('variant')
            .leftJoin('variant.options', 'option')
            .where('option.groupId = :groupId', { groupId: productOptionGroup.id })
            .getCount();
    }

    private applyRelations(
        qb: SelectQueryBuilder<ProductOptionGroup>,
        relations: RelationPaths<ProductOptionGroup>,
    ) {
        for (const relation of relations) {
            const alias = relation.replace('.', '_');
            qb.leftJoinAndSelect(`optionGroup.${relation}`, alias);
        }
    }
}
