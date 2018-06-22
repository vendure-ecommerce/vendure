import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { DeepPartial } from '../../common/common-types';
import { LocaleString, Translatable, Translation } from '../../locale/locale-types';
import { VendureEntity } from '../base/base.entity';
import { ProductOption } from '../product-option/product-option.entity';
import { Product } from '../product/product.entity';
import { ProductVariantTranslation } from './product-variant-translation.entity';

@Entity()
export class ProductVariant extends VendureEntity implements Translatable {
    constructor(input?: DeepPartial<ProductVariant>) {
        super(input);
    }

    name: LocaleString;

    @Column() sku: string;

    @Column() image: string;

    @Column() price: number;

    @OneToMany(type => ProductVariantTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ProductVariant>>;

    @ManyToOne(type => Product, product => product.variants)
    product: Product;

    @ManyToMany(type => ProductOption)
    @JoinTable()
    options: ProductOption[];
}
