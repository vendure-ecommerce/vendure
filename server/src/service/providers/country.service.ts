import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { CreateCountryInput, UpdateCountryInput } from 'shared/generated-types';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound } from '../../common/utils';
import { Country } from '../../entity/country/country.entity';
import { I18nError } from '../../i18n/i18n-error';
import { buildListQuery } from '../helpers/build-list-query';
import { patchEntity } from '../helpers/patch-entity';

@Injectable()
export class CountryService {
    constructor(@InjectConnection() private connection: Connection) {}

    findAll(options?: ListQueryOptions<Country>): Promise<PaginatedList<Country>> {
        return buildListQuery(this.connection, Country, options)
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(countryId: ID): Promise<Country | undefined> {
        return this.connection.manager.findOne(Country, countryId);
    }

    async create(input: CreateCountryInput): Promise<Country> {
        const country = new Country(input);
        return this.connection.manager.save(country);
    }

    async update(input: UpdateCountryInput): Promise<Country> {
        const country = await this.findOne(input.id);
        if (!country) {
            throw new I18nError(`error.entity-with-id-not-found`, { entityName: 'Country', id: input.id });
        }
        const updatedCountry = patchEntity(country, input);
        await this.connection.manager.save(updatedCountry);
        return assertFound(this.findOne(country.id));
    }
}
