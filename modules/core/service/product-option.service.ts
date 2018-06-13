import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ProductOptionGroup } from '../entity/product-option-group/product-option-group.entity';
import { LanguageCode } from '../locale/language-code';
import { translateDeep } from '../locale/translate-entity';

@Injectable()
export class ProductOptionService {
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
}
