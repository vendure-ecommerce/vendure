import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    CreateRoleMutationArgs,
    Permission,
    RoleQueryArgs,
    RolesQueryArgs,
    UpdateRoleMutationArgs,
} from 'shared/generated-types';
import { PaginatedList } from 'shared/shared-types';

import { Role } from '../../entity/role/role.entity';
import { RoleService } from '../../service/services/role.service';
import { Allow } from '../common/auth-guard';

@Resolver('Roles')
export class RoleResolver {
    constructor(private roleService: RoleService) {}

    @Query()
    @Allow(Permission.ReadAdministrator)
    roles(@Args() args: RolesQueryArgs): Promise<PaginatedList<Role>> {
        return this.roleService.findAll(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadAdministrator)
    role(@Args() args: RoleQueryArgs): Promise<Role | undefined> {
        return this.roleService.findOne(args.id);
    }

    @Mutation()
    @Allow(Permission.CreateAdministrator)
    createRole(@Args() args: CreateRoleMutationArgs): Promise<Role> {
        const { input } = args;
        return this.roleService.create(input);
    }

    @Mutation()
    @Allow(Permission.UpdateAdministrator)
    updateRole(@Args() args: UpdateRoleMutationArgs): Promise<Role> {
        const { input } = args;
        return this.roleService.update(input);
    }
}
