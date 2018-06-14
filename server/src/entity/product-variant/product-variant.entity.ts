import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { DeepPartial } from '../../common/common-types';
import { LocaleString, Translatable, Translation } from '../../locale/locale-types';
import { ProductOption } from '../product-option/product-option.entity';
import { Product } from '../product/product.entity';
import { ProductVariantTranslation } from './product-variant-translation.entity';

@Entity('product_variant')
export class ProductVariant implements Translatable {
    constructor(input?: DeepPartial<ProductVariant>) {
        if (input) {
            Object.assign(this, input);
        }
    }

    @PrimaryGeneratedColumn() id: number;

    name: LocaleString;

    @Column() sku: string;

    @Column() image: string;

    @Column() price: number;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;

    @OneToMany(type => ProductVariantTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ProductVariant>>;

    @ManyToOne(type => Product, product => product.variants)
    product: Product;

    @ManyToMany(type => ProductOption)
    @JoinTable()
    options: ProductOption[];
}
