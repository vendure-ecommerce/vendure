import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LanguageCode } from '../../locale/language-code';
import { Translation } from '../../locale/locale-types';
import { Product } from './product.entity';

@Entity('product_translation')
export class ProductTranslation implements Translation<Product> {
    @PrimaryGeneratedColumn() id: number;

    @Column() languageCode: LanguageCode;

    @Column() name: string;

    @Column() slug: string;

    @Column() description: string;

    @ManyToOne(type => Product, base => base.translations)
    base: Product;
}
