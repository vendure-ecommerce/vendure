import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { ID } from '../../../shared/shared-types';
import { DEFAULT_LANGUAGE_CODE } from '../common/constants';
import { createTranslatable } from '../common/create-translatable';
import { assertFound } from '../common/utils';
import { ProductOptionGroup } from '../entity/product-option-group/product-option-group.entity';
import { ProductOptionTranslation } from '../entity/product-option/product-option-translation.entity';
import { CreateProductOptionDto } from '../entity/product-option/product-option.dto';
import { ProductOption } from '../entity/product-option/product-option.entity';
import { LanguageCode } from '../locale/language-code';
import { Translated } from '../locale/locale-types';
import { translateDeep } from '../locale/translate-entity';

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
        createProductOptionDto: CreateProductOptionDto,
    ): Promise<Translated<ProductOption>> {
        const save = createTranslatable(ProductOption, ProductOptionTranslation, po => (po.group = group));
        const option = await save(this.connection, createProductOptionDto);
        return assertFound(this.findOne(option.id, DEFAULT_LANGUAGE_CODE));
    }
}
