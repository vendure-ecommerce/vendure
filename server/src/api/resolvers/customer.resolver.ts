import { Args, Mutation, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import {
    CreateCustomerAddressMutationArgs,
    CreateCustomerMutationArgs,
    CustomerQueryArgs,
    CustomersQueryArgs,
    Permission,
    UpdateCustomerAddressMutationArgs,
    UpdateCustomerMutationArgs,
} from 'shared/generated-types';
import { PaginatedList } from 'shared/shared-types';

import { idsAreEqual } from '../../common/utils';
import { Address } from '../../entity/address/address.entity';
import { Customer } from '../../entity/customer/customer.entity';
import { CustomerService } from '../../service/services/customer.service';
import { RequestContext } from '../common/request-context';
import { Allow } from '../decorators/allow.decorator';
import { Decode } from '../decorators/decode.decorator';
import { Ctx } from '../decorators/request-context.decorator';

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

    @Query()
    @Allow(Permission.Owner)
    async activeCustomer(@Ctx() ctx: RequestContext): Promise<Customer | undefined> {
        const userId = ctx.activeUserId;
        if (userId) {
            return this.customerService.findOneByUserId(userId);
        }
    }

    @ResolveProperty()
    @Allow(Permission.ReadCustomer, Permission.Owner)
    async addresses(
        @Ctx() ctx: RequestContext,
        @Parent() customer: Customer,
    ): Promise<Address[] | undefined> {
        if (ctx.authorizedAsOwnerOnly) {
            if (customer.user && !idsAreEqual(customer.user.id, ctx.activeUserId)) {
                return;
            }
        }
        return this.customerService.findAddressesByCustomerId(customer.id);
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
    async createCustomerAddress(@Args() args: CreateCustomerAddressMutationArgs): Promise<Address> {
        const { customerId, input } = args;
        return this.customerService.createAddress(customerId, input);
    }

    @Mutation()
    @Allow(Permission.UpdateCustomer)
    async updateCustomerAddress(@Args() args: UpdateCustomerAddressMutationArgs): Promise<Address> {
        const { input } = args;
        return this.customerService.updateAddress(input);
    }
}
