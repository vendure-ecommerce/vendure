import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { HasCustomFields } from '@vendure/common/lib/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Translation } from '../../common/types/locale-types';
import { VendureEntity } from '../base/base.entity';
import { CustomProductVariantFieldsTranslation } from '../custom-entity-fields';

import { ProductVariant } from './product-variant.entity';

@Entity()
export class ProductVariantTranslation extends VendureEntity
    implements Translation<ProductVariant>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<ProductVariant>>) {
        super(input);
    }

    @Column('varchar') languageCode: LanguageCode;

    @Column() name: string;

    @ManyToOne(type => ProductVariant, base => base.translations)
    base: ProductVariant;

    @Column(type => CustomProductVariantFieldsTranslation)
    customFields: CustomProductVariantFieldsTranslation;
}
