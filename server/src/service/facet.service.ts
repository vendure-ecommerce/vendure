import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { LanguageCode } from 'shared/generated-types';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { buildListQuery } from '../common/build-list-query';
import { ListQueryOptions } from '../common/common-types';
import { DEFAULT_LANGUAGE_CODE } from '../common/constants';
import { createTranslatable } from '../common/create-translatable';
import { updateTranslatable } from '../common/update-translatable';
import { assertFound } from '../common/utils';
import { FacetTranslation } from '../entity/facet/facet-translation.entity';
import { CreateFacetDto, UpdateFacetDto } from '../entity/facet/facet.dto';
import { Facet } from '../entity/facet/facet.entity';
import { Translated } from '../locale/locale-types';
import { translateDeep } from '../locale/translate-entity';
import { TranslationUpdaterService } from '../locale/translation-updater.service';

@Injectable()
export class FacetService {
    constructor(
        @InjectConnection() private connection: Connection,
        private translationUpdaterService: TranslationUpdaterService,
    ) {}

    findAll(lang: LanguageCode, options: ListQueryOptions<Facet>): Promise<PaginatedList<Translated<Facet>>> {
        const relations = ['values'];

        return buildListQuery(this.connection, Facet, options, relations)
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

    async create(createFacetDto: CreateFacetDto): Promise<Translated<Facet>> {
        const save = createTranslatable(Facet, FacetTranslation);
        const facet = await save(this.connection, createFacetDto);
        return assertFound(this.findOne(facet.id, DEFAULT_LANGUAGE_CODE));
    }

    async update(updateFacetDto: UpdateFacetDto): Promise<Translated<Facet>> {
        const save = updateTranslatable(Facet, FacetTranslation, this.translationUpdaterService);
        const facet = await save(this.connection, updateFacetDto);
        return assertFound(this.findOne(facet.id, DEFAULT_LANGUAGE_CODE));
    }
}
