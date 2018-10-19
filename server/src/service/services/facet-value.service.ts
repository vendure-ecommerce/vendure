import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    CreateFacetValueInput,
    CreateFacetValueWithFacetInput,
    LanguageCode,
    UpdateFacetValueInput,
} from 'shared/generated-types';
import { ID } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { FacetValueTranslation } from '../../entity/facet-value/facet-value-translation.entity';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { Facet } from '../../entity/facet/facet.entity';

import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { translateDeep } from '../helpers/utils/translate-entity';

@Injectable()
export class FacetValueService {
    constructor(
        @InjectConnection() private connection: Connection,
        private translatableSaver: TranslatableSaver,
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

    async create(
        facet: Facet,
        input: CreateFacetValueInput | CreateFacetValueWithFacetInput,
    ): Promise<Translated<FacetValue>> {
        const facetValue = await this.translatableSaver.create({
            input,
            entityType: FacetValue,
            translationType: FacetValueTranslation,
            beforeSave: fv => (fv.facet = facet),
        });
        return assertFound(this.findOne(facetValue.id, DEFAULT_LANGUAGE_CODE));
    }

    async update(input: UpdateFacetValueInput): Promise<Translated<FacetValue>> {
        const facetValue = await this.translatableSaver.update({
            input,
            entityType: FacetValue,
            translationType: FacetValueTranslation,
        });
        return assertFound(this.findOne(facetValue.id, DEFAULT_LANGUAGE_CODE));
    }
}
