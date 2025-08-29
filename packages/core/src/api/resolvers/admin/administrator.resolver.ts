import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    ChannelRoleInput,
    DeletionResponse,
    MutationAssignRoleToAdministratorArgs,
    MutationCreateAdministratorArgs,
    MutationDeleteAdministratorArgs,
    MutationDeleteAdministratorsArgs,
    MutationUpdateActiveAdministratorArgs,
    MutationUpdateAdministratorArgs,
    Permission,
    QueryAdministratorArgs,
    QueryAdministratorsArgs,
    UpdateChannelAdministratorInput,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { Administrator } from '../../../entity/administrator/administrator.entity';
import { AdministratorService } from '../../../service/services/administrator.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { RelationPaths, Relations } from '../../decorators/relations.decorator';
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
        @Relations(Administrator) relations: RelationPaths<Administrator>,
    ): Promise<PaginatedList<Administrator>> {
        return this.administratorService.findAll(ctx, args.options || undefined, relations);
    }

    @Query()
    @Allow(Permission.ReadAdministrator)
    administrator(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryAdministratorArgs,
        @Relations(Administrator) relations: RelationPaths<Administrator>,
    ): Promise<Administrator | undefined> {
        return this.administratorService.findOne(ctx, args.id, relations);
    }

    @Query()
    @Allow(Permission.Owner)
    async activeAdministrator(@Ctx() ctx: RequestContext): Promise<Administrator | undefined> {
        if (ctx.activeUserId) {
            return this.administratorService.findOneByUserId(ctx, ctx.activeUserId);
        }
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.CreateAdministrator)
    createAdministrator(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateAdministratorArgs,
    ): Promise<Administrator> {
        const { input } = args;
        // TODO look into backwards compatability of leaving the old mutations in place
        const channelRoles = input.roleIds.map<ChannelRoleInput>(roleId => ({
            channelId: ctx.channelId,
            roleId,
        }));
        return this.administratorService.create(ctx, { ...input, channelRoles });
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateAdministrator)
    updateAdministrator(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateAdministratorArgs,
    ): Promise<Administrator> {
        // TODO look into backwards compatability of leaving the old mutations in place
        const channelRoles = args.input.roleIds?.map<ChannelRoleInput>(roleId => ({
            channelId: ctx.channelId,
            roleId,
        }));
        const input: UpdateChannelAdministratorInput = { ...args.input, channelRoles };
        return this.administratorService.update(ctx, input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.Owner)
    async updateActiveAdministrator(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateActiveAdministratorArgs,
    ): Promise<Administrator | undefined> {
        const { input } = args;
        if (!ctx.activeUserId) return;
        // TODO look into backwards compatability of leaving the old mutations in place
        return this.administratorService.update(ctx, { ...input, id: ctx.activeUserId });
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateAdministrator)
    assignRoleToAdministrator(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationAssignRoleToAdministratorArgs,
    ): Promise<Administrator> {
        // TODO look into backwards compatability of leaving the old mutations in place
        return this.administratorService.assignRolesOnChannels(ctx, args.administratorId, [
            { channelId: ctx.channelId, roleId: args.roleId },
        ]);
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

    @Transaction()
    @Mutation()
    @Allow(Permission.DeleteAdministrator)
    deleteAdministrators(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteAdministratorsArgs,
    ): Promise<DeletionResponse[]> {
        return Promise.all(args.ids.map(id => this.administratorService.softDelete(ctx, id)));
    }

    // TODO missing the new example channelrole mutations:
    // - createChannelAdministrator
    // - updateChannelAdministrator
    // - updateActiveChannelAdministrator
    // - assignRoleToChannelAdministrator
    //
    // Think about backwards compatability and or breaking changes
}
