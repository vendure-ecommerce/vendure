import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    ConfigurableOperation,
    MutationCreateShippingMethodArgs,
    Permission,
    QueryShippingMethodArgs,
    QueryShippingMethodsArgs,
    MutationUpdateShippingMethodArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { ShippingMethod } from '../../../entity/shipping-method/shipping-method.entity';
import { ShippingMethodService } from '../../../service/services/shipping-method.service';
import { Allow } from '../../decorators/allow.decorator';

@Resolver('ShippingMethod')
export class ShippingMethodResolver {
    constructor(private shippingMethodService: ShippingMethodService) {}

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
    shippingEligibilityCheckers(@Args() args: QueryShippingMethodArgs): ConfigurableOperation[] {
        return this.shippingMethodService.getShippingEligibilityCheckers();
    }

    @Query()
    @Allow(Permission.ReadSettings)
    shippingCalculators(@Args() args: QueryShippingMethodArgs): ConfigurableOperation[] {
        return this.shippingMethodService.getShippingCalculators();
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
}
