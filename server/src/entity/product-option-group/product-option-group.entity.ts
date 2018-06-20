import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DeepPartial } from '../../common/common-types';
import { LocaleString, Translatable, Translation } from '../../locale/locale-types';
import { ProductOption } from '../product-option/product-option.entity';
import { ProductOptionGroupTranslation } from './product-option-group-translation.entity';

@Entity('product_option_group')
export class ProductOptionGroup implements Translatable {
    constructor(input?: DeepPartial<ProductOptionGroup>) {
        if (input) {
            Object.assign(this, input);
        }
    }

    @PrimaryGeneratedColumn('uuid') id: string;

    name: LocaleString;

    @Column({ unique: true })
    code: string;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;

    @OneToMany(type => ProductOptionGroupTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ProductOptionGroup>>;

    @OneToMany(type => ProductOption, option => option.group)
    options: ProductOption[];
}
