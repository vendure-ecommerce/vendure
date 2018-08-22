import { Column, Entity, ManyToOne } from 'typeorm';

import { DeepPartial, HasCustomFields } from '../../../../shared/shared-types';
import { LanguageCode } from '../../locale/language-code';
import { Translation } from '../../locale/locale-types';
import { VendureEntity } from '../base/base.entity';
import { CustomFacetFieldsTranslation } from '../custom-entity-fields';

import { Facet } from './facet.entity';

@Entity()
export class FacetTranslation extends VendureEntity implements Translation<Facet>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<Facet>>) {
        super(input);
    }

    @Column() languageCode: LanguageCode;

    @Column() name: string;

    @ManyToOne(type => Facet, base => base.translations)
    base: Facet;

    @Column(type => CustomFacetFieldsTranslation)
    customFields: CustomFacetFieldsTranslation;
}
