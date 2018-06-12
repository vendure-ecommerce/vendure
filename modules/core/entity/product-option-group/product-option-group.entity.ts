import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { LocaleString, Translatable, Translation } from '../../locale/locale-types';
import { ProductOption } from '../product-option/product-option.entity';
import { ProductOptionGroupTranslation } from './product-option-group-translation.entity';

@Entity('product_option_group')
export class ProductOptionGroup implements Translatable {
    @PrimaryGeneratedColumn() id: number;

    name: LocaleString;

    @Column({ unique: true })
    code: string;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;

    @OneToMany(type => ProductOptionGroupTranslation, translation => translation.base)
    translations: Translation<ProductOptionGroup>[];

    @OneToMany(type => ProductOption, product => product)
    options: ProductOption[];
}
