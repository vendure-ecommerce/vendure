import { Column, Entity, ManyToOne } from 'typeorm';

import { LanguageCode } from '../../../../shared/generated-types';
import { DeepPartial } from '../../../../shared/shared-types';
import { Translation } from '../../common/types/locale-types';
import { VendureEntity } from '../base/base.entity';
import { CustomFacetValueFieldsTranslation } from '../custom-entity-fields';

import { FacetValue } from './facet-value.entity';

@Entity()
export class FacetValueTranslation extends VendureEntity implements Translation<FacetValue> {
    constructor(input?: DeepPartial<Translation<FacetValue>>) {
        super(input);
    }

    @Column('varchar') languageCode: LanguageCode;

    @Column() name: string;

    @ManyToOne(type => FacetValue, base => base.translations, { onDelete: 'CASCADE' })
    base: FacetValue;

    @Column(type => CustomFacetValueFieldsTranslation)
    customFields: CustomFacetValueFieldsTranslation;
}
