import { Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { PaginatedList } from '../../../../shared/shared-types';
import { Address } from '../../entity/address/address.entity';
import { CreateCustomerDto } from '../../entity/customer/customer.dto';
import { Customer } from '../../entity/customer/customer.entity';
import { CustomerService } from '../../service/customer.service';
import { IdCodecService } from '../../service/id-codec.service';

@Resolver('Customer')
export class CustomerResolver {
    constructor(private customerService: CustomerService, private idCodecService: IdCodecService) {}

    @Query('customers')
    async customers(obj, args): Promise<PaginatedList<Customer>> {
        return this.customerService.findAll(args.take, args.skip).then(list => this.idCodecService.encode(list));
    }

    @Query('customer')
    async customer(obj, args): Promise<Customer | undefined> {
        return this.customerService
            .findOne(this.idCodecService.decode(args).id)
            .then(c => this.idCodecService.encode(c));
    }

    @ResolveProperty('addresses')
    async addresses(customer: Customer): Promise<Address[]> {
        const address = await this.customerService.findAddressesByCustomerId(this.idCodecService.decode(customer).id);
        return this.idCodecService.encode(address);
    }

    @Mutation()
    async createCustomer(_, args): Promise<Customer> {
        const { input, password } = args;
        const customer = await this.customerService.create(input, password);
        return this.idCodecService.encode(customer);
    }

    @Mutation()
    async createCustomerAddress(_, args): Promise<Address> {
        const { customerId, input } = args;
        const address = await this.customerService.createAddress(this.idCodecService.decode(customerId), input);
        return this.idCodecService.encode(address);
    }
}
