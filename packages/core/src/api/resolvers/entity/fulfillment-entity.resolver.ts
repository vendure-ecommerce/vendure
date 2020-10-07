import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Fulfillment } from '../../../entity/fulfillment/fulfillment.entity';
import { FulfillmentService } from '../../../service/services/fulfillment.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Fulfillment')
export class FulfillmentEntityResolver {
    constructor(private fulfillmentService: FulfillmentService) {}

    @ResolveField()
    async orderItems(@Ctx() ctx: RequestContext, @Parent() fulfillment: Fulfillment) {
        return this.fulfillmentService.getOrderItemsByFulfillmentId(ctx, fulfillment.id);
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
