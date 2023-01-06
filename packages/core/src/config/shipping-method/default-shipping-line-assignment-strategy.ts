import { RequestContext } from '../../api/index';
import { Order, OrderLine, ShippingLine } from '../../entity/index';

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
