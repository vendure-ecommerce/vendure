import { Observable } from 'rxjs';

import { getDefaultLanguage } from '../../common/utilities/get-default-language';
import { addCustomFields } from '../add-custom-fields';
import { CREATE_FACET, UPDATE_FACET } from '../mutations/facet-mutations';
import { GET_FACET_LIST, GET_FACET_WITH_VALUES } from '../queries/facet-queries';
import {
    CreateFacet,
    CreateFacetInput,
    CreateFacetVariables,
    GetFacetList,
    GetFacetListVariables,
    GetFacetWithValues,
    GetFacetWithValuesVariables,
    UpdateFacet,
    UpdateFacetInput,
    UpdateFacetVariables,
} from '../types/gql-generated-types';
import { QueryResult } from '../types/query-result';

import { BaseDataService } from './base-data.service';

export class FacetDataService {
    constructor(private baseDataService: BaseDataService) {}

    getFacets(take: number = 10, skip: number = 0): QueryResult<GetFacetList, GetFacetListVariables> {
        return this.baseDataService.query<GetFacetList, GetFacetListVariables>(GET_FACET_LIST, {
            options: {
                take,
                skip,
            },
            languageCode: getDefaultLanguage(),
        });
    }

    getFacet(id: string): QueryResult<GetFacetWithValues, GetFacetWithValuesVariables> {
        return this.baseDataService.query<GetFacetWithValues, GetFacetWithValuesVariables>(
            addCustomFields(GET_FACET_WITH_VALUES),
            {
                id,
                languageCode: getDefaultLanguage(),
            },
        );
    }

    createFacet(facet: CreateFacetInput): Observable<CreateFacet> {
        const input: CreateFacetVariables = {
            input: {
                code: facet.code,
                translations: facet.translations,
                values: facet.values,
                customFields: facet.customFields,
            },
        };
        return this.baseDataService.mutate<CreateFacet, CreateFacetVariables>(
            addCustomFields(CREATE_FACET),
            input,
        );
    }

    updateFacet(facet: UpdateFacetInput): Observable<UpdateFacet> {
        const input: UpdateFacetVariables = {
            input: {
                id: facet.id,
                code: facet.code,
                translations: facet.translations,
                customFields: facet.customFields,
            },
        };
        return this.baseDataService.mutate<UpdateFacet, UpdateFacetVariables>(
            addCustomFields(UPDATE_FACET),
            input,
        );
    }
}
