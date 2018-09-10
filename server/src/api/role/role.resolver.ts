import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginatedList } from 'shared/shared-types';

import { Permission } from '../../entity/role/permission';
import { Role } from '../../entity/role/role.entity';
import { RoleService } from '../../service/role.service';
import { ApplyIdCodec } from '../common/apply-id-codec-decorator';
import { Allow } from '../roles-guard';

@Resolver('Roles')
export class RoleResolver {
    constructor(private roleService: RoleService) {}

    @Query()
    @Allow(Permission.ReadAdministrator)
    @ApplyIdCodec()
    roles(@Args() args: any): Promise<PaginatedList<Role>> {
        return this.roleService.findAll(args.options);
    }

    @Query()
    @Allow(Permission.ReadAdministrator)
    @ApplyIdCodec()
    role(@Args() args: any): Promise<Role | undefined> {
        return this.roleService.findOne(args.id);
    }

    @Mutation()
    @Allow(Permission.CreateAdministrator)
    @ApplyIdCodec()
    createRole(_, args): Promise<Role> {
        const { input } = args;
        return this.roleService.create(input);
    }
}
