import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    DeletionResponse,
    MutationAssignRoleToAdministratorArgs,
    MutationCreateAdministratorArgs,
    MutationDeleteAdministratorArgs,
    MutationUpdateAdministratorArgs,
    Permission,
    QueryAdministratorArgs,
    QueryAdministratorsArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { Administrator } from '../../../entity/administrator/administrator.entity';
import { AdministratorService } from '../../../service/services/administrator.service';
import { Allow } from '../../decorators/allow.decorator';

@Resolver('Administrator')
export class AdministratorResolver {
    constructor(private administratorService: AdministratorService) {}

    @Query()
    @Allow(Permission.ReadAdministrator)
    administrators(@Args() args: QueryAdministratorsArgs): Promise<PaginatedList<Administrator>> {
        return this.administratorService.findAll(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadAdministrator)
    administrator(@Args() args: QueryAdministratorArgs): Promise<Administrator | undefined> {
        return this.administratorService.findOne(args.id);
    }

    @Mutation()
    @Allow(Permission.CreateAdministrator)
    createAdministrator(@Args() args: MutationCreateAdministratorArgs): Promise<Administrator> {
        const { input } = args;
        return this.administratorService.create(input);
    }

    @Mutation()
    @Allow(Permission.CreateAdministrator)
    updateAdministrator(@Args() args: MutationUpdateAdministratorArgs): Promise<Administrator> {
        const { input } = args;
        return this.administratorService.update(input);
    }

    @Mutation()
    @Allow(Permission.UpdateAdministrator)
    assignRoleToAdministrator(@Args() args: MutationAssignRoleToAdministratorArgs): Promise<Administrator> {
        return this.administratorService.assignRole(args.administratorId, args.roleId);
    }

    @Mutation()
    @Allow(Permission.DeleteAdministrator)
    deleteAdministrator(@Args() args: MutationDeleteAdministratorArgs): Promise<DeletionResponse> {
        const { id } = args;
        return this.administratorService.softDelete(id);
    }
}
