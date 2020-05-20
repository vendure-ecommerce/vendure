import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';

import { OrderMergeStrategy } from './order-merge-strategy';

/**
 * @description
 * Merges both Orders. If the guest order contains items which are already in the
 * existing Order, the guest Order quantity will replace that of the existing Order.
 *
 * @docsCategory orders
 * @docsPage Merge Strategies
 */
export class MergeOrdersStrategy implements OrderMergeStrategy {
    merge(guestOrder: Order, existingOrder: Order): OrderLine[] {
        const mergedLines = existingOrder.lines.slice();
        const guestLines = guestOrder.lines.slice();
        for (const guestLine of guestLines.reverse()) {
            const existingLine = this.findCorrespondingLine(existingOrder, guestLine);
            if (!existingLine) {
                mergedLines.unshift(guestLine);
            }
        }
        return mergedLines;
    }

    private findCorrespondingLine(existingOrder: Order, guestLine: OrderLine): OrderLine | undefined {
        return existingOrder.lines.find((line) => line.productVariant.id === guestLine.productVariant.id);
    }
}
