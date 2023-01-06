import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Channel } from '../../../entity/channel/channel.entity';
import { Vendor } from '../../../entity/vendor/vendor.entity';
import { VendorService } from '../../../service/index';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Channel')
export class ChannelEntityResolver {
    constructor(private vendorService: VendorService) {}

    @ResolveField()
    async vendor(@Ctx() ctx: RequestContext, @Parent() channel: Channel): Promise<Vendor | undefined> {
        if (!channel.vendorId) {
            return;
        }
        return channel.vendor ?? (await this.vendorService.findOne(ctx, channel.vendorId));
    }
}
