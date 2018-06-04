import { Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { Address } from '../../entity/address/address.interface';
import { CustomerEntity } from "../../entity/customer/customer.entity";
import { Customer } from "../../entity/customer/customer.interface";
import { RolesGuard } from "../../auth/roles-guard";
import { Role } from "../../auth/role";

@Resolver('Customer')
export class CustomerResolver {
    constructor(private customerService: CustomerService) {}

    @Query('customers')
    customers(): Promise<Customer[]> {
        return this.customerService.findAll();
    }

    @Query('customer')
    customer(obj, args): Promise<Customer> {
        return this.customerService.findOne(args.id);
    }

    @ResolveProperty('addresses')
    addresses(customer: CustomerEntity): Promise<Address[]> {
        return this.customerService.findAddressesByCustomerId(customer.id);
    }
}
