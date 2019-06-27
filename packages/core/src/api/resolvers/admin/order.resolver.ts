import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    MutationCancelOrderLinesArgs,
    MutationCreateFulfillmentArgs,
    MutationSettlePaymentArgs,
    Permission,
    QueryOrderArgs,
    QueryOrdersArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { Order } from '../../../entity/order/order.entity';
import { OrderService } from '../../../service/services/order.service';
import { ShippingMethodService } from '../../../service/services/shipping-method.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Decode } from '../../decorators/decode.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver()
export class OrderResolver {
    constructor(private orderService: OrderService, private shippingMethodService: ShippingMethodService) {}

    @Query()
    @Allow(Permission.ReadOrder)
    orders(@Ctx() ctx: RequestContext, @Args() args: QueryOrdersArgs): Promise<PaginatedList<Order>> {
        return this.orderService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadOrder)
    async order(@Ctx() ctx: RequestContext, @Args() args: QueryOrderArgs): Promise<Order | undefined> {
        return this.orderService.findOne(ctx, args.id);
    }

    @Mutation()
    @Allow(Permission.UpdateOrder)
    async settlePayment(@Ctx() ctx: RequestContext, @Args() args: MutationSettlePaymentArgs) {
        return this.orderService.settlePayment(ctx, args.id);
    }

    @Mutation()
    @Decode('orderLineId')
    @Allow(Permission.UpdateOrder)
    async createFulfillment(@Ctx() ctx: RequestContext, @Args() args: MutationCreateFulfillmentArgs) {
        return this.orderService.createFulfillment(ctx, args.input);
    }

    @Mutation()
    @Decode('orderLineId')
    @Allow(Permission.UpdateOrder)
    async cancelOrderLines(@Ctx() ctx: RequestContext, @Args() args: MutationCancelOrderLinesArgs) {
        return this.orderService.cancelOrderLines(ctx, args.input);
    }
}
