import { Column, Entity, ManyToOne } from 'typeorm';

import { DeepPartial } from '../../../../shared/shared-types';
import { LanguageCode } from '../../locale/language-code';
import { Translation, TranslationInput } from '../../locale/locale-types';
import { VendureEntity } from '../base/base.entity';

import { Product } from './product.entity';

@Entity()
export class ProductTranslation extends VendureEntity implements Translation<Product> {
    constructor(input?: DeepPartial<TranslationInput<Product>>) {
        super(input);
    }

    @Column() languageCode: LanguageCode;

    @Column() name: string;

    @Column() slug: string;

    @Column() description: string;

    @ManyToOne(type => Product, base => base.translations)
    base: Product;
}
