import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Channel, ChannelService, Ctx, RequestContext, Zone } from '@vendure/core';

@Resolver()
class CustomerChannelsResolver {
    constructor(private channelService: ChannelService) {}

    @ResolveField('defaultShippingZone', () => Zone, { nullable: true })
    returnNullShippingZone(@Ctx() ctx: RequestContext, @Parent() channel: Channel) {
        return null;
    }
    @Query()
    async customerChannels(@Ctx() ctx: RequestContext, @Args() args: any) {
        const channels = await this.channelService.findAll(ctx);
        const strippedChannels = channels.map((channel: Channel) => {
            return {
                ...channel,
                defaultShippingZone: null,
                defaultTaxZone: null,
                pricesIncludeTax: true,
            } as unknown as Channel;
        });
        return strippedChannels;
    }
}
export default CustomerChannelsResolver;
