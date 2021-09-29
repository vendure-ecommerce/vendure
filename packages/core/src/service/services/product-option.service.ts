import { Injectable } from '@nestjs/common';
import {
    CreateGroupOptionInput,
    CreateProductOptionInput,
    UpdateProductOptionInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { ProductOptionTranslation } from '../../entity/product-option/product-option-translation.entity';
import { ProductOption } from '../../entity/product-option/product-option.entity';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { translateDeep } from '../helpers/utils/translate-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

@Injectable()
export class ProductOptionService {
    constructor(
        private connection: TransactionalConnection,
        private translatableSaver: TranslatableSaver,
        private customFieldRelationService: CustomFieldRelationService,
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
        await this.customFieldRelationService.updateRelations(
            ctx,
            ProductOption,
            input as CreateProductOptionInput,
            option,
        );
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
        return assertFound(this.findOne(ctx, option.id));
    }
}
