import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    CreateCustomerAddressMutationArgs,
    CreateCustomerMutationArgs,
    CustomerQueryArgs,
    CustomersQueryArgs,
    DeleteCustomerAddressMutationArgs,
    DeleteCustomerMutationArgs,
    DeletionResponse,
    Permission,
    UpdateCustomerAddressMutationArgs,
    UpdateCustomerMutationArgs,
} from '@vendure/common/generated-types';
import { PaginatedList } from '@vendure/common/shared-types';

import { Address } from '../../../entity/address/address.entity';
import { Customer } from '../../../entity/customer/customer.entity';
import { CustomerService } from '../../../service/services/customer.service';
import { OrderService } from '../../../service/services/order.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Decode } from '../../decorators/decode.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver()
export class CustomerResolver {
    constructor(private customerService: CustomerService, private orderService: OrderService) {}

    @Query()
    @Allow(Permission.ReadCustomer)
    async customers(@Args() args: CustomersQueryArgs): Promise<PaginatedList<Customer>> {
        return this.customerService.findAll(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadCustomer)
    async customer(@Args() args: CustomerQueryArgs): Promise<Customer | undefined> {
        return this.customerService.findOne(args.id);
    }

    @Mutation()
    @Allow(Permission.CreateCustomer)
    async createCustomer(@Args() args: CreateCustomerMutationArgs): Promise<Customer> {
        const { input, password } = args;
        return this.customerService.create(input, password || undefined);
    }

    @Mutation()
    @Allow(Permission.UpdateCustomer)
    async updateCustomer(@Args() args: UpdateCustomerMutationArgs): Promise<Customer> {
        const { input } = args;
        return this.customerService.update(input);
    }

    @Mutation()
    @Allow(Permission.CreateCustomer)
    @Decode('customerId')
    async createCustomerAddress(
        @Ctx() ctx: RequestContext,
        @Args() args: CreateCustomerAddressMutationArgs,
    ): Promise<Address> {
        const { customerId, input } = args;
        return this.customerService.createAddress(ctx, customerId, input);
    }

    @Mutation()
    @Allow(Permission.UpdateCustomer)
    async updateCustomerAddress(
        @Ctx() ctx: RequestContext,
        @Args() args: UpdateCustomerAddressMutationArgs,
    ): Promise<Address> {
        const { input } = args;
        return this.customerService.updateAddress(ctx, input);
    }

    @Mutation()
    @Allow(Permission.DeleteCustomer)
    async deleteCustomerAddress(
        @Ctx() ctx: RequestContext,
        @Args() args: DeleteCustomerAddressMutationArgs,
    ): Promise<boolean> {
        const { id } = args;
        return this.customerService.deleteAddress(id);
    }

    @Mutation()
    @Allow(Permission.DeleteCustomer)
    async deleteCustomer(@Args() args: DeleteCustomerMutationArgs): Promise<DeletionResponse> {
        return this.customerService.softDelete(args.id);
    }
}
