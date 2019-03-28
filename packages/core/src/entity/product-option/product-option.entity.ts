import { DeepPartial } from '@vendure/common/shared-types';
import { HasCustomFields } from '@vendure/common/shared-types';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { LocaleString, Translatable, Translation } from '../../common/types/locale-types';
import { VendureEntity } from '../base/base.entity';
import { CustomProductOptionFields } from '../custom-entity-fields';
import { ProductOptionGroup } from '../product-option-group/product-option-group.entity';

import { ProductOptionTranslation } from './product-option-translation.entity';

/**
 * @description
 * A ProductOption is used to differentiate {@link ProductVariant}s from one another.
 *
 * @docsCategory entities
 */
@Entity()
export class ProductOption extends VendureEntity implements Translatable, HasCustomFields {
    constructor(input?: DeepPartial<ProductOption>) {
        super(input);
    }

    name: LocaleString;

    @Column() code: string;

    @OneToMany(type => ProductOptionTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ProductOption>>;

    @ManyToOne(type => ProductOptionGroup, group => group.options)
    group: ProductOptionGroup;

    @Column(type => CustomProductOptionFields)
    customFields: CustomProductOptionFields;
}
