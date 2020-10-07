import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { OrderItem } from '../../../entity/order-item/order-item.entity';
import { Refund } from '../../../entity/refund/refund.entity';
import { OrderService } from '../../../service/services/order.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Refund')
export class RefundEntityResolver {
    constructor(private orderService: OrderService) {}

    @ResolveField()
    async orderItems(@Ctx() ctx: RequestContext, @Parent() refund: Refund): Promise<OrderItem[]> {
        if (refund.orderItems) {
            return refund.orderItems;
        } else {
            return this.orderService.getRefundOrderItems(ctx, refund.id);
        }
    }
}
