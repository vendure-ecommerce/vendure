import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    MutationAddNoteToOrderArgs,
    MutationCancelOrderArgs,
    MutationDeleteOrderNoteArgs,
    MutationFulfillOrderArgs,
    MutationRefundOrderArgs,
    MutationSettlePaymentArgs,
    MutationSettleRefundArgs,
    MutationUpdateOrderNoteArgs,
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
    @Allow(Permission.UpdateOrder)
    async fulfillOrder(@Ctx() ctx: RequestContext, @Args() args: MutationFulfillOrderArgs) {
        return this.orderService.createFulfillment(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateOrder)
    async cancelOrder(@Ctx() ctx: RequestContext, @Args() args: MutationCancelOrderArgs) {
        return this.orderService.cancelOrder(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateOrder)
    async refundOrder(@Ctx() ctx: RequestContext, @Args() args: MutationRefundOrderArgs) {
        return this.orderService.refundOrder(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateOrder)
    async settleRefund(@Ctx() ctx: RequestContext, @Args() args: MutationSettleRefundArgs) {
        return this.orderService.settleRefund(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateOrder)
    async addNoteToOrder(@Ctx() ctx: RequestContext, @Args() args: MutationAddNoteToOrderArgs) {
        return this.orderService.addNoteToOrder(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateOrder)
    async updateOrderNote(@Ctx() ctx: RequestContext, @Args() args: MutationUpdateOrderNoteArgs) {
        return this.orderService.updateOrderNote(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateOrder)
    async deleteOrderNote(@Ctx() ctx: RequestContext, @Args() args: MutationDeleteOrderNoteArgs) {
        return this.orderService.deleteOrderNote(ctx, args.id);
    }
}
