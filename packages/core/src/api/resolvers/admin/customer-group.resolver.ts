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
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver('CustomerGroup')
export class CustomerGroupResolver {
    constructor(private customerGroupService: CustomerGroupService) {}

    @Query()
    @Allow(Permission.ReadCustomer, Permission.ReadCustomerGroup)
    customerGroups(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryCustomerGroupsArgs,
    ): Promise<PaginatedList<CustomerGroup>> {
        return this.customerGroupService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadCustomer, Permission.ReadCustomerGroup)
    async customerGroup(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryCustomerGroupArgs,
    ): Promise<CustomerGroup | undefined> {
        return this.customerGroupService.findOne(ctx, args.id);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.CreateCustomerGroup)
    async createCustomerGroup(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateCustomerGroupArgs,
    ): Promise<CustomerGroup> {
        return this.customerGroupService.create(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateCustomerGroup)
    async updateCustomerGroup(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateCustomerGroupArgs,
    ): Promise<CustomerGroup> {
        return this.customerGroupService.update(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.DeleteCustomerGroup)
    async deleteCustomerGroup(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteCustomerGroupArgs,
    ): Promise<DeletionResponse> {
        return this.customerGroupService.delete(ctx, args.id);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateCustomerGroup)
    async addCustomersToGroup(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationAddCustomersToGroupArgs,
    ): Promise<CustomerGroup> {
        return this.customerGroupService.addCustomersToGroup(ctx, args);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateCustomerGroup)
    async removeCustomersFromGroup(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationRemoveCustomersFromGroupArgs,
    ): Promise<CustomerGroup> {
        return this.customerGroupService.removeCustomersFromGroup(ctx, args);
    }
}
