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
        return this.customerGroupService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadCustomer)
    async customerGroup(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryCustomerGroupArgs,
    ): Promise<CustomerGroup | undefined> {
        return this.customerGroupService.findOne(ctx, args.id);
    }

    @Mutation()
    @Allow(Permission.CreateCustomer)
    async createCustomerGroup(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateCustomerGroupArgs,
    ): Promise<CustomerGroup> {
        return this.customerGroupService.create(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateCustomer)
    async updateCustomerGroup(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateCustomerGroupArgs,
    ): Promise<CustomerGroup> {
        return this.customerGroupService.update(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.DeleteCustomer)
    async deleteCustomerGroup(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteCustomerGroupArgs,
    ): Promise<DeletionResponse> {
        return this.customerGroupService.delete(ctx, args.id);
    }

    @Mutation()
    @Allow(Permission.UpdateCustomer)
    async addCustomersToGroup(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationAddCustomersToGroupArgs,
    ): Promise<CustomerGroup> {
        return this.customerGroupService.addCustomersToGroup(ctx, args);
    }

    @Mutation()
    @Allow(Permission.UpdateCustomer)
    async removeCustomersFromGroup(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationRemoveCustomersFromGroupArgs,
    ): Promise<CustomerGroup> {
        return this.customerGroupService.removeCustomersFromGroup(ctx, args);
    }
}
