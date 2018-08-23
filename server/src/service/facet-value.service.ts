import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { ID } from '../../../shared/shared-types';
import { DEFAULT_LANGUAGE_CODE } from '../common/constants';
import { createTranslatable } from '../common/create-translatable';
import { updateTranslatable } from '../common/update-translatable';
import { assertFound } from '../common/utils';
import { FacetValueTranslation } from '../entity/facet-value/facet-value-translation.entity';
import { CreateFacetValueDto, UpdateFacetValueDto } from '../entity/facet-value/facet-value.dto';
import { FacetValue } from '../entity/facet-value/facet-value.entity';
import { Facet } from '../entity/facet/facet.entity';
import { LanguageCode } from '../locale/language-code';
import { Translated } from '../locale/locale-types';
import { translateDeep } from '../locale/translate-entity';
import { TranslationUpdaterService } from '../locale/translation-updater.service';

@Injectable()
export class FacetValueService {
    constructor(
        @InjectConnection() private connection: Connection,
        private translationUpdaterService: TranslationUpdaterService,
    ) {}

    findAll(lang: LanguageCode): Promise<Array<Translated<FacetValue>>> {
        return this.connection.manager
            .find(FacetValue, {
                relations: ['facet'],
            })
            .then(facetValues => facetValues.map(facetValue => translateDeep(facetValue, lang)));
    }

    findOne(id: ID, lang: LanguageCode): Promise<Translated<FacetValue> | undefined> {
        return this.connection.manager
            .findOne(FacetValue, id, {
                relations: ['facet'],
            })
            .then(facetValue => facetValue && translateDeep(facetValue, lang));
    }

    async create(facet: Facet, createFacetValueDto: CreateFacetValueDto): Promise<Translated<FacetValue>> {
        const save = createTranslatable(FacetValue, FacetValueTranslation, fv => (fv.facet = facet));
        const facetValue = await save(this.connection, createFacetValueDto);
        return assertFound(this.findOne(facetValue.id, DEFAULT_LANGUAGE_CODE));
    }

    async update(updateFacetValueDto: UpdateFacetValueDto): Promise<Translated<FacetValue>> {
        const save = updateTranslatable(FacetValue, FacetValueTranslation, this.translationUpdaterService);
        const facetValue = await save(this.connection, updateFacetValueDto);
        return assertFound(this.findOne(facetValue.id, DEFAULT_LANGUAGE_CODE));
    }
}
