import { Injectable } from '@nestjs/common';
import {
    CreateGroupOptionInput,
    CreateProductOptionInput,
    DeletionResponse,
    DeletionResult,
    Permission,
    UpdateProductOptionInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Brackets } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { ForbiddenError } from '../../common';
import { Instrument } from '../../common/instrument-decorator';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { Logger, LogLevel } from '../../config/logger/vendure-logger';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { ProductOptionTranslation } from '../../entity/product-option/product-option-translation.entity';
import { ProductOption } from '../../entity/product-option/product-option.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { EventBus } from '../../event-bus';
import { ProductOptionEvent } from '../../event-bus/events/product-option-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';

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
    ) {}

    async findAll(ctx: RequestContext): Promise<Array<Translated<ProductOption>>> {
        const qb = this.connection
            .getRepository(ctx, ProductOption)
            .createQueryBuilder('option')
            .innerJoinAndSelect('option.translations', 'optionTranslations')
            .leftJoinAndSelect('option.channels', 'optionChannels')
            .leftJoinAndSelect('option.group', 'group')
            .innerJoinAndSelect('group.translations', 'groupTranslations')
            .where('option.deletedAt IS NULL')
            .andWhere(
                new Brackets(q => {
                    q.where('option.global = true').orWhere('optionChannels.id = :channelId', {
                        channelId: ctx.channelId,
                    });
                }),
            );

        const options = await qb.getMany();
        return options.map(option => this.translator.translate(option, ctx));
    }

    async findOne(ctx: RequestContext, id: ID): Promise<Translated<ProductOption> | undefined> {
        const qb = this.connection
            .getRepository(ctx, ProductOption)
            .createQueryBuilder('option')
            .innerJoinAndSelect('option.translations', 'optionTranslations')
            .leftJoinAndSelect('option.channels', 'optionChannels')
            .leftJoinAndSelect('option.group', 'group')
            .innerJoinAndSelect('group.translations', 'groupTranslations')
            .where('option.id = :id', { id })
            .andWhere('option.deletedAt IS NULL')
            .andWhere(
                new Brackets(q => {
                    q.where('option.global = true').orWhere('optionChannels.id = :channelId', {
                        channelId: ctx.channelId,
                    });
                }),
            );

        const option = await qb.getOne();
        return option ? this.translator.translate(option, ctx) : undefined;
    }

    async create(
        ctx: RequestContext,
        group: ProductOptionGroup | ID,
        input: CreateGroupOptionInput | CreateProductOptionInput,
    ): Promise<Translated<ProductOption>> {
        if (input.global) {
            if (!ctx.userHasPermissions([Permission.CreateGlobalProductOption])) {
                throw new ForbiddenError(LogLevel.Verbose);
            }
        }
        const productOptionGroup =
            group instanceof ProductOptionGroup
                ? group
                : await this.connection.getEntityOrThrow(ctx, ProductOptionGroup, group);
        const option = await this.translatableSaver.create({
            ctx,
            input,
            entityType: ProductOption,
            translationType: ProductOptionTranslation,
            beforeSave: po => (po.group = productOptionGroup),
        });
        const optionWithRelations = await this.customFieldRelationService.updateRelations(
            ctx,
            ProductOption,
            input as CreateProductOptionInput,
            option,
        );

        if (!input.global) {
            await this.connection
                .getRepository(ctx, ProductOption)
                .createQueryBuilder()
                .relation(ProductOption, 'channels')
                .of(option)
                .add(ctx.channelId);
        }

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
        if (input.global !== undefined) {
            if (!ctx.userHasPermissions([Permission.UpdateGlobalProductOption])) {
                throw new ForbiddenError(LogLevel.Verbose);
            }
            const channelRepo = this.connection.getRepository(ctx, ProductOption);
            if (input.global) {
                await channelRepo
                    .createQueryBuilder()
                    .relation(ProductOption, 'channels')
                    .of(option)
                    .remove(option.channels);
            } else {
                await channelRepo
                    .createQueryBuilder()
                    .relation(ProductOption, 'channels')
                    .of(option)
                    .add(ctx.channelId);
            }
        }
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
    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const productOption = await this.connection.getEntityOrThrow(ctx, ProductOption, id);
        if (productOption.global) {
            if (!ctx.userHasPermissions([Permission.DeleteGlobalProductOption])) {
                throw new ForbiddenError(LogLevel.Verbose);
            }
        }
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
            .leftJoin('variant.options', 'options')
            .where(variantState === 'active' ? 'variant.deletedAt IS NULL' : 'variant.deletedAt IS NOT NULL')
            .andWhere('options.id = :id', { id: productOption.id })
            .getCount();
    }
}
