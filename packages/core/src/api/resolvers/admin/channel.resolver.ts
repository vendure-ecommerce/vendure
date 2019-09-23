import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    MutationCreateChannelArgs,
    MutationUpdateChannelArgs,
    Permission,
    QueryChannelArgs,
} from '@vendure/common/lib/generated-types';

import { Channel } from '../../../entity/channel/channel.entity';
import { ChannelService } from '../../../service/services/channel.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Channel')
export class ChannelResolver {
    constructor(private channelService: ChannelService) {}

    @Query()
    @Allow(Permission.ReadSettings)
    channels(@Ctx() ctx: RequestContext): Promise<Channel[]> {
        return this.channelService.findAll();
    }

    @Query()
    @Allow(Permission.ReadSettings)
    async channel(@Ctx() ctx: RequestContext, @Args() args: QueryChannelArgs): Promise<Channel | undefined> {
        return this.channelService.findOne(args.id);
    }

    @Query()
    @Allow(Permission.Authenticated)
    async activeChannel(@Ctx() ctx: RequestContext): Promise<Channel> {
        return ctx.channel;
    }

    @Mutation()
    @Allow(Permission.SuperAdmin)
    async createChannel(@Args() args: MutationCreateChannelArgs): Promise<Channel> {
        return this.channelService.create(args.input);
    }

    @Mutation()
    @Allow(Permission.SuperAdmin)
    async updateChannel(@Args() args: MutationUpdateChannelArgs): Promise<Channel> {
        return this.channelService.update(args.input);
    }
}
