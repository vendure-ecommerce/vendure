import { LanguageCode } from 'shared/generated-types';
import { DeepPartial } from 'shared/shared-types';
import { HasCustomFields } from 'shared/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Translation } from '../../locale/locale-types';
import { VendureEntity } from '../base/base.entity';
import { CustomProductOptionGroupFieldsTranslation } from '../custom-entity-fields';

import { ProductOptionGroup } from './product-option-group.entity';

@Entity()
export class ProductOptionGroupTranslation extends VendureEntity
    implements Translation<ProductOptionGroup>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<ProductOptionGroup>>) {
        super(input);
    }

    @Column() languageCode: LanguageCode;

    @Column() name: string;

    @ManyToOne(type => ProductOptionGroup, base => base.translations)
    base: ProductOptionGroup;

    @Column(type => CustomProductOptionGroupFieldsTranslation)
    customFields: CustomProductOptionGroupFieldsTranslation;
}
