import { DeepPartial, HasCustomFields } from 'shared/shared-types';
import { Column, Entity, OneToMany } from 'typeorm';

import { LocaleString, Translatable, Translation } from '../../locale/locale-types';
import { VendureEntity } from '../base/base.entity';
import { CustomFacetFields } from '../custom-entity-fields';
import { FacetValue } from '../facet-value/facet-value.entity';

import { FacetTranslation } from './facet-translation.entity';

@Entity()
export class Facet extends VendureEntity implements Translatable, HasCustomFields {
    constructor(input?: DeepPartial<Facet>) {
        super(input);
    }

    name: LocaleString;

    @Column({ unique: true })
    code: string;

    @OneToMany(type => FacetTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<Facet>>;

    @OneToMany(type => FacetValue, value => value.facet)
    values: FacetValue[];

    @Column(type => CustomFacetFields)
    customFields: CustomFacetFields;
}
