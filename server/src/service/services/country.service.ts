import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { CreateCountryInput, UpdateCountryInput } from 'shared/generated-types';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound } from '../../common/utils';
import { Country } from '../../entity/country/country.entity';
import { I18nError } from '../../i18n/i18n-error';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { patchEntity } from '../helpers/patch-entity';

@Injectable()
export class CountryService {
    constructor(
        @InjectConnection() private connection: Connection,
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    findAll(options?: ListQueryOptions<Country>): Promise<PaginatedList<Country>> {
        return this.listQueryBuilder
            .build(Country, options)
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(countryId: ID): Promise<Country | undefined> {
        return this.connection.getRepository(Country).findOne(countryId);
    }

    async create(input: CreateCountryInput): Promise<Country> {
        const country = new Country(input);
        return this.connection.getRepository(Country).save(country);
    }

    async update(input: UpdateCountryInput): Promise<Country> {
        const country = await this.findOne(input.id);
        if (!country) {
            throw new I18nError(`error.entity-with-id-not-found`, { entityName: 'Country', id: input.id });
        }
        const updatedCountry = patchEntity(country, input);
        await this.connection.getRepository(Country).save(updatedCountry);
        return assertFound(this.findOne(country.id));
    }
}
