import { LanguageCode } from 'shared/generated-types';
import { DeepPartial, HasCustomFields } from 'shared/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Translation } from '../../locale/locale-types';
import { VendureEntity } from '../base/base.entity';
import { CustomProductFieldsTranslation } from '../custom-entity-fields';

import { Product } from './product.entity';

@Entity()
export class ProductTranslation extends VendureEntity implements Translation<Product>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<Product>>) {
        super(input);
    }

    @Column('varchar') languageCode: LanguageCode;

    @Column() name: string;

    @Column() slug: string;

    @Column() description: string;

    @ManyToOne(type => Product, base => base.translations)
    base: Product;

    @Column(type => CustomProductFieldsTranslation)
    customFields: CustomProductFieldsTranslation;
}
