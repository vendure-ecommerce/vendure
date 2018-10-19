import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { CreateFacetInput, LanguageCode, UpdateFacetInput } from 'shared/generated-types';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { FacetTranslation } from '../../entity/facet/facet-translation.entity';
import { Facet } from '../../entity/facet/facet.entity';

import { createTranslatable } from '../helpers/create-translatable';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { translateDeep } from '../helpers/translate-entity';
import { TranslationUpdaterService } from '../helpers/translation-updater.service';
import { updateTranslatable } from '../helpers/update-translatable';

@Injectable()
export class FacetService {
    constructor(
        @InjectConnection() private connection: Connection,
        private translationUpdaterService: TranslationUpdaterService,
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    findAll(
        lang: LanguageCode,
        options?: ListQueryOptions<Facet>,
    ): Promise<PaginatedList<Translated<Facet>>> {
        const relations = ['values'];

        return this.listQueryBuilder
            .build(Facet, options, relations)
            .getManyAndCount()
            .then(([facets, totalItems]) => {
                const items = facets.map(facet => translateDeep(facet, lang, ['values']));
                return {
                    items,
                    totalItems,
                };
            });
    }

    findOne(facetId: ID, lang: LanguageCode): Promise<Translated<Facet> | undefined> {
        const relations = ['values'];

        return this.connection.manager
            .findOne(Facet, facetId, { relations })
            .then(facet => facet && translateDeep(facet, lang, ['values']));
    }

    async create(input: CreateFacetInput): Promise<Translated<Facet>> {
        const save = createTranslatable(Facet, FacetTranslation);
        const facet = await save(this.connection, input);
        return assertFound(this.findOne(facet.id, DEFAULT_LANGUAGE_CODE));
    }

    async update(input: UpdateFacetInput): Promise<Translated<Facet>> {
        const save = updateTranslatable(Facet, FacetTranslation, this.translationUpdaterService);
        const facet = await save(this.connection, input);
        return assertFound(this.findOne(facet.id, DEFAULT_LANGUAGE_CODE));
    }
}
