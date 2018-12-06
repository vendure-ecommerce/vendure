import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { CreateFacetInput, LanguageCode, UpdateFacetInput } from '../../../../shared/generated-types';
import { ID, PaginatedList } from '../../../../shared/shared-types';
import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { FacetTranslation } from '../../entity/facet/facet-translation.entity';
import { Facet } from '../../entity/facet/facet.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { translateDeep } from '../helpers/utils/translate-entity';

@Injectable()
export class FacetService {
    constructor(
        @InjectConnection() private connection: Connection,
        private translatableSaver: TranslatableSaver,
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    findAll(
        lang: LanguageCode,
        options?: ListQueryOptions<Facet>,
    ): Promise<PaginatedList<Translated<Facet>>> {
        const relations = ['values', 'values.facet'];

        return this.listQueryBuilder
            .build(Facet, options, { relations })
            .getManyAndCount()
            .then(([facets, totalItems]) => {
                const items = facets.map(facet =>
                    translateDeep(facet, lang, ['values', ['values', 'facet']]),
                );
                return {
                    items,
                    totalItems,
                };
            });
    }

    findOne(facetId: ID, lang: LanguageCode): Promise<Translated<Facet> | undefined> {
        const relations = ['values', 'values.facet'];

        return this.connection.manager
            .findOne(Facet, facetId, { relations })
            .then(facet => facet && translateDeep(facet, lang, ['values', ['values', 'facet']]));
    }

    async create(input: CreateFacetInput): Promise<Translated<Facet>> {
        const facet = await this.translatableSaver.create({
            input,
            entityType: Facet,
            translationType: FacetTranslation,
        });
        return assertFound(this.findOne(facet.id, DEFAULT_LANGUAGE_CODE));
    }

    async update(input: UpdateFacetInput): Promise<Translated<Facet>> {
        const facet = await this.translatableSaver.update({
            input,
            entityType: Facet,
            translationType: FacetTranslation,
        });
        return assertFound(this.findOne(facet.id, DEFAULT_LANGUAGE_CODE));
    }
}
