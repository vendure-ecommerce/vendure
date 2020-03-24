import { Args, Parent, ResolveProperty, Resolver } from '@nestjs/graphql';
import { QueryOrdersArgs } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { Address } from '../../../entity/address/address.entity';
import { Customer } from '../../../entity/customer/customer.entity';
import { Order } from '../../../entity/order/order.entity';
import { CustomerService } from '../../../service/services/customer.service';
import { OrderService } from '../../../service/services/order.service';
import { UserService } from '../../../service/services/user.service';
import { ApiType } from '../../common/get-api-type';
import { RequestContext } from '../../common/request-context';
import { Api } from '../../decorators/api.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Customer')
export class CustomerEntityResolver {
    constructor(
        private customerService: CustomerService,
        private orderService: OrderService,
        private userService: UserService,
    ) {}
    @ResolveProperty()
    async addresses(
        @Ctx() ctx: RequestContext,
        @Parent() customer: Customer,
        @Api() apiType: ApiType,
    ): Promise<Address[]> {
        if (apiType === 'shop' && !ctx.activeUserId) {
            // Guest customers should not be able to see this data
            return [];
        }
        return this.customerService.findAddressesByCustomerId(ctx, customer.id);
    }

    @ResolveProperty()
    async orders(
        @Ctx() ctx: RequestContext,
        @Parent() customer: Customer,
        @Args() args: QueryOrdersArgs,
        @Api() apiType: ApiType,
    ): Promise<PaginatedList<Order>> {
        if (apiType === 'shop' && !ctx.activeUserId) {
            // Guest customers should not be able to see this data
            return { items: [], totalItems: 0 };
        }
        return this.orderService.findByCustomerId(ctx, customer.id, args.options || undefined);
    }

    @ResolveProperty()
    user(@Ctx() ctx: RequestContext, @Parent() customer: Customer) {
        if (customer.user) {
            return customer.user;
        }

        return this.userService.getUserByEmailAddress(customer.emailAddress);
    }
}
