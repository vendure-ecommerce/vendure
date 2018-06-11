import { Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { Address } from '../../entity/address/address.entity';
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
}
