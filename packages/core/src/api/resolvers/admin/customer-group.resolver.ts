import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    AddCustomersToGroupMutationArgs,
    CreateCustomerGroupMutationArgs,
    CustomerGroupQueryArgs,
    Permission,
    RemoveCustomersFromGroupMutationArgs,
    UpdateCustomerGroupMutationArgs,
} from '@vendure/common/generated-types';

import { CustomerGroup } from '../../../entity/customer-group/customer-group.entity';
import { CustomerGroupService } from '../../../service/services/customer-group.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Decode } from '../../decorators/decode.decorator';
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
