import { pick } from '@vendure/common/lib/pick';

import * as Codegen from '../../common/generated-types';
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
        return this.baseDataService.query<Codegen.GetFacetListQuery, Codegen.GetFacetListQueryVariables>(
            GET_FACET_LIST,
            {
                options: {
                    take,
                    skip,
                },
            },
        );
    }

    getAllFacets() {
        return this.baseDataService.query<Codegen.GetFacetListQuery, Codegen.GetFacetListQueryVariables>(
            GET_FACET_LIST,
            {},
        );
    }

    getFacet(id: string) {
        return this.baseDataService.query<
            Codegen.GetFacetWithValuesQuery,
            Codegen.GetFacetWithValuesQueryVariables
        >(GET_FACET_WITH_VALUES, {
            id,
        });
    }

    createFacet(facet: Codegen.CreateFacetInput) {
        const input: Codegen.CreateFacetMutationVariables = {
            input: pick(facet, ['code', 'isPrivate', 'translations', 'values', 'customFields']),
        };
        return this.baseDataService.mutate<Codegen.CreateFacetMutation, Codegen.CreateFacetMutationVariables>(
            CREATE_FACET,
            input,
        );
    }

    updateFacet(facet: Codegen.UpdateFacetInput) {
        const input: Codegen.UpdateFacetMutationVariables = {
            input: pick(facet, ['id', 'code', 'isPrivate', 'translations', 'customFields']),
        };
        return this.baseDataService.mutate<Codegen.UpdateFacetMutation, Codegen.UpdateFacetMutationVariables>(
            UPDATE_FACET,
            input,
        );
    }

    deleteFacet(id: string, force: boolean) {
        return this.baseDataService.mutate<Codegen.DeleteFacetMutation, Codegen.DeleteFacetMutationVariables>(
            DELETE_FACET,
            {
                id,
                force,
            },
        );
    }

    createFacetValues(facetValues: Codegen.CreateFacetValueInput[]) {
        const input: Codegen.CreateFacetValuesMutationVariables = {
            input: facetValues.map(pick(['facetId', 'code', 'translations', 'customFields'])),
        };
        return this.baseDataService.mutate<
            Codegen.CreateFacetValuesMutation,
            Codegen.CreateFacetValuesMutationVariables
        >(CREATE_FACET_VALUES, input);
    }

    updateFacetValues(facetValues: Codegen.UpdateFacetValueInput[]) {
        const input: Codegen.UpdateFacetValuesMutationVariables = {
            input: facetValues.map(pick(['id', 'code', 'translations', 'customFields'])),
        };
        return this.baseDataService.mutate<
            Codegen.UpdateFacetValuesMutation,
            Codegen.UpdateFacetValuesMutationVariables
        >(UPDATE_FACET_VALUES, input);
    }

    deleteFacetValues(ids: string[], force: boolean) {
        return this.baseDataService.mutate<
            Codegen.DeleteFacetValuesMutation,
            Codegen.DeleteFacetValuesMutationVariables
        >(DELETE_FACET_VALUES, {
            ids,
            force,
        });
    }
}
