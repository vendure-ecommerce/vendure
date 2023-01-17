import {
    CustomFulfillmentProcess,
    Fulfillment,
    FulfillmentState,
    Order,
    OrderService,
    RequestContext,
} from '@vendure/core';

let orderService: OrderService;

export const multivendorFulfillmentProcess: CustomFulfillmentProcess<FulfillmentState> = {
    init(injector) {
        orderService = injector.get(OrderService);
    },
    async onTransitionEnd(fromState, toState, data) {
        if (toState === 'Shipped' || toState === 'Delivered') {
            await checkAggregateOrderFulfillments({
                ...data,
                toState,
                aggregateOrderHandler: async (aggregateOrder, allFulfillmentStates) => {
                    if (allFulfillmentStates.every(state => state === 'Shipped')) {
                        await orderService.transitionToState(data.ctx, aggregateOrder.id, 'Shipped');
                    } else if (allFulfillmentStates.every(state => state === 'Delivered')) {
                        await orderService.transitionToState(data.ctx, aggregateOrder.id, 'Delivered');
                    } else if (allFulfillmentStates.some(state => state === 'Delivered')) {
                        await orderService.transitionToState(
                            data.ctx,
                            aggregateOrder.id,
                            'PartiallyDelivered',
                        );
                    } else if (allFulfillmentStates.some(state => state === 'Shipped')) {
                        await orderService.transitionToState(data.ctx, aggregateOrder.id, 'PartiallyShipped');
                    }
                },
            });
        }
    },
};

async function checkAggregateOrderFulfillments(input: {
    ctx: RequestContext;
    orders: Order[];
    fulfillment: Fulfillment;
    toState: FulfillmentState;
    aggregateOrderHandler: (
        aggregateOrder: Order,
        allFulfillmentStates: Array<FulfillmentState | 'none'>,
    ) => Promise<void>;
}) {
    const { ctx, orders, fulfillment, toState, aggregateOrderHandler } = input;
    for (const order of orders) {
        const aggregateOrder = await orderService.getAggregateOrder(ctx, order);
        if (aggregateOrder) {
            const sellerOrders = await orderService.getSellerOrders(ctx, aggregateOrder);
            const allFulfillmentStates = (
                await Promise.all(
                    sellerOrders.map(
                        async sellerOrder => await orderService.getOrderFulfillments(ctx, sellerOrder),
                    ),
                )
            )
                .map(fulfillments => {
                    if (fulfillments.length === 0) {
                        // This order has no fulfillments yet, so we need to add a placeholder to indicate this
                        return 'none';
                    } else {
                        return fulfillments;
                    }
                })
                .flat()
                .map(f => (f === 'none' ? f : f.id === fulfillment.id ? toState : f.state));
            await aggregateOrderHandler(aggregateOrder, allFulfillmentStates);
        }
    }
}
