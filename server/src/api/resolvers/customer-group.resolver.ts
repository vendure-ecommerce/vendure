import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    AddCustomersToGroupMutationArgs,
    CreateCustomerGroupMutationArgs,
    CustomerGroupQueryArgs,
    Permission,
    RemoveCustomersFromGroupMutationArgs,
    UpdateCustomerGroupMutationArgs,
} from 'shared/generated-types';

import { CustomerGroup } from '../../entity/customer-group/customer-group.entity';
import { CustomerGroupService } from '../../service/providers/customer-group.service';
import { Allow } from '../common/auth-guard';
import { Decode } from '../common/id-interceptor';
import { RequestContext } from '../common/request-context';
import { Ctx } from '../common/request-context.decorator';

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
        @Args() args: CustomerGroupQueryArgs,
    ): Promise<CustomerGroup | undefined> {
        return this.customerGroupService.findOne(args.id);
    }

    @Mutation()
    @Allow(Permission.CreateCustomer)
    @Decode('customerIds')
    async createCustomerGroup(@Args() args: CreateCustomerGroupMutationArgs): Promise<CustomerGroup> {
        return this.customerGroupService.create(args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateCustomer)
    async updateCustomerGroup(@Args() args: UpdateCustomerGroupMutationArgs): Promise<CustomerGroup> {
        return this.customerGroupService.update(args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateCustomer)
    @Decode('customerGroupId', 'customerIds')
    async addCustomersToGroup(@Args() args: AddCustomersToGroupMutationArgs): Promise<CustomerGroup> {
        return this.customerGroupService.addCustomersToGroup(args);
    }

    @Mutation()
    @Allow(Permission.UpdateCustomer)
    @Decode('customerGroupId', 'customerIds')
    async removeCustomersFromGroup(
        @Args() args: RemoveCustomersFromGroupMutationArgs,
    ): Promise<CustomerGroup> {
        return this.customerGroupService.removeCustomersFromGroup(args);
    }
}
