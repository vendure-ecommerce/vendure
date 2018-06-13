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
import { LocaleString, Translatable, Translation } from '../../locale/locale-types';
import { ProductOption } from '../product-option/product-option.entity';
import { Product } from '../product/product.entity';
import { ProductVariantTranslationEntity } from './product-variant-translation.entity';

@Entity('product_variant')
export class ProductVariant implements Translatable {
    @PrimaryGeneratedColumn() id: number;

    name: LocaleString;

    @Column() sku: string;

    @Column() image: string;

    @Column() price: number;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;

    @OneToMany(type => ProductVariantTranslationEntity, translation => translation.base, { eager: true })
    translations: Translation<ProductVariant>[];

    @ManyToOne(type => Product, product => product.variants)
    product: Product;

    @ManyToMany(type => ProductOption)
    @JoinTable()
    options: ProductOption[];
}
