import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Fulfillment } from '../../../entity/fulfillment/fulfillment.entity';
import { FulfillmentService } from '../../../service/services/fulfillment.service';

@Resolver('Fulfillment')
export class FulfillmentEntityResolver {
    constructor(private fulfillmentService: FulfillmentService) {}

    @ResolveField()
    async orderItems(@Parent() fulfillment: Fulfillment) {
        return this.fulfillmentService.getOrderItemsByFulfillmentId(fulfillment.id);
    }
}
@Resolver('Fulfillment')
export class FulfillmentAdminEntityResolver {
    constructor(private fulfillmentService: FulfillmentService) {}

    @ResolveField()
    async nextStates(@Parent() fulfillment: Fulfillment) {
        return this.fulfillmentService.getNextStates(fulfillment);
    }
}
