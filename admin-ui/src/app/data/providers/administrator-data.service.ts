import { GetAdministrators, GetAdministratorsVariables } from 'shared/generated-types';

import { getDefaultLanguage } from '../../common/utilities/get-default-language';
import { GET_ADMINISTRATORS } from '../definitions/administrator-definitions';
import { QueryResult } from '../query-result';

import { BaseDataService } from './base-data.service';

export class AdministratorDataService {
    constructor(private baseDataService: BaseDataService) {}

    getAdministrators(
        take: number = 10,
        skip: number = 0,
    ): QueryResult<GetAdministrators, GetAdministratorsVariables> {
        return this.baseDataService.query<GetAdministrators, GetAdministratorsVariables>(GET_ADMINISTRATORS, {
            options: {
                take,
                skip,
            },
        });
    }
}
