import { pick } from '@vendure/common/lib/pick';

import {
    CreateFacet,
    CreateFacetInput,
    CreateFacetValueInput,
    CreateFacetValues,
    DeleteFacet,
    DeleteFacetValues,
    GetFacetList,
    GetFacetWithValues,
    UpdateFacet,
    UpdateFacetInput,
    UpdateFacetValueInput,
    UpdateFacetValues,
} from '../../common/generated-types';
import { getDefaultLanguage } from '../../common/utilities/get-default-language';
import {
    CREATE_FACET,
    CREATE_FACET_VALUES,
    DELETE_FACET,
    DELETE_FACET_VALUES,
    GET_FACET_LIST,
    GET_FACET_WITH_VALUES,
    UPDATE_FACET,
    UPDATE_FACET_VALUES,
} from '../definitions/facet-definitions';

import { BaseDataService } from './base-data.service';

export class FacetDataService {
    constructor(private baseDataService: BaseDataService) {}

    getFacets(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<GetFacetList.Query, GetFacetList.Variables>(GET_FACET_LIST, {
            options: {
                take,
                skip,
            },
        });
    }

    getFacet(id: string) {
        return this.baseDataService.query<GetFacetWithValues.Query, GetFacetWithValues.Variables>(
            GET_FACET_WITH_VALUES,
            {
                id,
            },
        );
    }

    createFacet(facet: CreateFacetInput) {
        const input: CreateFacet.Variables = {
            input: pick(facet, ['code', 'isPrivate', 'translations', 'values', 'customFields']),
        };
        return this.baseDataService.mutate<CreateFacet.Mutation, CreateFacet.Variables>(CREATE_FACET, input);
    }

    updateFacet(facet: UpdateFacetInput) {
        const input: UpdateFacet.Variables = {
            input: pick(facet, ['id', 'code', 'isPrivate', 'translations', 'customFields']),
        };
        return this.baseDataService.mutate<UpdateFacet.Mutation, UpdateFacet.Variables>(UPDATE_FACET, input);
    }

    deleteFacet(id: string, force: boolean) {
        return this.baseDataService.mutate<DeleteFacet.Mutation, DeleteFacet.Variables>(DELETE_FACET, {
            id,
            force,
        });
    }

    createFacetValues(facetValues: CreateFacetValueInput[]) {
        const input: CreateFacetValues.Variables = {
            input: facetValues.map(pick(['facetId', 'code', 'translations', 'customFields'])),
        };
        return this.baseDataService.mutate<CreateFacetValues.Mutation, CreateFacetValues.Variables>(
            CREATE_FACET_VALUES,
            input,
        );
    }

    updateFacetValues(facetValues: UpdateFacetValueInput[]) {
        const input: UpdateFacetValues.Variables = {
            input: facetValues.map(pick(['id', 'code', 'translations', 'customFields'])),
        };
        return this.baseDataService.mutate<UpdateFacetValues.Mutation, UpdateFacetValues.Variables>(
            UPDATE_FACET_VALUES,
            input,
        );
    }

    deleteFacetValues(ids: string[], force: boolean) {
        return this.baseDataService.mutate<DeleteFacetValues.Mutation, DeleteFacetValues.Variables>(
            DELETE_FACET_VALUES,
            {
                ids,
                force,
            },
        );
    }
}
