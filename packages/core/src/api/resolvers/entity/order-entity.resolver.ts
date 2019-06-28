import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { Order } from '../../../entity/order/order.entity';
import { OrderService } from '../../../service/services/order.service';
import { ShippingMethodService } from '../../../service/services/shipping-method.service';

@Resolver('Order')
export class OrderEntityResolver {
    constructor(private orderService: OrderService, private shippingMethodService: ShippingMethodService) {}

    @ResolveProperty()
    async payments(@Parent() order: Order) {
        if (order.payments) {
            return order.payments;
        }
        return this.orderService.getOrderPayments(order.id);
    }

    @ResolveProperty()
    async refunds(@Parent() order: Order) {
        if (order.refunds) {
            return order.refunds;
        }
        return this.orderService.getOrderRefunds(order.id);
    }

    @ResolveProperty()
    async shippingMethod(@Parent() order: Order) {
        if (order.shippingMethodId) {
            // Does not need to be decoded because it is an internal property
            // which is never exposed to the outside world.
            const shippingMethodId = order.shippingMethodId;
            return this.shippingMethodService.findOne(shippingMethodId);
        } else {
            return null;
        }
    }

    @ResolveProperty()
    async fulfillments(@Parent() order: Order) {
        return this.orderService.getOrderFulfillments(order);
    }
}
