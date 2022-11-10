import { DefaultLogger, mergeConfig, orderPercentageDiscount } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { testSuccessfulPaymentMethod } from './fixtures/test-payment-methods';
import { TokenActiveOrderPlugin } from './fixtures/test-plugins/token-active-order-plugin';
import {
    CreatePromotionMutation,
    CreatePromotionMutationVariables,
    GetCustomerListQuery,
} from './graphql/generated-e2e-admin-types';
import {
    AddItemToOrderMutation,
    AddItemToOrderMutationVariables,
    GetActiveOrderQuery,
} from './graphql/generated-e2e-shop-types';
import { CREATE_PROMOTION, GET_CUSTOMER_LIST } from './graphql/shared-definitions';
import { ADD_ITEM_TO_ORDER, GET_ACTIVE_ORDER } from './graphql/shop-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('custom ActiveOrderStrategy', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            logger: new DefaultLogger(),
            plugins: [TokenActiveOrderPlugin],
            paymentOptions: {
                paymentMethodHandlers: [testSuccessfulPaymentMethod],
            },
            customFields: {
                Order: [
                    {
                        name: 'message',
                        type: 'string',
                        nullable: true,
                    },
                ],
            },
        }),
    );

    let customers: GetCustomerListQuery['customers']['items'];

    beforeAll(async () => {
        await server.init({
            initialData: {
                ...initialData,
                paymentMethods: [
                    {
                        name: testSuccessfulPaymentMethod.code,
                        handler: { code: testSuccessfulPaymentMethod.code, arguments: [] },
                    },
                ],
            },
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 3,
        });
        await adminClient.asSuperAdmin();
        const result = await adminClient.query<GetCustomerListQuery>(GET_CUSTOMER_LIST);
        customers = result.customers.items;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('activeOrder with no createActiveOrder defined returns null', async () => {
        const { activeOrder } = await shopClient.query<GetActiveOrderQuery>(GET_ACTIVE_ORDER);

        expect(activeOrder).toBeNull();
    });

    it(
        'addItemToOrder with no createActiveOrder throws',
        assertThrowsWithMessage(async () => {
            await shopClient.query<AddItemToOrderMutation, AddItemToOrderMutationVariables>(
                ADD_ITEM_TO_ORDER,
                {
                    productVariantId: 'T_1',
                    quantity: 1,
                },
            );
        }, 'No active Order could be determined nor created'),
    );

    it('activeOrder with valid input', async () => {
        const { createOrder } = await shopClient.query(gql`
            mutation CreateCustomOrder {
                createOrder(customerId: "${customers[1].id}") {
                    id
                    orderToken
                }
            }
        `);

        expect(createOrder).toEqual({
            id: 'T_1',
            orderToken: 'token-2',
        });

        await shopClient.asUserWithCredentials(customers[1].emailAddress, 'test');
        const { activeOrder } = await shopClient.query(ACTIVE_ORDER_BY_TOKEN, {
            input: {
                orderToken: { token: 'token-2' },
            },
        });

        expect(activeOrder).toEqual({
            id: 'T_1',
            orderToken: 'token-2',
        });
    });

    it('activeOrder with invalid input', async () => {
        await shopClient.asUserWithCredentials(customers[1].emailAddress, 'test');
        const { activeOrder } = await shopClient.query(ACTIVE_ORDER_BY_TOKEN, {
            input: {
                orderToken: { token: 'invalid' },
            },
        });

        expect(activeOrder).toBeNull();
    });

    it('activeOrder with invalid condition', async () => {
        // wrong customer logged in
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        const { activeOrder } = await shopClient.query(ACTIVE_ORDER_BY_TOKEN, {
            input: {
                orderToken: { token: 'token-2' },
            },
        });

        expect(activeOrder).toBeNull();
    });

    describe('happy path', () => {
        const activeOrderInput = `activeOrderInput: { orderToken: { token: "token-2" } }`;
        const TEST_COUPON_CODE = 'TESTCOUPON';
        let firstOrderLineId: string;

        beforeAll(async () => {
            await shopClient.asUserWithCredentials(customers[1].emailAddress, 'test');
            const result = await adminClient.query<CreatePromotionMutation, CreatePromotionMutationVariables>(
                CREATE_PROMOTION,
                {
                    input: {
                        enabled: true,
                        name: 'Free with test coupon',
                        couponCode: TEST_COUPON_CODE,
                        conditions: [],
                        actions: [
                            {
                                code: orderPercentageDiscount.code,
                                arguments: [{ name: 'discount', value: '100' }],
                            },
                        ],
                    },
                },
            );
        });

        it('addItemToOrder', async () => {
            const { addItemToOrder } = await shopClient.query(gql`
                mutation {
                    addItemToOrder(productVariantId: "T_1", quantity: 1, ${activeOrderInput}) {
                        ...on Order {
                            id
                            orderToken
                            lines {
                                id
                                productVariant { id }
                            }
                        }
                    }
                }
            `);

            expect(addItemToOrder).toEqual({
                id: 'T_1',
                orderToken: 'token-2',
                lines: [
                    {
                        id: 'T_1',
                        productVariant: { id: 'T_1' },
                    },
                ],
            });
            firstOrderLineId = addItemToOrder.lines[0].id;
        });

        it('adjustOrderLine', async () => {
            const { adjustOrderLine } = await shopClient.query(gql`
                mutation {
                    adjustOrderLine(orderLineId: "${firstOrderLineId}", quantity: 2, ${activeOrderInput}) {
                        ...on Order {
                            id
                            orderToken
                            lines {
                                quantity
                                productVariant { id }
                            }
                        }
                    }
                }
            `);

            expect(adjustOrderLine).toEqual({
                id: 'T_1',
                orderToken: 'token-2',
                lines: [
                    {
                        quantity: 2,
                        productVariant: { id: 'T_1' },
                    },
                ],
            });
        });

        it('removeOrderLine', async () => {
            const { removeOrderLine } = await shopClient.query(gql`
                mutation {
                    removeOrderLine(orderLineId: "${firstOrderLineId}", ${activeOrderInput}) {
                        ...on Order {
                            id
                            orderToken
                            lines {
                                id
                            }
                        }
                    }
                }
            `);
            expect(removeOrderLine).toEqual({
                id: 'T_1',
                orderToken: 'token-2',
                lines: [],
            });
        });

        it('removeAllOrderLines', async () => {
            const { addItemToOrder } = await shopClient.query(gql`
                mutation {
                    addItemToOrder(productVariantId: "T_1", quantity: 1, ${activeOrderInput}) {
                        ...on Order { lines { id } }
                    }
                }
            `);
            expect(addItemToOrder.lines.length).toBe(1);

            const { removeAllOrderLines } = await shopClient.query(gql`
                mutation {
                    removeAllOrderLines(${activeOrderInput}) {
                    ...on Order {
                        id
                        orderToken
                        lines { id }
                    }
                }
                }
            `);
            expect(removeAllOrderLines.lines.length).toBe(0);
        });

        it('applyCouponCode', async () => {
            await shopClient.query(gql`
                mutation {
                    addItemToOrder(productVariantId: "T_1", quantity: 1, ${activeOrderInput}) {
                        ...on Order { lines { id } }
                    }
                }
            `);
            const { applyCouponCode } = await shopClient.query(gql`
                mutation {
                    applyCouponCode(couponCode: "${TEST_COUPON_CODE}", ${activeOrderInput}) {
                        ...on Order {
                            id
                            orderToken
                            couponCodes
                            discounts {
                                description
                            }
                        }
                    }
                }
            `);
            expect(applyCouponCode).toEqual({
                id: 'T_1',
                orderToken: 'token-2',
                couponCodes: [TEST_COUPON_CODE],
                discounts: [{ description: 'Free with test coupon' }],
            });
        });

        it('removeCouponCode', async () => {
            const { removeCouponCode } = await shopClient.query(gql`
                mutation {
                    removeCouponCode(couponCode: "${TEST_COUPON_CODE}", ${activeOrderInput}) {
                        ...on Order {
                            id
                            orderToken
                            couponCodes
                            discounts {
                                description
                            }
                        }
                    }
                }
            `);
            expect(removeCouponCode).toEqual({
                id: 'T_1',
                orderToken: 'token-2',
                couponCodes: [],
                discounts: [],
            });
        });

        it('setOrderShippingAddress', async () => {
            const { setOrderShippingAddress } = await shopClient.query(gql`
                mutation {
                    setOrderShippingAddress(input: {
                        streetLine1: "Shipping Street"
                        countryCode: "AT"
                    }, ${activeOrderInput}) {
                        ...on Order {
                            id
                            orderToken
                            shippingAddress {
                                streetLine1
                                country
                            }
                        }
                    }
                }
            `);
            expect(setOrderShippingAddress).toEqual({
                id: 'T_1',
                orderToken: 'token-2',
                shippingAddress: {
                    streetLine1: 'Shipping Street',
                    country: 'Austria',
                },
            });
        });

        it('setOrderBillingAddress', async () => {
            const { setOrderBillingAddress } = await shopClient.query(gql`
                mutation {
                    setOrderBillingAddress(input: {
                        streetLine1: "Billing Street"
                        countryCode: "AT"
                    }, ${activeOrderInput}) {
                        ...on Order {
                            id
                            orderToken
                            billingAddress {
                                streetLine1
                                country
                            }
                        }
                    }
                }
            `);
            expect(setOrderBillingAddress).toEqual({
                id: 'T_1',
                orderToken: 'token-2',
                billingAddress: {
                    streetLine1: 'Billing Street',
                    country: 'Austria',
                },
            });
        });

        it('eligibleShippingMethods', async () => {
            const { eligibleShippingMethods } = await shopClient.query(gql`
                query {
                    eligibleShippingMethods(${activeOrderInput}) {
                    id
                    name
                    priceWithTax
                }
                }
            `);
            expect(eligibleShippingMethods).toEqual([
                {
                    id: 'T_1',
                    name: 'Standard Shipping',
                    priceWithTax: 500,
                },
                {
                    id: 'T_2',
                    name: 'Express Shipping',
                    priceWithTax: 1000,
                },
            ]);
        });

        it('setOrderShippingMethod', async () => {
            const { setOrderShippingMethod } = await shopClient.query(gql`
                mutation {
                    setOrderShippingMethod(shippingMethodId: "T_1", ${activeOrderInput}) {
                        ...on Order {
                            id
                            orderToken
                            shippingLines {
                                price
                            }
                        }
                    }
                }
            `);
            expect(setOrderShippingMethod).toEqual({
                id: 'T_1',
                orderToken: 'token-2',
                shippingLines: [{ price: 500 }],
            });
        });

        it('setOrderCustomFields', async () => {
            const { setOrderCustomFields } = await shopClient.query(gql`
                mutation {
                    setOrderCustomFields(input: { customFields: { message: "foo" } }, ${activeOrderInput}) {
                        ...on Order {
                            id
                            orderToken
                            customFields { message }
                        }
                    }
                }
            `);
            expect(setOrderCustomFields).toEqual({
                id: 'T_1',
                orderToken: 'token-2',
                customFields: { message: 'foo' },
            });
        });

        it('eligiblePaymentMethods', async () => {
            const { eligiblePaymentMethods } = await shopClient.query(gql`
                query {
                    eligiblePaymentMethods(${activeOrderInput}) {
                    id
                    name
                    code
                }
                }
            `);
            expect(eligiblePaymentMethods).toEqual([
                {
                    id: 'T_1',
                    name: 'test-payment-method',
                    code: 'test-payment-method',
                },
            ]);
        });

        it('nextOrderStates', async () => {
            const { nextOrderStates } = await shopClient.query(gql`
                query {
                    nextOrderStates(${activeOrderInput})
                }
            `);
            expect(nextOrderStates).toEqual(['ArrangingPayment', 'Cancelled']);
        });

        it('transitionOrderToState', async () => {
            const { transitionOrderToState } = await shopClient.query(gql`
                mutation {
                    transitionOrderToState(state: "ArrangingPayment", ${activeOrderInput}) {
                        ...on Order {
                            id
                            orderToken
                            state
                        }
                    }
                }
            `);
            expect(transitionOrderToState).toEqual({
                id: 'T_1',
                orderToken: 'token-2',
                state: 'ArrangingPayment',
            });
        });

        it('addPaymentToOrder', async () => {
            const { addPaymentToOrder } = await shopClient.query(gql`
                mutation {
                    addPaymentToOrder(input: { method: "test-payment-method", metadata: {}}, ${activeOrderInput}) {
                        ...on Order {
                            id
                            orderToken
                            state
                            payments {
                                state
                            }
                        }
                    }
                }
            `);
            expect(addPaymentToOrder).toEqual({
                id: 'T_1',
                orderToken: 'token-2',
                payments: [
                    {
                        state: 'Settled',
                    },
                ],
                state: 'PaymentSettled',
            });
        });
    });
});

export const ACTIVE_ORDER_BY_TOKEN = gql`
    query ActiveOrderByToken($input: ActiveOrderInput) {
        activeOrder(activeOrderInput: $input) {
            id
            orderToken
        }
    }
`;
