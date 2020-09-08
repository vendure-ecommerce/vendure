import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    MutationUpdatePaymentMethodArgs,
    Permission,
    QueryPaymentMethodArgs,
    QueryPaymentMethodsArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { PaymentMethod } from '../../../entity/payment-method/payment-method.entity';
import { PaymentMethodService } from '../../../service/services/payment-method.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver('PaymentMethod')
export class PaymentMethodResolver {
    constructor(private paymentMethodService: PaymentMethodService) {}

    @Query()
    @Allow(Permission.ReadSettings)
    paymentMethods(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryPaymentMethodsArgs,
    ): Promise<PaginatedList<PaymentMethod>> {
        return this.paymentMethodService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    paymentMethod(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryPaymentMethodArgs,
    ): Promise<PaymentMethod | undefined> {
        return this.paymentMethodService.findOne(ctx, args.id);
    }

    @Transaction
    @Mutation()
    @Allow(Permission.UpdateSettings)
    updatePaymentMethod(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdatePaymentMethodArgs,
    ): Promise<PaymentMethod> {
        return this.paymentMethodService.update(ctx, args.input);
    }
}
