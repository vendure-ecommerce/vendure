import { Args, Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { OrdersCustomerArgs } from '../../../../../shared/generated-types';
import { PaginatedList } from '../../../../../shared/shared-types';
import { Address } from '../../../entity/address/address.entity';
import { Customer } from '../../../entity/customer/customer.entity';
import { Order } from '../../../entity/order/order.entity';
import { CustomerService } from '../../../service/services/customer.service';
import { OrderService } from '../../../service/services/order.service';
import { IdCodecService } from '../../common/id-codec.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Customer')
export class CustomerEntityResolver {
    constructor(
        private customerService: CustomerService,
        private orderService: OrderService,
        private idCodecService: IdCodecService,
    ) {}
    @ResolveProperty()
    async addresses(@Ctx() ctx: RequestContext, @Parent() customer: Customer): Promise<Address[]> {
        const customerId = this.idCodecService.decode(customer.id);
        return this.customerService.findAddressesByCustomerId(ctx, customerId);
    }

    @ResolveProperty()
    async orders(
        @Ctx() ctx: RequestContext,
        @Parent() customer: Customer,
        @Args() args: OrdersCustomerArgs,
    ): Promise<PaginatedList<Order>> {
        const customerId = this.idCodecService.decode(customer.id);
        return this.orderService.findByCustomerId(ctx, customerId, args.options || undefined);
    }
}
