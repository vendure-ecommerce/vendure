import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';

import { OrderMergeStrategy } from './order-merge-strategy';

export class UseGuestStrategy implements OrderMergeStrategy {
    merge(guestOrder: Order, existingOrder: Order): OrderLine[] {
        return guestOrder.lines.slice();
    }
}
