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
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver('Administrator')
export class AdministratorResolver {
    constructor(private administratorService: AdministratorService) {}

    @Query()
    @Allow(Permission.ReadAdministrator)
    administrators(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryAdministratorsArgs,
    ): Promise<PaginatedList<Administrator>> {
        return this.administratorService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadAdministrator)
    administrator(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryAdministratorArgs,
    ): Promise<Administrator | undefined> {
        return this.administratorService.findOne(ctx, args.id);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.CreateAdministrator)
    createAdministrator(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateAdministratorArgs,
    ): Promise<Administrator> {
        const { input } = args;
        return this.administratorService.create(ctx, input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateAdministrator)
    updateAdministrator(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateAdministratorArgs,
    ): Promise<Administrator> {
        const { input } = args;
        return this.administratorService.update(ctx, input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateAdministrator)
    assignRoleToAdministrator(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationAssignRoleToAdministratorArgs,
    ): Promise<Administrator> {
        return this.administratorService.assignRole(ctx, args.administratorId, args.roleId);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.DeleteAdministrator)
    deleteAdministrator(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteAdministratorArgs,
    ): Promise<DeletionResponse> {
        const { id } = args;
        return this.administratorService.softDelete(ctx, id);
    }
}
