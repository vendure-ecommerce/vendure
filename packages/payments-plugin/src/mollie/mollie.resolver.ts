import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, Permission, RequestContext } from '@vendure/core';

import {
    MolliePaymentIntent,
    MolliePaymentIntentError,
    MolliePaymentIntentInput,
    MolliePaymentIntentResult,
    MolliePaymentMethod,
    MolliePaymentMethodsInput,
} from './graphql/generated-shop-types';
import { MollieService } from './mollie.service';

@Resolver()
export class MollieResolver {
    constructor(private mollieService: MollieService) {}

    @Mutation()
    @Allow(Permission.Owner)
    async createMolliePaymentIntent(
        @Ctx() ctx: RequestContext,
        @Args('input') input: MolliePaymentIntentInput,
    ): Promise<MolliePaymentIntentResult> {
        return this.mollieService.createPaymentIntent(ctx, input);
    }

    @ResolveField()
    @Resolver('MolliePaymentIntentResult')
    __resolveType(value: MolliePaymentIntentError | MolliePaymentIntent): string {
        if ((value as MolliePaymentIntentError).errorCode) {
            return 'MolliePaymentIntentError';
        } else {
            return 'MolliePaymentIntent';
        }
    }

    @Query()
    @Allow(Permission.Public)
    async molliePaymentMethods(
        @Ctx() ctx: RequestContext,
        @Args('input') { paymentMethodCode }: MolliePaymentMethodsInput,
    ): Promise<MolliePaymentMethod[]> {
        return this.mollieService.getEnabledPaymentMethods(ctx, paymentMethodCode);
    }
}
