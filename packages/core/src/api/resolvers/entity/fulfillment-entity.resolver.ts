import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FulfillmentLineSummary } from '@vendure/payments-plugin/e2e/graphql/generated-admin-types';

import { RequestContextCacheService } from '../../../cache/index';
import { Fulfillment } from '../../../entity/fulfillment/fulfillment.entity';
import { RequestContextService } from '../../../service/index';
import { FulfillmentService } from '../../../service/services/fulfillment.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Fulfillment')
export class FulfillmentEntityResolver {
    constructor(
        private fulfillmentService: FulfillmentService,
        private requestContextCache: RequestContextCacheService,
    ) {}

    @ResolveField()
    async orderItems(@Ctx() ctx: RequestContext, @Parent() fulfillment: Fulfillment) {
        return this.requestContextCache.get(
            ctx,
            `FulfillmentEntityResolver.orderItems(${fulfillment.id})`,
            () => this.fulfillmentService.getOrderItemsByFulfillmentId(ctx, fulfillment.id),
        );
    }

    @ResolveField()
    async summary(@Ctx() ctx: RequestContext, @Parent() fulfillment: Fulfillment) {
        return this.requestContextCache.get(ctx, `FulfillmentEntityResolver.summary(${fulfillment.id})`, () =>
            this.fulfillmentService.getFulfillmentLineSummary(ctx, fulfillment.id),
        );
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
