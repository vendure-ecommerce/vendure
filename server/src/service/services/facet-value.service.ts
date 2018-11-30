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

import { RequestContext } from '../../api/common/request-context';
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
            .then(facetValues => facetValues.map(facetValue => translateDeep(facetValue, lang, ['facet'])));
    }

    findOne(id: ID, lang: LanguageCode): Promise<Translated<FacetValue> | undefined> {
        return this.connection.manager
            .findOne(FacetValue, id, {
                relations: ['facet'],
            })
            .then(facetValue => facetValue && translateDeep(facetValue, lang, ['facet']));
    }

    findByIds(ids: ID[]): Promise<FacetValue[]> {
        return this.connection.getRepository(FacetValue).findByIds(ids, { relations: ['facet'] });
    }

    async findByCategoryIds(ctx: RequestContext, ids: ID[]): Promise<Array<Translated<FacetValue>>> {
        const facetValues = await this.connection
            .getRepository(FacetValue)
            .createQueryBuilder('facetValue')
            .leftJoinAndSelect(
                'product_category_facet_values_facet_value',
                'joinTable',
                'joinTable.facetValueId = facetValue.id',
            )
            .where('joinTable.productCategoryId IN (:...ids)', { ids })
            .getMany();
        return this.findByIds(facetValues.map(v => v.id)).then(values =>
            values.map(value => translateDeep(value, ctx.languageCode)),
        );
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
