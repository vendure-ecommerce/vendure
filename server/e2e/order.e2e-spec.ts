import gql from 'graphql-tag';
import { CreateAddressInput, GetCustomerList } from 'shared/generated-types';

import { GET_CUSTOMER_LIST } from '../../admin-ui/src/app/data/definitions/customer-definitions';
import { PaymentMethodHandler } from '../src/config/payment-method/payment-method-handler';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestClient } from './test-client';
import { TestServer } from './test-server';

describe('Orders', () => {
    const client = new TestClient();
    const server = new TestServer();

    beforeAll(async () => {
        const token = await server.init(
            {
                productCount: 10,
                customerCount: 2,
            },
            {
                paymentOptions: {
                    paymentMethodHandlers: [testPaymentMethod, testFailingPaymentMethod],
                },
            },
        );
        await client.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('as anonymous user', () => {
        let firstOrderItemId: string;
        let createdCustomerId: string;

        beforeAll(async () => {
            await client.asAnonymousUser();
        });

        it('addItemToOrder starts with no session token', () => {
            expect(client.getAuthToken()).toBe('');
        });

        it('activeOrder returns null before any items have been added', async () => {
            const result = await client.query(GET_ACTIVE_ORDER);
            expect(result.activeOrder).toBeNull();
        });

        it('activeOrder creates an anonymous session', () => {
            expect(client.getAuthToken()).not.toBe('');
        });

        it('addItemToOrder creates a new Order with an item', async () => {
            const result = await client.query(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });

            expect(result.addItemToOrder.lines.length).toBe(1);
            expect(result.addItemToOrder.lines[0].quantity).toBe(1);
            expect(result.addItemToOrder.lines[0].productVariant.id).toBe('T_1');
            expect(result.addItemToOrder.lines[0].id).toBe('T_1');
            firstOrderItemId = result.addItemToOrder.lines[0].id;
        });

        it('addItemToOrder errors with an invalid productVariantId', async () => {
            try {
                await client.query(ADD_ITEM_TO_ORDER, {
                    productVariantId: 'T_999',
                    quantity: 1,
                });
                fail('Should have thrown');
            } catch (err) {
                expect(err.message).toEqual(
                    expect.stringContaining(`No ProductVariant with the id '999' could be found`),
                );
            }
        });

        it('addItemToOrder errors with a negative quantity', async () => {
            try {
                await client.query(ADD_ITEM_TO_ORDER, {
                    productVariantId: 'T_999',
                    quantity: -3,
                });
                fail('Should have thrown');
            } catch (err) {
                expect(err.message).toEqual(
                    expect.stringContaining(`-3 is not a valid quantity for an OrderItem`),
                );
            }
        });

        it('addItemToOrder with an existing productVariantId adds quantity to the existing OrderLine', async () => {
            const result = await client.query(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 2,
            });

            expect(result.addItemToOrder.lines.length).toBe(1);
            expect(result.addItemToOrder.lines[0].quantity).toBe(3);
        });

        it('adjustItemQuantity adjusts the quantity', async () => {
            const result = await client.query(ADJUST_ITEM_QUENTITY, {
                orderItemId: firstOrderItemId,
                quantity: 50,
            });

            expect(result.adjustItemQuantity.lines.length).toBe(1);
            expect(result.adjustItemQuantity.lines[0].quantity).toBe(50);
        });

        it('adjustItemQuantity errors with a negative quantity', async () => {
            try {
                await client.query(ADJUST_ITEM_QUENTITY, {
                    orderItemId: firstOrderItemId,
                    quantity: -3,
                });
                fail('Should have thrown');
            } catch (err) {
                expect(err.message).toEqual(
                    expect.stringContaining(`-3 is not a valid quantity for an OrderItem`),
                );
            }
        });

        it('adjustItemQuantity errors with an invalid orderItemId', async () => {
            try {
                await client.query(ADJUST_ITEM_QUENTITY, {
                    orderItemId: 'T_999',
                    quantity: 5,
                });
                fail('Should have thrown');
            } catch (err) {
                expect(err.message).toEqual(
                    expect.stringContaining(`This order does not contain an OrderLine with the id 999`),
                );
            }
        });

        it('removeItemFromOrder removes the correct item', async () => {
            const result1 = await client.query(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_3',
                quantity: 3,
            });
            expect(result1.addItemToOrder.lines.length).toBe(2);
            expect(result1.addItemToOrder.lines.map(i => i.productVariant.id)).toEqual(['T_1', 'T_3']);

            const result2 = await client.query(REMOVE_ITEM_FROM_ORDER, {
                orderItemId: firstOrderItemId,
            });
            expect(result2.removeItemFromOrder.lines.length).toBe(1);
            expect(result2.removeItemFromOrder.lines.map(i => i.productVariant.id)).toEqual(['T_3']);
        });

        it('removeItemFromOrder errors with an invalid orderItemId', async () => {
            try {
                await client.query(REMOVE_ITEM_FROM_ORDER, {
                    orderItemId: 'T_999',
                });
                fail('Should have thrown');
            } catch (err) {
                expect(err.message).toEqual(
                    expect.stringContaining(`This order does not contain an OrderLine with the id 999`),
                );
            }
        });

        it('nextOrderStates returns next valid states', async () => {
            const result = await client.query(gql`
                query {
                    nextOrderStates
                }
            `);

            expect(result.nextOrderStates).toEqual(['ArrangingPayment']);
        });

        it('transitionOrderToState throws for an invalid state', async () => {
            try {
                await client.query(TRANSITION_TO_STATE, { state: 'Completed' });
                fail('Should have thrown');
            } catch (err) {
                expect(err.message).toEqual(
                    expect.stringContaining(`Cannot transition Order from "AddingItems" to "Completed"`),
                );
            }
        });

        it('attempting to transition to ArrangingPayment throws when Order has no Customer', async () => {
            try {
                await client.query(TRANSITION_TO_STATE, { state: 'ArrangingPayment' });
                fail('Should have thrown');
            } catch (err) {
                expect(err.message).toEqual(
                    expect.stringContaining(
                        `Cannot transition Order to the "ArrangingShipping" state without Customer details`,
                    ),
                );
            }
        });

        it('setCustomerForOrder creates a new Customer and associates it with the Order', async () => {
            const result = await client.query(SET_CUSTOMER, {
                input: {
                    emailAddress: 'test@test.com',
                    firstName: 'Test',
                    lastName: 'Person',
                },
            });

            const customer = result.setCustomerForOrder.customer;
            expect(customer.firstName).toBe('Test');
            expect(customer.lastName).toBe('Person');
            expect(customer.emailAddress).toBe('test@test.com');
            createdCustomerId = customer.id;
        });

        it('setCustomerForOrder updates the existing customer if Customer already set', async () => {
            const result = await client.query(SET_CUSTOMER, {
                input: {
                    emailAddress: 'test@test.com',
                    firstName: 'Changed',
                    lastName: 'Person',
                },
            });

            const customer = result.setCustomerForOrder.customer;
            expect(customer.firstName).toBe('Changed');
            expect(customer.lastName).toBe('Person');
            expect(customer.emailAddress).toBe('test@test.com');
            expect(customer.id).toBe(createdCustomerId);
        });

        it('can transition to ArrangingPayment once Customer has been set', async () => {
            const result = await client.query(TRANSITION_TO_STATE, { state: 'ArrangingPayment' });

            expect(result.transitionOrderToState).toEqual({ id: 'T_1', state: 'ArrangingPayment' });
        });
    });

    describe('as authenticated user', () => {
        let firstOrderItemId: string;
        let activeOrder: any;
        let authenticatedUserEmailAddress: string;
        let customers: GetCustomerList.Items[];
        const password = 'test';

        beforeAll(async () => {
            await client.asSuperAdmin();
            const result = await client.query<GetCustomerList.Query, GetCustomerList.Variables>(
                GET_CUSTOMER_LIST,
                {
                    options: {
                        take: 2,
                    },
                },
            );
            customers = result.customers.items;
            authenticatedUserEmailAddress = customers[0].emailAddress;
            await client.asUserWithCredentials(authenticatedUserEmailAddress, password);
        });

        it('activeOrder returns null before any items have been added', async () => {
            const result = await client.query(GET_ACTIVE_ORDER);
            expect(result.activeOrder).toBeNull();
        });

        it('addItemToOrder creates a new Order with an item', async () => {
            const result = await client.query(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });

            expect(result.addItemToOrder.lines.length).toBe(1);
            expect(result.addItemToOrder.lines[0].quantity).toBe(1);
            expect(result.addItemToOrder.lines[0].productVariant.id).toBe('T_1');
            activeOrder = result.addItemToOrder;
            firstOrderItemId = result.addItemToOrder.lines[0].id;
        });

        it('activeOrder returns order after item has been added', async () => {
            const result = await client.query(GET_ACTIVE_ORDER);
            expect(result.activeOrder.id).toBe(activeOrder.id);
            expect(result.activeOrder.state).toBe('AddingItems');
        });

        it('addItemToOrder with an existing productVariantId adds quantity to the existing OrderLine', async () => {
            const result = await client.query(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 2,
            });

            expect(result.addItemToOrder.lines.length).toBe(1);
            expect(result.addItemToOrder.lines[0].quantity).toBe(3);
        });

        it('adjustItemQuantity adjusts the quantity', async () => {
            const result = await client.query(ADJUST_ITEM_QUENTITY, {
                orderItemId: firstOrderItemId,
                quantity: 50,
            });

            expect(result.adjustItemQuantity.lines.length).toBe(1);
            expect(result.adjustItemQuantity.lines[0].quantity).toBe(50);
        });

        it('removeItemFromOrder removes the correct item', async () => {
            const result1 = await client.query(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_3',
                quantity: 3,
            });
            expect(result1.addItemToOrder.lines.length).toBe(2);
            expect(result1.addItemToOrder.lines.map(i => i.productVariant.id)).toEqual(['T_1', 'T_3']);

            const result2 = await client.query(REMOVE_ITEM_FROM_ORDER, {
                orderItemId: firstOrderItemId,
            });
            expect(result2.removeItemFromOrder.lines.length).toBe(1);
            expect(result2.removeItemFromOrder.lines.map(i => i.productVariant.id)).toEqual(['T_3']);
        });

        it('nextOrderStates returns next valid states', async () => {
            const result = await client.query(GET_NEXT_STATES);

            expect(result.nextOrderStates).toEqual(['ArrangingPayment']);
        });

        it('logging out and back in again resumes the last active order', async () => {
            await client.asAnonymousUser();
            const result1 = await client.query(GET_ACTIVE_ORDER);
            expect(result1.activeOrder).toBeNull();

            await client.asUserWithCredentials(authenticatedUserEmailAddress, password);
            const result2 = await client.query(GET_ACTIVE_ORDER);
            expect(result2.activeOrder.id).toBe(activeOrder.id);
        });

        describe('shipping', () => {
            let shippingMethods: any;

            it('setOrderShippingAddress sets shipping address', async () => {
                const address: CreateAddressInput = {
                    fullName: 'name',
                    company: 'company',
                    streetLine1: '12 the street',
                    streetLine2: 'line 2',
                    city: 'foo',
                    province: 'bar',
                    postalCode: '123456',
                    country: 'baz',
                    phoneNumber: '4444444',
                };
                const result = await client.query(SET_SHIPPING_ADDRESS, {
                    input: address,
                });

                expect(result.setOrderShippingAddress.shippingAddress).toEqual(address);
            });

            it('eligibleShippingMethods lists shipping methods', async () => {
                const result = await client.query(GET_ELIGIBLE_SHIPPING_METHODS);

                shippingMethods = result.eligibleShippingMethods;

                expect(shippingMethods).toEqual([
                    { id: 'T_1', price: 500, description: 'Standard Shipping' },
                    { id: 'T_2', price: 1000, description: 'Express Shipping' },
                ]);
            });

            it('shipping is initially unset', async () => {
                const result = await client.query(GET_ACTIVE_ORDER);

                expect(result.activeOrder.shipping).toEqual(0);
                expect(result.activeOrder.shippingMethod).toEqual(null);
            });

            it('setOrderShippingMethod sets the shipping method', async () => {
                const result = await client.query(SET_SHIPPING_METHOD, {
                    id: shippingMethods[1].id,
                });

                const activeOrderResult = await client.query(GET_ACTIVE_ORDER);

                const order = activeOrderResult.activeOrder;

                expect(order.shipping).toBe(shippingMethods[1].price);
                expect(order.shippingMethod.id).toBe(shippingMethods[1].id);
                expect(order.shippingMethod.description).toBe(shippingMethods[1].description);
            });

            it('shipping method is preserved after adjustItemQuantity', async () => {
                const activeOrderResult = await client.query(GET_ACTIVE_ORDER);
                activeOrder = activeOrderResult.activeOrder;
                const result = await client.query(ADJUST_ITEM_QUENTITY, {
                    orderItemId: activeOrder.lines[0].id,
                    quantity: 10,
                });

                expect(result.adjustItemQuantity.shipping).toBe(shippingMethods[1].price);
                expect(result.adjustItemQuantity.shippingMethod.id).toBe(shippingMethods[1].id);
                expect(result.adjustItemQuantity.shippingMethod.description).toBe(
                    shippingMethods[1].description,
                );
            });
        });

        describe('payment', () => {
            it('attempting add a Payment throws error when in AddingItems state', async () => {
                try {
                    await client.query(ADD_PAYMENT, {
                        input: {
                            method: testPaymentMethod.code,
                            metadata: {},
                        },
                    });
                    fail('Should have thrown');
                } catch (err) {
                    expect(err.message).toEqual(
                        expect.stringContaining(
                            `A Payment may only be added when Order is in "ArrangingPayment" state`,
                        ),
                    );
                }
            });

            it('transitions to the ArrangingPayment state', async () => {
                const result = await client.query(TRANSITION_TO_STATE, { state: 'ArrangingPayment' });
                expect(result.transitionOrderToState).toEqual({
                    id: activeOrder.id,
                    state: 'ArrangingPayment',
                });
            });

            it('attempting to add an item throws error when in ArrangingPayment state', async () => {
                try {
                    const result = await client.query(ADD_ITEM_TO_ORDER, {
                        productVariantId: 'T_4',
                        quantity: 1,
                    });
                    fail('Should have thrown');
                } catch (err) {
                    expect(err.message).toEqual(
                        expect.stringContaining(
                            `Order contents may only be modified when in the "AddingItems" state`,
                        ),
                    );
                }
            });

            it('attempting to modify item quantity throws error when in ArrangingPayment state', async () => {
                try {
                    const result = await client.query(ADJUST_ITEM_QUENTITY, {
                        orderItemId: activeOrder.lines[0].id,
                        quantity: 12,
                    });
                    fail('Should have thrown');
                } catch (err) {
                    expect(err.message).toEqual(
                        expect.stringContaining(
                            `Order contents may only be modified when in the "AddingItems" state`,
                        ),
                    );
                }
            });

            it('attempting to remove an item throws error when in ArrangingPayment state', async () => {
                try {
                    const result = await client.query(REMOVE_ITEM_FROM_ORDER, {
                        orderItemId: activeOrder.lines[0].id,
                    });
                    fail('Should have thrown');
                } catch (err) {
                    expect(err.message).toEqual(
                        expect.stringContaining(
                            `Order contents may only be modified when in the "AddingItems" state`,
                        ),
                    );
                }
            });

            it('attempting to setOrderShippingMethod throws error when in ArrangingPayment state', async () => {
                const shippingMethodsResult = await client.query(GET_ELIGIBLE_SHIPPING_METHODS);
                const shippingMethods = shippingMethodsResult.eligibleShippingMethods;

                try {
                    await client.query(SET_SHIPPING_METHOD, {
                        id: shippingMethods[0].id,
                    });
                    fail('Should have thrown');
                } catch (err) {
                    expect(err.message).toEqual(
                        expect.stringContaining(
                            `Order contents may only be modified when in the "AddingItems" state`,
                        ),
                    );
                }
            });

            it('adds a declined payment', async () => {
                const result = await client.query(ADD_PAYMENT, {
                    input: {
                        method: testFailingPaymentMethod.code,
                        metadata: {
                            foo: 'bar',
                        },
                    },
                });

                const payment = result.addPaymentToOrder.payments[0];
                expect(result.addPaymentToOrder.payments.length).toBe(1);
                expect(payment.method).toBe(testFailingPaymentMethod.code);
                expect(payment.state).toBe('Declined');
                expect(payment.transactionId).toBe(null);
                expect(payment.metadata).toEqual({
                    foo: 'bar',
                });
            });

            it('adds a successful payment and transitions Order state', async () => {
                const result = await client.query(ADD_PAYMENT, {
                    input: {
                        method: testPaymentMethod.code,
                        metadata: {
                            baz: 'quux',
                        },
                    },
                });

                const payment = result.addPaymentToOrder.payments[0];
                expect(result.addPaymentToOrder.state).toBe('PaymentSettled');
                expect(result.addPaymentToOrder.active).toBe(false);
                expect(result.addPaymentToOrder.payments.length).toBe(1);
                expect(payment.method).toBe(testPaymentMethod.code);
                expect(payment.state).toBe('Settled');
                expect(payment.transactionId).toBe('12345');
                expect(payment.metadata).toEqual({
                    baz: 'quux',
                });
            });
        });

        describe('orderByCode', () => {
            describe('immediately after Order is placed', () => {
                it('works when authenticated', async () => {
                    const result = await client.query(GET_ORDER_BY_CODE, {
                        code: activeOrder.code,
                    });

                    expect(result.orderByCode.id).toBe(activeOrder.id);
                });

                it('works when anonymous', async () => {
                    await client.asAnonymousUser();
                    const result = await client.query(GET_ORDER_BY_CODE, {
                        code: activeOrder.code,
                    });

                    expect(result.orderByCode.id).toBe(activeOrder.id);
                });

                it(`throws error for another user's Order`, async () => {
                    authenticatedUserEmailAddress = customers[1].emailAddress;
                    await client.asUserWithCredentials(authenticatedUserEmailAddress, password);

                    try {
                        await client.query(GET_ORDER_BY_CODE, {
                            code: activeOrder.code,
                        });
                        fail('Should have thrown');
                    } catch (err) {
                        expect(err.message).toEqual(
                            expect.stringContaining(
                                `You are not currently authorized to perform this action`,
                            ),
                        );
                    }
                });
            });
        });
    });
});

const testPaymentMethod = new PaymentMethodHandler({
    code: 'test-payment-method',
    name: 'Test Payment Method',
    args: {},
    createPayment: (order, args, metadata) => {
        return {
            amount: order.total,
            state: 'Settled',
            transactionId: '12345',
            metadata,
        };
    },
});

const testFailingPaymentMethod = new PaymentMethodHandler({
    code: 'test-failing-payment-method',
    name: 'Test Failing Payment Method',
    args: {},
    createPayment: (order, args, metadata) => {
        return {
            amount: order.total,
            state: 'Declined',
            metadata,
        };
    },
});

const TEST_ORDER_FRAGMENT = gql`
    fragment TestOrderFragment on Order {
        id
        code
        state
        active
        lines {
            id
            quantity
            productVariant {
                id
            }
        }
        shipping
        shippingMethod {
            id
            code
            description
        }
    }
`;

const GET_ACTIVE_ORDER = gql`
    query {
        activeOrder {
            ...TestOrderFragment
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;

const ADD_ITEM_TO_ORDER = gql`
    mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
        addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
            ...TestOrderFragment
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;

const ADJUST_ITEM_QUENTITY = gql`
    mutation AdjustItemQuantity($orderItemId: ID!, $quantity: Int!) {
        adjustItemQuantity(orderItemId: $orderItemId, quantity: $quantity) {
            ...TestOrderFragment
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;

const REMOVE_ITEM_FROM_ORDER = gql`
    mutation RemoveItemFromOrder($orderItemId: ID!) {
        removeItemFromOrder(orderItemId: $orderItemId) {
            ...TestOrderFragment
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;

const GET_NEXT_STATES = gql`
    query {
        nextOrderStates
    }
`;

const TRANSITION_TO_STATE = gql`
    mutation TransitionToState($state: String!) {
        transitionOrderToState(state: $state) {
            id
            state
        }
    }
`;

const GET_ELIGIBLE_SHIPPING_METHODS = gql`
    query {
        eligibleShippingMethods {
            id
            price
            description
        }
    }
`;

const SET_SHIPPING_ADDRESS = gql`
    mutation SetShippingAddress($input: CreateAddressInput!) {
        setOrderShippingAddress(input: $input) {
            shippingAddress {
                fullName
                company
                streetLine1
                streetLine2
                city
                province
                postalCode
                country
                phoneNumber
            }
        }
    }
`;

const SET_SHIPPING_METHOD = gql`
    mutation SetShippingMethod($id: ID!) {
        setOrderShippingMethod(shippingMethodId: $id) {
            shipping
            shippingMethod {
                id
                code
                description
            }
        }
    }
`;

const ADD_PAYMENT = gql`
    mutation AddPaymentToOrder($input: PaymentInput!) {
        addPaymentToOrder(input: $input) {
            ...TestOrderFragment
            payments {
                id
                transactionId
                method
                amount
                state
                metadata
            }
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;

const SET_CUSTOMER = gql`
    mutation SetCustomerForOrder($input: CreateCustomerInput!) {
        setCustomerForOrder(input: $input) {
            id
            customer {
                id
                emailAddress
                firstName
                lastName
            }
        }
    }
`;

const GET_ORDER_BY_CODE = gql`
    query GetOrderByCode($code: String!) {
        orderByCode(code: $code) {
            ...TestOrderFragment
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;
