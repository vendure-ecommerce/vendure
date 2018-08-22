import { Column, Entity, ManyToOne } from 'typeorm';

import { DeepPartial } from '../../../../shared/shared-types';
import { LanguageCode } from '../../locale/language-code';
import { Translation } from '../../locale/locale-types';
import { VendureEntity } from '../base/base.entity';
import { CustomFacetValueFieldsTranslation } from '../custom-entity-fields';

import { FacetValue } from './facet-value.entity';

@Entity()
export class FacetValueTranslation extends VendureEntity implements Translation<FacetValue> {
    constructor(input?: DeepPartial<Translation<FacetValue>>) {
        super(input);
    }

    @Column() languageCode: LanguageCode;

    @Column() name: string;

    @ManyToOne(type => FacetValue, base => base.translations)
    base: FacetValue;

    @Column(type => CustomFacetValueFieldsTranslation)
    customFields: CustomFacetValueFieldsTranslation;
}
