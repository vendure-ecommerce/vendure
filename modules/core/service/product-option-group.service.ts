import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { DEFAULT_LANGUAGE_CODE } from '../common/constants';
import { ProductOptionGroupTranslation } from '../entity/product-option-group/product-option-group-translation.entity';
import { CreateProductOptionGroupDto } from '../entity/product-option-group/product-option-group.dto';
import { ProductOptionGroup } from '../entity/product-option-group/product-option-group.entity';
import { LanguageCode } from '../locale/language-code';
import { translateDeep } from '../locale/translate-entity';

@Injectable()
export class ProductOptionGroupService {
    constructor(@InjectConnection() private connection: Connection) {}

    findAll(lang: LanguageCode): Promise<ProductOptionGroup[]> {
        return this.connection.manager
            .find(ProductOptionGroup, {
                relations: ['options'],
            })
            .then(groups => groups.map(group => translateDeep(group, lang, ['options'])));
    }

    findOne(id: number, lang: LanguageCode): Promise<ProductOptionGroup | undefined> {
        return this.connection.manager
            .findOne(ProductOptionGroup, id, {
                relations: ['options'],
            })
            .then(group => group && translateDeep(group, lang, ['options']));
    }

    async create(createProductOptionGroupDto: CreateProductOptionGroupDto): Promise<ProductOptionGroup> {
        const optionGroup = new ProductOptionGroup(createProductOptionGroupDto);
        const translations: ProductOptionGroupTranslation[] = [];

        for (const input of createProductOptionGroupDto.translations) {
            const translation = new ProductOptionGroupTranslation(input);
            translations.push(translation);
            await this.connection.manager.save(translation);
        }

        optionGroup.translations = translations;
        const createdGroup = await this.connection.manager.save(optionGroup);

        return this.findOne(createdGroup.id, DEFAULT_LANGUAGE_CODE) as Promise<ProductOptionGroup>;
    }
}
