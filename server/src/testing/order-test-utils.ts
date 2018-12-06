import { ID } from '../../../shared/shared-types';

import { OrderItem } from '../entity/order-item/order-item.entity';
import { OrderLine } from '../entity/order-line/order-line.entity';
import { Order } from '../entity/order/order.entity';
import { ProductVariant } from '../entity/product-variant/product-variant.entity';

export type SimpleLine = { productVariantId: ID; quantity: number; lineId: ID };

export function createOrderFromLines(simpleLines: SimpleLine[]): Order {
    const lines = simpleLines.map(
        ({ productVariantId, quantity, lineId }) =>
            new OrderLine({
                id: lineId,
                productVariant: new ProductVariant({ id: productVariantId }),
                items: Array.from({ length: quantity }).map(() => new OrderItem({})),
            }),
    );

    return new Order({
        lines,
    });
}

export function parseLines(lines: OrderLine[]): SimpleLine[] {
    return lines.map(line => {
        return {
            lineId: line.id,
            productVariantId: line.productVariant.id,
            quantity: line.quantity,
        };
    });
}
