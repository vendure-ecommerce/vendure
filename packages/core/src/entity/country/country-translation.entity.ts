import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Translation } from '../../common/types/locale-types';
import { VendureEntity } from '../base/base.entity';

import { Country } from './country.entity';

@Entity()
export class CountryTranslation extends VendureEntity implements Translation<Country> {
    constructor(input?: DeepPartial<Translation<CountryTranslation>>) {
        super(input);
    }

    @Column('varchar') languageCode: LanguageCode;

    @Column() name: string;

    @ManyToOne(type => Country, base => base.translations, { onDelete: 'CASCADE' })
    base: Country;
}
