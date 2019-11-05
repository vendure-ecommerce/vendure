import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    MutationCreateRoleArgs,
    MutationUpdateRoleArgs,
    Permission,
    QueryRoleArgs,
    QueryRolesArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { Role } from '../../../entity/role/role.entity';
import { RoleService } from '../../../service/services/role.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

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
    createRole(@Ctx() ctx: RequestContext, @Args() args: MutationCreateRoleArgs): Promise<Role> {
        const { input } = args;
        return this.roleService.create(ctx, input);
    }

    @Mutation()
    @Allow(Permission.UpdateAdministrator)
    updateRole(@Ctx() ctx: RequestContext, @Args() args: MutationUpdateRoleArgs): Promise<Role> {
        const { input } = args;
        return this.roleService.update(ctx, input);
    }
}
