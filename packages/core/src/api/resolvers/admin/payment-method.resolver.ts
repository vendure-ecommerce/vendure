import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    QueryPaymentMethodArgs,
    QueryPaymentMethodsArgs,
    Permission,
    MutationUpdatePaymentMethodArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { PaymentMethod } from '../../../entity/payment-method/payment-method.entity';
import { PaymentMethodService } from '../../../service/services/payment-method.service';
import { Allow } from '../../decorators/allow.decorator';

@Resolver('PaymentMethod')
export class PaymentMethodResolver {
    constructor(private paymentMethodService: PaymentMethodService) {}

    @Query()
    @Allow(Permission.ReadSettings)
    paymentMethods(@Args() args: QueryPaymentMethodsArgs): Promise<PaginatedList<PaymentMethod>> {
        return this.paymentMethodService.findAll(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    paymentMethod(@Args() args: QueryPaymentMethodArgs): Promise<PaymentMethod | undefined> {
        return this.paymentMethodService.findOne(args.id);
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    updatePaymentMethod(@Args() args: MutationUpdatePaymentMethodArgs): Promise<PaymentMethod> {
        return this.paymentMethodService.update(args.input);
    }
}
