import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { CreateProductOptionInput, LanguageCode } from 'shared/generated-types';
import { ID } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { ProductOptionTranslation } from '../../entity/product-option/product-option-translation.entity';
import { ProductOption } from '../../entity/product-option/product-option.entity';

import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { translateDeep } from '../helpers/utils/translate-entity';

@Injectable()
export class ProductOptionService {
    constructor(
        @InjectConnection() private connection: Connection,
        private translatableSaver: TranslatableSaver,
    ) {}

    findAll(lang: LanguageCode): Promise<Array<Translated<ProductOption>>> {
        return this.connection.manager
            .find(ProductOption, {
                relations: ['group'],
            })
            .then(options => options.map(option => translateDeep(option, lang)));
    }

    findOne(id: ID, lang: LanguageCode): Promise<Translated<ProductOption> | undefined> {
        return this.connection.manager
            .findOne(ProductOption, id, {
                relations: ['group'],
            })
            .then(option => option && translateDeep(option, lang));
    }

    async create(
        group: ProductOptionGroup,
        input: CreateProductOptionInput,
    ): Promise<Translated<ProductOption>> {
        const option = await this.translatableSaver.create({
            input,
            entityType: ProductOption,
            translationType: ProductOptionTranslation,
            beforeSave: po => (po.group = group),
        });
        return assertFound(this.findOne(option.id, DEFAULT_LANGUAGE_CODE));
    }
}
