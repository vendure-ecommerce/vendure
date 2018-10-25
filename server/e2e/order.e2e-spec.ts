import gql from 'graphql-tag';
import { GetCustomerList } from 'shared/generated-types';

import { GET_CUSTOMER_LIST } from '../../admin-ui/src/app/data/definitions/customer-definitions';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestClient } from './test-client';
import { TestServer } from './test-server';

describe('Orders', () => {
    const client = new TestClient();
    const server = new TestServer();

    beforeAll(async () => {
        const token = await server.init({
            productCount: 10,
            customerCount: 1,
        });
        await client.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('as anonymous user', () => {
        let firstOrderItemId: string;

        beforeAll(async () => {
            await client.asAnonymousUser();
        });

        it('addItemToOrder() starts with no session token', () => {
            expect(client.getAuthToken()).toBe('');
        });

        it('activeOrder() returns null before any items have been added', async () => {
            const result = await client.query(GET_ACTIVE_ORDER);
            expect(result.activeOrder).toBeNull();
        });

        it('activeOrder() creates an anonymous session', () => {
            expect(client.getAuthToken()).not.toBe('');
        });

        it('addItemToOrder() creates a new Order with an item', async () => {
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

        it('addItemToOrder() errors with an invalid productVariantId', async () => {
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

        it('addItemToOrder() errors with a negative quantity', async () => {
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

        it('addItemToOrder() with an existing productVariantId adds quantity to the existing OrderLine', async () => {
            const result = await client.query(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 2,
            });

            expect(result.addItemToOrder.lines.length).toBe(1);
            expect(result.addItemToOrder.lines[0].quantity).toBe(3);
        });

        it('adjustItemQuantity() adjusts the quantity', async () => {
            const result = await client.query(ADJUST_ITEM_QUENTITY, {
                orderItemId: firstOrderItemId,
                quantity: 50,
            });

            expect(result.adjustItemQuantity.lines.length).toBe(1);
            expect(result.adjustItemQuantity.lines[0].quantity).toBe(50);
        });

        it('adjustItemQuantity() errors with a negative quantity', async () => {
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

        it('adjustItemQuantity() errors with an invalid orderItemId', async () => {
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

        it('removeItemFromOrder() removes the correct item', async () => {
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

        it('removeItemFromOrder() errors with an invalid orderItemId', async () => {
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

        it('nextOrderStates() returns next valid states', async () => {
            const result = await client.query(gql`
                query {
                    nextOrderStates
                }
            `);

            expect(result.nextOrderStates).toEqual(['ArrangingShipping']);
        });

        it('transitionOrderToState() throws for an invalid state', async () => {
            try {
                await client.query(gql`
                    mutation {
                        transitionOrderToState(state: "Completed") {
                            id
                            state
                        }
                    }
                `);
                fail('Should have thrown');
            } catch (err) {
                expect(err.message).toEqual(
                    expect.stringContaining(`Cannot transition Order from "AddingItems" to "Completed"`),
                );
            }
        });

        it('transitionOrderToState() transitions Order to the next valid state', async () => {
            const result = await client.query(gql`
                mutation {
                    transitionOrderToState(state: "ArrangingShipping") {
                        id
                        state
                    }
                }
            `);

            expect(result.transitionOrderToState).toEqual({ id: 'T_1', state: 'ArrangingShipping' });
        });
    });

    describe('as authenticated user', () => {
        let firstOrderItemId: string;
        let activeOrderId: string;
        let authenticatedUserEmailAddress: string;
        const password = 'test';

        beforeAll(async () => {
            await client.asSuperAdmin();
            const result = await client.query<GetCustomerList.Query, GetCustomerList.Variables>(
                GET_CUSTOMER_LIST,
                {
                    options: {
                        take: 1,
                    },
                },
            );
            const customer = result.customers.items[0];
            authenticatedUserEmailAddress = customer.emailAddress;
            await client.asUserWithCredentials(authenticatedUserEmailAddress, password);
        });

        it('activeOrder() returns null before any items have been added', async () => {
            const result = await client.query(GET_ACTIVE_ORDER);
            expect(result.activeOrder).toBeNull();
        });

        it('addItemToOrder() creates a new Order with an item', async () => {
            const result = await client.query(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });

            expect(result.addItemToOrder.lines.length).toBe(1);
            expect(result.addItemToOrder.lines[0].quantity).toBe(1);
            expect(result.addItemToOrder.lines[0].productVariant.id).toBe('T_1');
            activeOrderId = result.addItemToOrder.id;
            firstOrderItemId = result.addItemToOrder.lines[0].id;
        });

        it('addItemToOrder() with an existing productVariantId adds quantity to the existing OrderLine', async () => {
            const result = await client.query(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 2,
            });

            expect(result.addItemToOrder.lines.length).toBe(1);
            expect(result.addItemToOrder.lines[0].quantity).toBe(3);
        });

        it('adjustItemQuantity() adjusts the quantity', async () => {
            const result = await client.query(ADJUST_ITEM_QUENTITY, {
                orderItemId: firstOrderItemId,
                quantity: 50,
            });

            expect(result.adjustItemQuantity.lines.length).toBe(1);
            expect(result.adjustItemQuantity.lines[0].quantity).toBe(50);
        });

        it('removeItemFromOrder() removes the correct item', async () => {
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

        it('nextOrderStates() returns next valid states', async () => {
            const result = await client.query(gql`
                query {
                    nextOrderStates
                }
            `);

            expect(result.nextOrderStates).toEqual(['ArrangingShipping']);
        });

        it('logging out and back in again resumes the last active order', async () => {
            await client.asAnonymousUser();
            const result1 = await client.query(GET_ACTIVE_ORDER);
            expect(result1.activeOrder).toBeNull();

            await client.asUserWithCredentials(authenticatedUserEmailAddress, password);
            const result2 = await client.query(GET_ACTIVE_ORDER);
            expect(result2.activeOrder.id).toBe(activeOrderId);
        });
    });
});

const TEST_ORDER_FRAGMENT = gql`
    fragment TestOrderFragment on Order {
        id
        lines {
            id
            quantity
            productVariant {
                id
            }
        }
    }
`;

const GET_ACTIVE_ORDER = gql`
    query {
        activeOrder {
            id
            state
        }
    }
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
