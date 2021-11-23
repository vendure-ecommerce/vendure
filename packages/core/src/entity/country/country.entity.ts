import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, OneToMany } from 'typeorm';

import { LocaleString, Translatable, Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomCountryFields } from '../custom-entity-fields';

import { CountryTranslation } from './country-translation.entity';

/**
 * @description
 * A country to which is available when creating / updating an {@link Address}. Countries are
 * grouped together into {@link Zone}s which are in turn used to determine applicable shipping
 * and taxes for an {@link Order}.
 *
 * @docsCategory entities
 */
@Entity()
export class Country extends VendureEntity implements Translatable, HasCustomFields {
    constructor(input?: DeepPartial<Country>) {
        super(input);
    }

    @Column() code: string;

    name: LocaleString;

    @Column() enabled: boolean;

    @OneToMany(type => CountryTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<Country>>;

    @Column(type => CustomCountryFields)
    customFields: CustomCountryFields;
}
