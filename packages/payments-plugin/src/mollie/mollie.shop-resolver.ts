import { Args, Query, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, Permission, RequestContext } from '@vendure/core';

import {
    MolliePaymentMethod,
    MolliePaymentMethodsInput
} from './graphql/generated-shop-types';
import { MollieService } from './mollie.service';

@Resolver()
export class MollieShopResolver {
    constructor(private mollieService: MollieService) {}

    @Query()
    @Allow(Permission.Public)
    async molliePaymentMethods(
        @Ctx() ctx: RequestContext,
        @Args('input') { paymentMethodCode }: MolliePaymentMethodsInput,
    ): Promise<MolliePaymentMethod[]> {
        return this.mollieService.getEnabledPaymentMethods(ctx, paymentMethodCode);
    }
}
