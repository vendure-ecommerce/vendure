import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { Channel } from '../../entity/channel/channel.entity';
import { ChannelService } from '../../service/channel.service';

@Resolver('Channel')
export class ChannelResolver {
    constructor(private channelService: ChannelService) {}

    @Mutation()
    createChannel(@Args() args): Promise<Channel> {
        return this.channelService.create(args.code);
    }
}
