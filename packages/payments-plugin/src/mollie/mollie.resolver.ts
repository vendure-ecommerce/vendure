import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, Permission, RequestContext } from '@vendure/core';

import { MollieService } from './mollie.service';

@Resolver()
export class MollieResolver {
    constructor(private mollieService: MollieService) {}

    @Mutation()
    @Allow(Permission.Owner)
    async createStripePaymentIntent(
        @Ctx() ctx: RequestContext,
        @Args('input') input: { paymentMethodId: string },
    ): Promise<string | undefined> {
        if (ctx.authorizedAsOwnerOnly) {
            return this.mollieService.createPaymentIntent(ctx, input.paymentMethodId);
        }
    }
}
