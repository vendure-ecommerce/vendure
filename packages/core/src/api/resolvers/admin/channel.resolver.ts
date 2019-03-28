import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    ChannelQueryArgs,
    CreateChannelMutationArgs,
    Permission,
    UpdateChannelMutationArgs,
} from '@vendure/common/generated-types';

import { Channel } from '../../../entity/channel/channel.entity';
import { ChannelService } from '../../../service/services/channel.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Decode } from '../../decorators/decode.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

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
    @Allow(Permission.Authenticated)
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
