import { Injectable } from '@nestjs/common';

import { RequestContext } from '../../../api/common/request-context';
import { ShippingCalculationResult } from '../../../config/shipping-method/shipping-calculator';
import { Order } from '../../../entity/order/order.entity';
import { ShippingMethod } from '../../../entity/shipping-method/shipping-method.entity';
import { ShippingMethodService } from '../../services/shipping-method.service';

type CheckEligibilityByShippingMethodResponse =
    | {
          method: ShippingMethod;
          result: ShippingCalculationResult;
      }
    | undefined;

type EligibleShippingMethod = NonNullable<CheckEligibilityByShippingMethodResponse>;

@Injectable()
export class ShippingCalculator {
    constructor(private shippingMethodService: ShippingMethodService) {}

    /**
     * Returns an array of each eligible ShippingMethod for the given Order and sorts them by
     * price, with the cheapest first.
     */
    async getEligibleShippingMethods(ctx: RequestContext, order: Order): Promise<EligibleShippingMethod[]> {
        const shippingMethods = this.shippingMethodService.getActiveShippingMethods(ctx.channel);

        const checkEligibilityPromises = shippingMethods.map((method) =>
            this.checkEligibilityByShippingMethod(order, method),
        );
        const eligibleMethods = await Promise.all(checkEligibilityPromises);

        // Workaround to remove undefined from type: https://stackoverflow.com/a/51577579
        const filteredEligibleMethods = eligibleMethods.filter(
            (m): m is EligibleShippingMethod => m !== undefined,
        );

        return filteredEligibleMethods.sort((a, b) => a.result.price - b.result.price);
    }

    private async checkEligibilityByShippingMethod(
        order: Order,
        method: ShippingMethod,
    ): Promise<CheckEligibilityByShippingMethodResponse> {
        const eligible = await method.test(order);
        if (eligible) {
            const result = await method.apply(order);
            if (result) {
                return { method, result };
            }
        }
    }
}
