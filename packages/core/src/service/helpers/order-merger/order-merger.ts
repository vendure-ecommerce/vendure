import { Injectable } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../../api/common/request-context';
import { ConfigService } from '../../../config/config.service';
import { OrderLine } from '../../../entity/order-line/order-line.entity';
import { Order } from '../../../entity/order/order.entity';

export type OrderWithNoLines = Order & { lines: undefined };
export type OrderWithEmptyLines = Order & { lines: ArrayLike<OrderLine> & { length: 0 } };
export type EmptyOrder = OrderWithEmptyLines | OrderWithNoLines;
export type MergeResult = {
    order?: Order;
    linesToInsert?: Array<{ productVariantId: ID; quantity: number }>;
    orderToDelete?: Order;
};

@Injectable()
export class OrderMerger {
    constructor(private configService: ConfigService) {}

    /**
     * Applies the configured OrderMergeStrategy to the supplied guestOrder and existingOrder. Returns an object
     * containing entities which then need to be persisted to the database by the OrderService methods.
     */
    merge(ctx: RequestContext, guestOrder?: Order, existingOrder?: Order): MergeResult {
        if (guestOrder && !this.orderEmpty(guestOrder) && existingOrder && !this.orderEmpty(existingOrder)) {
            const { mergeStrategy } = this.configService.orderOptions;
            const mergedLines = mergeStrategy.merge(ctx, guestOrder, existingOrder);
            return {
                order: existingOrder,
                linesToInsert: this.getLinesToInsert(guestOrder, existingOrder, mergedLines),
                orderToDelete: guestOrder,
            };
        } else if (
            guestOrder &&
            !this.orderEmpty(guestOrder) &&
            (!existingOrder || (existingOrder && this.orderEmpty(existingOrder)))
        ) {
            return {
                order: guestOrder,
                orderToDelete: existingOrder,
            };
        } else {
            return {
                order: existingOrder,
                orderToDelete: guestOrder,
            };
        }
    }

    private getLinesToInsert(
        guestOrder: Order,
        existingOrder: Order,
        mergedLines: OrderLine[],
    ): Array<{ productVariantId: ID; quantity: number }> {
        const linesToInsert: Array<{ productVariantId: ID; quantity: number }> = [];
        for (const line of mergedLines) {
            if (
                !existingOrder.lines.find(
                    existingLine => existingLine.productVariant.id === line.productVariant.id,
                )
            ) {
                linesToInsert.push({ productVariantId: line.productVariant.id, quantity: line.quantity });
            }
        }
        return linesToInsert;
    }

    private orderEmpty(order: Order | EmptyOrder): order is EmptyOrder {
        return !order || !order.lines || !order.lines.length;
    }
}
