import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { RequestContextCacheService } from '../../../cache/index';
import { Fulfillment, OrderItem } from '../../../entity';
import { FulfillmentService } from '../../../service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('OrderItem')
export class OrderItemEntityResolver {
    constructor(
        private fulfillmentService: FulfillmentService,
        private requestContextCache: RequestContextCacheService,
    ) {}

    @ResolveField()
    async fulfillment(
        @Ctx() ctx: RequestContext,
        @Parent() orderItem: OrderItem,
    ): Promise<Fulfillment | undefined> {
        if (orderItem.fulfillment) {
            return orderItem.fulfillment;
        }
        const lineFulfillments = await this.requestContextCache.get(
            ctx,
            `OrderItemEntityResolver.fulfillment(${orderItem.lineId})`,
            () => this.fulfillmentService.getFulfillmentsByOrderLineId(ctx, orderItem.lineId),
        );
        const otherResult = lineFulfillments.find(({ orderItemIds }) =>
            orderItemIds.has(orderItem.id),
        )?.fulfillment;
        return otherResult;
    }
}
