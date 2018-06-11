import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { LocaleString, Translatable, Translation } from '../../locale/locale-types';
import { ProductOptionGroup } from '../product-option-group/product-option-group.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';
import { ProductTranslation } from './product-translation.entity';

@Entity('product')
export class Product implements Translatable {
    @PrimaryGeneratedColumn() id: number;

    name: LocaleString;

    slug: LocaleString;

    description: LocaleString;

    @Column() image: string;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;

    @OneToMany(type => ProductTranslation, translation => translation.base)
    translations: Translation<Product>[];

    @OneToMany(type => ProductVariant, variant => variant.product)
    variants: ProductVariant[];

    @ManyToMany(type => ProductOptionGroup)
    @JoinTable()
    optionGroups: ProductOptionGroup[];
}
