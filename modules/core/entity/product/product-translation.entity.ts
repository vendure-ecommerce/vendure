import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LanguageCode } from '../../locale/language-code';
import { Translation, TranslationInput } from '../../locale/locale-types';
import { Product } from './product.entity';

@Entity('product_translation')
export class ProductTranslation implements Translation<Product> {
    constructor(input?: TranslationInput<Product>) {
        if (input) {
            if (input.id !== undefined) {
                this.id = input.id;
            }
            this.languageCode = input.languageCode;
            this.name = input.name;
            this.slug = input.slug;
            this.description = input.description;
        }
    }

    @PrimaryGeneratedColumn() id: number;

    @Column() languageCode: LanguageCode;

    @Column() name: string;

    @Column() slug: string;

    @Column() description: string;

    @ManyToOne(type => Product, base => base.translations)
    base: Product;
}
