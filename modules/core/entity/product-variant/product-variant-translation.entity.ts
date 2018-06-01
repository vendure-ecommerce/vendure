import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Translation } from '../../locale/locale-types';
import { ProductVariant } from './product-variant.interface';
import { ProductVariantEntity } from './product-variant.entity';

@Entity('product_variant_translation')
export class ProductVariantTranslationEntity implements Translation<ProductVariant> {
    @PrimaryGeneratedColumn() id: number;

    @Column() languageCode: string;

    @Column() name: string;

    @ManyToOne(type => ProductVariantEntity, base => base.translations)
    base: ProductVariantEntity;
}
