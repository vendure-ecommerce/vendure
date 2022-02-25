import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, Permission, RequestContext } from '@vendure/core';

import {
    MolliePaymentIntent,
    MolliePaymentIntentError,
    MolliePaymentIntentResult,
} from './graphql/generated-shop-types';
import { MollieService } from './mollie.service';

@Resolver()
export class MollieResolver {
    constructor(private mollieService: MollieService) {
    }

    @Mutation()
    @Allow(Permission.Owner)
    async createMolliePaymentIntent(
        @Ctx() ctx: RequestContext,
        @Args('input') input: { paymentMethodCode: string },
    ): Promise<MolliePaymentIntentResult> {
        return this.mollieService.createPaymentIntent(ctx, input.paymentMethodCode);
    }

    @ResolveField()
    @Resolver('MolliePaymentIntentResult')
    __resolveType(value: MolliePaymentIntentError | MolliePaymentIntent): string {
        if((value as MolliePaymentIntentError).errorCode) {
            return 'MolliePaymentIntentError';
        } else {
            return 'MolliePaymentIntent';
        }
    }
}
