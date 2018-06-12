import { Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { Address } from '../../entity/address/address.entity';
import { CreateCustomerDto } from '../../entity/customer/customer.dto';
import { Customer } from '../../entity/customer/customer.entity';
import { CustomerService } from '../../service/customer.service';

@Resolver('Customer')
export class CustomerResolver {
    constructor(private customerService: CustomerService) {}

    @Query('customers')
    customers(): Promise<Customer[]> {
        return this.customerService.findAll();
    }

    @Query('customer')
    customer(obj, args): Promise<Customer | undefined> {
        return this.customerService.findOne(args.id);
    }

    @ResolveProperty('addresses')
    addresses(customer: Customer): Promise<Address[]> {
        return this.customerService.findAddressesByCustomerId(customer.id);
    }

    @Mutation()
    createCustomer(_, args): Promise<Customer> {
        const { input, password } = args;
        return this.customerService.create(input, password);
    }
}
