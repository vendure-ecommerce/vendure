import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, OneToMany } from 'typeorm';

import { LocaleString, Translatable, Translation } from '../../common/types/locale-types';
import { VendureEntity } from '../base/base.entity';

import { CountryTranslation } from './country-translation.entity';

@Entity()
export class Country extends VendureEntity implements Translatable {
    constructor(input?: DeepPartial<Country>) {
        super(input);
    }

    @Column() code: string;

    name: LocaleString;

    @Column() enabled: boolean;

    @OneToMany(type => CountryTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<Country>>;
}
