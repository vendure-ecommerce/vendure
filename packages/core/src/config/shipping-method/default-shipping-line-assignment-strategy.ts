import { RequestContext } from '../../api/index';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';
import { ShippingLine } from '../../entity/shipping-line/shipping-line.entity';

import { ShippingLineAssignmentStrategy } from './shipping-line-assignment-strategy';

export class DefaultShippingLineAssignmentStrategy implements ShippingLineAssignmentStrategy {
    assignShippingLineToOrderLines(
        ctx: RequestContext,
        shippingLine: ShippingLine,
        order: Order,
    ): OrderLine[] | Promise<OrderLine[]> {
        return order.lines;
    }
}
