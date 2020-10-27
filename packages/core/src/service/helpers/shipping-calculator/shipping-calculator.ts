import { Injectable } from '@nestjs/common';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';

import { RequestContext } from '../../../api/common/request-context';
import { ShippingCalculationResult } from '../../../config/shipping-method/shipping-calculator';
import { Order } from '../../../entity/order/order.entity';
import { ShippingMethod } from '../../../entity/shipping-method/shipping-method.entity';
import { ShippingMethodService } from '../../services/shipping-method.service';

type EligibleShippingMethod = {
    method: ShippingMethod;
    result: ShippingCalculationResult;
};

@Injectable()
export class ShippingCalculator {
    constructor(private shippingMethodService: ShippingMethodService) {}

    /**
     * Returns an array of each eligible ShippingMethod for the given Order and sorts them by
     * price, with the cheapest first.
     */
    async getEligibleShippingMethods(ctx: RequestContext, order: Order): Promise<EligibleShippingMethod[]> {
        const shippingMethods = this.shippingMethodService.getActiveShippingMethods(ctx.channel);

        const checkEligibilityPromises = shippingMethods.map(method =>
            this.checkEligibilityByShippingMethod(ctx, order, method),
        );
        const eligibleMethods = await Promise.all(checkEligibilityPromises);

        return eligibleMethods.filter(notNullOrUndefined).sort((a, b) => a.result.price - b.result.price);
    }

    private async checkEligibilityByShippingMethod(
        ctx: RequestContext,
        order: Order,
        method: ShippingMethod,
    ): Promise<EligibleShippingMethod | undefined> {
        const eligible = await method.test(order);
        if (eligible) {
            const result = await method.apply(ctx, order);
            if (result) {
                return { method, result };
            }
        }
    }
}
