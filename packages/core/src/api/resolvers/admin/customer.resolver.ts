import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    DeletionResponse,
    MutationAddNoteToCustomerArgs,
    MutationAddNoteToOrderArgs,
    MutationCreateCustomerAddressArgs,
    MutationCreateCustomerArgs,
    MutationDeleteCustomerAddressArgs,
    MutationDeleteCustomerArgs,
    MutationDeleteCustomerNoteArgs,
    MutationUpdateCustomerAddressArgs,
    MutationUpdateCustomerArgs,
    MutationUpdateCustomerNoteArgs,
    Permission,
    QueryCustomerArgs,
    QueryCustomersArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { Address } from '../../../entity/address/address.entity';
import { Customer } from '../../../entity/customer/customer.entity';
import { CustomerService } from '../../../service/services/customer.service';
import { OrderService } from '../../../service/services/order.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver()
export class CustomerResolver {
    constructor(private customerService: CustomerService, private orderService: OrderService) {}

    @Query()
    @Allow(Permission.ReadCustomer)
    async customers(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryCustomersArgs,
    ): Promise<PaginatedList<Customer>> {
        return this.customerService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadCustomer)
    async customer(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryCustomerArgs,
    ): Promise<Customer | undefined> {
        return this.customerService.findOne(ctx, args.id);
    }

    @Mutation()
    @Allow(Permission.CreateCustomer)
    async createCustomer(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateCustomerArgs,
    ): Promise<Customer> {
        const { input, password } = args;
        return this.customerService.create(ctx, input, password || undefined);
    }

    @Mutation()
    @Allow(Permission.UpdateCustomer)
    async updateCustomer(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateCustomerArgs,
    ): Promise<Customer> {
        const { input } = args;
        return this.customerService.update(ctx, input);
    }

    @Mutation()
    @Allow(Permission.CreateCustomer)
    async createCustomerAddress(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateCustomerAddressArgs,
    ): Promise<Address> {
        const { customerId, input } = args;
        return this.customerService.createAddress(ctx, customerId, input);
    }

    @Mutation()
    @Allow(Permission.UpdateCustomer)
    async updateCustomerAddress(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateCustomerAddressArgs,
    ): Promise<Address> {
        const { input } = args;
        return this.customerService.updateAddress(ctx, input);
    }

    @Mutation()
    @Allow(Permission.DeleteCustomer)
    async deleteCustomerAddress(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteCustomerAddressArgs,
    ): Promise<boolean> {
        const { id } = args;
        return this.customerService.deleteAddress(ctx, id);
    }

    @Mutation()
    @Allow(Permission.DeleteCustomer)
    async deleteCustomer(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteCustomerArgs,
    ): Promise<DeletionResponse> {
        return this.customerService.softDelete(ctx, args.id);
    }

    @Mutation()
    @Allow(Permission.UpdateCustomer)
    async addNoteToCustomer(@Ctx() ctx: RequestContext, @Args() args: MutationAddNoteToCustomerArgs) {
        return this.customerService.addNoteToCustomer(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateCustomer)
    async updateCustomerNote(@Ctx() ctx: RequestContext, @Args() args: MutationUpdateCustomerNoteArgs) {
        return this.customerService.updateCustomerNote(ctx, args.input);
    }
    @Mutation()
    @Allow(Permission.UpdateCustomer)
    async deleteCustomerNote(@Ctx() ctx: RequestContext, @Args() args: MutationDeleteCustomerNoteArgs) {
        return this.customerService.deleteCustomerNote(ctx, args.id);
    }
}
