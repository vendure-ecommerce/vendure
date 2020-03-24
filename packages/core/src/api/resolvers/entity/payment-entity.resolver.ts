import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Payment } from '../../../entity/payment/payment.entity';
import { Refund } from '../../../entity/refund/refund.entity';
import { OrderService } from '../../../service/services/order.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Payment')
export class PaymentEntityResolver {
    constructor(private orderService: OrderService) {}

    @ResolveField()
    async refunds(@Ctx() ctx: RequestContext, @Parent() payment: Payment): Promise<Refund[]> {
        if (payment.refunds) {
            return payment.refunds;
        } else {
            return this.orderService.getPaymentRefunds(payment.id);
        }
    }
}
