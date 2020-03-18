/* tslint:disable:no-non-null-assertion */
import { mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    testErrorPaymentMethod,
    testFailingPaymentMethod,
    testSuccessfulPaymentMethod,
} from './fixtures/test-payment-methods';
import {
    AttemptLogin,
    CreateAddressInput,
    GetCountryList,
    GetCustomer,
    GetCustomerList,
    UpdateCountry,
} from './graphql/generated-e2e-admin-types';
import {
    AddItemToOrder,
    AddPaymentToOrder,
    AdjustItemQuantity,
    GetActiveOrder,
    GetActiveOrderPayments,
    GetAvailableCountries,
    GetCustomerAddresses,
    GetCustomerOrders,
    GetNextOrderStates,
    GetOrderByCode,
    GetShippingMethods,
    RemoveItemFromOrder,
    SetCustomerForOrder,
    SetShippingAddress,
    SetShippingMethod,
    TransitionToState,
} from './graphql/generated-e2e-shop-types';
import {
    ATTEMPT_LOGIN,
    GET_COUNTRY_LIST,
    GET_CUSTOMER,
    GET_CUSTOMER_LIST,
    UPDATE_COUNTRY,
} from './graphql/shared-definitions';
import {
    ADD_ITEM_TO_ORDER,
    ADD_PAYMENT,
    ADJUST_ITEM_QUANTITY,
    GET_ACTIVE_ORDER,
    GET_ACTIVE_ORDER_ADDRESSES,
    GET_ACTIVE_ORDER_ORDERS,
    GET_ACTIVE_ORDER_PAYMENTS,
    GET_AVAILABLE_COUNTRIES,
    GET_ELIGIBLE_SHIPPING_METHODS,
    GET_NEXT_STATES,
    GET_ORDER_BY_CODE,
    REMOVE_ITEM_FROM_ORDER,
    SET_CUSTOMER,
    SET_SHIPPING_ADDRESS,
    SET_SHIPPING_METHOD,
    TRANSITION_TO_STATE,
} from './graphql/shop-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('Shop orders', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            paymentOptions: {
                paymentMethodHandlers: [
                    testSuccessfulPaymentMethod,
                    testFailingPaymentMethod,
                    testErrorPaymentMethod,
                ],
            },
            orderOptions: {
                orderItemsLimit: 99,
            },
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 3,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('availableCountries returns enabled countries', async () => {
        // disable Austria
        const { countries } = await adminClient.query<GetCountryList.Query>(GET_COUNTRY_LIST, {});
        const AT = countries.items.find(c => c.code === 'AT')!;
        await adminClient.query<UpdateCountry.Mutation, UpdateCountry.Variables>(UPDATE_COUNTRY, {
            input: {
                id: AT.id,
                enabled: false,
            },
        });

        const result = await shopClient.query<GetAvailableCountries.Query>(GET_AVAILABLE_COUNTRIES);
        expect(result.availableCountries.length).toBe(countries.items.length - 1);
        expect(result.availableCountries.find(c => c.id === AT.id)).toBeUndefined();
    });

    describe('ordering as anonymous user', () => {
        let firstOrderLineId: string;
        let createdCustomerId: string;
        let orderCode: string;

        it('addItemToOrder starts with no session token', () => {
            expect(shopClient.getAuthToken()).toBeFalsy();
        });

        it('activeOrder returns null before any items have been added', async () => {
            const result = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
            expect(result.activeOrder).toBeNull();
        });

        it('activeOrder creates an anonymous session', () => {
            expect(shopClient.getAuthToken()).not.toBe('');
        });

        it('addItemToOrder creates a new Order with an item', async () => {
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });

            expect(addItemToOrder!.lines.length).toBe(1);
            expect(addItemToOrder!.lines[0].quantity).toBe(1);
            expect(addItemToOrder!.lines[0].productVariant.id).toBe('T_1');
            expect(addItemToOrder!.lines[0].id).toBe('T_1');
            firstOrderLineId = addItemToOrder!.lines[0].id;
            orderCode = addItemToOrder!.code;
        });

        it(
            'addItemToOrder errors with an invalid productVariantId',
            assertThrowsWithMessage(
                () =>
                    shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                        productVariantId: 'T_999',
                        quantity: 1,
                    }),
                `No ProductVariant with the id '999' could be found`,
            ),
        );

        it(
            'addItemToOrder errors with a negative quantity',
            assertThrowsWithMessage(
                () =>
                    shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                        productVariantId: 'T_999',
                        quantity: -3,
                    }),
                `-3 is not a valid quantity for an OrderItem`,
            ),
        );

        it('addItemToOrder with an existing productVariantId adds quantity to the existing OrderLine', async () => {
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 2,
            });

            expect(addItemToOrder!.lines.length).toBe(1);
            expect(addItemToOrder!.lines[0].quantity).toBe(3);
        });

        it(
            'addItemToOrder errors when going beyond orderItemsLimit',
            assertThrowsWithMessage(async () => {
                await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                    productVariantId: 'T_1',
                    quantity: 100,
                });
            }, 'Cannot add items. An order may consist of a maximum of 99 items'),
        );

        it('adjustOrderLine adjusts the quantity', async () => {
            const { adjustOrderLine } = await shopClient.query<
                AdjustItemQuantity.Mutation,
                AdjustItemQuantity.Variables
            >(ADJUST_ITEM_QUANTITY, {
                orderLineId: firstOrderLineId,
                quantity: 50,
            });

            expect(adjustOrderLine!.lines.length).toBe(1);
            expect(adjustOrderLine!.lines[0].quantity).toBe(50);
        });

        it(
            'adjustOrderLine errors when going beyond orderItemsLimit',
            assertThrowsWithMessage(async () => {
                await shopClient.query<AdjustItemQuantity.Mutation, AdjustItemQuantity.Variables>(
                    ADJUST_ITEM_QUANTITY,
                    {
                        orderLineId: firstOrderLineId,
                        quantity: 100,
                    },
                );
            }, 'Cannot add items. An order may consist of a maximum of 99 items'),
        );

        it(
            'adjustOrderLine errors with a negative quantity',
            assertThrowsWithMessage(
                () =>
                    shopClient.query<AdjustItemQuantity.Mutation, AdjustItemQuantity.Variables>(
                        ADJUST_ITEM_QUANTITY,
                        {
                            orderLineId: firstOrderLineId,
                            quantity: -3,
                        },
                    ),
                `-3 is not a valid quantity for an OrderItem`,
            ),
        );

        it(
            'adjustOrderLine errors with an invalid orderLineId',
            assertThrowsWithMessage(
                () =>
                    shopClient.query<AdjustItemQuantity.Mutation, AdjustItemQuantity.Variables>(
                        ADJUST_ITEM_QUANTITY,
                        {
                            orderLineId: 'T_999',
                            quantity: 5,
                        },
                    ),
                `This order does not contain an OrderLine with the id 999`,
            ),
        );

        it('removeItemFromOrder removes the correct item', async () => {
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_3',
                quantity: 3,
            });
            expect(addItemToOrder!.lines.length).toBe(2);
            expect(addItemToOrder!.lines.map(i => i.productVariant.id)).toEqual(['T_1', 'T_3']);

            const { removeOrderLine } = await shopClient.query<
                RemoveItemFromOrder.Mutation,
                RemoveItemFromOrder.Variables
            >(REMOVE_ITEM_FROM_ORDER, {
                orderLineId: firstOrderLineId,
            });
            expect(removeOrderLine!.lines.length).toBe(1);
            expect(removeOrderLine!.lines.map(i => i.productVariant.id)).toEqual(['T_3']);
        });

        it(
            'removeItemFromOrder errors with an invalid orderItemId',
            assertThrowsWithMessage(
                () =>
                    shopClient.query<RemoveItemFromOrder.Mutation, RemoveItemFromOrder.Variables>(
                        REMOVE_ITEM_FROM_ORDER,
                        {
                            orderLineId: 'T_999',
                        },
                    ),
                `This order does not contain an OrderLine with the id 999`,
            ),
        );

        it('nextOrderStates returns next valid states', async () => {
            const result = await shopClient.query<GetNextOrderStates.Query>(GET_NEXT_STATES);

            expect(result.nextOrderStates).toEqual(['ArrangingPayment', 'Cancelled']);
        });

        it(
            'transitionOrderToState throws for an invalid state',
            assertThrowsWithMessage(
                () =>
                    shopClient.query<TransitionToState.Mutation, TransitionToState.Variables>(
                        TRANSITION_TO_STATE,
                        { state: 'Completed' },
                    ),
                `Cannot transition Order from "AddingItems" to "Completed"`,
            ),
        );

        it(
            'attempting to transition to ArrangingPayment throws when Order has no Customer',
            assertThrowsWithMessage(
                () =>
                    shopClient.query<TransitionToState.Mutation, TransitionToState.Variables>(
                        TRANSITION_TO_STATE,
                        { state: 'ArrangingPayment' },
                    ),
                `Cannot transition Order to the "ArrangingPayment" state without Customer details`,
            ),
        );

        it('setCustomerForOrder creates a new Customer and associates it with the Order', async () => {
            const { setCustomerForOrder } = await shopClient.query<
                SetCustomerForOrder.Mutation,
                SetCustomerForOrder.Variables
            >(SET_CUSTOMER, {
                input: {
                    emailAddress: 'test@test.com',
                    firstName: 'Test',
                    lastName: 'Person',
                },
            });

            const customer = setCustomerForOrder!.customer!;
            expect(customer.firstName).toBe('Test');
            expect(customer.lastName).toBe('Person');
            expect(customer.emailAddress).toBe('test@test.com');
            createdCustomerId = customer.id;
        });

        it('setCustomerForOrder updates the existing customer if Customer already set', async () => {
            const { setCustomerForOrder } = await shopClient.query<
                SetCustomerForOrder.Mutation,
                SetCustomerForOrder.Variables
            >(SET_CUSTOMER, {
                input: {
                    emailAddress: 'test@test.com',
                    firstName: 'Changed',
                    lastName: 'Person',
                },
            });

            const customer = setCustomerForOrder!.customer!;
            expect(customer.firstName).toBe('Changed');
            expect(customer.lastName).toBe('Person');
            expect(customer.emailAddress).toBe('test@test.com');
            expect(customer.id).toBe(createdCustomerId);
        });

        it('setOrderShippingAddress sets shipping address', async () => {
            const address: CreateAddressInput = {
                fullName: 'name',
                company: 'company',
                streetLine1: '12 the street',
                streetLine2: null,
                city: 'foo',
                province: 'bar',
                postalCode: '123456',
                countryCode: 'US',
                phoneNumber: '4444444',
            };
            const { setOrderShippingAddress } = await shopClient.query<
                SetShippingAddress.Mutation,
                SetShippingAddress.Variables
            >(SET_SHIPPING_ADDRESS, {
                input: address,
            });

            expect(setOrderShippingAddress!.shippingAddress).toEqual({
                fullName: 'name',
                company: 'company',
                streetLine1: '12 the street',
                streetLine2: null,
                city: 'foo',
                province: 'bar',
                postalCode: '123456',
                country: 'United States of America',
                phoneNumber: '4444444',
            });
        });

        it('customer default Addresses are not updated before payment', async () => {
            const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
            const { customer } = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(
                GET_CUSTOMER,
                { id: activeOrder!.customer!.id },
            );

            expect(customer!.addresses).toEqual([]);
        });

        it('can transition to ArrangingPayment once Customer has been set', async () => {
            const result = await shopClient.query<TransitionToState.Mutation, TransitionToState.Variables>(
                TRANSITION_TO_STATE,
                { state: 'ArrangingPayment' },
            );

            expect(result.transitionOrderToState).toEqual({ id: 'T_1', state: 'ArrangingPayment' });
        });

        it('adds a successful payment and transitions Order state', async () => {
            const { addPaymentToOrder } = await shopClient.query<
                AddPaymentToOrder.Mutation,
                AddPaymentToOrder.Variables
            >(ADD_PAYMENT, {
                input: {
                    method: testSuccessfulPaymentMethod.code,
                    metadata: {},
                },
            });

            const payment = addPaymentToOrder!.payments![0];
            expect(addPaymentToOrder!.state).toBe('PaymentSettled');
            expect(addPaymentToOrder!.active).toBe(false);
            expect(addPaymentToOrder!.payments!.length).toBe(1);
            expect(payment.method).toBe(testSuccessfulPaymentMethod.code);
            expect(payment.state).toBe('Settled');
        });

        it('activeOrder is null after payment', async () => {
            const result = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);

            expect(result.activeOrder).toBeNull();
        });

        it('customer default Addresses are updated after payment', async () => {
            // TODO: will need to be reworked for https://github.com/vendure-ecommerce/vendure/issues/98
            const result = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: createdCustomerId,
            });

            // tslint:disable-next-line:no-non-null-assertion
            const address = result.customer!.addresses![0];
            expect(address.streetLine1).toBe('12 the street');
            expect(address.postalCode).toBe('123456');
            expect(address.defaultBillingAddress).toBe(true);
            expect(address.defaultShippingAddress).toBe(true);
        });
    });

    describe('ordering as authenticated user', () => {
        let firstOrderLineId: string;
        let activeOrder: AddItemToOrder.AddItemToOrder;
        let authenticatedUserEmailAddress: string;
        let customers: GetCustomerList.Items[];
        const password = 'test';

        beforeAll(async () => {
            await adminClient.asSuperAdmin();
            const result = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(
                GET_CUSTOMER_LIST,
                {
                    options: {
                        take: 2,
                    },
                },
            );
            customers = result.customers.items;
            authenticatedUserEmailAddress = customers[0].emailAddress;
            await shopClient.asUserWithCredentials(authenticatedUserEmailAddress, password);
        });

        it('activeOrder returns null before any items have been added', async () => {
            const result = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
            expect(result.activeOrder).toBeNull();
        });

        it('addItemToOrder creates a new Order with an item', async () => {
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });

            expect(addItemToOrder!.lines.length).toBe(1);
            expect(addItemToOrder!.lines[0].quantity).toBe(1);
            expect(addItemToOrder!.lines[0].productVariant.id).toBe('T_1');
            activeOrder = addItemToOrder!;
            firstOrderLineId = addItemToOrder!.lines[0].id;
        });

        it('activeOrder returns order after item has been added', async () => {
            const result = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
            expect(result.activeOrder!.id).toBe(activeOrder.id);
            expect(result.activeOrder!.state).toBe('AddingItems');
        });

        it('activeOrder resolves customer user', async () => {
            const result = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
            expect(result.activeOrder!.customer!.user).toEqual({
                id: 'T_2',
                identifier: 'hayden.zieme12@hotmail.com',
            });
        });

        it('addItemToOrder with an existing productVariantId adds quantity to the existing OrderLine', async () => {
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 2,
            });

            expect(addItemToOrder!.lines.length).toBe(1);
            expect(addItemToOrder!.lines[0].quantity).toBe(3);
        });

        it('adjustOrderLine adjusts the quantity', async () => {
            const { adjustOrderLine } = await shopClient.query<
                AdjustItemQuantity.Mutation,
                AdjustItemQuantity.Variables
            >(ADJUST_ITEM_QUANTITY, {
                orderLineId: firstOrderLineId,
                quantity: 50,
            });

            expect(adjustOrderLine!.lines.length).toBe(1);
            expect(adjustOrderLine!.lines[0].quantity).toBe(50);
        });

        it('removeItemFromOrder removes the correct item', async () => {
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_3',
                quantity: 3,
            });
            expect(addItemToOrder!.lines.length).toBe(2);
            expect(addItemToOrder!.lines.map(i => i.productVariant.id)).toEqual(['T_1', 'T_3']);

            const { removeOrderLine } = await shopClient.query<
                RemoveItemFromOrder.Mutation,
                RemoveItemFromOrder.Variables
            >(REMOVE_ITEM_FROM_ORDER, {
                orderLineId: firstOrderLineId,
            });
            expect(removeOrderLine!.lines.length).toBe(1);
            expect(removeOrderLine!.lines.map(i => i.productVariant.id)).toEqual(['T_3']);
        });

        it('nextOrderStates returns next valid states', async () => {
            const result = await shopClient.query<GetNextOrderStates.Query>(GET_NEXT_STATES);

            expect(result.nextOrderStates).toEqual(['ArrangingPayment', 'Cancelled']);
        });

        it('logging out and back in again resumes the last active order', async () => {
            await shopClient.asAnonymousUser();
            const result1 = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
            expect(result1.activeOrder).toBeNull();

            await shopClient.asUserWithCredentials(authenticatedUserEmailAddress, password);
            const result2 = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
            expect(result2.activeOrder!.id).toBe(activeOrder.id);
        });

        describe('shipping', () => {
            let shippingMethods: GetShippingMethods.EligibleShippingMethods[];

            it(
                'setOrderShippingAddress throws with invalid countryCode',
                assertThrowsWithMessage(() => {
                    const address: CreateAddressInput = {
                        streetLine1: '12 the street',
                        countryCode: 'INVALID',
                    };

                    return shopClient.query<SetShippingAddress.Mutation, SetShippingAddress.Variables>(
                        SET_SHIPPING_ADDRESS,
                        {
                            input: address,
                        },
                    );
                }, `The countryCode "INVALID" was not recognized`),
            );

            it('setOrderShippingAddress sets shipping address', async () => {
                const address: CreateAddressInput = {
                    fullName: 'name',
                    company: 'company',
                    streetLine1: '12 the street',
                    streetLine2: null,
                    city: 'foo',
                    province: 'bar',
                    postalCode: '123456',
                    countryCode: 'US',
                    phoneNumber: '4444444',
                };
                const { setOrderShippingAddress } = await shopClient.query<
                    SetShippingAddress.Mutation,
                    SetShippingAddress.Variables
                >(SET_SHIPPING_ADDRESS, {
                    input: address,
                });

                expect(setOrderShippingAddress!.shippingAddress).toEqual({
                    fullName: 'name',
                    company: 'company',
                    streetLine1: '12 the street',
                    streetLine2: null,
                    city: 'foo',
                    province: 'bar',
                    postalCode: '123456',
                    country: 'United States of America',
                    phoneNumber: '4444444',
                });
            });

            it('eligibleShippingMethods lists shipping methods', async () => {
                const result = await shopClient.query<GetShippingMethods.Query>(
                    GET_ELIGIBLE_SHIPPING_METHODS,
                );

                shippingMethods = result.eligibleShippingMethods;

                expect(shippingMethods).toEqual([
                    { id: 'T_1', price: 500, description: 'Standard Shipping' },
                    { id: 'T_2', price: 1000, description: 'Express Shipping' },
                ]);
            });

            it('shipping is initially unset', async () => {
                const result = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);

                expect(result.activeOrder!.shipping).toEqual(0);
                expect(result.activeOrder!.shippingMethod).toEqual(null);
            });

            it('setOrderShippingMethod sets the shipping method', async () => {
                const result = await shopClient.query<
                    SetShippingMethod.Mutation,
                    SetShippingMethod.Variables
                >(SET_SHIPPING_METHOD, {
                    id: shippingMethods[1].id,
                });

                const activeOrderResult = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);

                const order = activeOrderResult.activeOrder!;

                expect(order.shipping).toBe(shippingMethods[1].price);
                expect(order.shippingMethod!.id).toBe(shippingMethods[1].id);
                expect(order.shippingMethod!.description).toBe(shippingMethods[1].description);
            });

            it('shipping method is preserved after adjustOrderLine', async () => {
                const activeOrderResult = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
                activeOrder = activeOrderResult.activeOrder!;
                const { adjustOrderLine } = await shopClient.query<
                    AdjustItemQuantity.Mutation,
                    AdjustItemQuantity.Variables
                >(ADJUST_ITEM_QUANTITY, {
                    orderLineId: activeOrder.lines[0].id,
                    quantity: 10,
                });

                expect(adjustOrderLine!.shipping).toBe(shippingMethods[1].price);
                expect(adjustOrderLine!.shippingMethod!.id).toBe(shippingMethods[1].id);
                expect(adjustOrderLine!.shippingMethod!.description).toBe(shippingMethods[1].description);
            });
        });

        describe('payment', () => {
            it(
                'attempting add a Payment throws error when in AddingItems state',
                assertThrowsWithMessage(
                    () =>
                        shopClient.query<AddPaymentToOrder.Mutation, AddPaymentToOrder.Variables>(
                            ADD_PAYMENT,
                            {
                                input: {
                                    method: testSuccessfulPaymentMethod.code,
                                    metadata: {},
                                },
                            },
                        ),
                    `A Payment may only be added when Order is in "ArrangingPayment" state`,
                ),
            );

            it('transitions to the ArrangingPayment state', async () => {
                const result = await shopClient.query<
                    TransitionToState.Mutation,
                    TransitionToState.Variables
                >(TRANSITION_TO_STATE, { state: 'ArrangingPayment' });
                expect(result.transitionOrderToState).toEqual({
                    id: activeOrder.id,
                    state: 'ArrangingPayment',
                });
            });

            it(
                'attempting to add an item throws error when in ArrangingPayment state',
                assertThrowsWithMessage(
                    () =>
                        shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(
                            ADD_ITEM_TO_ORDER,
                            {
                                productVariantId: 'T_4',
                                quantity: 1,
                            },
                        ),
                    `Order contents may only be modified when in the "AddingItems" state`,
                ),
            );

            it(
                'attempting to modify item quantity throws error when in ArrangingPayment state',
                assertThrowsWithMessage(
                    () =>
                        shopClient.query<AdjustItemQuantity.Mutation, AdjustItemQuantity.Variables>(
                            ADJUST_ITEM_QUANTITY,
                            {
                                orderLineId: activeOrder.lines[0].id,
                                quantity: 12,
                            },
                        ),
                    `Order contents may only be modified when in the "AddingItems" state`,
                ),
            );

            it(
                'attempting to remove an item throws error when in ArrangingPayment state',
                assertThrowsWithMessage(
                    () =>
                        shopClient.query<RemoveItemFromOrder.Mutation, RemoveItemFromOrder.Variables>(
                            REMOVE_ITEM_FROM_ORDER,
                            {
                                orderLineId: activeOrder.lines[0].id,
                            },
                        ),
                    `Order contents may only be modified when in the "AddingItems" state`,
                ),
            );

            it(
                'attempting to setOrderShippingMethod throws error when in ArrangingPayment state',
                assertThrowsWithMessage(async () => {
                    const shippingMethodsResult = await shopClient.query<GetShippingMethods.Query>(
                        GET_ELIGIBLE_SHIPPING_METHODS,
                    );
                    const shippingMethods = shippingMethodsResult.eligibleShippingMethods;
                    return shopClient.query<SetShippingMethod.Mutation, SetShippingMethod.Variables>(
                        SET_SHIPPING_METHOD,
                        {
                            id: shippingMethods[0].id,
                        },
                    );
                }, `Order contents may only be modified when in the "AddingItems" state`),
            );

            it('adds a declined payment', async () => {
                const { addPaymentToOrder } = await shopClient.query<
                    AddPaymentToOrder.Mutation,
                    AddPaymentToOrder.Variables
                >(ADD_PAYMENT, {
                    input: {
                        method: testFailingPaymentMethod.code,
                        metadata: {
                            foo: 'bar',
                        },
                    },
                });

                const payment = addPaymentToOrder!.payments![0];
                expect(addPaymentToOrder!.payments!.length).toBe(1);
                expect(payment.method).toBe(testFailingPaymentMethod.code);
                expect(payment.state).toBe('Declined');
                expect(payment.transactionId).toBe(null);
                expect(payment.metadata).toEqual({
                    foo: 'bar',
                });
            });

            it('adds an error payment and returns error response', async () => {
                try {
                    await shopClient.query<AddPaymentToOrder.Mutation, AddPaymentToOrder.Variables>(
                        ADD_PAYMENT,
                        {
                            input: {
                                method: testErrorPaymentMethod.code,
                                metadata: {
                                    foo: 'bar',
                                },
                            },
                        },
                    );
                    fail('should have thrown');
                } catch (err) {
                    expect(err.message).toEqual('Something went horribly wrong');
                }
                const result = await shopClient.query<GetActiveOrderPayments.Query>(
                    GET_ACTIVE_ORDER_PAYMENTS,
                );
                const payment = result.activeOrder!.payments![1];
                expect(result.activeOrder!.payments!.length).toBe(2);
                expect(payment.method).toBe(testErrorPaymentMethod.code);
                expect(payment.state).toBe('Error');
                expect(payment.errorMessage).toBe('Something went horribly wrong');
            });

            it('adds a successful payment and transitions Order state', async () => {
                const { addPaymentToOrder } = await shopClient.query<
                    AddPaymentToOrder.Mutation,
                    AddPaymentToOrder.Variables
                >(ADD_PAYMENT, {
                    input: {
                        method: testSuccessfulPaymentMethod.code,
                        metadata: {
                            baz: 'quux',
                        },
                    },
                });

                const payment = addPaymentToOrder!.payments![2];
                expect(addPaymentToOrder!.state).toBe('PaymentSettled');
                expect(addPaymentToOrder!.active).toBe(false);
                expect(addPaymentToOrder!.payments!.length).toBe(3);
                expect(payment.method).toBe(testSuccessfulPaymentMethod.code);
                expect(payment.state).toBe('Settled');
                expect(payment.transactionId).toBe('12345');
                expect(payment.metadata).toEqual({
                    baz: 'quux',
                });
            });

            it('does not create new address when Customer already has address', async () => {
                const { customer } = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(
                    GET_CUSTOMER,
                    { id: customers[0].id },
                );
                expect(customer!.addresses!.length).toBe(1);
            });
        });

        describe('orderByCode', () => {
            describe('immediately after Order is placed', () => {
                it('works when authenticated', async () => {
                    const result = await shopClient.query<GetOrderByCode.Query, GetOrderByCode.Variables>(
                        GET_ORDER_BY_CODE,
                        {
                            code: activeOrder.code,
                        },
                    );

                    expect(result.orderByCode!.id).toBe(activeOrder.id);
                });

                it('works when anonymous', async () => {
                    await shopClient.asAnonymousUser();
                    const result = await shopClient.query<GetOrderByCode.Query, GetOrderByCode.Variables>(
                        GET_ORDER_BY_CODE,
                        {
                            code: activeOrder.code,
                        },
                    );

                    expect(result.orderByCode!.id).toBe(activeOrder.id);
                });

                it(
                    `throws error for another user's Order`,
                    assertThrowsWithMessage(async () => {
                        authenticatedUserEmailAddress = customers[1].emailAddress;
                        await shopClient.asUserWithCredentials(authenticatedUserEmailAddress, password);
                        return shopClient.query<GetOrderByCode.Query, GetOrderByCode.Variables>(
                            GET_ORDER_BY_CODE,
                            {
                                code: activeOrder.code,
                            },
                        );
                    }, `You are not currently authorized to perform this action`),
                );
            });
        });
    });

    describe('order merging', () => {
        let customers: GetCustomerList.Items[];

        beforeAll(async () => {
            const result = await adminClient.query<GetCustomerList.Query>(GET_CUSTOMER_LIST);
            customers = result.customers.items;
        });

        it('merges guest order with no existing order', async () => {
            await shopClient.asAnonymousUser();
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });

            expect(addItemToOrder!.lines.length).toBe(1);
            expect(addItemToOrder!.lines[0].productVariant.id).toBe('T_1');

            await shopClient.query<AttemptLogin.Mutation, AttemptLogin.Variables>(ATTEMPT_LOGIN, {
                username: customers[1].emailAddress,
                password: 'test',
            });
            const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);

            expect(activeOrder!.lines.length).toBe(1);
            expect(activeOrder!.lines[0].productVariant.id).toBe('T_1');
        });

        it('merges guest order with existing order', async () => {
            await shopClient.asAnonymousUser();
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_2',
                quantity: 1,
            });

            expect(addItemToOrder!.lines.length).toBe(1);
            expect(addItemToOrder!.lines[0].productVariant.id).toBe('T_2');

            await shopClient.query<AttemptLogin.Mutation, AttemptLogin.Variables>(ATTEMPT_LOGIN, {
                username: customers[1].emailAddress,
                password: 'test',
            });
            const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);

            expect(activeOrder!.lines.length).toBe(2);
            expect(activeOrder!.lines[0].productVariant.id).toBe('T_1');
            expect(activeOrder!.lines[1].productVariant.id).toBe('T_2');
        });

        /**
         * See https://github.com/vendure-ecommerce/vendure/issues/263
         */
        it('does not merge when logging in to a different account (issue #263)', async () => {
            await shopClient.query<AttemptLogin.Mutation, AttemptLogin.Variables>(ATTEMPT_LOGIN, {
                username: customers[2].emailAddress,
                password: 'test',
            });
            const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);

            expect(activeOrder).toBeNull();
        });

        it('does not merge when logging back to other account (issue #263)', async () => {
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_3',
                quantity: 1,
            });

            await shopClient.query<AttemptLogin.Mutation, AttemptLogin.Variables>(ATTEMPT_LOGIN, {
                username: customers[1].emailAddress,
                password: 'test',
            });
            const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);

            expect(activeOrder!.lines.length).toBe(2);
            expect(activeOrder!.lines[0].productVariant.id).toBe('T_1');
            expect(activeOrder!.lines[1].productVariant.id).toBe('T_2');
        });
    });

    describe('security of customer data', () => {
        let customers: GetCustomerList.Items[];

        beforeAll(async () => {
            const result = await adminClient.query<GetCustomerList.Query>(GET_CUSTOMER_LIST);
            customers = result.customers.items;
        });

        it('cannot setCustomOrder to existing non-guest Customer', async () => {
            await shopClient.asAnonymousUser();
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });

            try {
                await shopClient.query<SetCustomerForOrder.Mutation, SetCustomerForOrder.Variables>(
                    SET_CUSTOMER,
                    {
                        input: {
                            emailAddress: customers[0].emailAddress,
                            firstName: 'Evil',
                            lastName: 'Hacker',
                        },
                    },
                );
                fail('Should have thrown');
            } catch (e) {
                expect(e.message).toContain(
                    'Cannot use a registered email address for a guest order. Please log in first',
                );
            }
            const { customer } = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(
                GET_CUSTOMER,
                {
                    id: customers[0].id,
                },
            );
            expect(customer!.firstName).not.toBe('Evil');
            expect(customer!.lastName).not.toBe('Hacker');
        });

        it('guest cannot access Addresses of guest customer', async () => {
            await shopClient.asAnonymousUser();
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });

            await shopClient.query<SetCustomerForOrder.Mutation, SetCustomerForOrder.Variables>(
                SET_CUSTOMER,
                {
                    input: {
                        emailAddress: 'test@test.com',
                        firstName: 'Evil',
                        lastName: 'Hacker',
                    },
                },
            );

            const { activeOrder } = await shopClient.query<GetCustomerAddresses.Query>(
                GET_ACTIVE_ORDER_ADDRESSES,
            );

            expect(activeOrder!.customer!.addresses).toEqual([]);
        });

        it('guest cannot access Orders of guest customer', async () => {
            await shopClient.asAnonymousUser();
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });

            await shopClient.query<SetCustomerForOrder.Mutation, SetCustomerForOrder.Variables>(
                SET_CUSTOMER,
                {
                    input: {
                        emailAddress: 'test@test.com',
                        firstName: 'Evil',
                        lastName: 'Hacker',
                    },
                },
            );

            const { activeOrder } = await shopClient.query<GetCustomerOrders.Query>(GET_ACTIVE_ORDER_ORDERS);

            expect(activeOrder!.customer!.orders.items).toEqual([]);
        });
    });
});
