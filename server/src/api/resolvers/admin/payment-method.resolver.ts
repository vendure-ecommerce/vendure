import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
    PaymentMethodQueryArgs,
    PaymentMethodsQueryArgs,
    Permission,
    UpdatePaymentMethodMutationArgs,
} from '../../../../../shared/generated-types';
import { PaginatedList } from '../../../../../shared/shared-types';
import { PaymentMethod } from '../../../entity/payment-method/payment-method.entity';
import { PaymentMethodService } from '../../../service/services/payment-method.service';
import { Allow } from '../../decorators/allow.decorator';

@Resolver('PaymentMethod')
export class PaymentMethodResolver {
    constructor(private paymentMethodService: PaymentMethodService) {}

    @Query()
    @Allow(Permission.ReadSettings)
    paymentMethods(@Args() args: PaymentMethodsQueryArgs): Promise<PaginatedList<PaymentMethod>> {
        return this.paymentMethodService.findAll(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    paymentMethod(@Args() args: PaymentMethodQueryArgs): Promise<PaymentMethod | undefined> {
        return this.paymentMethodService.findOne(args.id);
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    updatePaymentMethod(@Args() args: UpdatePaymentMethodMutationArgs): Promise<PaymentMethod> {
        return this.paymentMethodService.update(args.input);
    }
}
