import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Fulfillment } from '../../../entity/fulfillment/fulfillment.entity';
import { OrderService } from '../../../service/services/order.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Fulfillment')
export class FulfillmentEntityResolver {
    constructor(private orderService: OrderService) {}

    @ResolveField()
    async orderItems(@Ctx() ctx: RequestContext, @Parent() fulfillment: Fulfillment) {
        return this.orderService.getFulfillmentOrderItems(ctx, fulfillment.id);
    }
}
