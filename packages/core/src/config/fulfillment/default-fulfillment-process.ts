import { HistoryEntryType } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { awaitPromiseOrObservable } from '../../common/index';
import { Fulfillment } from '../../entity/index';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';
import { orderItemsAreDelivered, orderItemsAreShipped } from '../../service/helpers/utils/order-utils';
import { FulfillmentState, OrderState } from '../../service/index';

import { FulfillmentProcess } from './fulfillment-process';

declare module '../../service/helpers/fulfillment-state-machine/fulfillment-state' {
    interface FulfillmentStates {
        Shipped: never;
        Delivered: never;
    }
}

let connection: import('../../connection/transactional-connection').TransactionalConnection;
let configService: import('../config.service').ConfigService;
let orderService: import('../../service/index').OrderService;
let historyService: import('../../service/index').HistoryService;
let stockMovementService: import('../../service/index').StockMovementService;

/**
 * @description
 * The default {@link FulfillmentProcess}
 *
 * @docsCategory fulfillment
 */
export const defaultFulfillmentProcess: FulfillmentProcess<FulfillmentState> = {
    transitions: {
        Created: {
            to: ['Pending'],
        },
        Pending: {
            to: ['Shipped', 'Delivered', 'Cancelled'],
        },
        Shipped: {
            to: ['Delivered', 'Cancelled'],
        },
        Delivered: {
            to: ['Cancelled'],
        },
        Cancelled: {
            to: [],
        },
    },
    async init(injector) {
        // Lazily import these services to avoid a circular dependency error
        // due to this being used as part of the DefaultConfig
        const TransactionalConnection = await import('../../connection/transactional-connection').then(
            m => m.TransactionalConnection,
        );
        const ConfigService = await import('../config.service').then(m => m.ConfigService);
        const HistoryService = await import('../../service/index').then(m => m.HistoryService);
        const OrderService = await import('../../service/index').then(m => m.OrderService);
        const StockMovementService = await import('../../service/index').then(m => m.StockMovementService);
        connection = injector.get(TransactionalConnection);
        configService = injector.get(ConfigService);
        orderService = injector.get(OrderService);
        historyService = injector.get(HistoryService);
        stockMovementService = injector.get(StockMovementService);
    },
    async onTransitionStart(fromState, toState, data) {
        const { fulfillmentHandlers } = configService.shippingOptions;
        const fulfillmentHandler = fulfillmentHandlers.find(h => h.code === data.fulfillment.handlerCode);
        if (fulfillmentHandler) {
            const result = await awaitPromiseOrObservable(
                fulfillmentHandler.onFulfillmentTransition(fromState, toState, data),
            );
            if (result === false || typeof result === 'string') {
                return result;
            }
        }
    },
    async onTransitionEnd(fromState, toState, { ctx, fulfillment, orders }) {
        if (toState === 'Cancelled') {
            await stockMovementService.createCancellationsForOrderItems(ctx, fulfillment.orderItems);
            const lines = await groupOrderItemsIntoLines(ctx, fulfillment.orderItems);
            await stockMovementService.createAllocationsForOrderLines(ctx, lines);
        }
        const historyEntryPromises = orders.map(order =>
            historyService.createHistoryEntryForOrder({
                orderId: order.id,
                type: HistoryEntryType.ORDER_FULFILLMENT_TRANSITION,
                ctx,
                data: {
                    fulfillmentId: fulfillment.id,
                    from: fromState,
                    to: toState,
                },
            }),
        );

        await Promise.all(historyEntryPromises);

        await Promise.all(
            orders.map(order =>
                handleFulfillmentStateTransitByOrder(ctx, order, fulfillment, fromState, toState),
            ),
        );
    },
};

async function groupOrderItemsIntoLines(
    ctx: RequestContext,
    orderItems: OrderItem[],
): Promise<Array<{ orderLine: OrderLine; quantity: number }>> {
    const orderLineIdQuantityMap = new Map<ID, number>();
    for (const item of orderItems) {
        const quantity = orderLineIdQuantityMap.get(item.lineId);
        if (quantity == null) {
            orderLineIdQuantityMap.set(item.lineId, 1);
        } else {
            orderLineIdQuantityMap.set(item.lineId, quantity + 1);
        }
    }
    const orderLines = await connection
        .getRepository(ctx, OrderLine)
        .findByIds([...orderLineIdQuantityMap.keys()], {
            relations: ['productVariant'],
        });
    return orderLines.map(orderLine => ({
        orderLine,
        // tslint:disable-next-line:no-non-null-assertion
        quantity: orderLineIdQuantityMap.get(orderLine.id)!,
    }));
}

async function handleFulfillmentStateTransitByOrder(
    ctx: RequestContext,
    order: Order,
    fulfillment: Fulfillment,
    fromState: FulfillmentState,
    toState: FulfillmentState,
): Promise<void> {
    const nextOrderStates = orderService.getNextOrderStates(order);

    const transitionOrderIfStateAvailable = (state: OrderState) =>
        nextOrderStates.includes(state) && orderService.transitionToState(ctx, order.id, state);

    if (toState === 'Shipped') {
        const orderWithFulfillment = await getOrderWithFulfillments(ctx, order.id);
        if (orderItemsAreShipped(orderWithFulfillment)) {
            await transitionOrderIfStateAvailable('Shipped');
        } else {
            await transitionOrderIfStateAvailable('PartiallyShipped');
        }
    }
    if (toState === 'Delivered') {
        const orderWithFulfillment = await getOrderWithFulfillments(ctx, order.id);
        if (orderItemsAreDelivered(orderWithFulfillment)) {
            await transitionOrderIfStateAvailable('Delivered');
        } else {
            await transitionOrderIfStateAvailable('PartiallyDelivered');
        }
    }
}

async function getOrderWithFulfillments(ctx: RequestContext, orderId: ID) {
    return await connection.getEntityOrThrow(ctx, Order, orderId, {
        relations: ['lines', 'lines.items', 'lines.items.fulfillments'],
    });
}
