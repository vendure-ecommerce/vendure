import { Injectable } from '@nestjs/common';
import {
    CreateProductOptionGroupInput,
    DeletionResult,
    UpdateProductOptionGroupInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Brackets } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { Instrument } from '../../common/instrument-decorator';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { Logger } from '../../config/logger/vendure-logger';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { ProductOptionGroupTranslation } from '../../entity/product-option-group/product-option-group-translation.entity';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { Product } from '../../entity/product/product.entity';
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

    findAll(
        ctx: RequestContext,
        filterTerm?: string,
        relations?: RelationPaths<ProductOptionGroup>,
    ): Promise<Array<Translated<ProductOptionGroup>>> {
        const qb = this.connection
            .getRepository(ctx, ProductOptionGroup)
            .createQueryBuilder('optionGroup')
            .leftJoinAndSelect('optionGroup.options', 'options')
            .leftJoinAndSelect('options.translations', 'optionTranslations')
            .leftJoinAndSelect('optionGroup.translations', 'optionGroupTranslations')
            .leftJoinAndSelect('options.channels', 'optionChannels')
            .leftJoinAndSelect('optionGroup.channels', 'optionGroupChannels')
            .where('optionGroup.deletedAt IS NULL')
            .andWhere(
                new Brackets(qb1 => {
                    qb1.where('optionGroup.global = :global', { global: true }).orWhere(
                        'optionGroupChannels.id = :channelId',
                        { channelId: ctx.channelId },
                    );
                }),
            );

        if (filterTerm) {
            qb.andWhere('optionGroup.code LIKE :filterTerm', { filterTerm: `%${filterTerm}%` });
        }

        return qb
            .getMany()
            .then(groups => groups.map(group => this.translator.translate(group, ctx, ['options'])));
    }

    findOne(
        ctx: RequestContext,
        id: ID,
        relations?: RelationPaths<ProductOptionGroup>,
    ): Promise<Translated<ProductOptionGroup> | undefined> {
        return this.connection
            .getRepository(ctx, ProductOptionGroup)
            .createQueryBuilder('optionGroup')
            .leftJoinAndSelect('optionGroup.options', 'options')
            .leftJoinAndSelect('options.translations', 'optionTranslations')
            .leftJoinAndSelect('optionGroup.translations', 'optionGroupTranslations')
            .leftJoinAndSelect('options.channels', 'optionChannels')
            .leftJoinAndSelect('optionGroup.channels', 'optionGroupChannels')
            .where('optionGroup.id = :id', { id })
            .andWhere('optionGroup.deletedAt IS NULL')
            .andWhere(
                new Brackets(qb => {
                    qb.where('optionGroup.global = :global', { global: true }).orWhere(
                        'optionGroupChannels.id = :channelId',
                        { channelId: ctx.channelId },
                    );
                }),
            )
            .getOne()
            .then(group => (group && this.translator.translate(group, ctx, ['options'])) ?? undefined);
    }

    getOptionGroupsByProductId(ctx: RequestContext, id: ID): Promise<Array<Translated<ProductOptionGroup>>> {
        return this.connection
            .getRepository(ctx, ProductOptionGroup)
            .createQueryBuilder('optionGroup')
            .leftJoinAndSelect('optionGroup.options', 'options')
            .leftJoinAndSelect('options.translations', 'optionTranslations')
            .leftJoinAndSelect('optionGroup.translations', 'optionGroupTranslations')
            .leftJoinAndSelect('options.channels', 'optionChannels')
            .leftJoinAndSelect('optionGroup.channels', 'optionGroupChannels')
            .innerJoin('optionGroup.products', 'product', 'product.id = :productId', { productId: id })
            .where('optionGroup.deletedAt IS NULL')
            .andWhere(
                new Brackets(qb => {
                    qb.where('optionGroup.global = :global', { global: true }).orWhere(
                        'optionGroupChannels.id = :channelId',
                        { channelId: ctx.channelId },
                    );
                }),
            )
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
        const group = await this.translatableSaver.update({
            ctx,
            input,
            entityType: ProductOptionGroup,
            translationType: ProductOptionGroupTranslation,
        });
        await this.customFieldRelationService.updateRelations(ctx, ProductOptionGroup, input, group);

        if (input.global !== undefined) {
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
     * Deletes the ProductOptionGroup and any associated ProductOptions. If the ProductOptionGroup
     * is still referenced by a soft-deleted Product, then a soft-delete will be used to preserve
     * referential integrity. Otherwise a hard-delete will be performed.
     */
    async deleteGroupAndOptionsFromProduct(ctx: RequestContext, id: ID, productId: ID) {
        const optionGroup = await this.connection.getEntityOrThrow(ctx, ProductOptionGroup, id, {
            relationLoadStrategy: 'query',
            loadEagerRelations: false,
            relations: ['options'],
        });
        const deletedOptionGroup = new ProductOptionGroup(optionGroup);
        const inUseByActiveProducts = await this.isInUseByOtherProducts(ctx, optionGroup, productId);
        if (0 < inUseByActiveProducts) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: ctx.translate('message.product-option-group-used', {
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
            await this.connection
                .getRepository(ctx, Product)
                .createQueryBuilder()
                .relation(Product, 'optionGroups')
                .of({ id: productId })
                .remove({ id });

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
            .getRepository(ctx, ProductOptionGroup)
            .createQueryBuilder('optionGroup')
            .innerJoin('optionGroup.products', 'product', 'product.deletedAt IS NULL')
            .where('optionGroup.id = :id', { id: productOptionGroup.id })
            .andWhere('product.id != :productId', { productId: targetProductId })
            .getCount();
    }

    private async groupOptionsAreInUse(ctx: RequestContext, productOptionGroup: ProductOptionGroup) {
        return this.connection
            .getRepository(ctx, ProductOptionGroup)
            .createQueryBuilder('optionGroup')
            .innerJoin('optionGroup.options', 'options')
            .leftJoinAndSelect('options.translations', 'optionTranslations')
            .leftJoinAndSelect('optionGroup.translations', 'optionGroupTranslations')
            .leftJoinAndSelect('options.channels', 'optionChannels')
            .leftJoinAndSelect('optionGroup.channels', 'optionGroupChannels')
            .innerJoin('options.variants', 'variant')
            .where('optionGroup.id = :groupId', { groupId: productOptionGroup.id })
            .getCount();
    }
}
