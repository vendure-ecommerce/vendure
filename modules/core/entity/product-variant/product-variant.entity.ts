import { Translatable } from '../../locale/locale-types';
import { ProductVariant } from './product-variant.interface';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from '../product/product.entity';
import { ProductVariantTranslationEntity } from './product-variant-translation.entity';

@Entity('product_variant')
export class ProductVariantEntity implements Translatable<ProductVariant> {
    @PrimaryGeneratedColumn() id: number;

    @Column() sku: string;

    @Column() image: string;

    @Column() price: string;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;

    @OneToMany(type => ProductVariantTranslationEntity, translation => translation.base)
    translations: ProductVariantTranslationEntity[];

    @ManyToOne(type => ProductEntity, product => product.variants)
    product: ProductEntity[];
}
