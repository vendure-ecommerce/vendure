import { Observable } from 'rxjs';
import {
    CreateAdministrator,
    CreateAdministratorInput,
    CreateAdministratorVariables,
    CreateRole,
    CreateRoleInput,
    CreateRoleVariables,
    GetAdministrator,
    GetAdministrators,
    GetAdministratorsVariables,
    GetAdministratorVariables,
    GetRole,
    GetRoles,
    GetRolesVariables,
    GetRoleVariables,
    UpdateAdministrator,
    UpdateAdministratorInput,
    UpdateAdministratorVariables,
    UpdateRole,
    UpdateRoleInput,
    UpdateRoleVariables,
} from 'shared/generated-types';

import {
    CREATE_ADMINISTRATOR,
    CREATE_ROLE,
    GET_ADMINISTRATOR,
    GET_ADMINISTRATORS,
    GET_ROLE,
    GET_ROLES,
    UPDATE_ADMINISTRATOR,
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

    getAdministrator(id: string): QueryResult<GetAdministrator, GetAdministratorVariables> {
        return this.baseDataService.query<GetAdministrator, GetAdministratorVariables>(GET_ADMINISTRATOR, {
            id,
        });
    }

    createAdministrator(input: CreateAdministratorInput): Observable<CreateAdministrator> {
        return this.baseDataService.mutate<CreateAdministrator, CreateAdministratorVariables>(
            CREATE_ADMINISTRATOR,
            { input },
        );
    }

    updateAdministrator(input: UpdateAdministratorInput): Observable<UpdateAdministrator> {
        return this.baseDataService.mutate<UpdateAdministrator, UpdateAdministratorVariables>(
            UPDATE_ADMINISTRATOR,
            { input },
        );
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
