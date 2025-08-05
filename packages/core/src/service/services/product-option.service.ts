import { Injectable } from '@nestjs/common';
import {
    CreateGroupOptionInput,
    CreateProductOptionInput,
    DeletionResponse,
    DeletionResult,
    UpdateProductOptionInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { IsNull } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { Instrument } from '../../common/instrument-decorator';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { Logger } from '../../config/logger/vendure-logger';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { ProductOptionTranslation } from '../../entity/product-option/product-option-translation.entity';
import { ProductOption } from '../../entity/product-option/product-option.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { EventBus } from '../../event-bus';
import { ProductOptionEvent } from '../../event-bus/events/product-option-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';

import { ChannelService } from './channel.service';

/**
 * @description
 * Contains methods relating to {@link ProductOption} entities.
 *
 * @docsCategory services
 */
@Injectable()
@Instrument()
export class ProductOptionService {
    constructor(
        private connection: TransactionalConnection,
        private translatableSaver: TranslatableSaver,
        private customFieldRelationService: CustomFieldRelationService,
        private eventBus: EventBus,
        private translator: TranslatorService,
        private readonly channelService: ChannelService,
        private readonly listQueryBuilder: ListQueryBuilder,
    ) {}

    async findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<ProductOption>,
        relations?: RelationPaths<ProductOption>,
    ): Promise<PaginatedList<Translated<ProductOption>>> {
        return this.listQueryBuilder
            .build(ProductOption, options, {
                relations: relations ?? ['group', 'channels'],
                ctx,
                channelId: ctx.channelId,
                where: { deletedAt: IsNull() },
            })
            .getManyAndCount()
            .then(([items, totalItems]) => {
                return {
                    items: items.map(item => this.translator.translate(item, ctx, ['group'])),
                    totalItems,
                };
            });
    }

    async findOne(ctx: RequestContext, id: ID): Promise<Translated<ProductOption> | undefined> {
        return this.connection
            .findOneInChannel(ctx, ProductOption, id, ctx.channelId, {
                relations: ['group', 'channels'],
                where: {
                    deletedAt: IsNull(),
                },
            })
            .then(option => (option && this.translator.translate(option, ctx)) ?? undefined);
    }

    /**
     * @description
     * Returns all ProductOptions belonging to the ProductOptionGroup with the given id.
     */
    async findByGroupIdList(
        ctx: RequestContext,
        groupId: ID,
        options?: ListQueryOptions<ProductOption>,
        relations?: RelationPaths<ProductOption>,
    ): Promise<PaginatedList<Translated<ProductOption>>> {
        return this.listQueryBuilder
            .build(ProductOption, options, {
                ctx,
                relations: relations ?? ['group'],
                channelId: ctx.channelId,
                entityAlias: 'productOption',
            })
            .andWhere('productOption.groupId = :groupId', { groupId })
            .getManyAndCount()
            .then(([items, totalItems]) => {
                return {
                    items: items.map(item => this.translator.translate(item, ctx, ['group'])),
                    totalItems,
                };
            });
    }

    async create(
        ctx: RequestContext,
        group: ProductOptionGroup | ID,
        input: CreateGroupOptionInput | CreateProductOptionInput,
    ): Promise<Translated<ProductOption>> {
        const productOptionGroup =
            group instanceof ProductOptionGroup
                ? group
                : await this.connection.getEntityOrThrow(ctx, ProductOptionGroup, group, {
                      relations: ['channels'],
                  });
        const option = await this.translatableSaver.create({
            ctx,
            input,
            entityType: ProductOption,
            translationType: ProductOptionTranslation,
            beforeSave: async po => {
                po.group = productOptionGroup;
                // Inherit channels from the parent group
                if (productOptionGroup.channels && productOptionGroup.channels.length > 0) {
                    po.channels = productOptionGroup.channels;
                } else {
                    // If group has no channels, assign to current channel
                    await this.channelService.assignToCurrentChannel(po, ctx);
                }
            },
        });
        const optionWithRelations = await this.customFieldRelationService.updateRelations(
            ctx,
            ProductOption,
            input as CreateProductOptionInput,
            option,
        );
        await this.eventBus.publish(new ProductOptionEvent(ctx, optionWithRelations, 'created', input));
        return assertFound(this.findOne(ctx, option.id));
    }

    async update(ctx: RequestContext, input: UpdateProductOptionInput): Promise<Translated<ProductOption>> {
        const option = await this.translatableSaver.update({
            ctx,
            input,
            entityType: ProductOption,
            translationType: ProductOptionTranslation,
        });
        await this.customFieldRelationService.updateRelations(ctx, ProductOption, input, option);
        await this.eventBus.publish(new ProductOptionEvent(ctx, option, 'updated', input));
        return assertFound(this.findOne(ctx, option.id));
    }

    /**
     * @description
     * Deletes a ProductOption.
     *
     * - If the ProductOption is used by any ProductVariants, the deletion will fail.
     * - If the ProductOption is used only by soft-deleted ProductVariants, the option will itself
     *   be soft-deleted.
     * - If the ProductOption is not used by any ProductVariant at all, it will be hard-deleted.
     */
    async delete(ctx: RequestContext, id: ID, force = false): Promise<DeletionResponse> {
        const productOption = await this.connection.getEntityOrThrow(ctx, ProductOption, id);
        const deletedProductOption = new ProductOption(productOption);
        const inUseByActiveVariants = await this.isInUse(ctx, productOption, 'active');
        if (0 < inUseByActiveVariants) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: ctx.translate('message.product-option-used', {
                    code: productOption.code,
                    count: inUseByActiveVariants,
                }),
            };
        }
        const isInUseBySoftDeletedVariants = await this.isInUse(ctx, productOption, 'soft-deleted');
        if (0 < isInUseBySoftDeletedVariants) {
            // soft delete
            productOption.deletedAt = new Date();
            await this.connection.getRepository(ctx, ProductOption).save(productOption, { reload: false });
        } else {
            // hard delete
            try {
                await this.connection.getRepository(ctx, ProductOption).remove(productOption);
            } catch (e: any) {
                Logger.error(e.message, undefined, e.stack);
            }
        }
        await this.eventBus.publish(new ProductOptionEvent(ctx, deletedProductOption, 'deleted', id));
        return {
            result: DeletionResult.DELETED,
        };
    }

    private async isInUse(
        ctx: RequestContext,
        productOption: ProductOption,
        variantState: 'active' | 'soft-deleted',
    ): Promise<number> {
        return this.connection
            .getRepository(ctx, ProductVariant)
            .createQueryBuilder('variant')
            .leftJoin('variant.options', 'option')
            .where(variantState === 'active' ? 'variant.deletedAt IS NULL' : 'variant.deletedAt IS NOT NULL')
            .andWhere('option.id = :id', { id: productOption.id })
            .getCount();
    }
}
