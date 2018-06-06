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
import { ProductOptionGroupEntity } from '../product-option-group/product-option-group.entity';
import { ProductOptionGroup } from '../product-option-group/product-option-group.interface';
import { ProductOptionEntity } from '../product-option/product-option.entity';
import { ProductOption } from '../product-option/product-option.interface';
import { ProductVariantEntity } from '../product-variant/product-variant.entity';
import { ProductVariant } from '../product-variant/product-variant.interface';
import { ProductTranslationEntity } from './product-translation.entity';
import { Product } from './product.interface';

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
