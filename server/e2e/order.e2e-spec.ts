import gql from 'graphql-tag';

import { Customer } from '../src/entity/customer/customer.entity';
import { OrderItem } from '../src/entity/order-item/order-item.entity';

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
    }, 60000);

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

        it('addItemToOrder() creates a new Order with an item', async () => {
            const result = await client.query(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });

            expect(result.addItemToOrder.items.length).toBe(1);
            expect(result.addItemToOrder.items[0].quantity).toBe(1);
            expect(result.addItemToOrder.items[0].productVariant.id).toBe('T_1');
            expect(result.addItemToOrder.items[0].id).toBe('T_1');
            firstOrderItemId = result.addItemToOrder.items[0].id;
        });

        it('addItemToOrder() creates an anonymous session', () => {
            expect(client.getAuthToken()).not.toBe('');
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

        it('addItemToOrder() with an existing productVariantId adds quantity to the existing OrderItem', async () => {
            const result = await client.query(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 2,
            });

            expect(result.addItemToOrder.items.length).toBe(1);
            expect(result.addItemToOrder.items[0].quantity).toBe(3);
        });

        it('adjustItemQuantity() adjusts the quantity', async () => {
            const result = await client.query(ADJUST_ITEM_QUENTITY, {
                orderItemId: firstOrderItemId,
                quantity: 50,
            });

            expect(result.adjustItemQuantity.items.length).toBe(1);
            expect(result.adjustItemQuantity.items[0].quantity).toBe(50);
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
                    expect.stringContaining(`This order does not contain an OrderItem with the id 999`),
                );
            }
        });

        it('removeItemFromOrder() removes the correct item', async () => {
            const result1 = await client.query(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_3',
                quantity: 3,
            });
            expect(result1.addItemToOrder.items.length).toBe(2);
            expect(result1.addItemToOrder.items.map(i => i.productVariant.id)).toEqual(['T_1', 'T_3']);

            const result2 = await client.query(REMOVE_ITEM_FROM_ORDER, {
                orderItemId: firstOrderItemId,
            });
            expect(result2.removeItemFromOrder.items.length).toBe(1);
            expect(result2.removeItemFromOrder.items.map(i => i.productVariant.id)).toEqual(['T_3']);
        });

        it('removeItemFromOrder() errors with an invalid orderItemId', async () => {
            try {
                await client.query(REMOVE_ITEM_FROM_ORDER, {
                    orderItemId: 'T_999',
                });
                fail('Should have thrown');
            } catch (err) {
                expect(err.message).toEqual(
                    expect.stringContaining(`This order does not contain an OrderItem with the id 999`),
                );
            }
        });
    });

    describe('as authenticated user', () => {
        let firstOrderItemId: string;

        beforeAll(async () => {
            await client.asSuperAdmin();
            const result = await client.query(gql`
                query {
                    customer(id: "T_1") {
                        id
                        emailAddress
                    }
                }
            `);
            const customer: Customer = result.customer;
            await client.asUserWithCredentials(customer.emailAddress, 'test');
        });

        it('addItemToOrder() creates a new Order with an item', async () => {
            const result = await client.query(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });

            expect(result.addItemToOrder.items.length).toBe(1);
            expect(result.addItemToOrder.items[0].quantity).toBe(1);
            expect(result.addItemToOrder.items[0].productVariant.id).toBe('T_1');
            firstOrderItemId = result.addItemToOrder.items[0].id;
        });

        it('addItemToOrder() with an existing productVariantId adds quantity to the existing OrderItem', async () => {
            const result = await client.query(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 2,
            });

            expect(result.addItemToOrder.items.length).toBe(1);
            expect(result.addItemToOrder.items[0].quantity).toBe(3);
        });

        it('adjustItemQuantity() adjusts the quantity', async () => {
            const result = await client.query(ADJUST_ITEM_QUENTITY, {
                orderItemId: firstOrderItemId,
                quantity: 50,
            });

            expect(result.adjustItemQuantity.items.length).toBe(1);
            expect(result.adjustItemQuantity.items[0].quantity).toBe(50);
        });

        it('removeItemFromOrder() removes the correct item', async () => {
            const result1 = await client.query(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_3',
                quantity: 3,
            });
            expect(result1.addItemToOrder.items.length).toBe(2);
            expect(result1.addItemToOrder.items.map(i => i.productVariant.id)).toEqual(['T_1', 'T_3']);

            const result2 = await client.query(REMOVE_ITEM_FROM_ORDER, {
                orderItemId: firstOrderItemId,
            });
            expect(result2.removeItemFromOrder.items.length).toBe(1);
            expect(result2.removeItemFromOrder.items.map(i => i.productVariant.id)).toEqual(['T_3']);
        });
    });
});

const TEST_ORDER_FRAGMENT = gql`
    fragment TestOrderFragment on Order {
        id
        items {
            id
            quantity
            productVariant {
                id
            }
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
