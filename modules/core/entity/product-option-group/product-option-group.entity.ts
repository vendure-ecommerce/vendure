import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Translatable } from '../../locale/locale-types';
import { ProductOptionGroup } from './product-option-group.interface';
import { ProductOptionGroupTranslationEntity } from './product-option-group-translation.entity';
import { ProductOptionEntity } from '../product-option/product-option.entity';

@Entity('product_option_group')
export class ProductOptionGroupEntity implements Translatable<ProductOptionGroup> {
    @PrimaryGeneratedColumn() id: number;

    @Column() code: string;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;

    @OneToMany(type => ProductOptionGroupTranslationEntity, translation => translation.base)
    translations: ProductOptionGroupTranslationEntity[];

    @OneToMany(type => ProductOptionEntity, product => product)
    options: ProductOptionEntity[];
}
