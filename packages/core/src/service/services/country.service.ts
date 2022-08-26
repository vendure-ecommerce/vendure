import { Injectable } from '@nestjs/common';
import {
    CreateCountryInput,
    DeletionResponse,
    DeletionResult,
    UpdateCountryInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/index';
import { UserInputError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Address } from '../../entity';
import { CountryTranslation } from '../../entity/country/country-translation.entity';
import { Country } from '../../entity/country/country.entity';
import { EventBus } from '../../event-bus';
import { CountryEvent } from '../../event-bus/events/country-event';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';

/**
 * @description
 * Contains methods relating to {@link Country} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class CountryService {
    constructor(
        private connection: TransactionalConnection,
        private listQueryBuilder: ListQueryBuilder,
        private translatableSaver: TranslatableSaver,
        private eventBus: EventBus,
        private translator: TranslatorService,
    ) {}

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Country>,
        relations: RelationPaths<Country> = [],
    ): Promise<PaginatedList<Translated<Country>>> {
        return this.listQueryBuilder
            .build(Country, options, { ctx, relations })
            .getManyAndCount()
            .then(([countries, totalItems]) => {
                const items = countries.map(country => this.translator.translate(country, ctx));
                return {
                    items,
                    totalItems,
                };
            });
    }

    findOne(
        ctx: RequestContext,
        countryId: ID,
        relations: RelationPaths<Country> = [],
    ): Promise<Translated<Country> | undefined> {
        return this.connection
            .getRepository(ctx, Country)
            .findOne(countryId, { relations })
            .then(country => country && this.translator.translate(country, ctx));
    }

    /**
     * @description
     * Returns an array of enabled Countries, intended for use in a public-facing (ie. Shop) API.
     */
    findAllAvailable(ctx: RequestContext): Promise<Array<Translated<Country>>> {
        return this.connection
            .getRepository(ctx, Country)
            .find({ where: { enabled: true } })
            .then(items => items.map(country => this.translator.translate(country, ctx)));
    }

    /**
     * @description
     * Returns a Country based on its ISO country code.
     */
    async findOneByCode(ctx: RequestContext, countryCode: string): Promise<Translated<Country>> {
        const country = await this.connection.getRepository(ctx, Country).findOne({
            where: {
                code: countryCode,
            },
        });
        if (!country) {
            throw new UserInputError('error.country-code-not-valid', { countryCode });
        }
        return this.translator.translate(country, ctx);
    }

    async create(ctx: RequestContext, input: CreateCountryInput): Promise<Translated<Country>> {
        const country = await this.translatableSaver.create({
            ctx,
            input,
            entityType: Country,
            translationType: CountryTranslation,
        });
        this.eventBus.publish(new CountryEvent(ctx, country, 'created', input));
        return assertFound(this.findOne(ctx, country.id));
    }

    async update(ctx: RequestContext, input: UpdateCountryInput): Promise<Translated<Country>> {
        const country = await this.translatableSaver.update({
            ctx,
            input,
            entityType: Country,
            translationType: CountryTranslation,
        });
        this.eventBus.publish(new CountryEvent(ctx, country, 'updated', input));
        return assertFound(this.findOne(ctx, country.id));
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const country = await this.connection.getEntityOrThrow(ctx, Country, id);
        const addressesUsingCountry = await this.connection
            .getRepository(ctx, Address)
            .createQueryBuilder('address')
            .where('address.country = :id', { id })
            .getCount();

        if (0 < addressesUsingCountry) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: ctx.translate('message.country-used-in-addresses', { count: addressesUsingCountry }),
            };
        } else {
            await this.connection.getRepository(ctx, Country).remove(country);
            this.eventBus.publish(new CountryEvent(ctx, country, 'deleted', id));
            return {
                result: DeletionResult.DELETED,
                message: '',
            };
        }
    }
}
