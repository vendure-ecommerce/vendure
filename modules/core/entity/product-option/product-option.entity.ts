import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Translatable } from '../../locale/locale-types';
import { ProductOptionGroupEntity } from '../product-option-group/product-option-group.entity';
import { ProductOptionTranslationEntity } from './product-option-translation.entity';
import { ProductOption } from './product-option.interface';

@Entity('product_option')
export class ProductOptionEntity implements Translatable<ProductOption> {
    @PrimaryGeneratedColumn() id: number;

    @Column() code: string;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;

    @OneToMany(type => ProductOptionTranslationEntity, translation => translation.base)
    translations: ProductOptionTranslationEntity[];

    @ManyToOne(type => ProductOptionGroupEntity)
    group: ProductOptionGroupEntity;
}
