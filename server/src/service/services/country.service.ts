import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { CreateCountryInput, UpdateCountryInput } from 'shared/generated-types';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { CountryTranslation } from '../../entity/country/country-translation.entity';
import { Country } from '../../entity/country/country.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { translateDeep } from '../helpers/utils/translate-entity';

@Injectable()
export class CountryService {
    constructor(
        @InjectConnection() private connection: Connection,
        private listQueryBuilder: ListQueryBuilder,
        private translatableSaver: TranslatableSaver,
    ) {}

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Country>,
    ): Promise<PaginatedList<Translated<Country>>> {
        return this.listQueryBuilder
            .build(Country, options)
            .getManyAndCount()
            .then(([countries, totalItems]) => {
                const items = countries.map(country => translateDeep(country, ctx.languageCode));
                return {
                    items,
                    totalItems,
                };
            });
    }

    findOne(ctx: RequestContext, countryId: ID): Promise<Translated<Country> | undefined> {
        return this.connection
            .getRepository(Country)
            .findOne(countryId)
            .then(country => country && translateDeep(country, ctx.languageCode));
    }

    async create(ctx: RequestContext, input: CreateCountryInput): Promise<Translated<Country>> {
        const country = await this.translatableSaver.create({
            input,
            entityType: Country,
            translationType: CountryTranslation,
        });
        return assertFound(this.findOne(ctx, country.id));
    }

    async update(ctx: RequestContext, input: UpdateCountryInput): Promise<Translated<Country>> {
        const country = await this.translatableSaver.update({
            input,
            entityType: Country,
            translationType: CountryTranslation,
        });
        return assertFound(this.findOne(ctx, country.id));
    }
}
