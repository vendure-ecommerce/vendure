/* tslint:disable:no-non-null-assertion */
import { pick } from '@vendure/common/lib/pick';
import {
    createErrorResultGuard,
    createTestEnvironment,
    ErrorResultGuard,
    SimpleGraphQLClient,
} from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import {
    failsToSettlePaymentMethod,
    onTransitionSpy,
    singleStageRefundablePaymentMethod,
    twoStagePaymentMethod,
} from './fixtures/test-payment-methods';
import { FULFILLMENT_FRAGMENT } from './graphql/fragments';
import {
    AddNoteToOrder,
    CanceledOrderFragment,
    CancelOrder,
    CreateFulfillment,
    DeleteOrderNote,
    ErrorCode,
    FulfillmentFragment,
    GetCustomerList,
    GetOrder,
    GetOrderFulfillmentItems,
    GetOrderFulfillments,
    GetOrderHistory,
    GetOrderList,
    GetOrderListFulfillments,
    GetOrderWithPayments,
    GetProductWithVariants,
    GetStockMovement,
    GlobalFlag,
    HistoryEntryType,
    PaymentFragment,
    RefundFragment,
    RefundOrder,
    SettlePayment,
    SettleRefund,
    SortOrder,
    StockMovementType,
    TransitFulfillment,
    UpdateOrderNote,
    UpdateProductVariants,
} from './graphql/generated-e2e-admin-types';
import {
    AddItemToOrder,
    DeletionResult,
    GetActiveOrder,
    GetOrderByCodeWithPayments,
    TestOrderFragmentFragment,
    UpdatedOrder,
} from './graphql/generated-e2e-shop-types';
import {
    CANCEL_ORDER,
    CREATE_FULFILLMENT,
    GET_CUSTOMER_LIST,
    GET_ORDER,
    GET_ORDERS_LIST,
    GET_ORDER_FULFILLMENTS,
    GET_PRODUCT_WITH_VARIANTS,
    GET_STOCK_MOVEMENT,
    TRANSIT_FULFILLMENT,
    UPDATE_PRODUCT_VARIANTS,
} from './graphql/shared-definitions';
import {
    ADD_ITEM_TO_ORDER,
    GET_ACTIVE_ORDER,
    GET_ORDER_BY_CODE_WITH_PAYMENTS,
} from './graphql/shop-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';
import { addPaymentToOrder, proceedToArrangingPayment } from './utils/test-order-utils';

describe('Orders resolver', () => {
    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig,
        paymentOptions: {
            paymentMethodHandlers: [
                twoStagePaymentMethod,
                failsToSettlePaymentMethod,
                singleStageRefundablePaymentMethod,
            ],
        },
    });
    let customers: GetCustomerList.Items[];
    const password = 'test';

    const orderGuard: ErrorResultGuard<
        TestOrderFragmentFragment | CanceledOrderFragment
    > = createErrorResultGuard<TestOrderFragmentFragment | CanceledOrderFragment>(input => !!input.lines);
    const paymentGuard: ErrorResultGuard<PaymentFragment> = createErrorResultGuard<PaymentFragment>(
        input => !!input.state,
    );
    const fulfillmentGuard: ErrorResultGuard<FulfillmentFragment> = createErrorResultGuard<
        FulfillmentFragment
    >(input => !!input.method);
    const refundGuard: ErrorResultGuard<RefundFragment> = createErrorResultGuard<RefundFragment>(
        input => !!input.items,
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 3,
        });
        await adminClient.asSuperAdmin();

        // Create a couple of orders to be queried
        const result = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(
            GET_CUSTOMER_LIST,
            {
                options: {
                    take: 3,
                },
            },
        );
        customers = result.customers.items;
        await shopClient.asUserWithCredentials(customers[0].emailAddress, password);
        await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_1',
            quantity: 1,
        });
        await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_2',
            quantity: 1,
        });
        await shopClient.asUserWithCredentials(customers[1].emailAddress, password);
        await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_2',
            quantity: 1,
        });
        await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_3',
            quantity: 3,
        });
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('orders', async () => {
        const result = await adminClient.query<GetOrderList.Query>(GET_ORDERS_LIST);
        expect(result.orders.items.map(o => o.id)).toEqual(['T_1', 'T_2']);
    });

    it('order', async () => {
        const result = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, { id: 'T_2' });
        expect(result.order!.id).toBe('T_2');
    });

    it('order history initially contains Created -> AddingItems transition', async () => {
        const { order } = await adminClient.query<GetOrderHistory.Query, GetOrderHistory.Variables>(
            GET_ORDER_HISTORY,
            { id: 'T_1' },
        );
        expect(order!.history.totalItems).toBe(1);
        expect(order!.history.items.map(pick(['type', 'data']))).toEqual([
            {
                type: HistoryEntryType.ORDER_STATE_TRANSITION,
                data: {
                    from: 'Created',
                    to: 'AddingItems',
                },
            },
        ]);
    });

    describe('payments', () => {
        let firstOrderCode: string;
        let firstOrderId: string;

        it('settlePayment fails', async () => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, password);
            await proceedToArrangingPayment(shopClient);
            const order = await addPaymentToOrder(shopClient, failsToSettlePaymentMethod);
            orderGuard.assertSuccess(order);

            expect(order.state).toBe('PaymentAuthorized');

            const payment = order.payments![0];
            const { settlePayment } = await adminClient.query<
                SettlePayment.Mutation,
                SettlePayment.Variables
            >(SETTLE_PAYMENT, {
                id: payment.id,
            });
            paymentGuard.assertErrorResult(settlePayment);

            expect(settlePayment.message).toBe('Settling the payment failed');
            expect(settlePayment.errorCode).toBe(ErrorCode.SETTLE_PAYMENT_ERROR);
            expect((settlePayment as any).paymentErrorMessage).toBe('Something went horribly wrong');

            const result = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: order.id,
            });

            expect(result.order!.state).toBe('PaymentAuthorized');
            firstOrderCode = order.code;
            firstOrderId = order.id;
        });

        it('public payment metadata available in Shop API', async () => {
            const { orderByCode } = await shopClient.query<
                GetOrderByCodeWithPayments.Query,
                GetOrderByCodeWithPayments.Variables
            >(GET_ORDER_BY_CODE_WITH_PAYMENTS, { code: firstOrderCode });

            expect(orderByCode?.payments?.[0].metadata).toEqual({
                public: {
                    publicCreatePaymentData: 'public',
                    publicSettlePaymentData: 'public',
                },
            });
        });

        it('public and private payment metadata available in Admin API', async () => {
            const { order } = await adminClient.query<
                GetOrderWithPayments.Query,
                GetOrderWithPayments.Variables
            >(GET_ORDER_WITH_PAYMENTS, { id: firstOrderId });

            expect(order?.payments?.[0].metadata).toEqual({
                privateCreatePaymentData: 'secret',
                privateSettlePaymentData: 'secret',
                public: {
                    publicCreatePaymentData: 'public',
                    publicSettlePaymentData: 'public',
                },
            });
        });

        it('settlePayment succeeds, onStateTransitionStart called', async () => {
            onTransitionSpy.mockClear();
            await shopClient.asUserWithCredentials(customers[1].emailAddress, password);
            await proceedToArrangingPayment(shopClient);
            const order = await addPaymentToOrder(shopClient, twoStagePaymentMethod);
            orderGuard.assertSuccess(order);

            expect(order.state).toBe('PaymentAuthorized');
            expect(onTransitionSpy).toHaveBeenCalledTimes(1);
            expect(onTransitionSpy.mock.calls[0][0]).toBe('Created');
            expect(onTransitionSpy.mock.calls[0][1]).toBe('Authorized');

            const payment = order.payments![0];
            const { settlePayment } = await adminClient.query<
                SettlePayment.Mutation,
                SettlePayment.Variables
            >(SETTLE_PAYMENT, {
                id: payment.id,
            });
            paymentGuard.assertSuccess(settlePayment);

            expect(settlePayment!.id).toBe(payment.id);
            expect(settlePayment!.state).toBe('Settled');
            // further metadata is combined into existing object
            expect(settlePayment!.metadata).toEqual({
                moreData: 42,
                public: {
                    baz: 'quux',
                },
            });
            expect(onTransitionSpy).toHaveBeenCalledTimes(2);
            expect(onTransitionSpy.mock.calls[1][0]).toBe('Authorized');
            expect(onTransitionSpy.mock.calls[1][1]).toBe('Settled');

            const result = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: order.id,
            });

            expect(result.order!.state).toBe('PaymentSettled');
            expect(result.order!.payments![0].state).toBe('Settled');
        });

        it('order history contains expected entries', async () => {
            const { order } = await adminClient.query<GetOrderHistory.Query, GetOrderHistory.Variables>(
                GET_ORDER_HISTORY,
                { id: 'T_2', options: { sort: { id: SortOrder.ASC } } },
            );
            expect(order!.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                    data: {
                        from: 'Created',
                        to: 'AddingItems',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                    data: {
                        from: 'AddingItems',
                        to: 'ArrangingPayment',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_PAYMENT_TRANSITION,
                    data: {
                        paymentId: 'T_2',
                        from: 'Created',
                        to: 'Authorized',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                    data: {
                        from: 'ArrangingPayment',
                        to: 'PaymentAuthorized',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_PAYMENT_TRANSITION,
                    data: {
                        paymentId: 'T_2',
                        from: 'Authorized',
                        to: 'Settled',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                    data: {
                        from: 'PaymentAuthorized',
                        to: 'PaymentSettled',
                    },
                },
            ]);
        });
    });

    describe('fulfillment', () => {
        it('return error result if lines is empty', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: 'T_2',
            });
            expect(order!.state).toBe('PaymentSettled');
            const { addFulfillmentToOrder } = await adminClient.query<
                CreateFulfillment.Mutation,
                CreateFulfillment.Variables
            >(CREATE_FULFILLMENT, {
                input: {
                    lines: [],
                    method: 'Test',
                },
            });
            fulfillmentGuard.assertErrorResult(addFulfillmentToOrder);

            expect(addFulfillmentToOrder.message).toBe('At least one OrderLine must be specified');
            expect(addFulfillmentToOrder.errorCode).toBe(ErrorCode.EMPTY_ORDER_LINE_SELECTION_ERROR);
        });

        it('returns error result if all quantities are zero', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: 'T_2',
            });
            expect(order!.state).toBe('PaymentSettled');
            const { addFulfillmentToOrder } = await adminClient.query<
                CreateFulfillment.Mutation,
                CreateFulfillment.Variables
            >(CREATE_FULFILLMENT, {
                input: {
                    lines: order!.lines.map(l => ({ orderLineId: l.id, quantity: 0 })),
                    method: 'Test',
                },
            });
            fulfillmentGuard.assertErrorResult(addFulfillmentToOrder);

            expect(addFulfillmentToOrder.message).toBe('At least one OrderLine must be specified');
            expect(addFulfillmentToOrder.errorCode).toBe(ErrorCode.EMPTY_ORDER_LINE_SELECTION_ERROR);
        });

        it('creates the first fulfillment', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: 'T_2',
            });
            expect(order!.state).toBe('PaymentSettled');
            const lines = order!.lines;

            const { addFulfillmentToOrder } = await adminClient.query<
                CreateFulfillment.Mutation,
                CreateFulfillment.Variables
            >(CREATE_FULFILLMENT, {
                input: {
                    lines: [{ orderLineId: lines[0].id, quantity: lines[0].quantity }],
                    method: 'Test1',
                    trackingCode: '111',
                },
            });
            fulfillmentGuard.assertSuccess(addFulfillmentToOrder);

            expect(addFulfillmentToOrder.id).toBe('T_1');
            expect(addFulfillmentToOrder.method).toBe('Test1');
            expect(addFulfillmentToOrder.trackingCode).toBe('111');
            expect(addFulfillmentToOrder.state).toBe('Pending');
            expect(addFulfillmentToOrder.orderItems).toEqual([{ id: lines[0].items[0].id }]);

            const result = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: 'T_2',
            });

            expect(result.order!.lines[0].items[0].fulfillment!.id).toBe(addFulfillmentToOrder!.id);
            expect(
                result.order!.lines[1].items.filter(
                    i => i.fulfillment && i.fulfillment.id === addFulfillmentToOrder.id,
                ).length,
            ).toBe(0);
            expect(result.order!.lines[1].items.filter(i => i.fulfillment == null).length).toBe(3);
        });

        it('creates the second fulfillment', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: 'T_2',
            });

            const unfulfilledItems =
                order?.lines.filter(l => {
                    const items = l.items.filter(i => i.fulfillment === null);
                    return items.length > 0 ? true : false;
                }) || [];

            const { addFulfillmentToOrder } = await adminClient.query<
                CreateFulfillment.Mutation,
                CreateFulfillment.Variables
            >(CREATE_FULFILLMENT, {
                input: {
                    lines: unfulfilledItems.map(l => ({
                        orderLineId: l.id,
                        quantity: l.items.length,
                    })),
                    method: 'Test2',
                    trackingCode: '222',
                },
            });
            fulfillmentGuard.assertSuccess(addFulfillmentToOrder);

            expect(addFulfillmentToOrder.id).toBe('T_2');
            expect(addFulfillmentToOrder.method).toBe('Test2');
            expect(addFulfillmentToOrder.trackingCode).toBe('222');
            expect(addFulfillmentToOrder.state).toBe('Pending');
        });

        it('returns error result if an OrderItem already part of a Fulfillment', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: 'T_2',
            });
            const { addFulfillmentToOrder } = await adminClient.query<
                CreateFulfillment.Mutation,
                CreateFulfillment.Variables
            >(CREATE_FULFILLMENT, {
                input: {
                    method: 'Test',
                    lines: [
                        {
                            orderLineId: order!.lines[0].id,
                            quantity: 1,
                        },
                    ],
                },
            });
            fulfillmentGuard.assertErrorResult(addFulfillmentToOrder);

            expect(addFulfillmentToOrder.message).toBe(
                'One or more OrderItems are already part of a Fulfillment',
            );
            expect(addFulfillmentToOrder.errorCode).toBe(ErrorCode.ITEMS_ALREADY_FULFILLED_ERROR);
        });

        it('transits the first fulfillment from created to Shipped and automatically change the order state to PartiallyShipped', async () => {
            const { transitionFulfillmentToState } = await adminClient.query<
                TransitFulfillment.Mutation,
                TransitFulfillment.Variables
            >(TRANSIT_FULFILLMENT, {
                id: 'T_1',
                state: 'Shipped',
            });
            fulfillmentGuard.assertSuccess(transitionFulfillmentToState);

            expect(transitionFulfillmentToState.id).toBe('T_1');
            expect(transitionFulfillmentToState.state).toBe('Shipped');

            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: 'T_2',
            });
            expect(order?.state).toBe('PartiallyShipped');
        });

        it('transits the second fulfillment from created to Shipped and automatically change the order state to Shipped', async () => {
            const { transitionFulfillmentToState } = await adminClient.query<
                TransitFulfillment.Mutation,
                TransitFulfillment.Variables
            >(TRANSIT_FULFILLMENT, {
                id: 'T_2',
                state: 'Shipped',
            });
            fulfillmentGuard.assertSuccess(transitionFulfillmentToState);

            expect(transitionFulfillmentToState.id).toBe('T_2');
            expect(transitionFulfillmentToState.state).toBe('Shipped');

            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: 'T_2',
            });
            expect(order?.state).toBe('Shipped');
        });

        it('transits the first fulfillment from Shipped to Delivered and change the order state to PartiallyDelivered', async () => {
            const { transitionFulfillmentToState } = await adminClient.query<
                TransitFulfillment.Mutation,
                TransitFulfillment.Variables
            >(TRANSIT_FULFILLMENT, {
                id: 'T_1',
                state: 'Delivered',
            });
            fulfillmentGuard.assertSuccess(transitionFulfillmentToState);

            expect(transitionFulfillmentToState.id).toBe('T_1');
            expect(transitionFulfillmentToState.state).toBe('Delivered');

            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: 'T_2',
            });
            expect(order?.state).toBe('PartiallyDelivered');
        });

        it('transits the second fulfillment from Shipped to Delivered and change the order state to Delivered', async () => {
            const { transitionFulfillmentToState } = await adminClient.query<
                TransitFulfillment.Mutation,
                TransitFulfillment.Variables
            >(TRANSIT_FULFILLMENT, {
                id: 'T_2',
                state: 'Delivered',
            });
            fulfillmentGuard.assertSuccess(transitionFulfillmentToState);

            expect(transitionFulfillmentToState.id).toBe('T_2');
            expect(transitionFulfillmentToState.state).toBe('Delivered');

            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: 'T_2',
            });
            expect(order?.state).toBe('Delivered');
        });

        it('order history contains expected entries', async () => {
            const { order } = await adminClient.query<GetOrderHistory.Query, GetOrderHistory.Variables>(
                GET_ORDER_HISTORY,
                {
                    id: 'T_2',
                    options: {
                        skip: 6,
                    },
                },
            );
            expect(order!.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    data: {
                        fulfillmentId: 'T_1',
                    },
                    type: HistoryEntryType.ORDER_FULFILLMENT,
                },
                {
                    data: {
                        fulfillmentId: 'T_2',
                    },
                    type: HistoryEntryType.ORDER_FULFILLMENT,
                },
                {
                    data: {
                        from: 'Pending',
                        fulfillmentId: 'T_1',
                        to: 'Shipped',
                    },
                    type: HistoryEntryType.ORDER_FULFILLMENT_TRANSITION,
                },
                {
                    data: {
                        from: 'PaymentSettled',
                        to: 'PartiallyShipped',
                    },
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                },
                {
                    data: {
                        from: 'Pending',
                        fulfillmentId: 'T_2',
                        to: 'Shipped',
                    },
                    type: HistoryEntryType.ORDER_FULFILLMENT_TRANSITION,
                },
                {
                    data: {
                        from: 'PartiallyShipped',
                        to: 'Shipped',
                    },
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                },
                {
                    data: {
                        from: 'Shipped',
                        fulfillmentId: 'T_1',
                        to: 'Delivered',
                    },
                    type: HistoryEntryType.ORDER_FULFILLMENT_TRANSITION,
                },
                {
                    data: {
                        from: 'Shipped',
                        to: 'PartiallyDelivered',
                    },
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                },
                {
                    data: {
                        from: 'Shipped',
                        fulfillmentId: 'T_2',
                        to: 'Delivered',
                    },
                    type: HistoryEntryType.ORDER_FULFILLMENT_TRANSITION,
                },
                {
                    data: {
                        from: 'PartiallyDelivered',
                        to: 'Delivered',
                    },
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                },
            ]);
        });

        it('order.fulfillments resolver for single order', async () => {
            const { order } = await adminClient.query<
                GetOrderFulfillments.Query,
                GetOrderFulfillments.Variables
            >(GET_ORDER_FULFILLMENTS, {
                id: 'T_2',
            });

            expect(order!.fulfillments).toEqual([
                { id: 'T_1', method: 'Test1', state: 'Delivered', nextStates: ['Cancelled'] },
                { id: 'T_2', method: 'Test2', state: 'Delivered', nextStates: ['Cancelled'] },
            ]);
        });

        it('order.fulfillments resolver for order list', async () => {
            const { orders } = await adminClient.query<GetOrderListFulfillments.Query>(
                GET_ORDER_LIST_FULFILLMENTS,
            );

            expect(orders.items[0].fulfillments).toEqual([]);
            expect(orders.items[1].fulfillments).toEqual([
                { id: 'T_1', method: 'Test1', state: 'Delivered', nextStates: ['Cancelled'] },
                { id: 'T_2', method: 'Test2', state: 'Delivered', nextStates: ['Cancelled'] },
            ]);
        });

        it('order.fulfillments.orderItems resolver', async () => {
            const { order } = await adminClient.query<
                GetOrderFulfillmentItems.Query,
                GetOrderFulfillmentItems.Variables
            >(GET_ORDER_FULFILLMENT_ITEMS, {
                id: 'T_2',
            });
            expect(order!.fulfillments![0].orderItems).toEqual([{ id: 'T_3' }]);
            expect(order!.fulfillments![1].orderItems).toEqual([{ id: 'T_4' }, { id: 'T_5' }, { id: 'T_6' }]);
        });
    });

    describe('cancellation by orderId', () => {
        it('cancel from AddingItems state', async () => {
            const testOrder = await createTestOrder(
                adminClient,
                shopClient,
                customers[0].emailAddress,
                password,
            );
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: testOrder.orderId,
            });
            expect(order!.state).toBe('AddingItems');
            const { cancelOrder } = await adminClient.query<CancelOrder.Mutation, CancelOrder.Variables>(
                CANCEL_ORDER,
                {
                    input: {
                        orderId: testOrder.orderId,
                    },
                },
            );

            const { order: order2 } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: testOrder.orderId,
            });
            expect(order2!.state).toBe('Cancelled');
            expect(order2!.active).toBe(false);
            await assertNoStockMovementsCreated(testOrder.product.id);
        });

        it('cancel from ArrangingPayment state', async () => {
            const testOrder = await createTestOrder(
                adminClient,
                shopClient,
                customers[0].emailAddress,
                password,
            );
            await proceedToArrangingPayment(shopClient);
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: testOrder.orderId,
            });
            expect(order!.state).toBe('ArrangingPayment');
            await adminClient.query<CancelOrder.Mutation, CancelOrder.Variables>(CANCEL_ORDER, {
                input: {
                    orderId: testOrder.orderId,
                },
            });

            const { order: order2 } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: testOrder.orderId,
            });
            expect(order2!.state).toBe('Cancelled');
            expect(order2!.active).toBe(false);

            await assertNoStockMovementsCreated(testOrder.product.id);
        });

        it('cancel from PaymentAuthorized state', async () => {
            const testOrder = await createTestOrder(
                adminClient,
                shopClient,
                customers[0].emailAddress,
                password,
            );
            await proceedToArrangingPayment(shopClient);
            const order = await addPaymentToOrder(shopClient, failsToSettlePaymentMethod);
            orderGuard.assertSuccess(order);

            expect(order.state).toBe('PaymentAuthorized');

            const result1 = await adminClient.query<GetStockMovement.Query, GetStockMovement.Variables>(
                GET_STOCK_MOVEMENT,
                {
                    id: 'T_3',
                },
            );
            let variant1 = result1.product!.variants[0];
            expect(variant1.stockOnHand).toBe(100);
            expect(variant1.stockAllocated).toBe(2);
            expect(variant1.stockMovements.items.map(pick(['type', 'quantity']))).toEqual([
                { type: StockMovementType.ADJUSTMENT, quantity: 100 },
                { type: StockMovementType.ALLOCATION, quantity: 2 },
            ]);

            const { cancelOrder } = await adminClient.query<CancelOrder.Mutation, CancelOrder.Variables>(
                CANCEL_ORDER,
                {
                    input: {
                        orderId: testOrder.orderId,
                    },
                },
            );
            orderGuard.assertSuccess(cancelOrder);

            expect(
                cancelOrder.lines.map(l =>
                    l.items.map(pick(['id', 'cancelled'])).sort((a, b) => (a.id > b.id ? 1 : -1)),
                ),
            ).toEqual([
                [
                    { id: 'T_11', cancelled: true },
                    { id: 'T_12', cancelled: true },
                ],
            ]);
            const { order: order2 } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: testOrder.orderId,
            });
            expect(order2!.active).toBe(false);
            expect(order2!.state).toBe('Cancelled');

            const result2 = await adminClient.query<GetStockMovement.Query, GetStockMovement.Variables>(
                GET_STOCK_MOVEMENT,
                {
                    id: 'T_3',
                },
            );
            variant1 = result2.product!.variants[0];
            expect(variant1.stockOnHand).toBe(100);
            expect(variant1.stockAllocated).toBe(0);
            expect(variant1.stockMovements.items.map(pick(['type', 'quantity']))).toEqual([
                { type: StockMovementType.ADJUSTMENT, quantity: 100 },
                { type: StockMovementType.ALLOCATION, quantity: 2 },
                { type: StockMovementType.RELEASE, quantity: 1 },
                { type: StockMovementType.RELEASE, quantity: 1 },
            ]);
        });

        async function assertNoStockMovementsCreated(productId: string) {
            const result = await adminClient.query<GetStockMovement.Query, GetStockMovement.Variables>(
                GET_STOCK_MOVEMENT,
                {
                    id: productId,
                },
            );
            const variant2 = result.product!.variants[0];
            expect(variant2.stockOnHand).toBe(100);
            expect(variant2.stockMovements.items.map(pick(['type', 'quantity']))).toEqual([
                { type: StockMovementType.ADJUSTMENT, quantity: 100 },
            ]);
        }
    });

    describe('cancellation by OrderLine', () => {
        let orderId: string;
        let product: GetProductWithVariants.Product;
        let productVariantId: string;

        beforeAll(async () => {
            const result = await createTestOrder(
                adminClient,
                shopClient,
                customers[0].emailAddress,
                password,
            );
            orderId = result.orderId;
            product = result.product;
            productVariantId = result.productVariantId;
        });

        it('cannot cancel from AddingItems state', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            expect(order!.state).toBe('AddingItems');

            const { cancelOrder } = await adminClient.query<CancelOrder.Mutation, CancelOrder.Variables>(
                CANCEL_ORDER,
                {
                    input: {
                        orderId,
                        lines: order!.lines.map(l => ({ orderLineId: l.id, quantity: 1 })),
                    },
                },
            );
            orderGuard.assertErrorResult(cancelOrder);

            expect(cancelOrder.message).toBe(
                'Cannot cancel OrderLines from an Order in the "AddingItems" state',
            );
            expect(cancelOrder.errorCode).toBe(ErrorCode.CANCEL_ACTIVE_ORDER_ERROR);
        });

        it('cannot cancel from ArrangingPayment state', async () => {
            await proceedToArrangingPayment(shopClient);
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            expect(order!.state).toBe('ArrangingPayment');
            const { cancelOrder } = await adminClient.query<CancelOrder.Mutation, CancelOrder.Variables>(
                CANCEL_ORDER,
                {
                    input: {
                        orderId,
                        lines: order!.lines.map(l => ({ orderLineId: l.id, quantity: 1 })),
                    },
                },
            );
            orderGuard.assertErrorResult(cancelOrder);

            expect(cancelOrder.message).toBe(
                'Cannot cancel OrderLines from an Order in the "ArrangingPayment" state',
            );
            expect(cancelOrder.errorCode).toBe(ErrorCode.CANCEL_ACTIVE_ORDER_ERROR);
        });

        it('returns error result if lines are empty', async () => {
            const order = await addPaymentToOrder(shopClient, twoStagePaymentMethod);
            orderGuard.assertSuccess(order);

            expect(order.state).toBe('PaymentAuthorized');

            const { cancelOrder } = await adminClient.query<CancelOrder.Mutation, CancelOrder.Variables>(
                CANCEL_ORDER,
                {
                    input: {
                        orderId,
                        lines: [],
                    },
                },
            );
            orderGuard.assertErrorResult(cancelOrder);

            expect(cancelOrder.message).toBe('At least one OrderLine must be specified');
            expect(cancelOrder.errorCode).toBe(ErrorCode.EMPTY_ORDER_LINE_SELECTION_ERROR);
        });

        it('returns error result if all quantities zero', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { cancelOrder } = await adminClient.query<CancelOrder.Mutation, CancelOrder.Variables>(
                CANCEL_ORDER,
                {
                    input: {
                        orderId,
                        lines: order!.lines.map(l => ({ orderLineId: l.id, quantity: 0 })),
                    },
                },
            );
            orderGuard.assertErrorResult(cancelOrder);

            expect(cancelOrder.message).toBe('At least one OrderLine must be specified');
            expect(cancelOrder.errorCode).toBe(ErrorCode.EMPTY_ORDER_LINE_SELECTION_ERROR);
        });

        it('partial cancellation', async () => {
            const result1 = await adminClient.query<GetStockMovement.Query, GetStockMovement.Variables>(
                GET_STOCK_MOVEMENT,
                {
                    id: product.id,
                },
            );
            const variant1 = result1.product!.variants[0];
            expect(variant1.stockOnHand).toBe(100);
            expect(variant1.stockAllocated).toBe(2);
            expect(variant1.stockMovements.items.map(pick(['type', 'quantity']))).toEqual([
                { type: StockMovementType.ADJUSTMENT, quantity: 100 },
                { type: StockMovementType.ALLOCATION, quantity: 2 },
                { type: StockMovementType.RELEASE, quantity: 1 },
                { type: StockMovementType.RELEASE, quantity: 1 },
                { type: StockMovementType.ALLOCATION, quantity: 2 },
            ]);

            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });

            const { cancelOrder } = await adminClient.query<CancelOrder.Mutation, CancelOrder.Variables>(
                CANCEL_ORDER,
                {
                    input: {
                        orderId,
                        lines: order!.lines.map(l => ({ orderLineId: l.id, quantity: 1 })),
                        reason: 'cancel reason 1',
                    },
                },
            );
            orderGuard.assertSuccess(cancelOrder);

            expect(cancelOrder.lines[0].quantity).toBe(1);
            expect(cancelOrder.lines[0].items.sort((a, b) => (a.id < b.id ? -1 : 1))).toEqual([
                { id: 'T_13', cancelled: true },
                { id: 'T_14', cancelled: false },
            ]);

            const { order: order2 } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });

            expect(order2!.state).toBe('PaymentAuthorized');
            expect(order2!.lines[0].quantity).toBe(1);

            const result2 = await adminClient.query<GetStockMovement.Query, GetStockMovement.Variables>(
                GET_STOCK_MOVEMENT,
                {
                    id: product.id,
                },
            );
            const variant2 = result2.product!.variants[0];
            expect(variant2.stockOnHand).toBe(100);
            expect(variant2.stockAllocated).toBe(1);
            expect(variant2.stockMovements.items.map(pick(['type', 'quantity']))).toEqual([
                { type: StockMovementType.ADJUSTMENT, quantity: 100 },
                { type: StockMovementType.ALLOCATION, quantity: 2 },
                { type: StockMovementType.RELEASE, quantity: 1 },
                { type: StockMovementType.RELEASE, quantity: 1 },
                { type: StockMovementType.ALLOCATION, quantity: 2 },
                { type: StockMovementType.RELEASE, quantity: 1 },
            ]);
        });

        it('returns error result if attempting to cancel already cancelled item', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { cancelOrder } = await adminClient.query<CancelOrder.Mutation, CancelOrder.Variables>(
                CANCEL_ORDER,
                {
                    input: {
                        orderId,
                        lines: order!.lines.map(l => ({ orderLineId: l.id, quantity: 2 })),
                    },
                },
            );
            orderGuard.assertErrorResult(cancelOrder);

            expect(cancelOrder.message).toBe(
                'The specified quantity is greater than the available OrderItems',
            );
            expect(cancelOrder.errorCode).toBe(ErrorCode.QUANTITY_TOO_GREAT_ERROR);
        });

        it('complete cancellation', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            await adminClient.query<CancelOrder.Mutation, CancelOrder.Variables>(CANCEL_ORDER, {
                input: {
                    orderId,
                    lines: order!.lines.map(l => ({ orderLineId: l.id, quantity: 1 })),
                    reason: 'cancel reason 2',
                },
            });

            const { order: order2 } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            expect(order2!.state).toBe('Cancelled');

            const result = await adminClient.query<GetStockMovement.Query, GetStockMovement.Variables>(
                GET_STOCK_MOVEMENT,
                {
                    id: product.id,
                },
            );
            const variant2 = result.product!.variants[0];
            expect(variant2.stockOnHand).toBe(100);
            expect(variant2.stockAllocated).toBe(0);
            expect(variant2.stockMovements.items.map(pick(['type', 'quantity']))).toEqual([
                { type: StockMovementType.ADJUSTMENT, quantity: 100 },
                { type: StockMovementType.ALLOCATION, quantity: 2 },
                { type: StockMovementType.RELEASE, quantity: 1 },
                { type: StockMovementType.RELEASE, quantity: 1 },
                { type: StockMovementType.ALLOCATION, quantity: 2 },
                { type: StockMovementType.RELEASE, quantity: 1 },
                { type: StockMovementType.RELEASE, quantity: 1 },
            ]);
        });

        it('order history contains expected entries', async () => {
            const { order } = await adminClient.query<GetOrderHistory.Query, GetOrderHistory.Variables>(
                GET_ORDER_HISTORY,
                {
                    id: orderId,
                    options: {
                        skip: 0,
                    },
                },
            );
            expect(order!.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                    data: {
                        from: 'Created',
                        to: 'AddingItems',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                    data: {
                        from: 'AddingItems',
                        to: 'ArrangingPayment',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_PAYMENT_TRANSITION,
                    data: {
                        paymentId: 'T_4',
                        from: 'Created',
                        to: 'Authorized',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                    data: {
                        from: 'ArrangingPayment',
                        to: 'PaymentAuthorized',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_CANCELLATION,
                    data: {
                        orderItemIds: ['T_13'],
                        reason: 'cancel reason 1',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_CANCELLATION,
                    data: {
                        orderItemIds: ['T_14'],
                        reason: 'cancel reason 2',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                    data: {
                        from: 'PaymentAuthorized',
                        to: 'Cancelled',
                    },
                },
            ]);
        });
    });

    describe('refunds', () => {
        let orderId: string;
        let product: GetProductWithVariants.Product;
        let productVariantId: string;
        let paymentId: string;
        let refundId: string;

        beforeAll(async () => {
            const result = await createTestOrder(
                adminClient,
                shopClient,
                customers[0].emailAddress,
                password,
            );
            orderId = result.orderId;
            product = result.product;
            productVariantId = result.productVariantId;
        });

        it('cannot refund from PaymentAuthorized state', async () => {
            await proceedToArrangingPayment(shopClient);
            const order = await addPaymentToOrder(shopClient, twoStagePaymentMethod);
            orderGuard.assertSuccess(order);

            expect(order.state).toBe('PaymentAuthorized');
            paymentId = order.payments![0].id;

            const { refundOrder } = await adminClient.query<RefundOrder.Mutation, RefundOrder.Variables>(
                REFUND_ORDER,
                {
                    input: {
                        lines: order.lines.map(l => ({ orderLineId: l.id, quantity: 1 })),
                        shipping: 0,
                        adjustment: 0,
                        paymentId,
                    },
                },
            );
            refundGuard.assertErrorResult(refundOrder);

            expect(refundOrder.message).toBe('Cannot refund an Order in the "PaymentAuthorized" state');
            expect(refundOrder.errorCode).toBe(ErrorCode.REFUND_ORDER_STATE_ERROR);
        });

        it('returns error result if no lines and no shipping', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { settlePayment } = await adminClient.query<
                SettlePayment.Mutation,
                SettlePayment.Variables
            >(SETTLE_PAYMENT, {
                id: order!.payments![0].id,
            });
            paymentGuard.assertSuccess(settlePayment);

            expect(settlePayment!.state).toBe('Settled');

            const { refundOrder } = await adminClient.query<RefundOrder.Mutation, RefundOrder.Variables>(
                REFUND_ORDER,
                {
                    input: {
                        lines: order!.lines.map(l => ({ orderLineId: l.id, quantity: 0 })),
                        shipping: 0,
                        adjustment: 0,
                        paymentId,
                    },
                },
            );
            refundGuard.assertErrorResult(refundOrder);

            expect(refundOrder.message).toBe('Nothing to refund');
            expect(refundOrder.errorCode).toBe(ErrorCode.NOTHING_TO_REFUND_ERROR);
        });

        it(
            'throws if paymentId not valid',
            assertThrowsWithMessage(async () => {
                const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                    id: orderId,
                });
                const { refundOrder } = await adminClient.query<RefundOrder.Mutation, RefundOrder.Variables>(
                    REFUND_ORDER,
                    {
                        input: {
                            lines: [],
                            shipping: 100,
                            adjustment: 0,
                            paymentId: 'T_999',
                        },
                    },
                );
            }, `No Payment with the id '999' could be found`),
        );

        it('returns error result if payment and order lines do not belong to the same Order', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { refundOrder } = await adminClient.query<RefundOrder.Mutation, RefundOrder.Variables>(
                REFUND_ORDER,
                {
                    input: {
                        lines: order!.lines.map(l => ({ orderLineId: l.id, quantity: l.quantity })),
                        shipping: 100,
                        adjustment: 0,
                        paymentId: 'T_1',
                    },
                },
            );
            refundGuard.assertErrorResult(refundOrder);

            expect(refundOrder.message).toBe('The Payment and OrderLines do not belong to the same Order');
            expect(refundOrder.errorCode).toBe(ErrorCode.PAYMENT_ORDER_MISMATCH_ERROR);
        });

        it('creates a Refund to be manually settled', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { refundOrder } = await adminClient.query<RefundOrder.Mutation, RefundOrder.Variables>(
                REFUND_ORDER,
                {
                    input: {
                        lines: order!.lines.map(l => ({ orderLineId: l.id, quantity: l.quantity })),
                        shipping: order!.shipping,
                        adjustment: 0,
                        reason: 'foo',
                        paymentId,
                    },
                },
            );
            refundGuard.assertSuccess(refundOrder);

            expect(refundOrder.shipping).toBe(order!.shipping);
            expect(refundOrder.items).toBe(order!.subTotal);
            expect(refundOrder.total).toBe(order!.total);
            expect(refundOrder.transactionId).toBe(null);
            expect(refundOrder.state).toBe('Pending');
            refundId = refundOrder.id;
        });

        it('returns error result if attempting to refund the same item more than once', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { refundOrder } = await adminClient.query<RefundOrder.Mutation, RefundOrder.Variables>(
                REFUND_ORDER,
                {
                    input: {
                        lines: order!.lines.map(l => ({ orderLineId: l.id, quantity: l.quantity })),
                        shipping: order!.shipping,
                        adjustment: 0,
                        paymentId,
                    },
                },
            );
            refundGuard.assertErrorResult(refundOrder);

            expect(refundOrder.message).toBe('Cannot refund an OrderItem which has already been refunded');
            expect(refundOrder.errorCode).toBe(ErrorCode.ALREADY_REFUNDED_ERROR);
        });

        it('manually settle a Refund', async () => {
            const { settleRefund } = await adminClient.query<SettleRefund.Mutation, SettleRefund.Variables>(
                SETTLE_REFUND,
                {
                    input: {
                        id: refundId,
                        transactionId: 'aaabbb',
                    },
                },
            );
            refundGuard.assertSuccess(settleRefund);

            expect(settleRefund.state).toBe('Settled');
            expect(settleRefund.transactionId).toBe('aaabbb');
        });

        it('order history contains expected entries', async () => {
            const { order } = await adminClient.query<GetOrderHistory.Query, GetOrderHistory.Variables>(
                GET_ORDER_HISTORY,
                {
                    id: orderId,
                    options: {
                        skip: 0,
                    },
                },
            );
            expect(order!.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                    data: {
                        from: 'Created',
                        to: 'AddingItems',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                    data: {
                        from: 'AddingItems',
                        to: 'ArrangingPayment',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_PAYMENT_TRANSITION,
                    data: {
                        paymentId: 'T_5',
                        from: 'Created',
                        to: 'Authorized',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                    data: {
                        from: 'ArrangingPayment',
                        to: 'PaymentAuthorized',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_PAYMENT_TRANSITION,
                    data: {
                        paymentId: 'T_5',
                        from: 'Authorized',
                        to: 'Settled',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                    data: {
                        from: 'PaymentAuthorized',
                        to: 'PaymentSettled',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_REFUND_TRANSITION,
                    data: {
                        refundId: 'T_1',
                        reason: 'foo',
                        from: 'Pending',
                        to: 'Settled',
                    },
                },
            ]);
        });
    });

    describe('order notes', () => {
        let orderId: string;
        let firstNoteId: string;

        beforeAll(async () => {
            const result = await createTestOrder(
                adminClient,
                shopClient,
                customers[2].emailAddress,
                password,
            );

            orderId = result.orderId;
        });

        it('private note', async () => {
            const { addNoteToOrder } = await adminClient.query<
                AddNoteToOrder.Mutation,
                AddNoteToOrder.Variables
            >(ADD_NOTE_TO_ORDER, {
                input: {
                    id: orderId,
                    note: 'A private note',
                    isPublic: false,
                },
            });

            expect(addNoteToOrder.id).toBe(orderId);

            const { order } = await adminClient.query<GetOrderHistory.Query, GetOrderHistory.Variables>(
                GET_ORDER_HISTORY,
                {
                    id: orderId,
                    options: {
                        skip: 1,
                    },
                },
            );

            expect(order!.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    type: HistoryEntryType.ORDER_NOTE,
                    data: {
                        note: 'A private note',
                    },
                },
            ]);

            firstNoteId = order!.history.items[0].id;

            const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);

            expect(activeOrder!.history.items.map(pick(['type']))).toEqual([
                { type: HistoryEntryType.ORDER_STATE_TRANSITION },
            ]);
        });

        it('public note', async () => {
            const { addNoteToOrder } = await adminClient.query<
                AddNoteToOrder.Mutation,
                AddNoteToOrder.Variables
            >(ADD_NOTE_TO_ORDER, {
                input: {
                    id: orderId,
                    note: 'A public note',
                    isPublic: true,
                },
            });

            expect(addNoteToOrder.id).toBe(orderId);

            const { order } = await adminClient.query<GetOrderHistory.Query, GetOrderHistory.Variables>(
                GET_ORDER_HISTORY,
                {
                    id: orderId,
                    options: {
                        skip: 2,
                    },
                },
            );

            expect(order!.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    type: HistoryEntryType.ORDER_NOTE,
                    data: {
                        note: 'A public note',
                    },
                },
            ]);

            const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);

            expect(activeOrder!.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                    data: {
                        from: 'Created',
                        to: 'AddingItems',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_NOTE,
                    data: {
                        note: 'A public note',
                    },
                },
            ]);
        });

        it('update note', async () => {
            const { updateOrderNote } = await adminClient.query<
                UpdateOrderNote.Mutation,
                UpdateOrderNote.Variables
            >(UPDATE_ORDER_NOTE, {
                input: {
                    noteId: firstNoteId,
                    note: 'An updated note',
                },
            });

            expect(updateOrderNote.data).toEqual({
                note: 'An updated note',
            });
        });

        it('delete note', async () => {
            const { order: before } = await adminClient.query<
                GetOrderHistory.Query,
                GetOrderHistory.Variables
            >(GET_ORDER_HISTORY, { id: orderId });
            expect(before?.history.totalItems).toBe(3);

            const { deleteOrderNote } = await adminClient.query<
                DeleteOrderNote.Mutation,
                DeleteOrderNote.Variables
            >(DELETE_ORDER_NOTE, {
                id: firstNoteId,
            });

            expect(deleteOrderNote.result).toBe(DeletionResult.DELETED);

            const { order: after } = await adminClient.query<
                GetOrderHistory.Query,
                GetOrderHistory.Variables
            >(GET_ORDER_HISTORY, { id: orderId });
            expect(after?.history.totalItems).toBe(2);
        });
    });
});

async function createTestOrder(
    adminClient: SimpleGraphQLClient,
    shopClient: SimpleGraphQLClient,
    emailAddress: string,
    password: string,
): Promise<{
    orderId: string;
    product: GetProductWithVariants.Product;
    productVariantId: string;
}> {
    const result = await adminClient.query<GetProductWithVariants.Query, GetProductWithVariants.Variables>(
        GET_PRODUCT_WITH_VARIANTS,
        {
            id: 'T_3',
        },
    );
    const product = result.product!;
    const productVariantId = product.variants[0].id;

    // Set the ProductVariant to trackInventory
    const { updateProductVariants } = await adminClient.query<
        UpdateProductVariants.Mutation,
        UpdateProductVariants.Variables
    >(UPDATE_PRODUCT_VARIANTS, {
        input: [
            {
                id: productVariantId,
                trackInventory: GlobalFlag.TRUE,
            },
        ],
    });

    // Add the ProductVariant to the Order
    await shopClient.asUserWithCredentials(emailAddress, password);
    const { addItemToOrder } = await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(
        ADD_ITEM_TO_ORDER,
        {
            productVariantId,
            quantity: 2,
        },
    );
    const orderId = (addItemToOrder as UpdatedOrder.Fragment).id;
    return { product, productVariantId, orderId };
}

export const SETTLE_PAYMENT = gql`
    mutation SettlePayment($id: ID!) {
        settlePayment(id: $id) {
            ...Payment
            ... on ErrorResult {
                errorCode
                message
            }
            ... on SettlePaymentError {
                paymentErrorMessage
            }
        }
    }
    fragment Payment on Payment {
        id
        state
        metadata
    }
`;

export const GET_ORDER_LIST_FULFILLMENTS = gql`
    query GetOrderListFulfillments {
        orders {
            items {
                id
                state
                fulfillments {
                    id
                    state
                    nextStates
                    method
                }
            }
        }
    }
`;

export const GET_ORDER_FULFILLMENT_ITEMS = gql`
    query GetOrderFulfillmentItems($id: ID!) {
        order(id: $id) {
            id
            state
            fulfillments {
                ...Fulfillment
            }
        }
    }
    ${FULFILLMENT_FRAGMENT}
`;

const REFUND_FRAGMENT = gql`
    fragment Refund on Refund {
        id
        state
        items
        transactionId
        shipping
        total
        metadata
    }
`;

export const REFUND_ORDER = gql`
    mutation RefundOrder($input: RefundOrderInput!) {
        refundOrder(input: $input) {
            ...Refund
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${REFUND_FRAGMENT}
`;

export const SETTLE_REFUND = gql`
    mutation SettleRefund($input: SettleRefundInput!) {
        settleRefund(input: $input) {
            ...Refund
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${REFUND_FRAGMENT}
`;

export const GET_ORDER_HISTORY = gql`
    query GetOrderHistory($id: ID!, $options: HistoryEntryListOptions) {
        order(id: $id) {
            id
            history(options: $options) {
                totalItems
                items {
                    id
                    type
                    administrator {
                        id
                    }
                    data
                }
            }
        }
    }
`;

export const ADD_NOTE_TO_ORDER = gql`
    mutation AddNoteToOrder($input: AddNoteToOrderInput!) {
        addNoteToOrder(input: $input) {
            id
        }
    }
`;

export const UPDATE_ORDER_NOTE = gql`
    mutation UpdateOrderNote($input: UpdateOrderNoteInput!) {
        updateOrderNote(input: $input) {
            id
            data
            isPublic
        }
    }
`;

export const DELETE_ORDER_NOTE = gql`
    mutation DeleteOrderNote($id: ID!) {
        deleteOrderNote(id: $id) {
            result
            message
        }
    }
`;

const GET_ORDER_WITH_PAYMENTS = gql`
    query GetOrderWithPayments($id: ID!) {
        order(id: $id) {
            id
            payments {
                id
                errorMessage
                metadata
            }
        }
    }
`;
