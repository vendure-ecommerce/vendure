import { Injectable } from '@nestjs/common';
import { notNullOrUndefined } from 'shared/shared-utils';

import { RequestContext } from '../../../api/common/request-context';
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
    getEligibleShippingMethods(
        ctx: RequestContext,
        order: Order,
    ): Array<{ method: ShippingMethod; price: number }> {
        const shippingMethods = this.shippingMethodService.getActiveShippingMethods(ctx.channel);
        return shippingMethods
            .filter(sm => sm.test(order))
            .map(sm => {
                const adjustment = sm.apply(order);
                if (adjustment) {
                    return {
                        method: sm,
                        price: adjustment.amount,
                    };
                }
            })
            .filter(notNullOrUndefined)
            .sort((a, b) => a.price - b.price);
    }
}
