import { Mutation, Resolver } from '@nestjs/graphql';
import {
    ActiveOrderService,
    Allow,
    Ctx,
    IllegalOperationError,
    Permission,
    RequestContext,
    Transaction,
} from '@vendure/core';

import { PayPalOrder } from './graphql/generated-shop-types';
import { PayPalOrderService } from './paypal-order.service';

@Resolver()
export class PayPalShopResolver {
    constructor(
        private readonly activeOrderService: ActiveOrderService,
        private readonly paypalService: PayPalOrderService,
    ) {}

    @Mutation()
    @Transaction()
    @Allow(Permission.Owner)
    async createPayPalOrder(@Ctx() ctx: RequestContext): Promise<PayPalOrder | undefined> {
        const sessionOrder = await this.activeOrderService.getActiveOrder(ctx, {});

        if (!sessionOrder) {
            throw new IllegalOperationError('error.order-could-not-be-determined-or-created');
        }
        if (sessionOrder.state !== 'ArrangingPayment') {
            throw new IllegalOperationError('errorResult.ORDER_PAYMENT_STATE_ERROR');
        }

        return await this.paypalService.createOrder(ctx, sessionOrder);
    }
}
