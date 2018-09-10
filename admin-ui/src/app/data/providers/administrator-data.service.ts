import { Observable } from 'rxjs';
import {
    CreateRole,
    CreateRoleInput,
    CreateRoleVariables,
    GetAdministrators,
    GetAdministratorsVariables,
    GetRole,
    GetRoles,
    GetRolesVariables,
    GetRoleVariables,
    UpdateRole,
    UpdateRoleInput,
    UpdateRoleVariables,
} from 'shared/generated-types';

import { getDefaultLanguage } from '../../common/utilities/get-default-language';
import {
    CREATE_ROLE,
    GET_ADMINISTRATORS,
    GET_ROLE,
    GET_ROLES,
    UPDATE_ROLE,
} from '../definitions/administrator-definitions';
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

    getRoles(take: number = 10, skip: number = 0): QueryResult<GetRoles, GetRolesVariables> {
        return this.baseDataService.query<GetRoles, GetRolesVariables>(GET_ROLES, {
            options: {
                take,
                skip,
            },
        });
    }

    getRole(id: string): QueryResult<GetRole, GetRoleVariables> {
        return this.baseDataService.query<GetRole, GetRoleVariables>(GET_ROLE, { id });
    }

    createRole(input: CreateRoleInput): Observable<CreateRole> {
        return this.baseDataService.mutate<CreateRole, CreateRoleVariables>(CREATE_ROLE, { input });
    }

    updateRole(input: UpdateRoleInput): Observable<UpdateRole> {
        return this.baseDataService.mutate<UpdateRole, UpdateRoleVariables>(UPDATE_ROLE, { input });
    }
}
