import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Decode } from '../..';
import {
    CreateCustomerAddressMutationArgs,
    Permission,
    UpdateCustomerAddressMutationArgs,
    UpdateCustomerMutationArgs,
} from '../../../../../shared/generated-types';
import { UnauthorizedError } from '../../../common/error/errors';
import { idsAreEqual } from '../../../common/utils';
import { Address, Customer } from '../../../entity';
import { CustomerService } from '../../../service/services/customer.service';
import { IdCodecService } from '../../common/id-codec.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver()
export class ShopCustomerResolver {
    constructor(private customerService: CustomerService, private idCodecService: IdCodecService) {}

    @Query()
    @Allow(Permission.Owner)
    async activeCustomer(@Ctx() ctx: RequestContext): Promise<Customer | undefined> {
        const userId = ctx.activeUserId;
        if (userId) {
            return this.customerService.findOneByUserId(userId);
        }
    }

    @Mutation()
    @Allow(Permission.Owner)
    async updateCustomer(@Args() args: UpdateCustomerMutationArgs): Promise<Customer> {
        // TODO: implement for owner
        return null as any;
    }

    @Mutation()
    @Allow(Permission.Owner)
    @Decode('customerId')
    async createCustomerAddress(
        @Ctx() ctx: RequestContext,
        @Args() args: CreateCustomerAddressMutationArgs,
    ): Promise<Address> {
        // TODO: implement for owner
        return null as any;
    }

    @Mutation()
    @Allow(Permission.Owner)
    async updateCustomerAddress(
        @Ctx() ctx: RequestContext,
        @Args() args: UpdateCustomerAddressMutationArgs,
    ): Promise<Address> {
        // TODO: implement for owner
        return null as any;
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
