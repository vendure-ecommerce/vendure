import { Injectable } from '@nestjs/common';
import {
    CreateGroupOptionInput,
    CreateProductOptionInput,
    DeletionResponse,
    DeletionResult,
    UpdateProductOptionInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { Logger } from '../../config/logger/vendure-logger';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { ProductOptionTranslation } from '../../entity/product-option/product-option-translation.entity';
import { ProductOption } from '../../entity/product-option/product-option.entity';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
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
export class ProductOptionService {
    constructor(
        private connection: TransactionalConnection,
        private translatableSaver: TranslatableSaver,
        private customFieldRelationService: CustomFieldRelationService,
        private eventBus: EventBus,
        private translator: TranslatorService,
    ) {}

    findAll(ctx: RequestContext): Promise<Array<Translated<ProductOption>>> {
        return this.connection
            .getRepository(ctx, ProductOption)
            .find({
                relations: ['group'],
            })
            .then(options => options.map(option => this.translator.translate(option, ctx)));
    }

    findOne(ctx: RequestContext, id: ID): Promise<Translated<ProductOption> | undefined> {
        return this.connection
            .getRepository(ctx, ProductOption)
            .findOne({
                where: { id },
                relations: ['group'],
            })
            .then(option => (option && this.translator.translate(option, ctx)) ?? undefined);
    }

    async create(
        ctx: RequestContext,
        group: ProductOptionGroup | ID,
        input: CreateGroupOptionInput | CreateProductOptionInput,
    ): Promise<Translated<ProductOption>> {
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
    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
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
