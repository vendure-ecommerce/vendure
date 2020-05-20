import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    DeletionResponse,
    MutationAddCustomersToGroupArgs,
    MutationCreateCustomerGroupArgs,
    MutationDeleteCustomerGroupArgs,
    MutationRemoveCustomersFromGroupArgs,
    MutationUpdateCustomerGroupArgs,
    Permission,
    QueryCustomerGroupArgs,
    QueryCustomerGroupsArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

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
    customerGroups(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryCustomerGroupsArgs,
    ): Promise<PaginatedList<CustomerGroup>> {
        return this.customerGroupService.findAll(args.options || undefined);
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
    @Allow(Permission.DeleteCustomer)
    async deleteCustomerGroup(@Args() args: MutationDeleteCustomerGroupArgs): Promise<DeletionResponse> {
        return this.customerGroupService.delete(args.id);
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
