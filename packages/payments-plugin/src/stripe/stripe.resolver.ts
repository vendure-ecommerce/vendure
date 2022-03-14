import { Mutation, Resolver } from '@nestjs/graphql';
import { ActiveOrderService, Allow, Ctx, Permission, RequestContext } from '@vendure/core';

import { StripeService } from './stripe.service';

@Resolver()
export class StripeResolver {
    constructor(private stripeService: StripeService, private activeOrderService: ActiveOrderService) {}

    @Mutation()
    @Allow(Permission.Owner)
    async createStripePaymentIntent(@Ctx() ctx: RequestContext): Promise<string | undefined> {
        if (ctx.authorizedAsOwnerOnly) {
            const sessionOrder = await this.activeOrderService.getOrderFromContext(ctx);
            if (sessionOrder) {
                return this.stripeService.createPaymentIntent(ctx, sessionOrder);
            }
        }
    }
}
