import { Column, Entity, ManyToOne } from 'typeorm';
import { DeepPartial } from '../../../../shared/shared-types';
import { LanguageCode } from '../../locale/language-code';
import { Translation } from '../../locale/locale-types';
import { VendureEntity } from '../base/base.entity';
import { ProductOptionGroup } from './product-option-group.entity';

@Entity()
export class ProductOptionGroupTranslation extends VendureEntity implements Translation<ProductOptionGroup> {
    constructor(input?: DeepPartial<Translation<ProductOptionGroup>>) {
        super(input);
    }

    @Column() languageCode: LanguageCode;

    @Column() name: string;

    @ManyToOne(type => ProductOptionGroup, base => base.translations)
    base: ProductOptionGroup;
}
