import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { QueryCustomersArgs } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { CustomerGroup } from '../../../entity/customer-group/customer-group.entity';
import { Customer } from '../../../entity/customer/customer.entity';
import { CustomerGroupService } from '../../../service/services/customer-group.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('CustomerGroup')
export class CustomerGroupEntityResolver {
    constructor(private customerGroupService: CustomerGroupService) {}

    @ResolveField()
    async customers(
        @Ctx() ctx: RequestContext,
        @Parent() customerGroup: CustomerGroup,
        @Args() args: QueryCustomersArgs,
    ): Promise<PaginatedList<Customer>> {
        return this.customerGroupService.getGroupCustomers(customerGroup.id, args.options || undefined);
    }
}
