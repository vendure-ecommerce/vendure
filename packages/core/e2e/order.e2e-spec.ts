/* tslint:disable:no-non-null-assertion */
import { omit } from '@vendure/common/lib/omit';
import { pick } from '@vendure/common/lib/pick';
import {
    defaultShippingCalculator,
    defaultShippingEligibilityChecker,
    manualFulfillmentHandler,
    mergeConfig,
} from '@vendure/core';
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
    partialPaymentMethod,
    singleStageRefundablePaymentMethod,
    twoStagePaymentMethod,
} from './fixtures/test-payment-methods';
import { FULFILLMENT_FRAGMENT } from './graphql/fragments';
import {
    AddNoteToOrder,
    CanceledOrderFragment,
    CancelOrder,
    CreateFulfillment,
    CreateShippingMethod,
    DeleteOrderNote,
    DeleteShippingMethod,
    ErrorCode,
    FulfillmentFragment,
    GetCustomerList,
    GetOrder,
    GetOrderFulfillmentItems,
    GetOrderFulfillments,
    GetOrderHistory,
    GetOrderList,
    GetOrderListFulfillments,
    GetOrderListWithQty,
    GetOrderWithPayments,
    GetProductWithVariants,
    GetStockMovement,
    GlobalFlag,
    HistoryEntryType,
    LanguageCode,
    OrderLineInput,
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
    AddPaymentToOrder,
    ApplyCouponCode,
    DeletionResult,
    GetActiveOrder,
    GetOrderByCodeWithPayments,
    SetShippingAddress,
    SetShippingMethod,
    TestOrderFragmentFragment,
    UpdatedOrder,
    UpdatedOrderFragment,
} from './graphql/generated-e2e-shop-types';
import {
    CANCEL_ORDER,
    CREATE_FULFILLMENT,
    CREATE_SHIPPING_METHOD,
    DELETE_SHIPPING_METHOD,
    GET_CUSTOMER_LIST,
    GET_ORDER,
    GET_ORDERS_LIST,
    GET_ORDER_FULFILLMENTS,
    GET_ORDER_HISTORY,
    GET_PRODUCT_WITH_VARIANTS,
    GET_STOCK_MOVEMENT,
    SETTLE_PAYMENT,
    TRANSIT_FULFILLMENT,
    UPDATE_PRODUCT_VARIANTS,
} from './graphql/shared-definitions';
import {
    ADD_ITEM_TO_ORDER,
    ADD_PAYMENT,
    APPLY_COUPON_CODE,
    GET_ACTIVE_ORDER,
    GET_ORDER_BY_CODE_WITH_PAYMENTS,
    SET_SHIPPING_ADDRESS,
    SET_SHIPPING_METHOD,
} from './graphql/shop-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';
import { addPaymentToOrder, proceedToArrangingPayment, sortById } from './utils/test-order-utils';

describe('Orders resolver', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            paymentOptions: {
                paymentMethodHandlers: [
                    twoStagePaymentMethod,
                    failsToSettlePaymentMethod,
                    singleStageRefundablePaymentMethod,
                    partialPaymentMethod,
                ],
            },
        }),
    );
    let customers: GetCustomerList.Items[];
    const password = 'test';

    const orderGuard: ErrorResultGuard<
        TestOrderFragmentFragment | CanceledOrderFragment | UpdatedOrderFragment
    > = createErrorResultGuard(input => !!input.lines);
    const paymentGuard: ErrorResultGuard<PaymentFragment> = createErrorResultGuard(input => !!input.state);
    const fulfillmentGuard: ErrorResultGuard<FulfillmentFragment> = createErrorResultGuard(
        input => !!input.method,
    );
    const refundGuard: ErrorResultGuard<RefundFragment> = createErrorResultGuard(input => !!input.items);

    beforeAll(async () => {
        await server.init({
            initialData: {
                ...initialData,
                paymentMethods: [
                    {
                        name: twoStagePaymentMethod.code,
                        handler: { code: twoStagePaymentMethod.code, arguments: [] },
                    },
                    {
                        name: failsToSettlePaymentMethod.code,
                        handler: { code: failsToSettlePaymentMethod.code, arguments: [] },
                    },
                    {
                        name: singleStageRefundablePaymentMethod.code,
                        handler: { code: singleStageRefundablePaymentMethod.code, arguments: [] },
                    },
                    {
                        name: partialPaymentMethod.code,
                        handler: { code: partialPaymentMethod.code, arguments: [] },
                    },
                ],
            },
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

    describe('querying', () => {
        it('orders', async () => {
            const result = await adminClient.query<GetOrderList.Query>(GET_ORDERS_LIST);
            expect(result.orders.items.map(o => o.id).sort()).toEqual(['T_1', 'T_2']);
        });

        it('order', async () => {
            const result = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: 'T_2',
            });
            expect(result.order!.id).toBe('T_2');
        });

        it('sort by total', async () => {
            const result = await adminClient.query<GetOrderList.Query, GetOrderList.Variables>(
                GET_ORDERS_LIST,
                {
                    options: {
                        sort: {
                            total: SortOrder.DESC,
                        },
                        take: 10,
                    },
                },
            );
            expect(result.orders.items.map(o => pick(o, ['id', 'total']))).toEqual([
                { id: 'T_2', total: 799600 },
                { id: 'T_1', total: 269800 },
            ]);
        });

        it('sort by totalWithTax', async () => {
            const result = await adminClient.query<GetOrderList.Query, GetOrderList.Variables>(
                GET_ORDERS_LIST,
                {
                    options: {
                        sort: {
                            totalWithTax: SortOrder.DESC,
                        },
                        take: 10,
                    },
                },
            );
            expect(result.orders.items.map(o => pick(o, ['id', 'totalWithTax']))).toEqual([
                { id: 'T_2', totalWithTax: 959520 },
                { id: 'T_1', totalWithTax: 323760 },
            ]);
        });

        it('sort by totalQuantity', async () => {
            const result = await adminClient.query<GetOrderList.Query, GetOrderList.Variables>(
                GET_ORDERS_LIST,
                {
                    options: {
                        sort: {
                            totalQuantity: SortOrder.DESC,
                        },
                        take: 10,
                    },
                },
            );
            expect(result.orders.items.map(o => pick(o, ['id', 'totalQuantity']))).toEqual([
                { id: 'T_2', totalQuantity: 4 },
                { id: 'T_1', totalQuantity: 2 },
            ]);
        });

        it('sort by customerLastName', async () => {
            async function sortOrdersByLastName(sortOrder: SortOrder) {
                const { orders } = await adminClient.query<GetOrderList.Query, GetOrderList.Variables>(
                    GET_ORDERS_LIST,
                    {
                        options: {
                            sort: {
                                customerLastName: sortOrder,
                            },
                        },
                    },
                );
                return orders;
            }

            const result1 = await sortOrdersByLastName(SortOrder.ASC);
            expect(result1.totalItems).toEqual(2);
            expect(result1.items.map(order => order.customer?.lastName)).toEqual(['Donnelly', 'Zieme']);

            const result2 = await sortOrdersByLastName(SortOrder.DESC);
            expect(result2.totalItems).toEqual(2);
            expect(result2.items.map(order => order.customer?.lastName)).toEqual(['Zieme', 'Donnelly']);
        });

        it('filter by total', async () => {
            const result = await adminClient.query<GetOrderList.Query, GetOrderList.Variables>(
                GET_ORDERS_LIST,
                {
                    options: {
                        filter: {
                            total: { gt: 323760 },
                        },
                        take: 10,
                    },
                },
            );
            expect(result.orders.items.map(o => pick(o, ['id', 'total']))).toEqual([
                { id: 'T_2', total: 799600 },
            ]);
        });

        it('filter by totalWithTax', async () => {
            const result = await adminClient.query<GetOrderList.Query, GetOrderList.Variables>(
                GET_ORDERS_LIST,
                {
                    options: {
                        filter: {
                            totalWithTax: { gt: 323760 },
                        },
                        take: 10,
                    },
                },
            );
            expect(result.orders.items.map(o => pick(o, ['id', 'totalWithTax']))).toEqual([
                { id: 'T_2', totalWithTax: 959520 },
            ]);
        });

        it('filter by totalQuantity', async () => {
            const result = await adminClient.query<GetOrderList.Query, GetOrderList.Variables>(
                GET_ORDERS_LIST,
                {
                    options: {
                        filter: {
                            totalQuantity: { eq: 4 },
                        },
                    },
                },
            );
            expect(result.orders.items.map(o => pick(o, ['id', 'totalQuantity']))).toEqual([
                { id: 'T_2', totalQuantity: 4 },
            ]);
        });

        it('filter by customerLastName', async () => {
            const result = await adminClient.query<GetOrderList.Query, GetOrderList.Variables>(
                GET_ORDERS_LIST,
                {
                    options: {
                        filter: {
                            customerLastName: {
                                eq: customers[1].lastName,
                            },
                        },
                    },
                },
            );
            expect(result.orders.totalItems).toEqual(1);
            expect(result.orders.items[0].customer?.lastName).toEqual(customers[1].lastName);
        });
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
            expect(result.order!.payments![0].state).toBe('Cancelled');
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
        const orderId = 'T_2';
        let f1Id: string;
        let f2Id: string;
        let f3Id: string;

        it('return error result if lines is empty', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            expect(order!.state).toBe('PaymentSettled');
            const { addFulfillmentToOrder } = await adminClient.query<
                CreateFulfillment.Mutation,
                CreateFulfillment.Variables
            >(CREATE_FULFILLMENT, {
                input: {
                    lines: [],
                    handler: {
                        code: manualFulfillmentHandler.code,
                        arguments: [{ name: 'method', value: 'Test' }],
                    },
                },
            });
            fulfillmentGuard.assertErrorResult(addFulfillmentToOrder);

            expect(addFulfillmentToOrder.message).toBe('At least one OrderLine must be specified');
            expect(addFulfillmentToOrder.errorCode).toBe(ErrorCode.EMPTY_ORDER_LINE_SELECTION_ERROR);
        });

        it('returns error result if all quantities are zero', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            expect(order!.state).toBe('PaymentSettled');
            const { addFulfillmentToOrder } = await adminClient.query<
                CreateFulfillment.Mutation,
                CreateFulfillment.Variables
            >(CREATE_FULFILLMENT, {
                input: {
                    lines: order!.lines.map(l => ({ orderLineId: l.id, quantity: 0 })),
                    handler: {
                        code: manualFulfillmentHandler.code,
                        arguments: [{ name: 'method', value: 'Test' }],
                    },
                },
            });
            fulfillmentGuard.assertErrorResult(addFulfillmentToOrder);

            expect(addFulfillmentToOrder.message).toBe('At least one OrderLine must be specified');
            expect(addFulfillmentToOrder.errorCode).toBe(ErrorCode.EMPTY_ORDER_LINE_SELECTION_ERROR);
        });

        it('creates the first fulfillment', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            expect(order!.state).toBe('PaymentSettled');
            const lines = order!.lines;

            const { addFulfillmentToOrder } = await adminClient.query<
                CreateFulfillment.Mutation,
                CreateFulfillment.Variables
            >(CREATE_FULFILLMENT, {
                input: {
                    lines: [{ orderLineId: lines[0].id, quantity: lines[0].quantity }],
                    handler: {
                        code: manualFulfillmentHandler.code,
                        arguments: [
                            { name: 'method', value: 'Test1' },
                            { name: 'trackingCode', value: '111' },
                        ],
                    },
                },
            });
            fulfillmentGuard.assertSuccess(addFulfillmentToOrder);

            expect(addFulfillmentToOrder.id).toBe('T_1');
            expect(addFulfillmentToOrder.method).toBe('Test1');
            expect(addFulfillmentToOrder.trackingCode).toBe('111');
            expect(addFulfillmentToOrder.state).toBe('Pending');
            expect(addFulfillmentToOrder.orderItems).toEqual([{ id: lines[0].items[0].id }]);
            f1Id = addFulfillmentToOrder.id;

            const result = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
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
            const lines = await getUnfulfilledOrderLineInput(adminClient, orderId);

            const { addFulfillmentToOrder } = await adminClient.query<
                CreateFulfillment.Mutation,
                CreateFulfillment.Variables
            >(CREATE_FULFILLMENT, {
                input: {
                    lines,
                    handler: {
                        code: manualFulfillmentHandler.code,
                        arguments: [
                            { name: 'method', value: 'Test2' },
                            { name: 'trackingCode', value: '222' },
                        ],
                    },
                },
            });
            fulfillmentGuard.assertSuccess(addFulfillmentToOrder);

            expect(addFulfillmentToOrder.id).toBe('T_2');
            expect(addFulfillmentToOrder.method).toBe('Test2');
            expect(addFulfillmentToOrder.trackingCode).toBe('222');
            expect(addFulfillmentToOrder.state).toBe('Pending');
            f2Id = addFulfillmentToOrder.id;
        });

        it('cancels second fulfillment', async () => {
            const { transitionFulfillmentToState } = await adminClient.query<
                TransitFulfillment.Mutation,
                TransitFulfillment.Variables
            >(TRANSIT_FULFILLMENT, {
                id: f2Id,
                state: 'Cancelled',
            });
            fulfillmentGuard.assertSuccess(transitionFulfillmentToState);

            expect(transitionFulfillmentToState.id).toBe('T_2');
            expect(transitionFulfillmentToState.state).toBe('Cancelled');
        });

        it('order.fulfillments still lists second (cancelled) fulfillment', async () => {
            const { order } = await adminClient.query<
                GetOrderFulfillments.Query,
                GetOrderFulfillments.Variables
            >(GET_ORDER_FULFILLMENTS, {
                id: orderId,
            });

            expect(order?.fulfillments?.map(pick(['id', 'state']))).toEqual([
                { id: f1Id, state: 'Pending' },
                { id: f2Id, state: 'Cancelled' },
            ]);
        });

        it('creates third fulfillment with same items from second fulfillment', async () => {
            const lines = await getUnfulfilledOrderLineInput(adminClient, orderId);
            const { addFulfillmentToOrder } = await adminClient.query<
                CreateFulfillment.Mutation,
                CreateFulfillment.Variables
            >(CREATE_FULFILLMENT, {
                input: {
                    lines,
                    handler: {
                        code: manualFulfillmentHandler.code,
                        arguments: [
                            { name: 'method', value: 'Test3' },
                            { name: 'trackingCode', value: '333' },
                        ],
                    },
                },
            });
            fulfillmentGuard.assertSuccess(addFulfillmentToOrder);

            expect(addFulfillmentToOrder.id).toBe('T_3');
            expect(addFulfillmentToOrder.method).toBe('Test3');
            expect(addFulfillmentToOrder.trackingCode).toBe('333');
            expect(addFulfillmentToOrder.state).toBe('Pending');
            f3Id = addFulfillmentToOrder.id;
        });

        it('returns error result if an OrderItem already part of a Fulfillment', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { addFulfillmentToOrder } = await adminClient.query<
                CreateFulfillment.Mutation,
                CreateFulfillment.Variables
            >(CREATE_FULFILLMENT, {
                input: {
                    lines: [
                        {
                            orderLineId: order!.lines[0].id,
                            quantity: 1,
                        },
                    ],
                    handler: {
                        code: manualFulfillmentHandler.code,
                        arguments: [{ name: 'method', value: 'Test' }],
                    },
                },
            });
            fulfillmentGuard.assertErrorResult(addFulfillmentToOrder);

            expect(addFulfillmentToOrder.message).toBe(
                'One or more OrderItems are already part of a Fulfillment',
            );
            expect(addFulfillmentToOrder.errorCode).toBe(ErrorCode.ITEMS_ALREADY_FULFILLED_ERROR);
        });

        it('transitions the first fulfillment from created to Shipped and automatically change the order state to PartiallyShipped', async () => {
            const { transitionFulfillmentToState } = await adminClient.query<
                TransitFulfillment.Mutation,
                TransitFulfillment.Variables
            >(TRANSIT_FULFILLMENT, {
                id: f1Id,
                state: 'Shipped',
            });
            fulfillmentGuard.assertSuccess(transitionFulfillmentToState);

            expect(transitionFulfillmentToState.id).toBe(f1Id);
            expect(transitionFulfillmentToState.state).toBe('Shipped');

            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            expect(order?.state).toBe('PartiallyShipped');
        });

        it('transitions the third fulfillment from created to Shipped and automatically change the order state to Shipped', async () => {
            const { transitionFulfillmentToState } = await adminClient.query<
                TransitFulfillment.Mutation,
                TransitFulfillment.Variables
            >(TRANSIT_FULFILLMENT, {
                id: f3Id,
                state: 'Shipped',
            });
            fulfillmentGuard.assertSuccess(transitionFulfillmentToState);

            expect(transitionFulfillmentToState.id).toBe(f3Id);
            expect(transitionFulfillmentToState.state).toBe('Shipped');

            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            expect(order?.state).toBe('Shipped');
        });

        it('transitions the first fulfillment from Shipped to Delivered and change the order state to PartiallyDelivered', async () => {
            const { transitionFulfillmentToState } = await adminClient.query<
                TransitFulfillment.Mutation,
                TransitFulfillment.Variables
            >(TRANSIT_FULFILLMENT, {
                id: f1Id,
                state: 'Delivered',
            });
            fulfillmentGuard.assertSuccess(transitionFulfillmentToState);

            expect(transitionFulfillmentToState.id).toBe(f1Id);
            expect(transitionFulfillmentToState.state).toBe('Delivered');

            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            expect(order?.state).toBe('PartiallyDelivered');
        });

        it('transitions the third fulfillment from Shipped to Delivered and change the order state to Delivered', async () => {
            const { transitionFulfillmentToState } = await adminClient.query<
                TransitFulfillment.Mutation,
                TransitFulfillment.Variables
            >(TRANSIT_FULFILLMENT, {
                id: f3Id,
                state: 'Delivered',
            });
            fulfillmentGuard.assertSuccess(transitionFulfillmentToState);

            expect(transitionFulfillmentToState.id).toBe(f3Id);
            expect(transitionFulfillmentToState.state).toBe('Delivered');

            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            expect(order?.state).toBe('Delivered');
        });

        it('order history contains expected entries', async () => {
            const { order } = await adminClient.query<GetOrderHistory.Query, GetOrderHistory.Variables>(
                GET_ORDER_HISTORY,
                {
                    id: orderId,
                    options: {
                        skip: 6,
                    },
                },
            );
            expect(order!.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    data: {
                        fulfillmentId: f1Id,
                    },
                    type: HistoryEntryType.ORDER_FULFILLMENT,
                },
                {
                    data: {
                        from: 'Created',
                        fulfillmentId: f1Id,
                        to: 'Pending',
                    },
                    type: HistoryEntryType.ORDER_FULFILLMENT_TRANSITION,
                },
                {
                    data: {
                        fulfillmentId: f2Id,
                    },
                    type: HistoryEntryType.ORDER_FULFILLMENT,
                },
                {
                    data: {
                        from: 'Created',
                        fulfillmentId: f2Id,
                        to: 'Pending',
                    },
                    type: HistoryEntryType.ORDER_FULFILLMENT_TRANSITION,
                },
                {
                    data: {
                        from: 'Pending',
                        fulfillmentId: f2Id,
                        to: 'Cancelled',
                    },
                    type: HistoryEntryType.ORDER_FULFILLMENT_TRANSITION,
                },
                {
                    data: {
                        fulfillmentId: f3Id,
                    },
                    type: HistoryEntryType.ORDER_FULFILLMENT,
                },
                {
                    data: {
                        from: 'Created',
                        fulfillmentId: f3Id,
                        to: 'Pending',
                    },
                    type: HistoryEntryType.ORDER_FULFILLMENT_TRANSITION,
                },
                {
                    data: {
                        from: 'Pending',
                        fulfillmentId: f1Id,
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
                        fulfillmentId: f3Id,
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
                        fulfillmentId: f1Id,
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
                        fulfillmentId: f3Id,
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
                id: orderId,
            });

            expect(order!.fulfillments?.sort(sortById)).toEqual([
                { id: f1Id, method: 'Test1', state: 'Delivered', nextStates: ['Cancelled'] },
                { id: f2Id, method: 'Test2', state: 'Cancelled', nextStates: [] },
                { id: f3Id, method: 'Test3', state: 'Delivered', nextStates: ['Cancelled'] },
            ]);
        });

        it('order.fulfillments resolver for order list', async () => {
            const { orders } = await adminClient.query<GetOrderListFulfillments.Query>(
                GET_ORDER_LIST_FULFILLMENTS,
            );

            expect(orders.items[0].fulfillments).toEqual([]);
            expect(orders.items[1].fulfillments).toEqual([
                { id: f1Id, method: 'Test1', state: 'Delivered', nextStates: ['Cancelled'] },
                { id: f2Id, method: 'Test2', state: 'Cancelled', nextStates: [] },
                { id: f3Id, method: 'Test3', state: 'Delivered', nextStates: ['Cancelled'] },
            ]);
        });

        it('order.fulfillments.orderItems resolver', async () => {
            const { order } = await adminClient.query<
                GetOrderFulfillmentItems.Query,
                GetOrderFulfillmentItems.Variables
            >(GET_ORDER_FULFILLMENT_ITEMS, {
                id: orderId,
            });
            expect(order!.fulfillments![0].orderItems).toEqual([{ id: 'T_3' }]);
            expect(order!.fulfillments![1].orderItems).toEqual([{ id: 'T_4' }, { id: 'T_5' }, { id: 'T_6' }]);
            expect(order!.fulfillments![2].orderItems).toEqual([{ id: 'T_4' }, { id: 'T_5' }, { id: 'T_6' }]);
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
            expect(refundOrder.items).toBe(order!.subTotalWithTax);
            expect(refundOrder.total).toBe(order!.totalWithTax);
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
            expect(order!.history.items.sort(sortById).map(pick(['type', 'data']))).toEqual([
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

    describe('multiple payments', () => {
        const PARTIAL_PAYMENT_AMOUNT = 1000;
        let orderId: string;
        let orderTotalWithTax: number;
        let payment1Id: string;
        let payment2Id: string;

        beforeAll(async () => {
            const result = await createTestOrder(
                adminClient,
                shopClient,
                customers[1].emailAddress,
                password,
            );
            orderId = result.orderId;
        });

        it('adds a partial payment', async () => {
            await proceedToArrangingPayment(shopClient);
            const { addPaymentToOrder: order } = await shopClient.query<
                AddPaymentToOrder.Mutation,
                AddPaymentToOrder.Variables
            >(ADD_PAYMENT, {
                input: {
                    method: partialPaymentMethod.code,
                    metadata: {
                        amount: PARTIAL_PAYMENT_AMOUNT,
                    },
                },
            });
            orderGuard.assertSuccess(order);
            orderTotalWithTax = order.totalWithTax;

            expect(order.state).toBe('ArrangingPayment');
            expect(order.payments?.length).toBe(1);
            expect(omit(order.payments![0], ['id'])).toEqual({
                amount: PARTIAL_PAYMENT_AMOUNT,
                metadata: {
                    public: {
                        amount: PARTIAL_PAYMENT_AMOUNT,
                    },
                },
                method: partialPaymentMethod.code,
                state: 'Settled',
                transactionId: '12345',
            });
            payment1Id = order.payments![0].id;
        });

        it('adds another payment to make up order totalWithTax', async () => {
            const { addPaymentToOrder: order } = await shopClient.query<
                AddPaymentToOrder.Mutation,
                AddPaymentToOrder.Variables
            >(ADD_PAYMENT, {
                input: {
                    method: singleStageRefundablePaymentMethod.code,
                    metadata: {},
                },
            });
            orderGuard.assertSuccess(order);

            expect(order.state).toBe('PaymentSettled');
            expect(order.payments?.length).toBe(2);
            expect(omit(order.payments![1], ['id'])).toEqual({
                amount: orderTotalWithTax - PARTIAL_PAYMENT_AMOUNT,
                metadata: {},
                method: singleStageRefundablePaymentMethod.code,
                state: 'Settled',
                transactionId: '12345',
            });
            payment2Id = order.payments![1].id;
        });

        it('refunding order with multiple payments', async () => {
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
                        paymentId: payment1Id,
                    },
                },
            );
            refundGuard.assertSuccess(refundOrder);
            expect(refundOrder.total).toBe(PARTIAL_PAYMENT_AMOUNT);

            const { order: orderWithPayments } = await adminClient.query<
                GetOrderWithPayments.Query,
                GetOrderWithPayments.Variables
            >(GET_ORDER_WITH_PAYMENTS, {
                id: orderId,
            });

            expect(orderWithPayments?.payments![0].refunds.length).toBe(1);
            expect(orderWithPayments?.payments![0].refunds[0].total).toBe(PARTIAL_PAYMENT_AMOUNT);

            expect(orderWithPayments?.payments![1].refunds.length).toBe(1);
            expect(orderWithPayments?.payments![1].refunds[0].total).toBe(
                orderTotalWithTax - PARTIAL_PAYMENT_AMOUNT,
            );
        });
    });

    describe('issues', () => {
        // https://github.com/vendure-ecommerce/vendure/issues/639
        it('returns fulfillments for Order with no lines', async () => {
            await shopClient.asAnonymousUser();
            // Apply a coupon code just to create an active order with no OrderLines
            await shopClient.query<ApplyCouponCode.Mutation, ApplyCouponCode.Variables>(APPLY_COUPON_CODE, {
                couponCode: 'TEST',
            });
            const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
            const { order } = await adminClient.query<
                GetOrderFulfillments.Query,
                GetOrderFulfillments.Variables
            >(GET_ORDER_FULFILLMENTS, {
                id: activeOrder!.id,
            });

            expect(order?.fulfillments).toEqual([]);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/603
        it('orders correctly resolves quantities and OrderItems', async () => {
            await shopClient.asAnonymousUser();
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 2,
            });
            orderGuard.assertSuccess(addItemToOrder);

            const { orders } = await adminClient.query<
                GetOrderListWithQty.Query,
                GetOrderListWithQty.Variables
            >(GET_ORDERS_LIST_WITH_QUANTITIES, {
                options: {
                    filter: {
                        code: { eq: addItemToOrder.code },
                    },
                },
            });

            expect(orders.items[0].totalQuantity).toBe(2);
            expect(orders.items[0].lines[0].quantity).toBe(2);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/716
        it('get an Order with a deleted ShippingMethod', async () => {
            const { createShippingMethod: shippingMethod } = await adminClient.query<
                CreateShippingMethod.Mutation,
                CreateShippingMethod.Variables
            >(CREATE_SHIPPING_METHOD, {
                input: {
                    code: 'royal-mail',
                    translations: [{ languageCode: LanguageCode.en, name: 'Royal Mail', description: '' }],
                    fulfillmentHandler: manualFulfillmentHandler.code,
                    checker: {
                        code: defaultShippingEligibilityChecker.code,
                        arguments: [{ name: 'orderMinimum', value: '0' }],
                    },
                    calculator: {
                        code: defaultShippingCalculator.code,
                        arguments: [
                            { name: 'rate', value: '500' },
                            { name: 'taxRate', value: '0' },
                        ],
                    },
                },
            });
            await shopClient.asUserWithCredentials(customers[0].emailAddress, password);
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 2,
            });
            await shopClient.query<SetShippingAddress.Mutation, SetShippingAddress.Variables>(
                SET_SHIPPING_ADDRESS,
                {
                    input: {
                        fullName: 'name',
                        streetLine1: '12 the street',
                        city: 'foo',
                        postalCode: '123456',
                        countryCode: 'US',
                    },
                },
            );
            const { setOrderShippingMethod: order } = await shopClient.query<
                SetShippingMethod.Mutation,
                SetShippingMethod.Variables
            >(SET_SHIPPING_METHOD, {
                id: shippingMethod.id,
            });
            orderGuard.assertSuccess(order);

            await adminClient.query<DeleteShippingMethod.Mutation, DeleteShippingMethod.Variables>(
                DELETE_SHIPPING_METHOD,
                {
                    id: shippingMethod.id,
                },
            );

            const { order: order2 } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: order.id,
            });
            expect(order2?.shippingLines[0]).toEqual({
                priceWithTax: 500,
                shippingMethod: pick(shippingMethod, ['id', 'name', 'code', 'description']),
            });
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

async function getUnfulfilledOrderLineInput(
    client: SimpleGraphQLClient,
    id: string,
): Promise<OrderLineInput[]> {
    const { order } = await client.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
        id,
    });

    const unfulfilledItems =
        order?.lines.filter(l => {
            const items = l.items.filter(i => i.fulfillment === null);
            return items.length > 0 ? true : false;
        }) || [];

    return unfulfilledItems.map(l => ({
        orderLineId: l.id,
        quantity: l.items.length,
    }));
}

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
                refunds {
                    id
                    total
                }
            }
        }
    }
`;

const GET_ORDERS_LIST_WITH_QUANTITIES = gql`
    query GetOrderListWithQty($options: OrderListOptions) {
        orders(options: $options) {
            items {
                id
                code
                totalQuantity
                lines {
                    id
                    quantity
                }
            }
        }
    }
`;
