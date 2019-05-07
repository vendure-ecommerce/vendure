import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    MutationCreateRoleArgs,
    Permission,
    QueryRoleArgs,
    QueryRolesArgs,
    MutationUpdateRoleArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { Role } from '../../../entity/role/role.entity';
import { RoleService } from '../../../service/services/role.service';
import { Allow } from '../../decorators/allow.decorator';

@Resolver('Roles')
export class RoleResolver {
    constructor(private roleService: RoleService) {}

    @Query()
    @Allow(Permission.ReadAdministrator)
    roles(@Args() args: QueryRolesArgs): Promise<PaginatedList<Role>> {
        return this.roleService.findAll(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadAdministrator)
    role(@Args() args: QueryRoleArgs): Promise<Role | undefined> {
        return this.roleService.findOne(args.id);
    }

    @Mutation()
    @Allow(Permission.CreateAdministrator)
    createRole(@Args() args: MutationCreateRoleArgs): Promise<Role> {
        const { input } = args;
        return this.roleService.create(input);
    }

    @Mutation()
    @Allow(Permission.UpdateAdministrator)
    updateRole(@Args() args: MutationUpdateRoleArgs): Promise<Role> {
        const { input } = args;
        return this.roleService.update(input);
    }
}
