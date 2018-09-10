import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Permission } from 'shared/generated-types';

import { Channel } from '../../entity/channel/channel.entity';
import { ChannelService } from '../../service/channel.service';
import { Allow } from '../roles-guard';

@Resolver('Channel')
export class ChannelResolver {
    constructor(private channelService: ChannelService) {}

    @Mutation()
    @Allow(Permission.SuperAdmin)
    createChannel(@Args() args): Promise<Channel> {
        return this.channelService.create(args.code);
    }
}
