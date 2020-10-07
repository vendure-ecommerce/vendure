import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    AddFulfillmentToOrderResult,
    CancelOrderResult,
    MutationAddFulfillmentToOrderArgs,
    MutationAddNoteToOrderArgs,
    MutationCancelOrderArgs,
    MutationDeleteOrderNoteArgs,
    MutationRefundOrderArgs,
    MutationSetOrderCustomFieldsArgs,
    MutationSettlePaymentArgs,
    MutationSettleRefundArgs,
    MutationTransitionFulfillmentToStateArgs,
    MutationTransitionOrderToStateArgs,
    MutationUpdateOrderNoteArgs,
    Permission,
    QueryOrderArgs,
    QueryOrdersArgs,
    RefundOrderResult,
    SettlePaymentResult,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { ErrorResultUnion } from '../../../common/error/error-result';
import { Fulfillment } from '../../../entity/fulfillment/fulfillment.entity';
import { Order } from '../../../entity/order/order.entity';
import { Payment } from '../../../entity/payment/payment.entity';
import { Refund } from '../../../entity/refund/refund.entity';
import { FulfillmentState } from '../../../service/helpers/fulfillment-state-machine/fulfillment-state';
import { OrderState } from '../../../service/helpers/order-state-machine/order-state';
import { OrderService } from '../../../service/services/order.service';
import { ShippingMethodService } from '../../../service/services/shipping-method.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

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

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateOrder)
    async settlePayment(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationSettlePaymentArgs,
    ): Promise<ErrorResultUnion<SettlePaymentResult, Payment>> {
        return this.orderService.settlePayment(ctx, args.id);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateOrder)
    async addFulfillmentToOrder(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationAddFulfillmentToOrderArgs,
    ): Promise<ErrorResultUnion<AddFulfillmentToOrderResult, Fulfillment>> {
        return this.orderService.createFulfillment(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateOrder)
    async cancelOrder(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCancelOrderArgs,
    ): Promise<ErrorResultUnion<CancelOrderResult, Order>> {
        return this.orderService.cancelOrder(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateOrder)
    async refundOrder(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationRefundOrderArgs,
    ): Promise<ErrorResultUnion<RefundOrderResult, Refund>> {
        return this.orderService.refundOrder(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateOrder)
    async settleRefund(@Ctx() ctx: RequestContext, @Args() args: MutationSettleRefundArgs) {
        return this.orderService.settleRefund(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateOrder)
    async addNoteToOrder(@Ctx() ctx: RequestContext, @Args() args: MutationAddNoteToOrderArgs) {
        return this.orderService.addNoteToOrder(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateOrder)
    async updateOrderNote(@Ctx() ctx: RequestContext, @Args() args: MutationUpdateOrderNoteArgs) {
        return this.orderService.updateOrderNote(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateOrder)
    async deleteOrderNote(@Ctx() ctx: RequestContext, @Args() args: MutationDeleteOrderNoteArgs) {
        return this.orderService.deleteOrderNote(ctx, args.id);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateOrder)
    async setOrderCustomFields(@Ctx() ctx: RequestContext, @Args() args: MutationSetOrderCustomFieldsArgs) {
        return this.orderService.updateCustomFields(ctx, args.input.id, args.input.customFields);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateOrder)
    async transitionOrderToState(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationTransitionOrderToStateArgs,
    ) {
        return this.orderService.transitionToState(ctx, args.id, args.state as OrderState);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateOrder)
    async transitionFulfillmentToState(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationTransitionFulfillmentToStateArgs,
    ) {
        return this.orderService.transitionFulfillmentToState(ctx, args.id, args.state as FulfillmentState);
    }
}
