import { DeepPartial } from 'shared/shared-types';
import { HasCustomFields } from 'shared/shared-types';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { LocaleString, Translatable, Translation } from '../../locale/locale-types';
import { VendureEntity } from '../base/base.entity';
import { CustomProductOptionFields } from '../custom-entity-fields';
import { ProductOptionGroup } from '../product-option-group/product-option-group.entity';

import { ProductOptionTranslation } from './product-option-translation.entity';

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
