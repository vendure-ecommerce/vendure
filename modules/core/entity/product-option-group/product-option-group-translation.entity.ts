import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Translation } from '../../locale/locale-types';
import { ProductOptionGroupEntity } from './product-option-group.entity';
import { ProductOptionGroup } from './product-option-group.interface';

@Entity('product_option_group_translation')
export class ProductOptionGroupTranslationEntity implements Translation<ProductOptionGroup> {
    @PrimaryGeneratedColumn() id: number;

    @Column() languageCode: string;

    @Column() name: string;

    @ManyToOne(type => ProductOptionGroupEntity, base => base.translations)
    base: ProductOptionGroupEntity;
}
