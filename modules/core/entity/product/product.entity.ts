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
import { Translatable } from '../../locale/locale-types';
import { Product } from './product.interface';
import { ProductTranslationEntity } from './product-translation.entity';
import { ProductVariantEntity } from '../product-variant/product-variant.entity';
import { ProductVariant } from '../product-variant/product-variant.interface';
import { ProductOptionEntity } from '../product-option/product-option.entity';
import { ProductOption } from '../product-option/product-option.interface';
import { ProductOptionGroup } from '../product-option-group/product-option-group.interface';
import { ProductOptionGroupEntity } from '../product-option-group/product-option-group.entity';

@Entity('product')
export class ProductEntity implements Translatable<Product> {
    @PrimaryGeneratedColumn() id: number;

    @Column() image: string;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;

    @OneToMany(type => ProductTranslationEntity, translation => translation.base)
    translations: ProductTranslationEntity[];

    @OneToMany(type => ProductVariantEntity, variant => variant.product)
    variants: ProductVariantEntity[];

    @ManyToMany(type => ProductOptionGroupEntity)
    @JoinTable()
    optionGroups: ProductOptionGroupEntity[];
}
