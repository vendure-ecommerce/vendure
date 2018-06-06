import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Translation } from '../../locale/locale-types';
import { ProductOptionGroup } from './product-option-group.interface';
import { ProductOptionGroupEntity } from './product-option-group.entity';

@Entity('product_option_group_translation')
export class ProductOptionGroupTranslationEntity implements Translation<ProductOptionGroup> {
    @PrimaryGeneratedColumn() id: number;

    @Column() languageCode: string;

    @Column() name: string;

    @ManyToOne(type => ProductOptionGroupEntity, base => base.translations)
    base: ProductOptionGroupEntity;
}
