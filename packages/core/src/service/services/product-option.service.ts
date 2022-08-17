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
import { TransactionalConnection } from '../../connection/transactional-connection';
import { ProductVariant } from '../../entity/index';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { ProductOptionTranslation } from '../../entity/product-option/product-option-translation.entity';
import { ProductOption } from '../../entity/product-option/product-option.entity';
import { EventBus } from '../../event-bus';
import { ProductOptionEvent } from '../../event-bus/events/product-option-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { translateDeep } from '../helpers/utils/translate-entity';

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
    ) {}

    findAll(ctx: RequestContext): Promise<Array<Translated<ProductOption>>> {
        return this.connection
            .getRepository(ctx, ProductOption)
            .find({
                relations: ['group'],
            })
            .then(options => options.map(option => translateDeep(option, ctx.languageCode)));
    }

    findOne(ctx: RequestContext, id: ID): Promise<Translated<ProductOption> | undefined> {
        return this.connection
            .getRepository(ctx, ProductOption)
            .findOne(id, {
                relations: ['group'],
            })
            .then(option => option && translateDeep(option, ctx.languageCode));
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
        this.eventBus.publish(new ProductOptionEvent(ctx, optionWithRelations, 'created', input));
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
        this.eventBus.publish(new ProductOptionEvent(ctx, option, 'updated', input));
        return assertFound(this.findOne(ctx, option.id));
    }

    async softDelete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const productOption = await this.connection.getEntityOrThrow(ctx, ProductOption, id);
        const consumingVariants = await this.connection
            .getRepository(ctx, ProductVariant)
            .createQueryBuilder('variant')
            .leftJoin('variant.options', 'option')
            .where('variant.deletedAt IS NULL')
            .andWhere('option.id = :id', { id })
            .getMany();
        if (consumingVariants.length) {
            const message = ctx.translate('message.product-option-used', {
                code: productOption.code,
                count: consumingVariants.length,
            });
            return {
                result: DeletionResult.NOT_DELETED,
                message,
            };
        } else {
            productOption.deletedAt = new Date();
            await this.connection.getRepository(ctx, ProductOption).save(productOption, { reload: false });
            this.eventBus.publish(new ProductOptionEvent(ctx, productOption, 'deleted', id));
            return {
                result: DeletionResult.DELETED,
            };
        }
    }
}
