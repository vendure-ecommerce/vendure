import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { CreateProductOptionGroupInput, UpdateProductOptionGroupInput } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Connection, FindManyOptions, Like } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { ProductOptionGroupTranslation } from '../../entity/product-option-group/product-option-group-translation.entity';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { translateDeep } from '../helpers/utils/translate-entity';

@Injectable()
export class ProductOptionGroupService {
    constructor(
        @InjectConnection() private connection: Connection,
        private translatableSaver: TranslatableSaver,
    ) {}

    findAll(ctx: RequestContext, filterTerm?: string): Promise<Array<Translated<ProductOptionGroup>>> {
        const findOptions: FindManyOptions = {
            relations: ['options'],
        };
        if (filterTerm) {
            findOptions.where = {
                code: Like(`%${filterTerm}%`),
            };
        }
        return this.connection.manager
            .find(ProductOptionGroup, findOptions)
            .then(groups => groups.map(group => translateDeep(group, ctx.languageCode, ['options'])));
    }

    findOne(ctx: RequestContext, id: ID): Promise<Translated<ProductOptionGroup> | undefined> {
        return this.connection.manager
            .findOne(ProductOptionGroup, id, {
                relations: ['options'],
            })
            .then(group => group && translateDeep(group, ctx.languageCode, ['options']));
    }

    async create(ctx: RequestContext, input: CreateProductOptionGroupInput): Promise<Translated<ProductOptionGroup>> {
        const group = await this.translatableSaver.create({
            input,
            entityType: ProductOptionGroup,
            translationType: ProductOptionGroupTranslation,
        });
        return assertFound(this.findOne(ctx, group.id));
    }

    async update(ctx: RequestContext, input: UpdateProductOptionGroupInput): Promise<Translated<ProductOptionGroup>> {
        const group = await this.translatableSaver.update({
            input,
            entityType: ProductOptionGroup,
            translationType: ProductOptionGroupTranslation,
        });
        return assertFound(this.findOne(ctx, group.id));
    }
}
