import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { LocaleString, Translatable, Translation } from '../../locale/locale-types';
import { ProductOptionGroup } from '../product-option-group/product-option-group.entity';
import { ProductOptionTranslation } from './product-option-translation.entity';

@Entity('product_option')
export class ProductOption implements Translatable {
    @PrimaryGeneratedColumn() id: number;

    name: LocaleString;

    @Column() code: string;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;

    @OneToMany(type => ProductOptionTranslation, translation => translation.base)
    translations: Translation<ProductOption>[];

    @ManyToOne(type => ProductOptionGroup)
    group: ProductOptionGroup;
}
