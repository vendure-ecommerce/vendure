import { Args, Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import {
    CreateCustomerAddressMutationArgs,
    CreateCustomerMutationArgs,
    CustomerQueryArgs,
    CustomersQueryArgs,
    Permission,
} from 'shared/generated-types';
import { PaginatedList } from 'shared/shared-types';

import { Address } from '../../entity/address/address.entity';
import { Customer } from '../../entity/customer/customer.entity';
import { CustomerService } from '../../service/providers/customer.service';
import { Allow } from '../common/auth-guard';
import { Decode } from '../common/id-interceptor';

@Resolver('Customer')
export class CustomerResolver {
    constructor(private customerService: CustomerService) {}

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

    @ResolveProperty()
    @Allow(Permission.ReadCustomer)
    async addresses(customer: Customer): Promise<Address[]> {
        return this.customerService.findAddressesByCustomerId(customer.id);
    }

    @Mutation()
    @Allow(Permission.CreateCustomer)
    async createCustomer(@Args() args: CreateCustomerMutationArgs): Promise<Customer> {
        const { input, password } = args;
        return this.customerService.create(input, password || undefined);
    }

    @Mutation()
    @Allow(Permission.CreateCustomer)
    @Decode('customerId')
    async createCustomerAddress(@Args() args: CreateCustomerAddressMutationArgs): Promise<Address> {
        const { customerId, input } = args;
        return this.customerService.createAddress(customerId, input);
    }
}
