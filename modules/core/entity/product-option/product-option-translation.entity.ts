import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Translation } from '../../locale/locale-types';
import { ProductOptionEntity } from './product-option.entity';
import { ProductOption } from './product-option.interface';

@Entity('product_option_translation')
export class ProductOptionTranslationEntity implements Translation<ProductOption> {
    @PrimaryGeneratedColumn() id: number;

    @Column() languageCode: string;

    @Column() name: string;

    @ManyToOne(type => ProductOptionEntity, base => base.translations)
    base: ProductOptionEntity;
}
