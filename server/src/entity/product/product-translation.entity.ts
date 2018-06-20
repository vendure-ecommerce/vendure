import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DeepPartial } from '../../common/common-types';
import { LanguageCode } from '../../locale/language-code';
import { Translation, TranslationInput } from '../../locale/locale-types';
import { Product } from './product.entity';

@Entity('product_translation')
export class ProductTranslation implements Translation<Product> {
    constructor(input?: DeepPartial<TranslationInput<Product>>) {
        if (input) {
            Object.assign(this, input);
        }
    }

    @PrimaryGeneratedColumn('uuid') id: string;

    @Column() languageCode: LanguageCode;

    @Column() name: string;

    @Column() slug: string;

    @Column() description: string;

    @ManyToOne(type => Product, base => base.translations)
    base: Product;
}
