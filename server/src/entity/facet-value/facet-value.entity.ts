import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { DeepPartial, HasCustomFields } from '../../../../shared/shared-types';
import { LocaleString, Translatable, Translation } from '../../locale/locale-types';
import { VendureEntity } from '../base/base.entity';
import { CustomFacetValueFields } from '../custom-entity-fields';
import { Facet } from '../facet/facet.entity';

import { FacetValueTranslation } from './facet-value-translation.entity';

@Entity()
export class FacetValue extends VendureEntity implements Translatable, HasCustomFields {
    constructor(input?: DeepPartial<FacetValue>) {
        super(input);
    }
    name: LocaleString;

    @Column({ unique: true })
    code: string;

    @OneToMany(type => FacetValueTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<FacetValue>>;

    @ManyToOne(type => Facet, group => group.values)
    facet: Facet;

    @Column(type => CustomFacetValueFields)
    customFields: CustomFacetValueFields;
}
