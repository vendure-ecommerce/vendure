import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    CreateChannelResult,
    DeletionResponse,
    MutationCreateChannelArgs,
    MutationDeleteChannelArgs,
    MutationUpdateChannelArgs,
    Permission,
    QueryChannelArgs,
    UpdateChannelResult,
} from '@vendure/common/lib/generated-types';

import { ErrorResultUnion, isGraphQlErrorResult } from '../../../common/error/error-result';
import { Channel } from '../../../entity/channel/channel.entity';
import { ChannelService } from '../../../service/services/channel.service';
import { RoleService } from '../../../service/services/role.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver('Channel')
export class ChannelResolver {
    constructor(private channelService: ChannelService, private roleService: RoleService) {}

    @Query()
    @Allow(Permission.ReadSettings)
    channels(@Ctx() ctx: RequestContext): Promise<Channel[]> {
        return this.channelService.findAll(ctx);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    async channel(@Ctx() ctx: RequestContext, @Args() args: QueryChannelArgs): Promise<Channel | undefined> {
        return this.channelService.findOne(ctx, args.id);
    }

    @Query()
    @Allow(Permission.Authenticated)
    async activeChannel(@Ctx() ctx: RequestContext): Promise<Channel> {
        return ctx.channel;
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.SuperAdmin)
    async createChannel(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateChannelArgs,
    ): Promise<ErrorResultUnion<CreateChannelResult, Channel>> {
        const result = await this.channelService.create(ctx, args.input);
        if (isGraphQlErrorResult(result)) {
            return result;
        }
        const superAdminRole = await this.roleService.getSuperAdminRole();
        const customerRole = await this.roleService.getCustomerRole();
        await this.roleService.assignRoleToChannel(ctx, superAdminRole.id, result.id);
        await this.roleService.assignRoleToChannel(ctx, customerRole.id, result.id);
        return result;
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.SuperAdmin)
    async updateChannel(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateChannelArgs,
    ): Promise<ErrorResultUnion<UpdateChannelResult, Channel>> {
        const result = await this.channelService.update(ctx, args.input);
        if (isGraphQlErrorResult(result)) {
            return result;
        }
        return result;
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.SuperAdmin)
    async deleteChannel(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteChannelArgs,
    ): Promise<DeletionResponse> {
        return this.channelService.delete(ctx, args.id);
    }
}
