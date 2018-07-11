import { Column, Entity, ManyToOne } from 'typeorm';

import { DeepPartial } from '../../../../shared/shared-types';
import { LanguageCode } from '../../locale/language-code';
import { Translation } from '../../locale/locale-types';
import { VendureEntity } from '../base/base.entity';

import { ProductOption } from './product-option.entity';

@Entity()
export class ProductOptionTranslation extends VendureEntity implements Translation<ProductOption> {
    constructor(input?: DeepPartial<Translation<ProductOption>>) {
        super(input);
    }

    @Column() languageCode: LanguageCode;

    @Column() name: string;

    @ManyToOne(type => ProductOption, base => base.translations)
    base: ProductOption;
}
