import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LanguageCode } from '../../locale/language-code';
import { Translation } from '../../locale/locale-types';
import { ProductVariant } from './product-variant.entity';

@Entity('product_variant_translation')
export class ProductVariantTranslationEntity implements Translation<ProductVariant> {
    @PrimaryGeneratedColumn() id: number;

    @Column() languageCode: LanguageCode;

    @Column() name: string;

    @ManyToOne(type => ProductVariant, base => base.translations)
    base: ProductVariant;
}
