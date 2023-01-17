import { OrderType } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import {
    CustomOrderProcess,
    idsAreEqual,
    Order,
    orderItemsAreDelivered,
    orderItemsArePartiallyDelivered,
    orderItemsArePartiallyShipped,
    orderItemsAreShipped,
    OrderService,
    RequestContext,
    TransactionalConnection,
} from '@vendure/core';

let connection: TransactionalConnection;
let orderService: OrderService;

export const multivendorOrderProcess: CustomOrderProcess<any> = {
    init(injector) {
        connection = injector.get(TransactionalConnection);
        orderService = injector.get(OrderService);
    },

    async onTransitionStart(fromState, toState, data) {
        const { ctx, order } = data;
        if (fromState === 'AddingItems' && toState === 'ArrangingPayment') {
            for (const line of data.order.lines) {
                if (!line.shippingLineId) {
                    return 'not all lines have shipping';
                }
            }
        }

        if (order.type !== OrderType.Aggregate) {
            if (toState === 'PartiallyShipped') {
                const orderWithFulfillments = await findOrderWithFulfillments(ctx, order.id);
                if (!orderItemsArePartiallyShipped(orderWithFulfillments)) {
                    return `message.cannot-transition-unless-some-order-items-shipped`;
                }
            }
            if (toState === 'Shipped') {
                const orderWithFulfillments = await findOrderWithFulfillments(ctx, order.id);
                if (!orderItemsAreShipped(orderWithFulfillments)) {
                    return `message.cannot-transition-unless-all-order-items-shipped`;
                }
            }
            if (toState === 'PartiallyDelivered') {
                const orderWithFulfillments = await findOrderWithFulfillments(ctx, order.id);
                if (!orderItemsArePartiallyDelivered(orderWithFulfillments)) {
                    return `message.cannot-transition-unless-some-order-items-delivered`;
                }
            }
            if (toState === 'Delivered') {
                const orderWithFulfillments = await findOrderWithFulfillments(ctx, order.id);
                if (!orderItemsAreDelivered(orderWithFulfillments)) {
                    return `message.cannot-transition-unless-all-order-items-delivered`;
                }
            }
        }
    },
    async onTransitionEnd(fromState, toState, data) {
        const { ctx, order } = data;
        if (order.type === OrderType.Seller) {
            const aggregateOrder = await orderService.getAggregateOrder(ctx, order);
            if (aggregateOrder) {
                const otherSellerOrders = (await orderService.getSellerOrders(ctx, aggregateOrder)).filter(
                    so => !idsAreEqual(so.id, order.id),
                );
                const sellerOrderStates = [...otherSellerOrders.map(so => so.state), toState];
                if (sellerOrderStates.every(state => state === 'Shipped')) {
                    await orderService.transitionToState(data.ctx, aggregateOrder.id, 'Shipped');
                } else if (sellerOrderStates.every(state => state === 'Delivered')) {
                    await orderService.transitionToState(data.ctx, aggregateOrder.id, 'Delivered');
                } else if (sellerOrderStates.some(state => state === 'Delivered')) {
                    await orderService.transitionToState(data.ctx, aggregateOrder.id, 'PartiallyDelivered');
                } else if (sellerOrderStates.some(state => state === 'Shipped')) {
                    await orderService.transitionToState(data.ctx, aggregateOrder.id, 'PartiallyShipped');
                }
            }
        }
    },
};

async function findOrderWithFulfillments(ctx: RequestContext, id: ID): Promise<Order> {
    return await connection.getEntityOrThrow(ctx, Order, id, {
        relations: ['lines', 'lines.items', 'lines.items.fulfillments'],
    });
}
