import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';

import { OrderMergeStrategy } from './order-merge-strategy';

export class UseGuestIfExistingEmptyStrategy implements OrderMergeStrategy {
    merge(guestOrder: Order, existingOrder: Order): OrderLine[] {
        return existingOrder.lines.length ? existingOrder.lines.slice() : guestOrder.lines.slice();
    }
}
