import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DeepPartial } from '../../common/common-types';
import { LocaleString, Translatable, Translation } from '../../locale/locale-types';
import { VendureEntity } from '../base/base.entity';
import { ProductOptionGroup } from '../product-option-group/product-option-group.entity';
import { ProductOptionTranslation } from './product-option-translation.entity';

@Entity()
export class ProductOption extends VendureEntity implements Translatable {
    constructor(input?: DeepPartial<ProductOption>) {
        super(input);
    }

    name: LocaleString;

    @Column() code: string;

    @OneToMany(type => ProductOptionTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ProductOption>>;

    @ManyToOne(type => ProductOptionGroup, group => group.options)
    group: ProductOptionGroup;
}
