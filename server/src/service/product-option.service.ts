import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { CreateProductOptionInput, LanguageCode } from 'shared/generated-types';
import { ID } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { DEFAULT_LANGUAGE_CODE } from '../common/constants';
import { Translated } from '../common/types/locale-types';
import { assertFound } from '../common/utils';
import { ProductOptionGroup } from '../entity/product-option-group/product-option-group.entity';
import { ProductOptionTranslation } from '../entity/product-option/product-option-translation.entity';
import { ProductOption } from '../entity/product-option/product-option.entity';

import { createTranslatable } from './helpers/create-translatable';
import { translateDeep } from './helpers/translate-entity';

@Injectable()
export class ProductOptionService {
    constructor(@InjectConnection() private connection: Connection) {}

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
        createProductOptionDto: CreateProductOptionInput,
    ): Promise<Translated<ProductOption>> {
        const save = createTranslatable(ProductOption, ProductOptionTranslation, po => (po.group = group));
        const option = await save(this.connection, createProductOptionDto);
        return assertFound(this.findOne(option.id, DEFAULT_LANGUAGE_CODE));
    }
}
