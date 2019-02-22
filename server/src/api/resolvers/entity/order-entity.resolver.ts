import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { Order } from '../../../entity/order/order.entity';
import { OrderService } from '../../../service/services/order.service';
import { ShippingMethodService } from '../../../service/services/shipping-method.service';
import { IdCodecService } from '../../common/id-codec.service';

@Resolver('Order')
export class OrderEntityResolver {
    constructor(
        private orderService: OrderService,
        private shippingMethodService: ShippingMethodService,
        private idCodecService: IdCodecService,
    ) {}

    @ResolveProperty()
    async payments(@Parent() order: Order) {
        const orderId = this.idCodecService.decode(order.id);
        return this.orderService.getOrderPayments(orderId);
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
}
