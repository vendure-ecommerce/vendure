import { Injectable } from '@nestjs/common';
import { pick } from '@vendure/common/lib/pick';

import { RequestContext } from '../../../api/index';
import { ConfigService } from '../../../config/index';
import { TransactionalConnection } from '../../../connection/index';
import { Order, OrderItem, OrderLine } from '../../../entity/index';

@Injectable()
export class OrderSplitter {
    constructor(private connection: TransactionalConnection, private configService: ConfigService) {}

    async createSellerOrders(ctx: RequestContext, order: Order): Promise<Order[]> {
        const { orderSplitStrategy } = this.configService.orderOptions;
        const partialOrders = await orderSplitStrategy.splitOrder?.(ctx, order);
        if (!partialOrders || partialOrders.length === 0) {
            // No split is needed
            return [];
        }

        order.type = 'aggregate';
        order.sellerOrders = [];
        for (const partialOrder of partialOrders) {
            const lines: OrderLine[] = [];
            for (const line of partialOrder.lines) {
                lines.push(await this.duplicateOrderLine(ctx, line));
            }
            const sellerOrder = await this.connection.getRepository(ctx, Order).save(
                new Order({
                    type: 'seller',
                    aggregateOrder: order,
                    code: await this.configService.orderOptions.orderCodeStrategy.generate(ctx),
                    active: false,
                    orderPlacedAt: new Date(),
                    customer: order.customer,
                    channels: [{ id: partialOrder.channelId }],
                    state: partialOrder.state,
                    lines,
                    surcharges: partialOrder.surcharges,
                    shippingLines: partialOrder.shippingLines,
                    couponCodes: order.couponCodes,
                    modifications: [],
                    shippingAddress: order.shippingAddress,
                    billingAddress: order.billingAddress,
                    subTotal: 0,
                    subTotalWithTax: 0,
                    currencyCode: order.currencyCode,
                }),
            );

            order.sellerOrders.push(sellerOrder);
        }
        return order.sellerOrders;
    }

    private async duplicateOrderLine(ctx: RequestContext, line: OrderLine): Promise<OrderLine> {
        const newLine = await this.connection.getRepository(ctx, OrderLine).save(
            new OrderLine({
                ...pick(line, ['productVariant', 'taxCategory', 'featuredAsset', 'customFields']),
                items: [],
            }),
        );
        newLine.items = line.items.map(
            item =>
                new OrderItem({
                    ...pick(item, [
                        'initialListPrice',
                        'listPrice',
                        'listPriceIncludesTax',
                        'adjustments',
                        'taxLines',
                        'cancelled',
                    ]),
                    line: newLine,
                }),
        );
        await this.connection.getRepository(ctx, OrderItem).save(newLine.items);
        return newLine;
    }
}
