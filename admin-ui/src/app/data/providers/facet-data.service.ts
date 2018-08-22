import { getDefaultLanguage } from '../../common/utilities/get-default-language';
import { GET_FACET_LIST } from '../queries/facet-queries';
import { GetFacetList, GetFacetListVariables } from '../types/gql-generated-types';
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
}
