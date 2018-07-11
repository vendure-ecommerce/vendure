import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { DeepPartial } from '../../../../shared/shared-types';
import { LocaleString, Translatable, Translation } from '../../locale/locale-types';
import { VendureEntity } from '../base/base.entity';
import { ProductOptionGroup } from '../product-option-group/product-option-group.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';

import { ProductTranslation } from './product-translation.entity';

@Entity()
export class Product extends VendureEntity implements Translatable {
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
}
