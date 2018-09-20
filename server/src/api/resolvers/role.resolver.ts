import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    CreateRoleVariables,
    GetRolesVariables,
    GetRoleVariables,
    Permission,
    UpdateRoleVariables,
} from 'shared/generated-types';
import { PaginatedList } from 'shared/shared-types';

import { Role } from '../../entity/role/role.entity';
import { RoleService } from '../../service/providers/role.service';
import { ApplyIdCodec } from '../common/apply-id-codec-decorator';
import { Allow } from '../common/roles-guard';

@Resolver('Roles')
export class RoleResolver {
    constructor(private roleService: RoleService) {}

    @Query()
    @Allow(Permission.ReadAdministrator)
    @ApplyIdCodec()
    roles(@Args() args: GetRolesVariables): Promise<PaginatedList<Role>> {
        return this.roleService.findAll(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadAdministrator)
    @ApplyIdCodec()
    role(@Args() args: GetRoleVariables): Promise<Role | undefined> {
        return this.roleService.findOne(args.id);
    }

    @Mutation()
    @Allow(Permission.CreateAdministrator)
    @ApplyIdCodec()
    createRole(@Args() args: CreateRoleVariables): Promise<Role> {
        const { input } = args;
        return this.roleService.create(input);
    }

    @Mutation()
    @Allow(Permission.UpdateAdministrator)
    @ApplyIdCodec()
    updateRole(@Args() args: UpdateRoleVariables): Promise<Role> {
        const { input } = args;
        return this.roleService.update(input);
    }
}
