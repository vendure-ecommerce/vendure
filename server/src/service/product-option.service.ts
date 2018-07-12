import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { ID } from '../../../shared/shared-types';
import { DEFAULT_LANGUAGE_CODE } from '../common/constants';
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
            .then(groups => groups.map(group => translateDeep(group, lang)));
    }

    findOne(id: ID, lang: LanguageCode): Promise<Translated<ProductOption> | undefined> {
        return this.connection.manager
            .findOne(ProductOption, id, {
                relations: ['group'],
            })
            .then(group => group && translateDeep(group, lang));
    }

    async create(
        group: ProductOptionGroup,
        createProductOptionDto: CreateProductOptionDto,
    ): Promise<Translated<ProductOption>> {
        const option = new ProductOption(createProductOptionDto);
        const translations: ProductOptionTranslation[] = [];

        for (const input of createProductOptionDto.translations) {
            const translation = new ProductOptionTranslation(input);
            translations.push(translation);
            await this.connection.manager.save(translation);
        }

        option.translations = translations;
        option.group = group;
        const createdGroup = await this.connection.manager.save(option);

        return assertFound(this.findOne(createdGroup.id, DEFAULT_LANGUAGE_CODE));
    }
}
