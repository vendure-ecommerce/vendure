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
    QueryTestShippingMethodArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { ShippingMethod } from '../../../entity/shipping-method/shipping-method.entity';
import { OrderTestingService } from '../../../service/services/order-testing.service';
import { ShippingMethodService } from '../../../service/services/shipping-method.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('ShippingMethod')
export class ShippingMethodResolver {
    constructor(
        private shippingMethodService: ShippingMethodService,
        private orderTestingService: OrderTestingService,
    ) {}

    @Query()
    @Allow(Permission.ReadSettings)
    shippingMethods(@Args() args: QueryShippingMethodsArgs): Promise<PaginatedList<ShippingMethod>> {
        return this.shippingMethodService.findAll(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    shippingMethod(@Args() args: QueryShippingMethodArgs): Promise<ShippingMethod | undefined> {
        return this.shippingMethodService.findOne(args.id);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    shippingEligibilityCheckers(@Ctx() ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.shippingMethodService.getShippingEligibilityCheckers(ctx);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    shippingCalculators(@Ctx() ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.shippingMethodService.getShippingCalculators(ctx);
    }

    @Mutation()
    @Allow(Permission.CreateSettings)
    createShippingMethod(@Args() args: MutationCreateShippingMethodArgs): Promise<ShippingMethod> {
        const { input } = args;
        return this.shippingMethodService.create(input);
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    updateShippingMethod(@Args() args: MutationUpdateShippingMethodArgs): Promise<ShippingMethod> {
        const { input } = args;
        return this.shippingMethodService.update(input);
    }

    @Mutation()
    @Allow(Permission.DeleteSettings)
    deleteShippingMethod(@Args() args: MutationDeleteShippingMethodArgs): Promise<DeletionResponse> {
        const { id } = args;
        return this.shippingMethodService.softDelete(id);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    testShippingMethod(@Ctx() ctx: RequestContext, @Args() args: QueryTestShippingMethodArgs) {
        const { input } = args;
        return this.orderTestingService.testShippingMethod(ctx, input);
    }
}
