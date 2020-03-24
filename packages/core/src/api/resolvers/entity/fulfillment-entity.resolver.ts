import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Fulfillment } from '../../../entity/fulfillment/fulfillment.entity';
import { OrderService } from '../../../service/services/order.service';

@Resolver('Fulfillment')
export class FulfillmentEntityResolver {
    constructor(private orderService: OrderService) {}

    @ResolveField()
    async orderItems(@Parent() fulfillment: Fulfillment) {
        return this.orderService.getFulfillmentOrderItems(fulfillment.id);
    }
}
