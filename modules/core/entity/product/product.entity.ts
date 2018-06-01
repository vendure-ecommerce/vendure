import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Translatable } from '../../locale/locale-types';
import { Product } from './product.interface';
import { ProductTranslationEntity } from './product-translation.entity';
import { ProductVariantEntity } from '../product-variant/product-variant.entity';
import { ProductVariant } from '../product-variant/product-variant.interface';

@Entity('product')
export class ProductEntity implements Translatable<Product> {
    @PrimaryGeneratedColumn() id: number;

    @Column() image: string;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;

    @OneToMany(type => ProductTranslationEntity, translation => translation.base)
    translations: ProductTranslationEntity[];

    @OneToMany(type => ProductVariantEntity, variant => variant.product)
    variants: ProductVariant[];
}
