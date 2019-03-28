import { LanguageCode } from '@vendure/common/generated-types';
import { DeepPartial, HasCustomFields } from '@vendure/common/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Translation } from '../../common/types/locale-types';
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

    @Column('text') description: string;

    @ManyToOne(type => Product, base => base.translations)
    base: Product;

    @Column(type => CustomProductFieldsTranslation)
    customFields: CustomProductFieldsTranslation;
}
