import { Injectable } from '@nestjs/common';
import {
    CreateProductOptionGroupInput,
    UpdateProductOptionGroupInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { FindManyOptions, Like } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { ProductOptionGroupTranslation } from '../../entity/product-option-group/product-option-group-translation.entity';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { translateDeep } from '../helpers/utils/translate-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

@Injectable()
export class ProductOptionGroupService {
    constructor(private connection: TransactionalConnection, private translatableSaver: TranslatableSaver) {}

    findAll(ctx: RequestContext, filterTerm?: string): Promise<Array<Translated<ProductOptionGroup>>> {
        const findOptions: FindManyOptions = {
            relations: ['options'],
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

    findOne(ctx: RequestContext, id: ID): Promise<Translated<ProductOptionGroup> | undefined> {
        return this.connection
            .getRepository(ctx, ProductOptionGroup)
            .findOne(id, {
                relations: ['options'],
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
        return assertFound(this.findOne(ctx, group.id));
    }
}
