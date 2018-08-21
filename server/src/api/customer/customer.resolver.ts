import { Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';

import { PaginatedList } from '../../../../shared/shared-types';
import { Address } from '../../entity/address/address.entity';
import { Customer } from '../../entity/customer/customer.entity';
import { CustomerService } from '../../service/customer.service';
import { ApplyIdCodec } from '../common/apply-id-codec-decorator';

@Resolver('Customer')
export class CustomerResolver {
    constructor(private customerService: CustomerService) {}

    @Query('customers')
    @ApplyIdCodec()
    async customers(obj, args): Promise<PaginatedList<Customer>> {
        return this.customerService.findAll(args.options);
    }

    @Query('customer')
    @ApplyIdCodec()
    async customer(obj, args): Promise<Customer | undefined> {
        return this.customerService.findOne(args.id);
    }

    @ResolveProperty('addresses')
    @ApplyIdCodec()
    async addresses(customer: Customer): Promise<Address[]> {
        return this.customerService.findAddressesByCustomerId(customer.id);
    }

    @Mutation()
    @ApplyIdCodec()
    async createCustomer(_, args): Promise<Customer> {
        const { input, password } = args;
        return this.customerService.create(input, password);
    }

    @Mutation()
    @ApplyIdCodec()
    async createCustomerAddress(_, args): Promise<Address> {
        const { customerId, input } = args;
        return this.customerService.createAddress(customerId, input);
    }
}
