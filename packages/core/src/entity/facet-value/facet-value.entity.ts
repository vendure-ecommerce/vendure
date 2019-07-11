import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { LocaleString, Translatable, Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomFacetValueFields } from '../custom-entity-fields';
import { Facet } from '../facet/facet.entity';

import { FacetValueTranslation } from './facet-value-translation.entity';

/**
 * @description
 * A particular value of a {@link Facet}.
 *
 * @docsCategory entities
 */
@Entity()
export class FacetValue extends VendureEntity implements Translatable, HasCustomFields {
    constructor(input?: DeepPartial<FacetValue>) {
        super(input);
    }
    name: LocaleString;

    @Column() code: string;

    @OneToMany(type => FacetValueTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<FacetValue>>;

    @ManyToOne(type => Facet, group => group.values, { onDelete: 'CASCADE' })
    facet: Facet;

    @Column(type => CustomFacetValueFields)
    customFields: CustomFacetValueFields;
}
