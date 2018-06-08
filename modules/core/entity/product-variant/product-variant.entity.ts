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
import { Translatable, Translation } from '../../locale/locale-types';
import { ProductOptionEntity } from '../product-option/product-option.entity';
import { ProductEntity } from '../product/product.entity';
import { ProductVariantTranslationEntity } from './product-variant-translation.entity';
import { ProductVariant } from './product-variant.interface';

@Entity('product_variant')
export class ProductVariantEntity implements Translatable<ProductVariant> {
    @PrimaryGeneratedColumn() id: number;

    @Column() sku: string;

    @Column() image: string;

    @Column() price: number;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;

    @OneToMany(type => ProductVariantTranslationEntity, translation => translation.base)
    translations: Translation<ProductVariant>[];

    @ManyToOne(type => ProductEntity, product => product.variants)
    product: ProductEntity;

    @ManyToMany(type => ProductOptionEntity)
    @JoinTable()
    options: ProductOptionEntity[];
}
