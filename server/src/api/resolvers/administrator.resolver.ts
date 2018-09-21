import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    AssignRoleToAdministratorVariables,
    CreateAdministratorVariables,
    GetAdministratorsVariables,
    GetAdministratorVariables,
    Permission,
    UpdateAdministratorVariables,
} from 'shared/generated-types';
import { PaginatedList } from 'shared/shared-types';

import { Administrator } from '../../entity/administrator/administrator.entity';
import { AdministratorService } from '../../service/providers/administrator.service';
import { Decode } from '../common/id-interceptor';
import { Allow } from '../common/roles-guard';

@Resolver('Administrator')
export class AdministratorResolver {
    constructor(private administratorService: AdministratorService) {}

    @Query()
    @Allow(Permission.ReadAdministrator)
    administrators(@Args() args: GetAdministratorsVariables): Promise<PaginatedList<Administrator>> {
        return this.administratorService.findAll(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadAdministrator)
    administrator(@Args() args: GetAdministratorVariables): Promise<Administrator | undefined> {
        return this.administratorService.findOne(args.id);
    }

    @Mutation()
    @Allow(Permission.CreateAdministrator)
    @Decode('roleIds')
    createAdministrator(@Args() args: CreateAdministratorVariables): Promise<Administrator> {
        const { input } = args;
        return this.administratorService.create(input);
    }

    @Mutation()
    @Allow(Permission.CreateAdministrator)
    updateAdministrator(@Args() args: UpdateAdministratorVariables): Promise<Administrator> {
        const { input } = args;
        return this.administratorService.update(input);
    }

    @Mutation()
    @Allow(Permission.UpdateAdministrator)
    @Decode('administratorId', 'roleId')
    assignRoleToAdministrator(@Args() args: AssignRoleToAdministratorVariables): Promise<Administrator> {
        return this.administratorService.assignRole(args.administratorId, args.roleId);
    }
}
