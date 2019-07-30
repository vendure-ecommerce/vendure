import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    MutationAddCustomersToGroupArgs,
    MutationCreateCustomerGroupArgs,
    MutationRemoveCustomersFromGroupArgs,
    MutationUpdateCustomerGroupArgs,
    Permission,
    QueryCustomerGroupArgs,
} from '@vendure/common/lib/generated-types';

import { CustomerGroup } from '../../../entity/customer-group/customer-group.entity';
import { CustomerGroupService } from '../../../service/services/customer-group.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('CustomerGroup')
export class CustomerGroupResolver {
    constructor(private customerGroupService: CustomerGroupService) {}

    @Query()
    @Allow(Permission.ReadCustomer)
    customerGroups(@Ctx() ctx: RequestContext): Promise<CustomerGroup[]> {
        return this.customerGroupService.findAll();
    }

    @Query()
    @Allow(Permission.ReadCustomer)
    async customerGroup(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryCustomerGroupArgs,
    ): Promise<CustomerGroup | undefined> {
        return this.customerGroupService.findOne(args.id);
    }

    @Mutation()
    @Allow(Permission.CreateCustomer)
    async createCustomerGroup(@Args() args: MutationCreateCustomerGroupArgs): Promise<CustomerGroup> {
        return this.customerGroupService.create(args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateCustomer)
    async updateCustomerGroup(@Args() args: MutationUpdateCustomerGroupArgs): Promise<CustomerGroup> {
        return this.customerGroupService.update(args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateCustomer)
    async addCustomersToGroup(@Args() args: MutationAddCustomersToGroupArgs): Promise<CustomerGroup> {
        return this.customerGroupService.addCustomersToGroup(args);
    }

    @Mutation()
    @Allow(Permission.UpdateCustomer)
    async removeCustomersFromGroup(
        @Args() args: MutationRemoveCustomersFromGroupArgs,
    ): Promise<CustomerGroup> {
        return this.customerGroupService.removeCustomersFromGroup(args);
    }
}
