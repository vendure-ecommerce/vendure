import { LanguageCode } from 'shared/generated-types';
import { DeepPartial } from 'shared/shared-types';
import { HasCustomFields } from 'shared/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Translation } from '../../locale/locale-types';
import { VendureEntity } from '../base/base.entity';
import { CustomProductOptionFieldsTranslation } from '../custom-entity-fields';

import { ProductOption } from './product-option.entity';

@Entity()
export class ProductOptionTranslation extends VendureEntity
    implements Translation<ProductOption>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<ProductOption>>) {
        super(input);
    }

    @Column('varchar') languageCode: LanguageCode;

    @Column() name: string;

    @ManyToOne(type => ProductOption, base => base.translations)
    base: ProductOption;

    @Column(type => CustomProductOptionFieldsTranslation)
    customFields: CustomProductOptionFieldsTranslation;
}
