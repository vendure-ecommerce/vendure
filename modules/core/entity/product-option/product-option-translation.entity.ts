import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Translation } from '../../locale/locale-types';
import { ProductOption } from './product-option.interface';
import { ProductOptionEntity } from './product-option.entity';

@Entity('product_option_translation')
export class ProductOptionTranslationEntity implements Translation<ProductOption> {
    @PrimaryGeneratedColumn() id: number;

    @Column() languageCode: string;

    @Column() name: string;

    @ManyToOne(type => ProductOptionEntity, base => base.translations)
    base: ProductOptionEntity;
}
