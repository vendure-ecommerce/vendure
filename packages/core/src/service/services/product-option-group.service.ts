import { Injectable } from '@nestjs/common';
import {
    CreateProductOptionGroupInput,
    UpdateProductOptionGroupInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { FindManyOptions, Like } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/index';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { ProductOptionGroupTranslation } from '../../entity/product-option-group/product-option-group-translation.entity';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { EventBus } from '../../event-bus';
import { ProductOptionGroupEvent } from '../../event-bus/events/product-option-group-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { Translator } from '../helpers/translator/translator';

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
        private eventBus: EventBus,
        private translator: Translator,
    ) {
    }

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
            .then(group => group && this.translator.translate(group, ctx, ['options']));
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
            .then(groups => groups.map(group => this.translator.translate(group, ctx, ['options'])));
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
}
