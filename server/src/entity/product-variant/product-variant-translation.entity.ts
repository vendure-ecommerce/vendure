import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DeepPartial } from '../../common/common-types';
import { LanguageCode } from '../../locale/language-code';
import { Translation } from '../../locale/locale-types';
import { VendureEntity } from '../base/base.entity';
import { ProductVariant } from './product-variant.entity';

@Entity()
export class ProductVariantTranslation extends VendureEntity implements Translation<ProductVariant> {
    constructor(input?: DeepPartial<Translation<ProductVariant>>) {
        super(input);
    }

    @Column() languageCode: LanguageCode;

    @Column() name: string;

    @ManyToOne(type => ProductVariant, base => base.translations)
    base: ProductVariant;
}
