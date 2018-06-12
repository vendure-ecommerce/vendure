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
import { DeepPartial } from '../../common/common-types';
import { LocaleString, Translatable, Translation, TranslationInput } from '../../locale/locale-types';
import { ProductOptionGroup } from '../product-option-group/product-option-group.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';
import { ProductTranslation } from './product-translation.entity';

@Entity('product')
export class Product implements Translatable {
    constructor(input?: DeepPartial<Product>) {
        if (input) {
            Object.assign(this, input);
        }
    }

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
