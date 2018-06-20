import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { DEFAULT_LANGUAGE_CODE } from '../common/constants';
import { ProductOptionGroup } from '../entity/product-option-group/product-option-group.entity';
import { ProductOptionTranslation } from '../entity/product-option/product-option-translation.entity';
import { CreateProductOptionDto } from '../entity/product-option/product-option.dto';
import { ProductOption } from '../entity/product-option/product-option.entity';
import { LanguageCode } from '../locale/language-code';
import { translateDeep } from '../locale/translate-entity';

@Injectable()
export class ProductOptionService {
    constructor(@InjectConnection() private connection: Connection) {}

    findAll(lang: LanguageCode): Promise<ProductOption[]> {
        return this.connection.manager
            .find(ProductOption, {
                relations: ['group'],
            })
            .then(groups => groups.map(group => translateDeep(group, lang)));
    }

    findOne(id: string, lang: LanguageCode): Promise<ProductOption | undefined> {
        return this.connection.manager
            .findOne(ProductOption, id, {
                relations: ['group'],
            })
            .then(group => group && translateDeep(group, lang));
    }

    async create(group: ProductOptionGroup, createProductOptionDto: CreateProductOptionDto): Promise<ProductOption> {
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

        return this.findOne(createdGroup.id, DEFAULT_LANGUAGE_CODE) as Promise<ProductOption>;
    }
}
