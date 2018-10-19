import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    ChannelQueryArgs,
    CreateChannelMutationArgs,
    Permission,
    UpdateChannelMutationArgs,
} from 'shared/generated-types';

import { Channel } from '../../entity/channel/channel.entity';
import { ChannelService } from '../../service/services/channel.service';
import { Allow } from '../common/auth-guard';
import { Decode } from '../common/id-interceptor';
import { RequestContext } from '../common/request-context';
import { Ctx } from '../common/request-context.decorator';

@Resolver('Channel')
export class ChannelResolver {
    constructor(private channelService: ChannelService) {}

    @Query()
    @Allow(Permission.SuperAdmin)
    channels(@Ctx() ctx: RequestContext): Promise<Channel[]> {
        return this.channelService.findAll();
    }

    @Query()
    @Allow(Permission.SuperAdmin)
    async channel(@Ctx() ctx: RequestContext, @Args() args: ChannelQueryArgs): Promise<Channel | undefined> {
        return this.channelService.findOne(args.id);
    }

    @Query()
    @Allow(Permission.Public)
    async activeChannel(@Ctx() ctx: RequestContext): Promise<Channel> {
        return ctx.channel;
    }

    @Mutation()
    @Allow(Permission.SuperAdmin)
    @Decode('defaultTaxZoneId', 'defaultShippingZoneId')
    async createChannel(@Args() args: CreateChannelMutationArgs): Promise<Channel> {
        return this.channelService.create(args.input);
    }

    @Mutation()
    @Allow(Permission.SuperAdmin)
    @Decode('defaultTaxZoneId', 'defaultShippingZoneId')
    async updateChannel(@Args() args: UpdateChannelMutationArgs): Promise<Channel> {
        return this.channelService.update(args.input);
    }
}
