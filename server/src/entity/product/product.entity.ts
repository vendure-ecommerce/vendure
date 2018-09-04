import { DeepPartial } from 'shared/shared-types';
import { HasCustomFields } from 'shared/shared-types';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { LocaleString, Translatable, Translation } from '../../common/types/locale-types';
import { VendureEntity } from '../base/base.entity';
import { CustomProductFields } from '../custom-entity-fields';
import { ProductOptionGroup } from '../product-option-group/product-option-group.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';

import { ProductTranslation } from './product-translation.entity';

@Entity()
export class Product extends VendureEntity implements Translatable, HasCustomFields {
    constructor(input?: DeepPartial<Product>) {
        super(input);
    }
    name: LocaleString;

    slug: LocaleString;

    description: LocaleString;

    @Column() image: string;

    @OneToMany(type => ProductTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<Product>>;

    @OneToMany(type => ProductVariant, variant => variant.product)
    variants: ProductVariant[];

    @ManyToMany(type => ProductOptionGroup)
    @JoinTable()
    optionGroups: ProductOptionGroup[];

    @Column(type => CustomProductFields)
    customFields: CustomProductFields;
}
