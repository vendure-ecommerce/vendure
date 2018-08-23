import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { ID } from '../../../shared/shared-types';
import { DEFAULT_LANGUAGE_CODE } from '../common/constants';
import { assertFound } from '../common/utils';
import { FacetValueTranslation } from '../entity/facet-value/facet-value-translation.entity';
import { CreateFacetValueDto } from '../entity/facet-value/facet-value.dto';
import { FacetValue } from '../entity/facet-value/facet-value.entity';
import { Facet } from '../entity/facet/facet.entity';
import { LanguageCode } from '../locale/language-code';
import { Translated } from '../locale/locale-types';
import { translateDeep } from '../locale/translate-entity';

@Injectable()
export class FacetValueService {
    constructor(@InjectConnection() private connection: Connection) {}

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
        const facetValue = new FacetValue(createFacetValueDto);
        const translations: FacetValueTranslation[] = [];

        for (const input of createFacetValueDto.translations) {
            const translation = new FacetValueTranslation(input);
            translations.push(translation);
            await this.connection.manager.save(translation);
        }

        facetValue.translations = translations;
        facetValue.facet = facet;
        const createdGroup = await this.connection.manager.save(facetValue);

        return assertFound(this.findOne(createdGroup.id, DEFAULT_LANGUAGE_CODE));
    }
}
