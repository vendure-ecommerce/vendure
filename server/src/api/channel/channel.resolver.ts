import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { Channel } from '../../entity/channel/channel.entity';
import { Permission } from '../../entity/role/permission';
import { ChannelService } from '../../service/channel.service';
import { RolesGuard } from '../roles-guard';

@Resolver('Channel')
export class ChannelResolver {
    constructor(private channelService: ChannelService) {}

    @Mutation()
    @RolesGuard([Permission.SuperAdmin])
    createChannel(@Args() args): Promise<Channel> {
        return this.channelService.create(args.code);
    }
}
