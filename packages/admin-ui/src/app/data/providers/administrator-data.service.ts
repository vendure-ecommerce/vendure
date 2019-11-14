import {
    CreateAdministrator,
    CreateAdministratorInput,
    CreateRole,
    CreateRoleInput,
    DeleteRole,
    GetAdministrator,
    GetAdministrators,
    GetRole,
    GetRoles,
    UpdateAdministrator,
    UpdateAdministratorInput,
    UpdateRole,
    UpdateRoleInput,
} from '../../common/generated-types';
import {
    CREATE_ADMINISTRATOR,
    CREATE_ROLE,
    DELETE_ROLE,
    GET_ADMINISTRATOR,
    GET_ADMINISTRATORS,
    GET_ROLE,
    GET_ROLES,
    UPDATE_ADMINISTRATOR,
    UPDATE_ROLE,
} from '../definitions/administrator-definitions';

import { BaseDataService } from './base-data.service';

export class AdministratorDataService {
    constructor(private baseDataService: BaseDataService) {}

    getAdministrators(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<GetAdministrators.Query, GetAdministrators.Variables>(
            GET_ADMINISTRATORS,
            {
                options: {
                    take,
                    skip,
                },
            },
        );
    }

    getAdministrator(id: string) {
        return this.baseDataService.query<GetAdministrator.Query, GetAdministrator.Variables>(
            GET_ADMINISTRATOR,
            {
                id,
            },
        );
    }

    createAdministrator(input: CreateAdministratorInput) {
        return this.baseDataService.mutate<CreateAdministrator.Mutation, CreateAdministrator.Variables>(
            CREATE_ADMINISTRATOR,
            { input },
        );
    }

    updateAdministrator(input: UpdateAdministratorInput) {
        return this.baseDataService.mutate<UpdateAdministrator.Mutation, UpdateAdministrator.Variables>(
            UPDATE_ADMINISTRATOR,
            { input },
        );
    }

    getRoles(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<GetRoles.Query, GetRoles.Variables>(GET_ROLES, {
            options: {
                take,
                skip,
            },
        });
    }

    getRole(id: string) {
        return this.baseDataService.query<GetRole.Query, GetRole.Variables>(GET_ROLE, { id });
    }

    createRole(input: CreateRoleInput) {
        return this.baseDataService.mutate<CreateRole.Mutation, CreateRole.Variables>(CREATE_ROLE, { input });
    }

    updateRole(input: UpdateRoleInput) {
        return this.baseDataService.mutate<UpdateRole.Mutation, UpdateRole.Variables>(UPDATE_ROLE, { input });
    }

    deleteRole(id: string) {
        return this.baseDataService.mutate<DeleteRole.Mutation, DeleteRole.Variables>(DELETE_ROLE, { id });
    }
}
