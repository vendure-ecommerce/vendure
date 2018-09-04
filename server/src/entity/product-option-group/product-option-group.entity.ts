import { DeepPartial } from 'shared/shared-types';
import { HasCustomFields } from 'shared/shared-types';
import { Column, Entity, OneToMany } from 'typeorm';

import { LocaleString, Translatable, Translation } from '../../common/types/locale-types';
import { VendureEntity } from '../base/base.entity';
import { CustomProductOptionGroupFields } from '../custom-entity-fields';
import { ProductOption } from '../product-option/product-option.entity';

import { ProductOptionGroupTranslation } from './product-option-group-translation.entity';

@Entity()
export class ProductOptionGroup extends VendureEntity implements Translatable, HasCustomFields {
    constructor(input?: DeepPartial<ProductOptionGroup>) {
        super(input);
    }

    name: LocaleString;

    @Column({ unique: true })
    code: string;

    @OneToMany(type => ProductOptionGroupTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ProductOptionGroup>>;

    @OneToMany(type => ProductOption, option => option.group)
    options: ProductOption[];

    @Column(type => CustomProductOptionGroupFields)
    customFields: CustomProductOptionGroupFields;
}
