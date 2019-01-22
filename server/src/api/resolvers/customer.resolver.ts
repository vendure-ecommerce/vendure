import { Args, Mutation, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';

import {
    CreateCustomerAddressMutationArgs,
    CreateCustomerMutationArgs,
    CustomerQueryArgs,
    CustomersQueryArgs,
    DeleteCustomerMutationArgs,
    OrdersCustomerArgs,
    Permission,
    UpdateCustomerAddressMutationArgs,
    UpdateCustomerMutationArgs,
} from '../../../../shared/generated-types';
import { PaginatedList } from '../../../../shared/shared-types';
import { UnauthorizedError } from '../../common/error/errors';
import { idsAreEqual } from '../../common/utils';
import { Address } from '../../entity/address/address.entity';
import { Customer } from '../../entity/customer/customer.entity';
import { Order } from '../../entity/order/order.entity';
import { CustomerService } from '../../service/services/customer.service';
import { OrderService } from '../../service/services/order.service';
import { IdCodecService } from '../common/id-codec.service';
import { RequestContext } from '../common/request-context';
import { Allow } from '../decorators/allow.decorator';
import { Decode } from '../decorators/decode.decorator';
import { Ctx } from '../decorators/request-context.decorator';

@Resolver('Customer')
export class CustomerResolver {
    constructor(
        private customerService: CustomerService,
        private orderService: OrderService,
        private idCodecService: IdCodecService,
    ) {}

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
    async addresses(@Ctx() ctx: RequestContext, @Parent() customer: Customer): Promise<Address[]> {
        this.checkOwnerPermissions(ctx, customer);
        const customerId = this.idCodecService.decode(customer.id);
        return this.customerService.findAddressesByCustomerId(customerId);
    }

    @ResolveProperty()
    @Allow(Permission.ReadOrder, Permission.Owner)
    async orders(
        @Ctx() ctx: RequestContext,
        @Parent() customer: Customer,
        @Args() args: OrdersCustomerArgs,
    ): Promise<PaginatedList<Order>> {
        this.checkOwnerPermissions(ctx, customer);
        const customerId = this.idCodecService.decode(customer.id);
        return this.orderService.findByCustomerId(customerId, args.options || undefined);
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
    async updateCustomerAddress(@Args() args: UpdateCustomerAddressMutationArgs): Promise<Address> {
        const { input } = args;
        return this.customerService.updateAddress(input);
    }

    @Mutation()
    @Allow(Permission.DeleteCustomer)
    async deleteCustomer(@Args() args: DeleteCustomerMutationArgs): Promise<boolean> {
        return this.customerService.softDelete(args.id);
    }

    /**
     * If the current request is authorized as the Owner, ensure that the userId matches that
     * of the Customer data being requested.
     */
    private checkOwnerPermissions(ctx: RequestContext, customer: Customer) {
        if (ctx.authorizedAsOwnerOnly) {
            const userId = customer.user && this.idCodecService.decode(customer.user.id);
            if (userId && !idsAreEqual(userId, ctx.activeUserId)) {
                throw new UnauthorizedError();
            }
        }
    }
}
