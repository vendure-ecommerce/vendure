import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    ConfigurableOperationDefinition,
    DeletionResponse,
    MutationCreateShippingMethodArgs,
    MutationDeleteShippingMethodArgs,
    MutationUpdateShippingMethodArgs,
    Permission,
    QueryShippingMethodArgs,
    QueryShippingMethodsArgs,
    QueryTestEligibleShippingMethodsArgs,
    QueryTestShippingMethodArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { ShippingMethod } from '../../../entity/shipping-method/shipping-method.entity';
import { OrderTestingService } from '../../../service/services/order-testing.service';
import { ShippingMethodService } from '../../../service/services/shipping-method.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver('ShippingMethod')
export class ShippingMethodResolver {
    constructor(
        private shippingMethodService: ShippingMethodService,
        private orderTestingService: OrderTestingService,
    ) {}

    @Query()
    @Allow(Permission.ReadSettings)
    shippingMethods(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryShippingMethodsArgs,
    ): Promise<PaginatedList<ShippingMethod>> {
        return this.shippingMethodService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    shippingMethod(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryShippingMethodArgs,
    ): Promise<ShippingMethod | undefined> {
        return this.shippingMethodService.findOne(ctx, args.id);
    }

    @Query()
    @Allow(Permission.ReadSettings, Permission.ReadOrder)
    shippingEligibilityCheckers(@Ctx() ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.shippingMethodService.getShippingEligibilityCheckers(ctx);
    }

    @Query()
    @Allow(Permission.ReadSettings, Permission.ReadOrder)
    shippingCalculators(@Ctx() ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.shippingMethodService.getShippingCalculators(ctx);
    }

    @Query()
    @Allow(Permission.ReadSettings, Permission.ReadOrder)
    fulfillmentHandlers(@Ctx() ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.shippingMethodService.getFulfillmentHandlers(ctx);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.CreateSettings)
    createShippingMethod(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateShippingMethodArgs,
    ): Promise<ShippingMethod> {
        const { input } = args;
        return this.shippingMethodService.create(ctx, input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateSettings)
    updateShippingMethod(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateShippingMethodArgs,
    ): Promise<ShippingMethod> {
        const { input } = args;
        return this.shippingMethodService.update(ctx, input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.DeleteSettings)
    deleteShippingMethod(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteShippingMethodArgs,
    ): Promise<DeletionResponse> {
        const { id } = args;
        return this.shippingMethodService.softDelete(ctx, id);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    testShippingMethod(@Ctx() ctx: RequestContext, @Args() args: QueryTestShippingMethodArgs) {
        const { input } = args;
        return this.orderTestingService.testShippingMethod(ctx, input);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    testEligibleShippingMethods(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryTestEligibleShippingMethodsArgs,
    ) {
        const { input } = args;
        return this.orderTestingService.testEligibleShippingMethods(ctx, input);
    }
}
