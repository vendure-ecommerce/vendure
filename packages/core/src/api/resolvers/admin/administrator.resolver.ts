import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    AdministratorList,
    AdministratorQueryArgs,
    AdministratorsQueryArgs,
    AssignRoleToAdministratorMutationArgs,
    CreateAdministratorMutationArgs,
    Permission,
    UpdateAdministratorMutationArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { Administrator } from '../../../entity/administrator/administrator.entity';
import { AdministratorService } from '../../../service/services/administrator.service';
import { Allow } from '../../decorators/allow.decorator';
import { Decode } from '../../decorators/decode.decorator';

@Resolver('Administrator')
export class AdministratorResolver {
    constructor(private administratorService: AdministratorService) {}

    @Query()
    @Allow(Permission.ReadAdministrator)
    administrators(@Args() args: AdministratorsQueryArgs): Promise<PaginatedList<Administrator>> {
        return this.administratorService.findAll(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadAdministrator)
    administrator(@Args() args: AdministratorQueryArgs): Promise<Administrator | undefined> {
        return this.administratorService.findOne(args.id);
    }

    @Mutation()
    @Allow(Permission.CreateAdministrator)
    @Decode('roleIds')
    createAdministrator(@Args() args: CreateAdministratorMutationArgs): Promise<Administrator> {
        const { input } = args;
        return this.administratorService.create(input);
    }

    @Mutation()
    @Allow(Permission.CreateAdministrator)
    updateAdministrator(@Args() args: UpdateAdministratorMutationArgs): Promise<Administrator> {
        const { input } = args;
        return this.administratorService.update(input);
    }

    @Mutation()
    @Allow(Permission.UpdateAdministrator)
    @Decode('administratorId', 'roleId')
    assignRoleToAdministrator(@Args() args: AssignRoleToAdministratorMutationArgs): Promise<Administrator> {
        return this.administratorService.assignRole(args.administratorId, args.roleId);
    }
}
