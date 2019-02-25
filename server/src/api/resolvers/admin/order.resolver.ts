import { Args, Query, Resolver } from '@nestjs/graphql';

import { OrderQueryArgs, OrdersQueryArgs, Permission } from '../../../../../shared/generated-types';
import { PaginatedList } from '../../../../../shared/shared-types';
import { Order } from '../../../entity/order/order.entity';
import { OrderService } from '../../../service/services/order.service';
import { ShippingMethodService } from '../../../service/services/shipping-method.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver()
export class OrderResolver {
    constructor(private orderService: OrderService, private shippingMethodService: ShippingMethodService) {}

    @Query()
    @Allow(Permission.ReadOrder)
    orders(@Ctx() ctx: RequestContext, @Args() args: OrdersQueryArgs): Promise<PaginatedList<Order>> {
        return this.orderService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadOrder)
    async order(@Ctx() ctx: RequestContext, @Args() args: OrderQueryArgs): Promise<Order | undefined> {
        return this.orderService.findOne(ctx, args.id);
    }
}
