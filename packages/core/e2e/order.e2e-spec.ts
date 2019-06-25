/* tslint:disable:no-non-null-assertion */
import gql from 'graphql-tag';
import path from 'path';
import { expand } from 'rxjs/operators';

import { ID } from '../../common/lib/shared-types';
import { PaymentMethodHandler } from '../src/config/payment-method/payment-method-handler';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { ORDER_FRAGMENT, ORDER_WITH_LINES_FRAGMENT } from './graphql/fragments';
import {
    CreateFulfillment,
    GetCustomerList,
    GetOrder,
    GetOrderList,
    OrderFragment,
    OrderItemFragment,
    SettlePayment,
} from './graphql/generated-e2e-admin-types';
import {
    AddItemToOrder,
    AddPaymentToOrder,
    GetShippingMethods,
    SetShippingAddress,
    SetShippingMethod,
    TransitionToState,
} from './graphql/generated-e2e-shop-types';
import { GET_CUSTOMER_LIST } from './graphql/shared-definitions';
import {
    ADD_ITEM_TO_ORDER,
    ADD_PAYMENT,
    GET_ELIGIBLE_SHIPPING_METHODS,
    SET_SHIPPING_ADDRESS,
    SET_SHIPPING_METHOD,
    TRANSITION_TO_STATE,
} from './graphql/shop-definitions';
import { TestAdminClient, TestShopClient } from './test-client';
import { TestServer } from './test-server';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('Orders resolver', () => {
    const adminClient = new TestAdminClient();
    const shopClient = new TestShopClient();
    const server = new TestServer();
    let customers: GetCustomerList.Items[];
    const password = 'test';

    beforeAll(async () => {
        const token = await server.init(
            {
                productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
                customerCount: 2,
            },
            {
                paymentOptions: {
                    paymentMethodHandlers: [
                        twoStagePaymentMethod,
                        failsToSettlePaymentMethod,
                    ],
                },
            },
        );
        await adminClient.init();

        // Create a couple of orders to be queried
        const result = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(
            GET_CUSTOMER_LIST,
            {
                options: {
                    take: 2,
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
            quantity: 2,
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

    describe('payments', () => {

        it('settlePayment fails', async () => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, password);
            await proceedToArrangingPayment(shopClient);

            const { addPaymentToOrder } = await shopClient.query<
                AddPaymentToOrder.Mutation,
                AddPaymentToOrder.Variables
                >(ADD_PAYMENT, {
                input: {
                    method: failsToSettlePaymentMethod.code,
                    metadata: {
                        baz: 'quux',
                    },
                },
            });
            const order = addPaymentToOrder!;

            expect(order.state).toBe('PaymentAuthorized');

            const payment = order.payments![0];
            const { settlePayment } = await adminClient.query<SettlePayment.Mutation, SettlePayment.Variables>(SETTLE_PAYMENT, {
                id: payment.id,
            });

            expect(settlePayment!.id).toBe(payment.id);
            expect(settlePayment!.state).toBe('Authorized');

            const result = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, { id: order.id });

            expect(result.order!.state).toBe('PaymentAuthorized');
        });

        it('settlePayment succeeds', async () => {
            await shopClient.asUserWithCredentials(customers[1].emailAddress, password);
            await proceedToArrangingPayment(shopClient);

            const { addPaymentToOrder } = await shopClient.query<
                AddPaymentToOrder.Mutation,
                AddPaymentToOrder.Variables
                >(ADD_PAYMENT, {
                input: {
                    method: twoStagePaymentMethod.code,
                    metadata: {
                        baz: 'quux',
                    },
                },
            });
            const order = addPaymentToOrder!;

            expect(order.state).toBe('PaymentAuthorized');

            const payment = order.payments![0];
            const { settlePayment } = await adminClient.query<SettlePayment.Mutation, SettlePayment.Variables>(SETTLE_PAYMENT, {
                id: payment.id,
            });

            expect(settlePayment!.id).toBe(payment.id);
            expect(settlePayment!.state).toBe('Settled');
            // further metadata is combined into existing object
            expect(settlePayment!.metadata).toEqual({
                baz: 'quux',
                moreData: 42,
            });

            const result = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, { id: order.id });

            expect(result.order!.state).toBe('PaymentSettled');
            expect(result.order!.payments![0].state).toBe('Settled');
        });
    });

    describe('fulfillment', () => {

        it('throws if Order is not in "PaymentSettled" state', assertThrowsWithMessage(async () => {
                const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, { id: 'T_1' });
                expect(order!.state).toBe('PaymentAuthorized');

                await adminClient.query<CreateFulfillment.Mutation, CreateFulfillment.Variables>(CREATE_FULFILLMENT, {
                    input: {
                        lines: order!.lines.map(l => ({ orderLineId: l.id, quantity: l.quantity })),
                        method: 'Test',
                    },
                });
            },
            'One or more OrderItems belong to an Order which is in an invalid state',
            ),
        );

        it('throws if lines is empty', assertThrowsWithMessage(async () => {
                const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, { id: 'T_2' });
                expect(order!.state).toBe('PaymentSettled');
                await adminClient.query<CreateFulfillment.Mutation, CreateFulfillment.Variables>(CREATE_FULFILLMENT, {
                    input: {
                        lines: [],
                        method: 'Test',
                    },
                });
            },
            'Nothing to fulfill',
            ),
        );

        it('throws if all quantities are zero', assertThrowsWithMessage(async () => {
                const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, { id: 'T_2' });
                expect(order!.state).toBe('PaymentSettled');
                await adminClient.query<CreateFulfillment.Mutation, CreateFulfillment.Variables>(CREATE_FULFILLMENT, {
                    input: {
                        lines: order!.lines.map(l => ({ orderLineId: l.id, quantity: 0 })),
                        method: 'Test',
                    },
                });
            },
            'Nothing to fulfill',
            ),
        );

        it('creates a partial fulfillment', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, { id: 'T_2' });
            expect(order!.state).toBe('PaymentSettled');
            const lines = order!.lines;

            const { createFulfillment } = await adminClient.query<CreateFulfillment.Mutation, CreateFulfillment.Variables>(CREATE_FULFILLMENT, {
                input: {
                    lines: lines.map(l => ({ orderLineId: l.id, quantity: 1 })),
                    method: 'Test',
                    trackingCode: '123456',
                },
            });

            expect(createFulfillment!.method).toBe('Test');
            expect(createFulfillment!.trackingCode).toBe('123456');
            expect(createFulfillment!.orderItems).toEqual([
                { id: lines[0].items[0].id },
                { id: lines[1].items[0].id },
            ]);

            const result = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, { id: 'T_2' });
            // expect(result.order!.lines).toEqual({});
            expect(result.order!.state).toBe('PartiallyFulfilled');
            expect(result.order!.lines[0].items[0].fulfillment!.id).toBe(createFulfillment!.id);
            expect(result.order!.lines[1].items[1].fulfillment!.id).toBe(createFulfillment!.id);
            expect(result.order!.lines[1].items[0].fulfillment).toBe(null);
        });

        it('throws if an OrderItem already part of a Fulfillment', assertThrowsWithMessage(async () => {
                const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, { id: 'T_2' });
                expect(order!.state).toBe('PartiallyFulfilled');
                await adminClient.query<CreateFulfillment.Mutation, CreateFulfillment.Variables>(CREATE_FULFILLMENT, {
                    input: {
                        method: 'Test',
                        lines: [{
                            orderLineId: order!.lines[0].id,
                            quantity: 1,
                        }],
                    },
                });
            },
            'One or more OrderItems have already been fulfilled',
            ),
        );

        it('completes fulfillment', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, { id: 'T_2' });
            expect(order!.state).toBe('PartiallyFulfilled');

            const orderItems = order!.lines.reduce((items, line) => [...items, ...line.items], [] as OrderItemFragment[]);

            const { createFulfillment } = await adminClient.query<CreateFulfillment.Mutation, CreateFulfillment.Variables>(CREATE_FULFILLMENT, {
                input: {
                    lines: [{
                        orderLineId: order!.lines[1].id,
                        quantity: 1,
                    }],
                    method: 'Test2',
                    trackingCode: '56789',
                },
            });

            expect(createFulfillment!.method).toBe('Test2');
            expect(createFulfillment!.trackingCode).toBe('56789');
            expect(createFulfillment!.orderItems).toEqual([{ id: orderItems[1].id }]);

            const result = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, { id: 'T_2' });
            expect(result.order!.state).toBe('Fulfilled');
        });
    });
});

/**
 * A two-stage (authorize, capture) payment method.
 */
const twoStagePaymentMethod = new PaymentMethodHandler({
    code: 'authorize-only-payment-method',
    description: 'Test Payment Method',
    args: {},
    createPayment: (order, args, metadata) => {
        return {
            amount: order.total,
            state: 'Authorized',
            transactionId: '12345',
            metadata,
        };
    },
    settlePayment: () => {
        return {
            success: true,
            metadata: {
                moreData: 42,
            },
        };
    },
});

/**
 * A payment method where calling `settlePayment` always fails.
 */
const failsToSettlePaymentMethod = new PaymentMethodHandler({
    code: 'fails-to-settle-payment-method',
    description: 'Test Payment Method',
    args: {},
    createPayment: (order, args, metadata) => {
        return {
            amount: order.total,
            state: 'Authorized',
            transactionId: '12345',
            metadata,
        };
    },
    settlePayment: () => {
        return {
            success: false,
            errorMessage: 'Something went horribly wrong',
        };
    },
});

async function proceedToArrangingPayment(shopClient: TestShopClient): Promise<ID> {
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

    const { eligibleShippingMethods } = await shopClient.query<GetShippingMethods.Query>(
        GET_ELIGIBLE_SHIPPING_METHODS,
    );

    await shopClient.query<SetShippingMethod.Mutation, SetShippingMethod.Variables>(
        SET_SHIPPING_METHOD,
        {
            id: eligibleShippingMethods[1].id,
        },
    );

    const { transitionOrderToState } = await shopClient.query<
        TransitionToState.Mutation,
        TransitionToState.Variables
        >(TRANSITION_TO_STATE, { state: 'ArrangingPayment' });

    return transitionOrderToState!.id;
}

export const GET_ORDERS_LIST = gql`
    query GetOrderList($options: OrderListOptions) {
        orders(options: $options) {
            items {
                ...Order
            }
            totalItems
        }
    }
    ${ORDER_FRAGMENT}
`;

export const GET_ORDER = gql`
    query GetOrder($id: ID!) {
        order(id: $id) {
            ...OrderWithLines
        }
    }
    ${ORDER_WITH_LINES_FRAGMENT}
`;

export const SETTLE_PAYMENT = gql`
    mutation SettlePayment($id: ID!) {
        settlePayment(id: $id) {
            id
            state
            metadata
        }
    }
`;

export const CREATE_FULFILLMENT = gql`
    mutation CreateFulfillment($input: CreateFulfillmentInput!) {
        createFulfillment(input: $input) {
            id
            method
            trackingCode
            orderItems {
                id
            }
        }
    }
`;
