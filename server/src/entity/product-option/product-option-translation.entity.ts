import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DeepPartial } from '../../common/common-types';
import { LanguageCode } from '../../locale/language-code';
import { Translation } from '../../locale/locale-types';
import { ProductOption } from './product-option.entity';

@Entity('product_option_translation')
export class ProductOptionTranslation implements Translation<ProductOption> {
    constructor(input?: DeepPartial<Translation<ProductOption>>) {
        if (input) {
            Object.assign(this, input);
        }
    }

    @PrimaryGeneratedColumn('uuid') id: string;

    @Column() languageCode: LanguageCode;

    @Column() name: string;

    @ManyToOne(type => ProductOption, base => base.translations)
    base: ProductOption;
}
