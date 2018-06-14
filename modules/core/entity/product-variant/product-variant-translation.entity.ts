import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DeepPartial } from '../../common/common-types';
import { LanguageCode } from '../../locale/language-code';
import { Translation } from '../../locale/locale-types';
import { ProductVariant } from './product-variant.entity';

@Entity('product_variant_translation')
export class ProductVariantTranslation implements Translation<ProductVariant> {
    constructor(input?: DeepPartial<Translation<ProductVariant>>) {
        if (input) {
            Object.assign(this, input);
        }
    }

    @PrimaryGeneratedColumn() id: number;

    @Column() languageCode: LanguageCode;

    @Column() name: string;

    @ManyToOne(type => ProductVariant, base => base.translations)
    base: ProductVariant;
}
