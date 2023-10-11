import { Mutation, Resolver } from '@nestjs/graphql';
import {
    ActiveOrderService,
    Allow,
    Ctx,
    Permission,
    RequestContext,
    UnauthorizedError,
    UserInputError,
} from '@vendure/core';

import { StripeService } from './stripe.service';

@Resolver()
export class StripeResolver {
    constructor(private stripeService: StripeService, private activeOrderService: ActiveOrderService) {}

    @Mutation()
    @Allow(Permission.Owner)
    async createStripePaymentIntent(@Ctx() ctx: RequestContext): Promise<string> {
        if (!ctx.authorizedAsOwnerOnly) {
            throw new UnauthorizedError();
        }
        const sessionOrder = await this.activeOrderService.getActiveOrder(ctx, undefined);
        if (!sessionOrder) {
            throw new UserInputError('No active order found for session');
        }
        return this.stripeService.createPaymentIntent(ctx, sessionOrder);
    }
}
