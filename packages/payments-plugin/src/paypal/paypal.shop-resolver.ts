import { Mutation, Resolver } from '@nestjs/graphql';
import {
    ActiveOrderService,
    Allow,
    Ctx,
    IllegalOperationError,
    Order,
    Permission,
    RelationPaths,
    Relations,
    RequestContext,
    Transaction,
} from '@vendure/core';

import { PayPalOrder } from './graphql/generated-shop-types';
import { PayPalService } from './paypal.service';

@Resolver()
export class PayPalShopResolver {
    constructor(
        private readonly activeOrderService: ActiveOrderService,
        private readonly paypalService: PayPalService,
    ) {}

    @Mutation()
    @Transaction()
    @Allow(Permission.Owner)
    async createPayPalOrder(
        @Ctx() ctx: RequestContext,
        @Relations(Order) relations: RelationPaths<Order>,
    ): Promise<PayPalOrder | undefined> {
        const sessionOrder = await this.activeOrderService.getActiveOrder(ctx, {});

        if (!sessionOrder) {
            throw new IllegalOperationError('Session has no active order');
        }
        if (sessionOrder.state !== 'ArrangingPayment') {
            throw new IllegalOperationError('Order must be in arranging payment state');
        }

        return await this.paypalService.createOrder(ctx, sessionOrder);
    }
}
