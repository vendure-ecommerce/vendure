import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LanguageCode } from '../../locale/language-code';
import { Translation } from '../../locale/locale-types';
import { ProductOption } from './product-option.entity';

@Entity('product_option_translation')
export class ProductOptionTranslation implements Translation<ProductOption> {
    @PrimaryGeneratedColumn() id: number;

    @Column() languageCode: LanguageCode;

    @Column() name: string;

    @ManyToOne(type => ProductOption, base => base.translations)
    base: ProductOption;
}
