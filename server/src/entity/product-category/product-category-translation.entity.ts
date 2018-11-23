import { LanguageCode } from 'shared/generated-types';
import { DeepPartial, HasCustomFields } from 'shared/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Translation } from '../../common/types/locale-types';
import { VendureEntity } from '../base/base.entity';
import { CustomProductCategoryFieldsTranslation } from '../custom-entity-fields';

import { ProductCategory } from './product-category.entity';

@Entity()
export class ProductCategoryTranslation extends VendureEntity
    implements Translation<ProductCategory>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<ProductCategory>>) {
        super(input);
    }

    @Column('varchar') languageCode: LanguageCode;

    @Column() name: string;

    @Column() description: string;

    @ManyToOne(type => ProductCategory, base => base.translations)
    base: ProductCategory;

    @Column(type => CustomProductCategoryFieldsTranslation)
    customFields: CustomProductCategoryFieldsTranslation;
}
