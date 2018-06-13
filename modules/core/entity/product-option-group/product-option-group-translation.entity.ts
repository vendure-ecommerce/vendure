import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DeepPartial } from '../../common/common-types';
import { LanguageCode } from '../../locale/language-code';
import { Translation } from '../../locale/locale-types';
import { ProductOptionGroup } from './product-option-group.entity';

@Entity('product_option_group_translation')
export class ProductOptionGroupTranslation implements Translation<ProductOptionGroup> {
    constructor(input?: DeepPartial<Translation<ProductOptionGroup>>) {
        if (input) {
            Object.assign(this, input);
        }
    }

    @PrimaryGeneratedColumn() id: number;

    @Column() languageCode: LanguageCode;

    @Column() name: string;

    @ManyToOne(type => ProductOptionGroup, base => base.translations)
    base: ProductOptionGroup;
}
