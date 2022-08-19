import { Injectable } from '@nestjs/common';
import {
    CreateProductOptionGroupInput,
    DeletionResult,
    UpdateProductOptionGroupInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { FindManyOptions, Like } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/index';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { Logger } from '../../config/index';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Product, ProductOptionTranslation, ProductVariant } from '../../entity/index';
import { ProductOptionGroupTranslation } from '../../entity/product-option-group/product-option-group-translation.entity';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { EventBus } from '../../event-bus';
import { ProductOptionGroupEvent } from '../../event-bus/events/product-option-group-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { translateDeep } from '../helpers/utils/translate-entity';

import { ProductOptionService } from './product-option.service';

/**
 * @description
 * Contains methods relating to {@link ProductOptionGroup} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class ProductOptionGroupService {
    constructor(
        private connection: TransactionalConnection,
        private translatableSaver: TranslatableSaver,
        private customFieldRelationService: CustomFieldRelationService,
        private productOptionService: ProductOptionService,
        private eventBus: EventBus,
    ) {}

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
            .then(groups => groups.map(group => translateDeep(group, ctx.languageCode, ['options'])));
    }

    findOne(
        ctx: RequestContext,
        id: ID,
        relations?: RelationPaths<ProductOptionGroup>,
    ): Promise<Translated<ProductOptionGroup> | undefined> {
        return this.connection
            .getRepository(ctx, ProductOptionGroup)
            .findOne(id, {
                relations: relations ?? ['options'],
            })
            .then(group => group && translateDeep(group, ctx.languageCode, ['options']));
    }

    getOptionGroupsByProductId(ctx: RequestContext, id: ID): Promise<Array<Translated<ProductOptionGroup>>> {
        return this.connection
            .getRepository(ctx, ProductOptionGroup)
            .find({
                relations: ['options'],
                where: {
                    product: { id },
                },
                order: {
                    id: 'ASC',
                },
            })
            .then(groups => groups.map(group => translateDeep(group, ctx.languageCode, ['options'])));
    }

    async create(
        ctx: RequestContext,
        input: CreateProductOptionGroupInput,
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
        this.eventBus.publish(new ProductOptionGroupEvent(ctx, groupWithRelations, 'created', input));
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
        this.eventBus.publish(new ProductOptionGroupEvent(ctx, group, 'updated', input));
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
            relations: ['options', 'product'],
        });
        const inUseByActiveProducts = await this.isInUseByOtherProducts(
            ctx,
            optionGroup,
            productId,
            'active',
        );
        if (0 < inUseByActiveProducts) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: ctx.translate('message.product-option-group-used', {
                    code: optionGroup.code,
                    count: inUseByActiveProducts,
                }),
            };
        }

        for (const option of optionGroup.options) {
            const { result, message } = await this.productOptionService.delete(ctx, option.id);
            if (result === DeletionResult.NOT_DELETED) {
                await this.connection.rollBackTransaction(ctx);
                return { result, message };
            }
        }
        const isInUseBySoftDeletedVariants = await this.isInUseByOtherProducts(
            ctx,
            optionGroup,
            productId,
            'soft-deleted',
        );
        if (0 < isInUseBySoftDeletedVariants) {
            // soft delete
            optionGroup.deletedAt = new Date();
            await this.connection.getRepository(ctx, ProductOptionGroup).save(optionGroup, { reload: false });
        } else {
            // hard delete
            // TODO: V2 rely on onDelete: CASCADE rather than this manual loop
            for (const translation of optionGroup.translations) {
                await this.connection
                    .getRepository(ctx, ProductOptionGroupTranslation)
                    .remove(translation as ProductOptionGroupTranslation);
            }
            try {
                await this.connection.getRepository(ctx, ProductOptionGroup).remove(optionGroup);
            } catch (e) {
                Logger.error(e.message, undefined, e.stack);
            }
        }
        this.eventBus.publish(new ProductOptionGroupEvent(ctx, optionGroup, 'deleted', id));
        return {
            result: DeletionResult.DELETED,
        };
    }

    private async isInUseByOtherProducts(
        ctx: RequestContext,
        productOptionGroup: ProductOptionGroup,
        targetProductId: ID,
        productState: 'active' | 'soft-deleted',
    ): Promise<number> {
        const [products, count] = await this.connection
            .getRepository(ctx, Product)
            .createQueryBuilder('product')
            .leftJoin('product.optionGroups', 'optionGroup')
            .where(productState === 'active' ? 'product.deletedAt IS NULL' : 'product.deletedAt IS NOT NULL')
            .andWhere('optionGroup.id = :id', { id: productOptionGroup.id })
            .andWhere('product.id != :productId', { productId: targetProductId })
            .getManyAndCount();

        return count;
    }
}
