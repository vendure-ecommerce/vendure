import { Column, Entity, ManyToOne } from 'typeorm';

import { DeepPartial } from '../../../../shared/shared-types';
import { LanguageCode } from '../../locale/language-code';
import { Translation, TranslationInput } from '../../locale/locale-types';
import { VendureEntity } from '../base/base.entity';
import { HasCustomFields } from '../base/has-custom-fields';
import { CustomProductFieldsTranslation } from '../custom-entity-fields';

import { Product } from './product.entity';

@Entity()
export class ProductTranslation extends VendureEntity implements Translation<Product>, HasCustomFields {
    constructor(input?: DeepPartial<TranslationInput<Product>>) {
        super(input);
    }

    @Column() languageCode: LanguageCode;

    @Column() name: string;

    @Column() slug: string;

    @Column() description: string;

    @ManyToOne(type => Product, base => base.translations)
    base: Product;

    @Column(type => CustomProductFieldsTranslation)
    customFields: CustomProductFieldsTranslation;
}
