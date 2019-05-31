import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial, HasCustomFields, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, ManyToOne, RelationId } from 'typeorm';

import { Translation } from '../../common/types/locale-types';
import { VendureEntity } from '../base/base.entity';
import { CustomProductFieldsTranslation } from '../custom-entity-fields';

import { Product } from './product.entity';

@Entity()
@Index(['languageCode', 'slug'], { unique: true })
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

    @RelationId((item: ProductTranslation) => item.base)
    baseId: ID;

    @Column(type => CustomProductFieldsTranslation)
    customFields: CustomProductFieldsTranslation;
}
