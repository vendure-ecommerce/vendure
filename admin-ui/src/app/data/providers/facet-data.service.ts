import { Observable } from 'rxjs';

import { getDefaultLanguage } from '../../common/utilities/get-default-language';
import { pick } from '../../common/utilities/pick';
import { addCustomFields } from '../add-custom-fields';
import {
    CREATE_FACET,
    CREATE_FACET_VALUES,
    UPDATE_FACET,
    UPDATE_FACET_VALUES,
} from '../mutations/facet-mutations';
import { GET_FACET_LIST, GET_FACET_WITH_VALUES } from '../queries/facet-queries';
import {
    CreateFacet,
    CreateFacetInput,
    CreateFacetValueInput,
    CreateFacetValues,
    CreateFacetValuesVariables,
    CreateFacetVariables,
    GetFacetList,
    GetFacetListVariables,
    GetFacetWithValues,
    GetFacetWithValuesVariables,
    UpdateFacet,
    UpdateFacetInput,
    UpdateFacetValueInput,
    UpdateFacetValues,
    UpdateFacetValuesVariables,
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
            input: pick(facet, ['code', 'translations', 'values', 'customFields']),
        };
        return this.baseDataService.mutate<CreateFacet, CreateFacetVariables>(
            addCustomFields(CREATE_FACET),
            input,
        );
    }

    updateFacet(facet: UpdateFacetInput): Observable<UpdateFacet> {
        const input: UpdateFacetVariables = {
            input: pick(facet, ['id', 'code', 'translations', 'customFields']),
        };
        return this.baseDataService.mutate<UpdateFacet, UpdateFacetVariables>(
            addCustomFields(UPDATE_FACET),
            input,
        );
    }

    createFacetValues(facetValues: CreateFacetValueInput[]): Observable<CreateFacetValues> {
        const input: CreateFacetValuesVariables = {
            input: facetValues.map(pick(['facetId', 'code', 'translations'])),
        };
        return this.baseDataService.mutate<CreateFacetValues, CreateFacetValuesVariables>(
            addCustomFields(CREATE_FACET_VALUES),
            input,
        );
    }

    updateFacetValues(facetValues: UpdateFacetValueInput[]): Observable<UpdateFacetValues> {
        const input: UpdateFacetValuesVariables = {
            input: facetValues.map(pick(['id', 'code', 'translations'])),
        };
        return this.baseDataService.mutate<UpdateFacetValues, UpdateFacetValuesVariables>(
            addCustomFields(UPDATE_FACET_VALUES),
            input,
        );
    }
}
