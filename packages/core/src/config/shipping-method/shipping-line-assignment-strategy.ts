import { RequestContext } from '../../api/index';
import { InjectableStrategy } from '../../common/index';
import { Order, OrderLine, ShippingLine } from '../../entity/index';

export interface ShippingLineAssignmentStrategy extends InjectableStrategy {
    assignShippingLineToOrderLines(
        ctx: RequestContext,
        shippingLine: ShippingLine,
        order: Order,
    ): OrderLine[] | Promise<OrderLine[]>;
}
