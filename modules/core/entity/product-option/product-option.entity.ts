import { Translatable } from '../../locale/locale-types';
import { ProductOption } from './product-option.interface';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ProductOptionTranslationEntity } from './product-option-translation.entity';
import { ProductOptionGroupEntity } from '../product-option-group/product-option-group.entity';

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
