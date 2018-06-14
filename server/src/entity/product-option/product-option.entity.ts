import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { DeepPartial } from '../../common/common-types';
import { LocaleString, Translatable, Translation, TranslationInput } from '../../locale/locale-types';
import { ProductOptionGroup } from '../product-option-group/product-option-group.entity';
import { ProductOptionTranslation } from './product-option-translation.entity';

@Entity('product_option')
export class ProductOption implements Translatable {
    constructor(input?: DeepPartial<ProductOption>) {
        if (input) {
            Object.assign(this, input);
        }
    }

    @PrimaryGeneratedColumn() id: number;

    name: LocaleString;

    @Column() code: string;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;

    @OneToMany(type => ProductOptionTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ProductOption>>;

    @ManyToOne(type => ProductOptionGroup, group => group.options)
    group: ProductOptionGroup;
}
