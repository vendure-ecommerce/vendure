import { RequestContext } from '../../api/common/request-context';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';

import { OrderMergeStrategy } from './order-merge-strategy';

/**
 * @description
 * If the existing order is empty, then the guest order is used. Otherwise the existing order is used.
 *
 * @docsCategory orders
 * @docsPage Merge Strategies
 */
export class UseGuestIfExistingEmptyStrategy implements OrderMergeStrategy {
    merge(ctx: RequestContext, guestOrder: Order, existingOrder: Order): OrderLine[] {
        return existingOrder.lines.length ? existingOrder.lines.slice() : guestOrder.lines.slice();
    }
}
