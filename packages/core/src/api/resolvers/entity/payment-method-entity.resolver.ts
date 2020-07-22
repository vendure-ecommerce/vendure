import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ConfigurableOperationDefinition } from '@vendure/common/lib/generated-types';

import { PaymentMethod } from '../../../entity/payment-method/payment-method.entity';
import { PaymentMethodService } from '../../../service/services/payment-method.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('PaymentMethod')
export class PaymentMethodEntityResolver {
    constructor(private paymentMethodService: PaymentMethodService) {}

    @ResolveField()
    async definition(
        @Ctx() ctx: RequestContext,
        @Parent() paymentMethod: PaymentMethod,
    ): Promise<ConfigurableOperationDefinition> {
        return this.paymentMethodService.getPaymentMethodHandler(paymentMethod.code).toGraphQlType(ctx);
    }
}
