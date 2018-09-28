import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateChannelMutationArgs, Permission } from 'shared/generated-types';

import { Channel } from '../../entity/channel/channel.entity';
import { ChannelService } from '../../service/providers/channel.service';
import { Allow } from '../common/auth-guard';

@Resolver('Channel')
export class ChannelResolver {
    constructor(private channelService: ChannelService) {}

    @Mutation()
    @Allow(Permission.SuperAdmin)
    createChannel(@Args() args: CreateChannelMutationArgs): Promise<Channel> {
        return this.channelService.create(args.code);
    }
}
