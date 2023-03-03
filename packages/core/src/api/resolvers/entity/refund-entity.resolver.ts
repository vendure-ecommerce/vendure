import { Resolver } from '@nestjs/graphql';

import { Refund } from '../../../entity/refund/refund.entity';
import { OrderService } from '../../../service/services/order.service';

@Resolver('Refund')
export class RefundEntityResolver {
    constructor(private orderService: OrderService) {}
}
