import { LanguageCode } from '@vendure/common/generated-types';
import { DeepPartial } from '@vendure/common/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

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
