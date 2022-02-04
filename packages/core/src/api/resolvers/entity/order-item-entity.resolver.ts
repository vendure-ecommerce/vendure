import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Fulfillment, OrderItem } from '../../../entity';
import { FulfillmentService } from '../../../service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('OrderItem')
export class OrderItemEntityResolver {
    constructor(private fulfillmentService: FulfillmentService) {}

    @ResolveField()
    async fulfillment(
        @Ctx() ctx: RequestContext,
        @Parent() orderItem: OrderItem,
    ): Promise<Fulfillment | undefined> {
        if (orderItem.fulfillment) {
            return orderItem.fulfillment;
        }
        return this.fulfillmentService.getFulfillmentByOrderItemId(ctx, orderItem.id);
    }
}
