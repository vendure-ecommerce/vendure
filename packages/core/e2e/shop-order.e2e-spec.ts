/* tslint:disable:no-non-null-assertion */
import { pick } from '@vendure/common/lib/pick';
import { Asset, mergeConfig } from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import {
    testErrorPaymentMethod,
    testFailingPaymentMethod,
    testSuccessfulPaymentMethod,
} from './fixtures/test-payment-methods';
import {
    AttemptLogin,
    CreateAddressInput,
    DeleteProduct,
    DeleteProductVariant,
    GetCountryList,
    GetCustomer,
    GetCustomerList,
    UpdateCountry,
    UpdateProduct,
    UpdateProductVariants,
} from './graphql/generated-e2e-admin-types';
import {
    ActiveOrderCustomerFragment,
    AddItemToOrder,
    AddPaymentToOrder,
    AdjustItemQuantity,
    ErrorCode,
    GetActiveOrder,
    GetActiveOrderPayments,
    GetActiveOrderWithPayments,
    GetAvailableCountries,
    GetCustomerAddresses,
    GetCustomerOrders,
    GetNextOrderStates,
    GetOrderByCode,
    GetShippingMethods,
    RemoveAllOrderLines,
    RemoveItemFromOrder,
    SetBillingAddress,
    SetCustomerForOrder,
    SetShippingAddress,
    SetShippingMethod,
    TestOrderFragmentFragment,
    TestOrderWithPaymentsFragment,
    TransitionToState,
    UpdatedOrderFragment,
} from './graphql/generated-e2e-shop-types';
import {
    ATTEMPT_LOGIN,
    DELETE_PRODUCT,
    DELETE_PRODUCT_VARIANT,
    GET_COUNTRY_LIST,
    GET_CUSTOMER,
    GET_CUSTOMER_LIST,
    UPDATE_COUNTRY,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
} from './graphql/shared-definitions';
import {
    ADD_ITEM_TO_ORDER,
    ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS,
    ADD_PAYMENT,
    ADJUST_ITEM_QUANTITY,
    GET_ACTIVE_ORDER,
    GET_ACTIVE_ORDER_ADDRESSES,
    GET_ACTIVE_ORDER_ORDERS,
    GET_ACTIVE_ORDER_PAYMENTS,
    GET_ACTIVE_ORDER_WITH_PAYMENTS,
    GET_AVAILABLE_COUNTRIES,
    GET_ELIGIBLE_SHIPPING_METHODS,
    GET_NEXT_STATES,
    GET_ORDER_BY_CODE,
    REMOVE_ALL_ORDER_LINES,
    REMOVE_ITEM_FROM_ORDER,
    SET_BILLING_ADDRESS,
    SET_CUSTOMER,
    SET_SHIPPING_ADDRESS,
    SET_SHIPPING_METHOD,
    TRANSITION_TO_STATE,
    UPDATED_ORDER_FRAGMENT,
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
            customFields: {
                Order: [
                    { name: 'giftWrap', type: 'boolean', defaultValue: false },
                    { name: 'orderImage', type: 'relation', entity: Asset },
                ],
                OrderLine: [
                    { name: 'notes', type: 'string' },
                    { name: 'privateField', type: 'string', public: false },
                    { name: 'lineImage', type: 'relation', entity: Asset },
                ],
            },
            orderOptions: {
                orderItemsLimit: 199,
            },
        }),
    );

    type OrderSuccessResult =
        | UpdatedOrderFragment
        | TestOrderFragmentFragment
        | TestOrderWithPaymentsFragment
        | ActiveOrderCustomerFragment;
    const orderResultGuard: ErrorResultGuard<OrderSuccessResult> = createErrorResultGuard(
        input => !!input.lines,
    );

    beforeAll(async () => {
        await server.init({
            initialData: {
                ...initialData,
                paymentMethods: [
                    {
                        name: testSuccessfulPaymentMethod.code,
                        handler: { code: testSuccessfulPaymentMethod.code, arguments: [] },
                    },
                    {
                        name: testFailingPaymentMethod.code,
                        handler: { code: testFailingPaymentMethod.code, arguments: [] },
                    },
                    {
                        name: testErrorPaymentMethod.code,
                        handler: { code: testErrorPaymentMethod.code, arguments: [] },
                    },
                ],
            },
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

            orderResultGuard.assertSuccess(addItemToOrder);
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

        it('addItemToOrder errors with a negative quantity', async () => {
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_999',
                quantity: -3,
            });

            orderResultGuard.assertErrorResult(addItemToOrder);
            expect(addItemToOrder.message).toEqual(`The quantity for an OrderItem cannot be negative`);
            expect(addItemToOrder.errorCode).toEqual(ErrorCode.NEGATIVE_QUANTITY_ERROR);
        });

        it('addItemToOrder with an existing productVariantId adds quantity to the existing OrderLine', async () => {
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 2,
            });
            orderResultGuard.assertSuccess(addItemToOrder);
            expect(addItemToOrder!.lines.length).toBe(1);
            expect(addItemToOrder!.lines[0].quantity).toBe(3);
        });

        describe('OrderLine customFields', () => {
            const GET_ORDER_WITH_ORDER_LINE_CUSTOM_FIELDS = gql`
                query {
                    activeOrder {
                        lines {
                            id
                            customFields {
                                notes
                                lineImage {
                                    id
                                }
                            }
                        }
                    }
                }
            `;
            it('addItemToOrder with private customFields errors', async () => {
                try {
                    await shopClient.query<AddItemToOrder.Mutation>(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS, {
                        productVariantId: 'T_2',
                        quantity: 1,
                        customFields: {
                            privateField: 'oh no!',
                        },
                    });
                    fail('Should have thrown');
                } catch (e) {
                    expect(e.response.errors[0].extensions.code).toBe('BAD_USER_INPUT');
                }
            });

            it('addItemToOrder with equal customFields adds quantity to the existing OrderLine', async () => {
                const { addItemToOrder: add1 } = await shopClient.query<AddItemToOrder.Mutation>(
                    ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS,
                    {
                        productVariantId: 'T_2',
                        quantity: 1,
                        customFields: {
                            notes: 'note1',
                        },
                    },
                );
                orderResultGuard.assertSuccess(add1);
                expect(add1!.lines.length).toBe(2);
                expect(add1!.lines[1].quantity).toBe(1);

                const { addItemToOrder: add2 } = await shopClient.query<AddItemToOrder.Mutation>(
                    ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS,
                    {
                        productVariantId: 'T_2',
                        quantity: 1,
                        customFields: {
                            notes: 'note1',
                        },
                    },
                );
                orderResultGuard.assertSuccess(add2);
                expect(add2!.lines.length).toBe(2);
                expect(add2!.lines[1].quantity).toBe(2);

                await shopClient.query<RemoveItemFromOrder.Mutation, RemoveItemFromOrder.Variables>(
                    REMOVE_ITEM_FROM_ORDER,
                    {
                        orderLineId: add2!.lines[1].id,
                    },
                );
            });

            it('addItemToOrder with different customFields adds quantity to a new OrderLine', async () => {
                const { addItemToOrder: add1 } = await shopClient.query<AddItemToOrder.Mutation>(
                    ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS,
                    {
                        productVariantId: 'T_3',
                        quantity: 1,
                        customFields: {
                            notes: 'note2',
                        },
                    },
                );
                orderResultGuard.assertSuccess(add1);
                expect(add1!.lines.length).toBe(2);
                expect(add1!.lines[1].quantity).toBe(1);

                const { addItemToOrder: add2 } = await shopClient.query<AddItemToOrder.Mutation>(
                    ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS,
                    {
                        productVariantId: 'T_3',
                        quantity: 1,
                        customFields: {
                            notes: 'note3',
                        },
                    },
                );
                orderResultGuard.assertSuccess(add2);
                expect(add2!.lines.length).toBe(3);
                expect(add2!.lines[1].quantity).toBe(1);
                expect(add2!.lines[2].quantity).toBe(1);

                await shopClient.query<RemoveItemFromOrder.Mutation, RemoveItemFromOrder.Variables>(
                    REMOVE_ITEM_FROM_ORDER,
                    {
                        orderLineId: add2!.lines[1].id,
                    },
                );
                await shopClient.query<RemoveItemFromOrder.Mutation, RemoveItemFromOrder.Variables>(
                    REMOVE_ITEM_FROM_ORDER,
                    {
                        orderLineId: add2!.lines[2].id,
                    },
                );
            });

            it('addItemToOrder with relation customField', async () => {
                const { addItemToOrder } = await shopClient.query<AddItemToOrder.Mutation>(
                    ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS,
                    {
                        productVariantId: 'T_3',
                        quantity: 1,
                        customFields: {
                            lineImageId: 'T_1',
                        },
                    },
                );

                orderResultGuard.assertSuccess(addItemToOrder);
                expect(addItemToOrder!.lines.length).toBe(2);
                expect(addItemToOrder!.lines[1].quantity).toBe(1);

                const { activeOrder } = await shopClient.query(GET_ORDER_WITH_ORDER_LINE_CUSTOM_FIELDS);

                expect(activeOrder.lines[1].customFields.lineImage).toEqual({ id: 'T_1' });
            });

            it('addItemToOrder with equal relation customField adds to quantity', async () => {
                const { addItemToOrder } = await shopClient.query<AddItemToOrder.Mutation>(
                    ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS,
                    {
                        productVariantId: 'T_3',
                        quantity: 1,
                        customFields: {
                            lineImageId: 'T_1',
                        },
                    },
                );

                orderResultGuard.assertSuccess(addItemToOrder);
                expect(addItemToOrder!.lines.length).toBe(2);
                expect(addItemToOrder!.lines[1].quantity).toBe(2);

                const { activeOrder } = await shopClient.query(GET_ORDER_WITH_ORDER_LINE_CUSTOM_FIELDS);

                expect(activeOrder.lines[1].customFields.lineImage).toEqual({ id: 'T_1' });
            });

            it('addItemToOrder with different relation customField adds new line', async () => {
                const { addItemToOrder } = await shopClient.query<AddItemToOrder.Mutation>(
                    ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS,
                    {
                        productVariantId: 'T_3',
                        quantity: 1,
                        customFields: {
                            lineImageId: 'T_2',
                        },
                    },
                );

                orderResultGuard.assertSuccess(addItemToOrder);
                expect(addItemToOrder!.lines.length).toBe(3);
                expect(addItemToOrder!.lines[2].quantity).toBe(1);

                const { activeOrder } = await shopClient.query(GET_ORDER_WITH_ORDER_LINE_CUSTOM_FIELDS);

                expect(activeOrder.lines[2].customFields.lineImage).toEqual({ id: 'T_2' });
            });

            it('adjustOrderLine updates relation reference', async () => {
                const { activeOrder } = await shopClient.query(GET_ORDER_WITH_ORDER_LINE_CUSTOM_FIELDS);

                const ADJUST_ORDER_LINE_WITH_CUSTOM_FIELDS = gql`
                    mutation($orderLineId: ID!, $quantity: Int!, $customFields: OrderLineCustomFieldsInput) {
                        adjustOrderLine(
                            orderLineId: $orderLineId
                            quantity: $quantity
                            customFields: $customFields
                        ) {
                            ... on Order {
                                lines {
                                    id
                                    customFields {
                                        notes
                                        lineImage {
                                            id
                                        }
                                    }
                                }
                            }
                        }
                    }
                `;
                const { adjustOrderLine } = await shopClient.query(ADJUST_ORDER_LINE_WITH_CUSTOM_FIELDS, {
                    orderLineId: activeOrder.lines[2].id,
                    quantity: 1,
                    customFields: {
                        lineImageId: 'T_1',
                    },
                });

                expect(adjustOrderLine.lines[2].customFields.lineImage).toEqual({ id: 'T_1' });

                await shopClient.query<RemoveItemFromOrder.Mutation, RemoveItemFromOrder.Variables>(
                    REMOVE_ITEM_FROM_ORDER,
                    {
                        orderLineId: activeOrder!.lines[2].id,
                    },
                );
                await shopClient.query<RemoveItemFromOrder.Mutation, RemoveItemFromOrder.Variables>(
                    REMOVE_ITEM_FROM_ORDER,
                    {
                        orderLineId: activeOrder!.lines[1].id,
                    },
                );
            });
        });

        it('addItemToOrder errors when going beyond orderItemsLimit', async () => {
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 200,
            });

            orderResultGuard.assertErrorResult(addItemToOrder);
            expect(addItemToOrder.message).toBe(
                'Cannot add items. An order may consist of a maximum of 199 items',
            );
            expect(addItemToOrder.errorCode).toBe(ErrorCode.ORDER_LIMIT_ERROR);
        });

        it('adjustOrderLine adjusts the quantity', async () => {
            const { adjustOrderLine } = await shopClient.query<
                AdjustItemQuantity.Mutation,
                AdjustItemQuantity.Variables
            >(ADJUST_ITEM_QUANTITY, {
                orderLineId: firstOrderLineId,
                quantity: 50,
            });
            orderResultGuard.assertSuccess(adjustOrderLine);
            expect(adjustOrderLine!.lines.length).toBe(1);
            expect(adjustOrderLine!.lines[0].quantity).toBe(50);
        });

        it('adjustOrderLine with quantity 0 removes the line', async () => {
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_3',
                quantity: 3,
            });
            orderResultGuard.assertSuccess(addItemToOrder);
            expect(addItemToOrder!.lines.length).toBe(2);
            expect(addItemToOrder!.lines.map(i => i.productVariant.id)).toEqual(['T_1', 'T_3']);

            const { adjustOrderLine } = await shopClient.query<
                AdjustItemQuantity.Mutation,
                AdjustItemQuantity.Variables
            >(ADJUST_ITEM_QUANTITY, {
                orderLineId: addItemToOrder?.lines[1].id!,
                quantity: 0,
            });
            orderResultGuard.assertSuccess(adjustOrderLine);
            expect(adjustOrderLine!.lines.length).toBe(1);
            expect(adjustOrderLine!.lines.map(i => i.productVariant.id)).toEqual(['T_1']);
        });

        it('adjustOrderLine with quantity > stockOnHand only allows user to have stock on hand', async () => {
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_3',
                quantity: 111,
            });
            orderResultGuard.assertErrorResult(addItemToOrder);
            // Insufficient stock error should return because there are only 100 available
            expect(addItemToOrder.errorCode).toBe('INSUFFICIENT_STOCK_ERROR');

            // But it should still add the item to the order
            expect(addItemToOrder!.order.lines[1].quantity).toBe(100);

            const { adjustOrderLine } = await shopClient.query<
                AdjustItemQuantity.Mutation,
                AdjustItemQuantity.Variables
            >(ADJUST_ITEM_QUANTITY, {
                orderLineId: 'T_8',
                quantity: 101,
            });
            orderResultGuard.assertErrorResult(adjustOrderLine);
            expect(adjustOrderLine.errorCode).toBe('INSUFFICIENT_STOCK_ERROR');
            expect(adjustOrderLine.message).toBe(
                'Only 100 items were added to the order due to insufficient stock',
            );

            const order = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
            expect(order.activeOrder?.lines[1].quantity).toBe(100);

            const { adjustOrderLine: adjustLine2 } = await shopClient.query<
                AdjustItemQuantity.Mutation,
                AdjustItemQuantity.Variables
            >(ADJUST_ITEM_QUANTITY, {
                orderLineId: 'T_8',
                quantity: 0,
            });
            orderResultGuard.assertSuccess(adjustLine2);
            expect(adjustLine2!.lines.length).toBe(1);
            expect(adjustLine2!.lines.map(i => i.productVariant.id)).toEqual(['T_1']);
        });

        it('adjustOrderLine errors when going beyond orderItemsLimit', async () => {
            const { adjustOrderLine } = await shopClient.query<
                AdjustItemQuantity.Mutation,
                AdjustItemQuantity.Variables
            >(ADJUST_ITEM_QUANTITY, {
                orderLineId: firstOrderLineId,
                quantity: 200,
            });
            orderResultGuard.assertErrorResult(adjustOrderLine);
            expect(adjustOrderLine.message).toBe(
                'Cannot add items. An order may consist of a maximum of 199 items',
            );
            expect(adjustOrderLine.errorCode).toBe(ErrorCode.ORDER_LIMIT_ERROR);
        });

        it('adjustOrderLine errors with a negative quantity', async () => {
            const { adjustOrderLine } = await shopClient.query<
                AdjustItemQuantity.Mutation,
                AdjustItemQuantity.Variables
            >(ADJUST_ITEM_QUANTITY, {
                orderLineId: firstOrderLineId,
                quantity: -3,
            });
            orderResultGuard.assertErrorResult(adjustOrderLine);
            expect(adjustOrderLine.message).toBe('The quantity for an OrderItem cannot be negative');
            expect(adjustOrderLine.errorCode).toBe(ErrorCode.NEGATIVE_QUANTITY_ERROR);
        });

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
            orderResultGuard.assertSuccess(addItemToOrder);
            expect(addItemToOrder!.lines.length).toBe(2);
            expect(addItemToOrder!.lines.map(i => i.productVariant.id)).toEqual(['T_1', 'T_3']);

            const { removeOrderLine } = await shopClient.query<
                RemoveItemFromOrder.Mutation,
                RemoveItemFromOrder.Variables
            >(REMOVE_ITEM_FROM_ORDER, {
                orderLineId: firstOrderLineId,
            });
            orderResultGuard.assertSuccess(removeOrderLine);
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

        it('transitionOrderToState returns error result for invalid state', async () => {
            const { transitionOrderToState } = await shopClient.query<
                TransitionToState.Mutation,
                TransitionToState.Variables
            >(TRANSITION_TO_STATE, { state: 'Completed' });
            orderResultGuard.assertErrorResult(transitionOrderToState);

            expect(transitionOrderToState!.message).toBe(
                `Cannot transition Order from "AddingItems" to "Completed"`,
            );
            expect(transitionOrderToState!.errorCode).toBe(ErrorCode.ORDER_STATE_TRANSITION_ERROR);
        });

        it('attempting to transition to ArrangingPayment returns error result when Order has no Customer', async () => {
            const { transitionOrderToState } = await shopClient.query<
                TransitionToState.Mutation,
                TransitionToState.Variables
            >(TRANSITION_TO_STATE, { state: 'ArrangingPayment' });
            orderResultGuard.assertErrorResult(transitionOrderToState);

            expect(transitionOrderToState!.transitionError).toBe(
                `Cannot transition Order to the "ArrangingPayment" state without Customer details`,
            );
            expect(transitionOrderToState!.errorCode).toBe(ErrorCode.ORDER_STATE_TRANSITION_ERROR);
        });

        it('setCustomerForOrder returns error result on email address conflict', async () => {
            const { customers } = await adminClient.query<GetCustomerList.Query>(GET_CUSTOMER_LIST);

            const { setCustomerForOrder } = await shopClient.query<
                SetCustomerForOrder.Mutation,
                SetCustomerForOrder.Variables
            >(SET_CUSTOMER, {
                input: {
                    emailAddress: customers.items[0].emailAddress,
                    firstName: 'Test',
                    lastName: 'Person',
                },
            });
            orderResultGuard.assertErrorResult(setCustomerForOrder);

            expect(setCustomerForOrder!.message).toBe('The email address is not available.');
            expect(setCustomerForOrder!.errorCode).toBe(ErrorCode.EMAIL_ADDRESS_CONFLICT_ERROR);
        });

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
            orderResultGuard.assertSuccess(setCustomerForOrder);

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
            orderResultGuard.assertSuccess(setCustomerForOrder);

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

        it('setOrderBillingAddress sets billing address', async () => {
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
            const { setOrderBillingAddress } = await shopClient.query<
                SetBillingAddress.Mutation,
                SetBillingAddress.Variables
            >(SET_BILLING_ADDRESS, {
                input: address,
            });

            expect(setOrderBillingAddress!.billingAddress).toEqual({
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
            const { transitionOrderToState } = await shopClient.query<
                TransitionToState.Mutation,
                TransitionToState.Variables
            >(TRANSITION_TO_STATE, { state: 'ArrangingPayment' });
            orderResultGuard.assertSuccess(transitionOrderToState);

            expect(pick(transitionOrderToState, ['id', 'state'])).toEqual({
                id: 'T_1',
                state: 'ArrangingPayment',
            });
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
            orderResultGuard.assertSuccess(addPaymentToOrder);

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
        let activeOrder: UpdatedOrderFragment;
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
            orderResultGuard.assertSuccess(addItemToOrder);
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
            orderResultGuard.assertSuccess(addItemToOrder);
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
            orderResultGuard.assertSuccess(adjustOrderLine);
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
            orderResultGuard.assertSuccess(addItemToOrder);
            expect(addItemToOrder!.lines.length).toBe(2);
            expect(addItemToOrder!.lines.map(i => i.productVariant.id)).toEqual(['T_1', 'T_3']);

            const { removeOrderLine } = await shopClient.query<
                RemoveItemFromOrder.Mutation,
                RemoveItemFromOrder.Variables
            >(REMOVE_ITEM_FROM_ORDER, {
                orderLineId: firstOrderLineId,
            });
            orderResultGuard.assertSuccess(removeOrderLine);
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

        it('cannot setCustomerForOrder when already logged in', async () => {
            const { setCustomerForOrder } = await shopClient.query<
                SetCustomerForOrder.Mutation,
                SetCustomerForOrder.Variables
            >(SET_CUSTOMER, {
                input: {
                    emailAddress: 'newperson@email.com',
                    firstName: 'New',
                    lastName: 'Person',
                },
            });
            orderResultGuard.assertErrorResult(setCustomerForOrder);

            expect(setCustomerForOrder!.message).toBe(
                'Cannot set a Customer for the Order when already logged in',
            );
            expect(setCustomerForOrder!.errorCode).toBe(ErrorCode.ALREADY_LOGGED_IN_ERROR);
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
                    {
                        id: 'T_1',
                        price: 500,
                        code: 'standard-shipping',
                        name: 'Standard Shipping',
                        description: '',
                    },
                    {
                        id: 'T_2',
                        price: 1000,
                        code: 'express-shipping',
                        name: 'Express Shipping',
                        description: '',
                    },
                ]);
            });

            it('shipping is initially unset', async () => {
                const result = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);

                expect(result.activeOrder!.shipping).toEqual(0);
                expect(result.activeOrder!.shippingLines).toEqual([]);
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
                expect(order.shippingLines[0].shippingMethod!.id).toBe(shippingMethods[1].id);
                expect(order.shippingLines[0].shippingMethod!.description).toBe(
                    shippingMethods[1].description,
                );
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
                orderResultGuard.assertSuccess(adjustOrderLine);
                expect(adjustOrderLine!.shipping).toBe(shippingMethods[1].price);
                expect(adjustOrderLine!.shippingLines[0].shippingMethod!.id).toBe(shippingMethods[1].id);
                expect(adjustOrderLine!.shippingLines[0].shippingMethod!.description).toBe(
                    shippingMethods[1].description,
                );
            });
        });

        describe('payment', () => {
            it('attempting add a Payment returns error result when in AddingItems state', async () => {
                const { addPaymentToOrder } = await shopClient.query<
                    AddPaymentToOrder.Mutation,
                    AddPaymentToOrder.Variables
                >(ADD_PAYMENT, {
                    input: {
                        method: testSuccessfulPaymentMethod.code,
                        metadata: {},
                    },
                });

                orderResultGuard.assertErrorResult(addPaymentToOrder);
                expect(addPaymentToOrder!.message).toBe(
                    `A Payment may only be added when Order is in "ArrangingPayment" state`,
                );
                expect(addPaymentToOrder!.errorCode).toBe(ErrorCode.ORDER_PAYMENT_STATE_ERROR);
            });

            it('transitions to the ArrangingPayment state', async () => {
                const { transitionOrderToState } = await shopClient.query<
                    TransitionToState.Mutation,
                    TransitionToState.Variables
                >(TRANSITION_TO_STATE, { state: 'ArrangingPayment' });

                orderResultGuard.assertSuccess(transitionOrderToState);
                expect(pick(transitionOrderToState, ['id', 'state'])).toEqual({
                    id: activeOrder.id,
                    state: 'ArrangingPayment',
                });
            });

            it('attempting to add an item returns error result when in ArrangingPayment state', async () => {
                const { addItemToOrder } = await shopClient.query<
                    AddItemToOrder.Mutation,
                    AddItemToOrder.Variables
                >(ADD_ITEM_TO_ORDER, {
                    productVariantId: 'T_4',
                    quantity: 1,
                });

                orderResultGuard.assertErrorResult(addItemToOrder);
                expect(addItemToOrder.message).toBe(
                    `Order contents may only be modified when in the "AddingItems" state`,
                );
                expect(addItemToOrder.errorCode).toBe(ErrorCode.ORDER_MODIFICATION_ERROR);
            });

            it('attempting to modify item quantity returns error result when in ArrangingPayment state', async () => {
                const { adjustOrderLine } = await shopClient.query<
                    AdjustItemQuantity.Mutation,
                    AdjustItemQuantity.Variables
                >(ADJUST_ITEM_QUANTITY, {
                    orderLineId: activeOrder.lines[0].id,
                    quantity: 12,
                });
                orderResultGuard.assertErrorResult(adjustOrderLine);
                expect(adjustOrderLine.message).toBe(
                    `Order contents may only be modified when in the "AddingItems" state`,
                );
                expect(adjustOrderLine.errorCode).toBe(ErrorCode.ORDER_MODIFICATION_ERROR);
            });

            it('attempting to remove an item returns error result when in ArrangingPayment state', async () => {
                const { removeOrderLine } = await shopClient.query<
                    RemoveItemFromOrder.Mutation,
                    RemoveItemFromOrder.Variables
                >(REMOVE_ITEM_FROM_ORDER, {
                    orderLineId: activeOrder.lines[0].id,
                });
                orderResultGuard.assertErrorResult(removeOrderLine);
                expect(removeOrderLine.message).toBe(
                    `Order contents may only be modified when in the "AddingItems" state`,
                );
                expect(removeOrderLine.errorCode).toBe(ErrorCode.ORDER_MODIFICATION_ERROR);
            });

            it('attempting to remove all items returns error result when in ArrangingPayment state', async () => {
                const { removeAllOrderLines } = await shopClient.query<RemoveAllOrderLines.Mutation>(
                    REMOVE_ALL_ORDER_LINES,
                );
                orderResultGuard.assertErrorResult(removeAllOrderLines);
                expect(removeAllOrderLines.message).toBe(
                    `Order contents may only be modified when in the "AddingItems" state`,
                );
                expect(removeAllOrderLines.errorCode).toBe(ErrorCode.ORDER_MODIFICATION_ERROR);
            });

            it('attempting to setOrderShippingMethod returns error result when in ArrangingPayment state', async () => {
                const shippingMethodsResult = await shopClient.query<GetShippingMethods.Query>(
                    GET_ELIGIBLE_SHIPPING_METHODS,
                );
                const shippingMethods = shippingMethodsResult.eligibleShippingMethods;
                const { setOrderShippingMethod } = await shopClient.query<
                    SetShippingMethod.Mutation,
                    SetShippingMethod.Variables
                >(SET_SHIPPING_METHOD, {
                    id: shippingMethods[0].id,
                });
                orderResultGuard.assertErrorResult(setOrderShippingMethod);
                expect(setOrderShippingMethod.message).toBe(
                    `Order contents may only be modified when in the "AddingItems" state`,
                );
                expect(setOrderShippingMethod.errorCode).toBe(ErrorCode.ORDER_MODIFICATION_ERROR);
            });

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
                orderResultGuard.assertErrorResult(addPaymentToOrder);

                expect(addPaymentToOrder!.message).toBe('The payment was declined');
                expect(addPaymentToOrder!.errorCode).toBe(ErrorCode.PAYMENT_DECLINED_ERROR);
                expect((addPaymentToOrder as any).paymentErrorMessage).toBe('Insufficient funds');

                const { activeOrder: order } = await shopClient.query<GetActiveOrderWithPayments.Query>(
                    GET_ACTIVE_ORDER_WITH_PAYMENTS,
                );
                const payment = order!.payments![0];
                expect(order!.payments!.length).toBe(1);
                expect(payment.method).toBe(testFailingPaymentMethod.code);
                expect(payment.state).toBe('Declined');
                expect(payment.transactionId).toBe(null);
                expect(payment.metadata).toEqual({
                    public: { foo: 'bar' },
                });
            });

            it('adds an error payment and returns error result', async () => {
                const { addPaymentToOrder } = await shopClient.query<
                    AddPaymentToOrder.Mutation,
                    AddPaymentToOrder.Variables
                >(ADD_PAYMENT, {
                    input: {
                        method: testErrorPaymentMethod.code,
                        metadata: {
                            foo: 'bar',
                        },
                    },
                });

                orderResultGuard.assertErrorResult(addPaymentToOrder);
                expect(addPaymentToOrder!.message).toBe('The payment failed');
                expect(addPaymentToOrder!.errorCode).toBe(ErrorCode.PAYMENT_FAILED_ERROR);
                expect((addPaymentToOrder as any).paymentErrorMessage).toBe('Something went horribly wrong');

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
                orderResultGuard.assertSuccess(addPaymentToOrder);

                const payment = addPaymentToOrder!.payments!.find(p => p.transactionId === '12345')!;
                expect(addPaymentToOrder!.state).toBe('PaymentSettled');
                expect(addPaymentToOrder!.active).toBe(false);
                expect(addPaymentToOrder!.payments!.length).toBe(3);
                expect(payment.method).toBe(testSuccessfulPaymentMethod.code);
                expect(payment.state).toBe('Settled');
                expect(payment.transactionId).toBe('12345');
                expect(payment.metadata).toEqual({
                    public: { baz: 'quux' },
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

            describe('3 hours after the Order has been placed', () => {
                let dateNowMock: any;
                beforeAll(() => {
                    // mock Date.now: add 3 hours
                    const nowIn3H = Date.now() + 3 * 3600 * 1000;
                    dateNowMock = jest.spyOn(global.Date, 'now').mockImplementation(() => nowIn3H);
                });

                it('still works when authenticated as owner', async () => {
                    authenticatedUserEmailAddress = customers[0].emailAddress;
                    await shopClient.asUserWithCredentials(authenticatedUserEmailAddress, password);
                    const result = await shopClient.query<GetOrderByCode.Query, GetOrderByCode.Variables>(
                        GET_ORDER_BY_CODE,
                        {
                            code: activeOrder.code,
                        },
                    );

                    expect(result.orderByCode!.id).toBe(activeOrder.id);
                });

                it(
                    'access denied when anonymous',
                    assertThrowsWithMessage(async () => {
                        await shopClient.asAnonymousUser();
                        await shopClient.query<GetOrderByCode.Query, GetOrderByCode.Variables>(
                            GET_ORDER_BY_CODE,
                            {
                                code: activeOrder.code,
                            },
                        );
                    }, `You are not currently authorized to perform this action`),
                );

                afterAll(() => {
                    // restore Date.now
                    dateNowMock.mockRestore();
                });
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
            orderResultGuard.assertSuccess(addItemToOrder);
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
            orderResultGuard.assertSuccess(addItemToOrder);
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

        // https://github.com/vendure-ecommerce/vendure/issues/754
        it('handles merging when an existing order has OrderLines', async () => {
            async function setShippingOnActiveOrder() {
                await shopClient.query<SetShippingAddress.Mutation, SetShippingAddress.Variables>(
                    SET_SHIPPING_ADDRESS,
                    {
                        input: {
                            streetLine1: '12 the street',
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
            }

            // Set up an existing order and add a ShippingLine
            await shopClient.asUserWithCredentials(customers[2].emailAddress, 'test');
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_3',
                quantity: 1,
            });
            await setShippingOnActiveOrder();

            // Now start a new guest order
            await shopClient.query(LOG_OUT);
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_4',
                quantity: 1,
            });
            await setShippingOnActiveOrder();

            // attempt to log in and merge the guest order with the existing order
            const { login } = await shopClient.query<AttemptLogin.Mutation, AttemptLogin.Variables>(
                ATTEMPT_LOGIN,
                {
                    username: customers[2].emailAddress,
                    password: 'test',
                },
            );

            expect(login.identifier).toBe(customers[2].emailAddress);
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

            const { setCustomerForOrder } = await shopClient.query<
                SetCustomerForOrder.Mutation,
                SetCustomerForOrder.Variables
            >(SET_CUSTOMER, {
                input: {
                    emailAddress: customers[0].emailAddress,
                    firstName: 'Evil',
                    lastName: 'Hacker',
                },
            });
            orderResultGuard.assertErrorResult(setCustomerForOrder);

            expect(setCustomerForOrder!.message).toBe('The email address is not available.');
            expect(setCustomerForOrder!.errorCode).toBe(ErrorCode.EMAIL_ADDRESS_CONFLICT_ERROR);

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

    describe('order custom fields', () => {
        it('custom fields added to type', async () => {
            await shopClient.asAnonymousUser();
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });
            const { activeOrder } = await shopClient.query(GET_ORDER_CUSTOM_FIELDS);

            expect(activeOrder?.customFields).toEqual({
                orderImage: null,
                giftWrap: false,
            });
        });

        it('setting order custom fields', async () => {
            const { setOrderCustomFields } = await shopClient.query(SET_ORDER_CUSTOM_FIELDS, {
                input: {
                    customFields: { giftWrap: true, orderImageId: 'T_1' },
                },
            });

            expect(setOrderCustomFields?.customFields).toEqual({
                orderImage: { id: 'T_1' },
                giftWrap: true,
            });

            const { activeOrder } = await shopClient.query(GET_ORDER_CUSTOM_FIELDS);

            expect(activeOrder?.customFields).toEqual({
                orderImage: { id: 'T_1' },
                giftWrap: true,
            });
        });
    });

    describe('remove all order lines', () => {
        beforeAll(async () => {
            await shopClient.asAnonymousUser();
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_2',
                quantity: 3,
            });
        });
        it('should remove all order lines', async () => {
            const { removeAllOrderLines } = await shopClient.query<
                RemoveAllOrderLines.Mutation,
                RemoveAllOrderLines.Variables
            >(REMOVE_ALL_ORDER_LINES);
            orderResultGuard.assertSuccess(removeAllOrderLines);
            expect(removeAllOrderLines?.total).toBe(0);
            expect(removeAllOrderLines?.lines.length).toBe(0);
        });
    });

    describe('validation of product variant availability', () => {
        const bonsaiProductId = 'T_20';
        const bonsaiVariantId = 'T_34';

        beforeAll(async () => {
            await shopClient.asAnonymousUser();
        });

        it(
            'addItemToOrder errors when product is disabled',
            assertThrowsWithMessage(async () => {
                await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                    input: {
                        id: bonsaiProductId,
                        enabled: false,
                    },
                });

                await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                    productVariantId: bonsaiVariantId,
                    quantity: 1,
                });
            }, `No ProductVariant with the id '34' could be found`),
        );

        it(
            'addItemToOrder errors when product variant is disabled',
            assertThrowsWithMessage(async () => {
                await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                    input: {
                        id: bonsaiProductId,
                        enabled: true,
                    },
                });
                await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                    UPDATE_PRODUCT_VARIANTS,
                    {
                        input: [
                            {
                                id: bonsaiVariantId,
                                enabled: false,
                            },
                        ],
                    },
                );

                await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                    productVariantId: bonsaiVariantId,
                    quantity: 1,
                });
            }, `No ProductVariant with the id '34' could be found`),
        );
        it(
            'addItemToOrder errors when product is deleted',
            assertThrowsWithMessage(async () => {
                await adminClient.query<DeleteProduct.Mutation, DeleteProduct.Variables>(DELETE_PRODUCT, {
                    id: bonsaiProductId,
                });

                await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                    productVariantId: bonsaiVariantId,
                    quantity: 1,
                });
            }, `No ProductVariant with the id '34' could be found`),
        );
        it(
            'addItemToOrder errors when product variant is deleted',
            assertThrowsWithMessage(async () => {
                await adminClient.query<DeleteProductVariant.Mutation, DeleteProductVariant.Variables>(
                    DELETE_PRODUCT_VARIANT,
                    {
                        id: bonsaiVariantId,
                    },
                );

                await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                    productVariantId: bonsaiVariantId,
                    quantity: 1,
                });
            }, `No ProductVariant with the id '34' could be found`),
        );

        it('errors when transitioning to ArrangingPayment with deleted variant', async () => {
            const orchidProductId = 'T_19';
            const orchidVariantId = 'T_33';

            await shopClient.asUserWithCredentials('marques.sawayn@hotmail.com', 'test');
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: orchidVariantId,
                quantity: 1,
            });

            orderResultGuard.assertSuccess(addItemToOrder);

            await adminClient.query<DeleteProduct.Mutation, DeleteProduct.Variables>(DELETE_PRODUCT, {
                id: orchidProductId,
            });

            const { transitionOrderToState } = await shopClient.query<
                TransitionToState.Mutation,
                TransitionToState.Variables
            >(TRANSITION_TO_STATE, {
                state: 'ArrangingPayment',
            });
            orderResultGuard.assertErrorResult(transitionOrderToState);

            expect(transitionOrderToState!.transitionError).toBe(
                `Cannot transition to "ArrangingPayment" because the Order contains ProductVariants which are no longer available`,
            );
            expect(transitionOrderToState!.errorCode).toBe(ErrorCode.ORDER_STATE_TRANSITION_ERROR);
        });
    });
});

const GET_ORDER_CUSTOM_FIELDS = gql`
    query GetOrderCustomFields {
        activeOrder {
            id
            customFields {
                giftWrap
                orderImage {
                    id
                }
            }
        }
    }
`;

const SET_ORDER_CUSTOM_FIELDS = gql`
    mutation SetOrderCustomFields($input: UpdateOrderInput!) {
        setOrderCustomFields(input: $input) {
            ... on Order {
                id
                customFields {
                    giftWrap
                    orderImage {
                        id
                    }
                }
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`;

export const LOG_OUT = gql`
    mutation LogOut {
        logout {
            success
        }
    }
`;

export const ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS = gql`
    mutation AddItemToOrderWithCustomFields(
        $productVariantId: ID!
        $quantity: Int!
        $customFields: OrderLineCustomFieldsInput
    ) {
        addItemToOrder(
            productVariantId: $productVariantId
            quantity: $quantity
            customFields: $customFields
        ) {
            ...UpdatedOrder
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${UPDATED_ORDER_FRAGMENT}
`;
