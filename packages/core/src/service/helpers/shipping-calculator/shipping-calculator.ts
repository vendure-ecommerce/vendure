import { Injectable } from '@nestjs/common';

import { RequestContext } from '../../../api/common/request-context';
import { ShippingCalculationResult } from '../../../config/shipping-method/shipping-calculator';
import { Order } from '../../../entity/order/order.entity';
import { ShippingMethod } from '../../../entity/shipping-method/shipping-method.entity';
import { ShippingMethodService } from '../../services/shipping-method.service';

@Injectable()
export class ShippingCalculator {
    constructor(private shippingMethodService: ShippingMethodService) {}

    /**
     * Returns an array of each eligible ShippingMethod for the given Order and sorts them by
     * price, with the cheapest first.
     */
    async getEligibleShippingMethods(
        ctx: RequestContext,
        order: Order,
    ): Promise<Array<{ method: ShippingMethod; result: ShippingCalculationResult }>> {
        const shippingMethods = this.shippingMethodService.getActiveShippingMethods(ctx.channel);
        const eligibleMethods: Array<{ method: ShippingMethod; result: ShippingCalculationResult }> = [];
        for (const method of shippingMethods) {
            const eligible = await method.test(order);
            if (eligible) {
                const result = await method.apply(order);
                if (result) {
                    eligibleMethods.push({ method, result });
                }
            }
        }
        return eligibleMethods.sort((a, b) => a.result.price - b.result.price);
    }
}
