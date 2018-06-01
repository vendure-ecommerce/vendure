import { Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { CustomerService } from './customer.service';
import { Address } from '../../entity/address/address.interface';
import { CustomerEntity } from "../../entity/customer/customer.entity";
import { Customer } from "../../entity/customer/customer.interface";
import { UseGuards } from "@nestjs/common";

@Resolver('Customer')
export class CustomerResolver {
    constructor(private customerService: CustomerService) {}

    @Query('customers')
    customers(): Promise<Customer[]> {
        return this.customerService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Query('customer')
    customer(obj, args): Promise<Customer> {
        return this.customerService.findOne(args.id);
    }

    @ResolveProperty('addresses')
    addresses(customer: CustomerEntity): Promise<Address[]> {
        return this.customerService.findAddressesByCustomerId(customer.id);
    }
}
