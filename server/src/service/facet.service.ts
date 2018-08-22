import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { ID, PaginatedList } from '../../../shared/shared-types';
import { buildListQuery } from '../common/build-list-query';
import { ListQueryOptions } from '../common/common-types';
import { Facet } from '../entity/facet/facet.entity';
import { LanguageCode } from '../locale/language-code';
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
            .then(([products, totalItems]) => {
                const items = products.map(product => translateDeep(product, lang, ['values']));
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
            .then(product => product && translateDeep(product, lang, ['values']));
    }
}
