import { CurrencyCode, LanguageCode, mergeConfig } from '@vendure/core';
import { AssignProductsToChannelDocument } from '@vendure/core/e2e/graphql/generated-e2e-admin-types';
import {
    createTestEnvironment,
    E2E_DEFAULT_CHANNEL_TOKEN,
    SimpleGraphQLClient,
    TestServer,
} from '@vendure/testing';
import nock from 'nock';
import path from 'path';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';
import { paypalPaymentMethodHandler } from '../src/paypal/paypal.handler';
import { PayPalPlugin } from '../src/paypal/paypal.plugin';
import { CreatePayPalOrderRequest } from '../src/paypal/types';

import {
    accessToken,
    alternativeAccessToken,
    alternativeAuthenticationToken,
    alternativeChannelToken,
    alternativeClientId,
    alternativeClientSecret,
    apiUrl,
    authenticatePath,
    authenticationToken,
    authorizePath,
    captureId,
    capturePath,
    clientId,
    clientSecret,
    getOrderPath,
    merchantId,
    methodCode,
    paypalOrder,
    paypalOrderId,
    postOrderPath,
    postRefundPath,
    productVariantQuantity,
    reauthorizePath,
    refundId,
    productVariantId,
} from './fixtures/paypal.fixtures';
import {
    CREATE_CHANNEL,
    CREATE_PAYMENT_METHOD,
    GET_CUSTOMER_LIST,
    REFUND_ORDER,
} from './graphql/admin-queries';
import {
    Channel,
    CreateChannelMutation,
    CreateChannelMutationVariables,
    CreatePaymentMethodMutation,
    CreatePaymentMethodMutationVariables,
    GetCustomerListQuery,
    GetCustomerListQueryVariables,
} from './graphql/generated-admin-types';
import {
    AddItemToOrderMutation,
    AddItemToOrderMutationVariables,
    TestOrderFragmentFragment,
} from './graphql/generated-shop-types';
import { ADD_ITEM_TO_ORDER } from './graphql/shop-queries';
import {
    ADD_PAYMENT_TO_ORDER,
    ASSIGN_SHIPPING_METHODS_TO_CHANNEL,
    CREATE_PAYPAL_ORDER,
    proceedToArrangingPayment,
    setShipping,
    SETTLE_PAYMENT,
} from './payment-helpers';

let shopClient: SimpleGraphQLClient;
let adminClient: SimpleGraphQLClient;
let server: TestServer;
let started = false;
let customers: GetCustomerListQuery['customers']['items'];
let order: TestOrderFragmentFragment;
const customerCount = 3;

describe('PayPal payments', () => {
    beforeAll(async () => {
        const devConfig = mergeConfig(testConfig(), {
            plugins: [
                PayPalPlugin.init({
                    apiUrl,
                }),
            ],
        });
        const env = createTestEnvironment(devConfig);
        shopClient = env.shopClient;
        adminClient = env.adminClient;
        server = env.server;
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount,
        });
        started = true;
        await adminClient.asSuperAdmin();
        ({
            customers: { items: customers },
        } = await adminClient.query<GetCustomerListQuery, GetCustomerListQueryVariables>(GET_CUSTOMER_LIST));
    }, TEST_SETUP_TIMEOUT_MS);

    beforeEach(() => {
        shopClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        nock.cleanAll();
        nock(apiUrl)
            .post(authenticatePath)
            .matchHeader('Authorization', `Basic ${authenticationToken}`)
            .reply(201, { access_token: accessToken })
            .persist();
    });

    afterAll(async () => {
        await server.destroy();
    });

    it('Should start successfully', ({ expect }) => {
        expect(started).toEqual(true);
        expect(customers).toHaveLength(customerCount);
    });

    it('Should create a PayPal payment method', async ({ expect }) => {
        const { createPaymentMethod } = await adminClient.query<
            CreatePaymentMethodMutation,
            CreatePaymentMethodMutationVariables
        >(CREATE_PAYMENT_METHOD, {
            input: {
                code: methodCode,
                enabled: true,
                handler: {
                    code: paypalPaymentMethodHandler.code,
                    arguments: [
                        { name: 'clientId', value: clientId },
                        { name: 'clientSecret', value: clientSecret },
                        { name: 'merchantId', value: merchantId },
                    ],
                },
                translations: [
                    {
                        languageCode: LanguageCode.en,
                        name: 'PayPal payment test',
                        description: 'This is a PayPal test payment method',
                    },
                ],
            },
        });
        const args = createPaymentMethod.handler.args;

        expect(createPaymentMethod.code).toBe(methodCode);
        expect(args).toHaveLength(3);
        expect(args[0].name).toBe('clientId');
        expect(args[0].value).toBe(clientId);
        expect(args[1].name).toBe('clientSecret');
        expect(args[1].value).toBe(clientSecret);
        expect(args[2].name).toBe('merchantId');
        expect(args[2].value).toBe(merchantId);
    });

    it('Should not create a PayPal payment method without args', async ({ expect }) => {
        const queryPromise = adminClient.query<
            CreatePaymentMethodMutation,
            CreatePaymentMethodMutationVariables
        >(CREATE_PAYMENT_METHOD, {
            input: {
                code: methodCode,
                enabled: true,
                handler: {
                    code: paypalPaymentMethodHandler.code,
                    arguments: [
                        { name: 'clientId', value: clientId },
                        { name: 'clientSecret', value: clientSecret },
                    ],
                },
                translations: [
                    {
                        languageCode: LanguageCode.en,
                        name: 'PayPal payment test',
                        description: 'This is a PayPal test payment method',
                    },
                ],
            },
        });

        await expect(queryPromise).rejects.toThrowError('The argument "merchantId" is required');
    });

    describe('Order creation', () => {
        it('Should fail when no active order is set', async ({ expect }) => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
            const createOrderPromise = shopClient.query(CREATE_PAYPAL_ORDER);
            await expect(createOrderPromise).rejects.toThrowError(
                'No active Order could be determined nor created',
            );
        });
        it('Should fail when not in ArrangingPayment state', async ({ expect }) => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrderMutation,
                AddItemToOrderMutationVariables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId,
                quantity: productVariantQuantity,
            });
            order = addItemToOrder as TestOrderFragmentFragment;

            await setShipping(shopClient);
            const createOrderPromise = shopClient.query(CREATE_PAYPAL_ORDER);
            await expect(createOrderPromise).rejects.toThrowError(
                'A Payment may only be added when Order is in "ArrangingPayment" state',
            );
        });
        it('Should create an order with correct content', async ({ expect }) => {
            let createOrderRequest: CreatePayPalOrderRequest | undefined;

            nock(apiUrl)
                .post(postOrderPath, body => {
                    createOrderRequest = body;
                    return body;
                })
                .reply(201, {
                    id: paypalOrderId,
                    links: [],
                });

            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');

            await proceedToArrangingPayment(shopClient);
            const { createPayPalOrder } = await shopClient.query(CREATE_PAYPAL_ORDER);

            expect(createOrderRequest).toBeDefined();
            expect(createOrderRequest?.intent).toBe('AUTHORIZE');
            expect(createOrderRequest?.purchase_units.length).toBe(1);

            const purchaseUnit = createOrderRequest?.purchase_units[0];
            expect(purchaseUnit).toEqual({
                reference_id: order.code,
                amount: {
                    currency_code: 'USD',
                    value: '1209.88',
                    breakdown: {
                        item_total: { currency_code: 'USD', value: '1199.90' },
                        shipping: { currency_code: 'USD', value: '10.00' },
                    },
                },
                items: [
                    {
                        name: 'Pinelab stickers',
                        quantity: '10',
                        unit_amount: { currency_code: 'USD', value: '119.99' },
                    },
                ],
            });

            // The initial paypal order is pretty shallow as no payment has been approved yet, so we
            // just check if the correct order is returned.
            expect(createPayPalOrder.id).toBe(paypalOrderId);
            expect(createPayPalOrder.links.length).toBe(0);
        });
        it('Should use payment method that is assigned to the active channel', async ({ expect }) => {
            let createOrderRequest: CreatePayPalOrderRequest | undefined;

            nock(apiUrl)
                .post(authenticatePath)
                .matchHeader('Authorization', `Basic ${alternativeAuthenticationToken}`)
                .reply(201, { access_token: alternativeAccessToken })
                .post(postOrderPath, body => {
                    createOrderRequest = body;
                    return body;
                })
                .matchHeader('Authorization', `Bearer ${alternativeAccessToken}`)
                .reply(201, {
                    id: paypalOrderId,
                    links: [],
                });

            const { createChannel } = await adminClient.query<
                CreateChannelMutation,
                CreateChannelMutationVariables
            >(CREATE_CHANNEL, {
                input: {
                    code: 'second-channel',
                    token: alternativeChannelToken,
                    defaultLanguageCode: LanguageCode.en,
                    currencyCode: CurrencyCode.GBP,
                    pricesIncludeTax: true,
                    defaultShippingZoneId: 'T_1',
                    defaultTaxZoneId: 'T_1',
                },
            });

            await adminClient.query(AssignProductsToChannelDocument, {
                input: {
                    channelId: 'T_2',
                    productIds: ['T_1'],
                },
            });

            await adminClient.query(ASSIGN_SHIPPING_METHODS_TO_CHANNEL, {
                input: {
                    channelId: (createChannel as Channel).id,
                    shippingMethodIds: ['T_1', 'T_2'],
                },
            });

            adminClient.setChannelToken(alternativeChannelToken);

            await adminClient.query(CREATE_PAYMENT_METHOD, {
                input: {
                    code: methodCode,
                    enabled: true,
                    handler: {
                        code: paypalPaymentMethodHandler.code,
                        arguments: [
                            { name: 'clientId', value: alternativeClientId },
                            { name: 'clientSecret', value: alternativeClientSecret },
                            { name: 'merchantId', value: merchantId },
                        ],
                    },
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'PayPal payment test',
                            description: 'This is a PayPal test payment method',
                        },
                    ],
                },
            });

            shopClient.setChannelToken(alternativeChannelToken);
            await shopClient.asUserWithCredentials(customers[2].emailAddress, 'test');
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrderMutation,
                AddItemToOrderMutationVariables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: productVariantQuantity,
            });
            const alternativeOrder = addItemToOrder as TestOrderFragmentFragment;
            await proceedToArrangingPayment(shopClient);
            const { createPayPalOrder } = await shopClient.query(CREATE_PAYPAL_ORDER);

            expect(createOrderRequest).toBeDefined();
            expect(createOrderRequest?.purchase_units.length).toBe(1);
            expect(createOrderRequest?.purchase_units[0].reference_id).toBe(alternativeOrder.code);

            expect(createPayPalOrder).toBeDefined();
            expect(createPayPalOrder).toEqual({
                id: 'mocked_paypal_order_id',
                links: [],
            });
        });
    });

    describe('Payment creation', () => {
        it('Should print error message when orderId is not set', async ({ expect }) => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');

            await expect(
                shopClient.query(ADD_PAYMENT_TO_ORDER, {
                    input: {
                        method: methodCode,
                        metadata: {},
                    },
                }),
            ).rejects.toThrow('The argument "orderId" is required');
        });
        it('Should return validation result if validation fails', async ({ expect }) => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');

            nock(apiUrl)
                .get(getOrderPath)
                .reply(200, {
                    ...paypalOrder,
                    status: 'NOT_APPROVED',
                });

            const addPaymentToOrderResult = await shopClient.query(ADD_PAYMENT_TO_ORDER, {
                input: {
                    method: methodCode,
                    metadata: {
                        orderId: paypalOrderId,
                    },
                },
            });
            expect(addPaymentToOrderResult).toEqual({
                addPaymentToOrder: {
                    message: 'The payment failed',
                    errorCode: 'PAYMENT_FAILED_ERROR',
                    paymentErrorMessage: 'PayPal order must be in "APPROVED" state.',
                },
            });
        });
        it('Should not create payment when authorization fails', async ({ expect }) => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');

            nock(apiUrl)
                .get(getOrderPath)
                .reply(200, {
                    ...paypalOrder,
                    purchase_units: [
                        {
                            ...paypalOrder.purchase_units[0],
                            reference_id: order.code,
                        },
                    ],
                })
                .post(authorizePath)
                .reply(400, {});

            const addPaymentToOrderResult = await shopClient.query(ADD_PAYMENT_TO_ORDER, {
                input: {
                    method: methodCode,
                    metadata: {
                        orderId: paypalOrderId,
                    },
                },
            });

            expect(addPaymentToOrderResult).toEqual({
                addPaymentToOrder: {
                    message: 'The payment failed',
                    errorCode: 'PAYMENT_FAILED_ERROR',
                    paymentErrorMessage: 'Payment authorization failed. Error while accessing PayPal',
                },
            });
        });
        it('Should authorize and set transactionId and payerId', async ({ expect }) => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');

            nock(apiUrl)
                .get(getOrderPath)
                .reply(200, {
                    ...paypalOrder,
                    purchase_units: [
                        {
                            ...paypalOrder.purchase_units[0],
                            reference_id: order.code,
                        },
                    ],
                })
                .post(authorizePath)
                .reply(201, {
                    ...paypalOrder,
                    purchase_units: [
                        {
                            ...paypalOrder.purchase_units[0],
                            reference_id: order.code,
                            payments: {
                                authorizations: [
                                    {
                                        ...paypalOrder.purchase_units[0].payments?.authorizations?.[0],
                                        status: 'CREATED',
                                    },
                                ],
                            },
                        },
                    ],
                });

            const { addPaymentToOrder } = await shopClient.query(ADD_PAYMENT_TO_ORDER, {
                input: {
                    method: methodCode,
                    metadata: {
                        orderId: paypalOrderId,
                    },
                },
            });

            expect(addPaymentToOrder).toEqual({
                id: order.id,
                code: order.code,
                state: 'PaymentAuthorized',
                payments: [
                    {
                        id: 'T_1',
                        state: 'Error',
                        transactionId: null,
                        method: methodCode,
                    },
                    {
                        id: 'T_2',
                        state: 'Error',
                        transactionId: null,
                        method: methodCode,
                    },
                    {
                        id: 'T_3',
                        state: 'Authorized',
                        transactionId: paypalOrderId,
                        method: methodCode,
                    },
                ],
            });
        });
    });

    describe('Payment settle', () => {
        it('Should fail when not in Authorized state', async ({ expect }) => {
            await adminClient.asSuperAdmin();

            // We use a payment of the previous describe block that failed.
            const { settlePayment } = await adminClient.query(SETTLE_PAYMENT, {
                id: 'T_1',
            });

            expect(settlePayment).toEqual({
                errorCode: 'SETTLE_PAYMENT_ERROR',
                message: 'Settling the payment failed',
                __typename: 'SettlePaymentError',
                paymentErrorMessage: 'Payment is not authorized. Call "createPayment" to authorize payment',
            });
        });
        it('Should fail when no authorizations are available', async ({ expect }) => {
            nock(apiUrl)
                .get(getOrderPath)
                .reply(200, {
                    ...paypalOrder,
                    purchase_units: [
                        {
                            ...paypalOrder.purchase_units[0],
                            payments: undefined,
                            reference_id: order.code,
                        },
                    ],
                })
                .post(authorizePath)
                .reply(201, {
                    ...paypalOrder,
                    purchase_units: [
                        {
                            ...paypalOrder.purchase_units[0],
                            reference_id: order.code,
                            payments: {
                                authorizations: [
                                    {
                                        ...paypalOrder.purchase_units[0].payments?.authorizations?.[0],
                                        status: 'CREATED',
                                    },
                                ],
                            },
                        },
                    ],
                });

            await adminClient.asSuperAdmin();

            // We use the last payment of the previous describe block that was successful.
            const { settlePayment } = await adminClient.query(SETTLE_PAYMENT, {
                id: 'T_3',
            });

            expect(settlePayment).toEqual({
                errorCode: 'SETTLE_PAYMENT_ERROR',
                message: 'Settling the payment failed',
                __typename: 'SettlePaymentError',
                paymentErrorMessage: 'No authorizations found in order details',
            });
        });
        it('Should capture order and return success', async ({ expect }) => {
            await shopClient.asUserWithCredentials(customers[1].emailAddress, 'test');
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrderMutation,
                AddItemToOrderMutationVariables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId,
                quantity: productVariantQuantity,
            });
            order = addItemToOrder as TestOrderFragmentFragment;

            nock(apiUrl)
                .get(getOrderPath)
                .times(2)
                .reply(200, {
                    ...paypalOrder,
                    purchase_units: [
                        {
                            ...paypalOrder.purchase_units[0],
                            reference_id: order.code,
                        },
                    ],
                })
                .post(authorizePath)
                .reply(201, {
                    ...paypalOrder,
                    purchase_units: [
                        {
                            ...paypalOrder.purchase_units[0],
                            reference_id: order.code,
                            payments: {
                                authorizations: [
                                    {
                                        ...paypalOrder.purchase_units[0].payments?.authorizations?.[0],
                                        status: 'CREATED',
                                    },
                                ],
                            },
                        },
                    ],
                })
                .post(capturePath)
                .reply(201, {});

            await proceedToArrangingPayment(shopClient);
            await adminClient.asSuperAdmin();

            const { addPaymentToOrder } = await shopClient.query(ADD_PAYMENT_TO_ORDER, {
                input: {
                    method: methodCode,
                    metadata: {
                        orderId: paypalOrderId,
                    },
                },
            });

            // We use the last payment of the previous describe block that was successful.
            const { settlePayment } = await adminClient.query(SETTLE_PAYMENT, {
                id: addPaymentToOrder.payments[0].id,
            });

            expect(settlePayment).toEqual({
                id: 'T_4',
                transactionId: paypalOrderId,
                amount: 120988,
                method: methodCode,
                state: 'Settled',
                metadata: {
                    payerId: '123123123',
                },
                __typename: 'Payment',
            });
        });
        it('Should reauthorize if authorization is expired', async ({ expect }) => {
            await shopClient.asUserWithCredentials(customers[1].emailAddress, 'test');
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrderMutation,
                AddItemToOrderMutationVariables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId,
                quantity: productVariantQuantity,
            });
            order = addItemToOrder as TestOrderFragmentFragment;

            let reauthorizeRequestCount = 0;

            nock(apiUrl)
                .get(getOrderPath)
                .times(2)
                .reply(200, {
                    ...paypalOrder,
                    purchase_units: [
                        {
                            ...paypalOrder.purchase_units[0],
                            reference_id: order.code,
                            payments: {
                                authorizations: [
                                    {
                                        ...paypalOrder.purchase_units[0].payments?.authorizations?.[0],
                                        expiration_time: '2000-01-01T00:00:00Z',
                                        status: 'CREATED',
                                    },
                                ],
                            },
                        },
                    ],
                })
                .post(authorizePath)
                .reply(201, {
                    ...paypalOrder,
                    purchase_units: [
                        {
                            ...paypalOrder.purchase_units[0],
                            reference_id: order.code,
                            payments: {
                                authorizations: [
                                    {
                                        ...paypalOrder.purchase_units[0].payments?.authorizations?.[0],
                                        status: 'CREATED',
                                    },
                                ],
                            },
                        },
                    ],
                })
                .post(reauthorizePath)
                .reply(201, body => {
                    reauthorizeRequestCount++;
                    return {};
                })
                .post(capturePath)
                .reply(201, {});

            await proceedToArrangingPayment(shopClient);
            await adminClient.asSuperAdmin();

            const { addPaymentToOrder } = await shopClient.query(ADD_PAYMENT_TO_ORDER, {
                input: {
                    method: methodCode,
                    metadata: {
                        orderId: paypalOrderId,
                    },
                },
            });

            // We use the last payment of the previous describe block that was successful.
            const { settlePayment } = await adminClient.query(SETTLE_PAYMENT, {
                id: addPaymentToOrder.payments[0].id,
            });

            expect(reauthorizeRequestCount).toBe(1);
            expect(settlePayment).toEqual({
                id: 'T_5',
                transactionId: paypalOrderId,
                amount: 120988,
                method: methodCode,
                state: 'Settled',
                metadata: {
                    payerId: '123123123',
                },
                __typename: 'Payment',
            });
        });
    });

    describe('Payment refund', () => {
        it('Should fail when no captures were found in order details', async ({ expect }) => {
            nock(apiUrl).get(getOrderPath).reply(200, paypalOrder);

            await expect(
                adminClient.query(REFUND_ORDER, {
                    input: {
                        lines: [
                            {
                                orderLineId: 'T_3',
                                quantity: 1,
                            },
                        ],
                        shipping: 1000,
                        adjustment: 119900,
                        paymentId: 'T_4',
                        reason: 'Test refund',
                    },
                }),
            ).rejects.toThrowError('No payments were captured in this order');
        });
        it('Should fail when multiple captures were found in order details', async ({ expect }) => {
            nock(apiUrl)
                .get(getOrderPath)
                .reply(200, {
                    ...paypalOrder,
                    purchase_units: [
                        {
                            ...paypalOrder.purchase_units[0],
                            payments: {
                                captures: [
                                    {
                                        status: 'COMPLETED',
                                    },
                                    {
                                        status: 'COMPLETED',
                                    },
                                ],
                            },
                        },
                    ],
                });

            await expect(
                adminClient.query(REFUND_ORDER, {
                    input: {
                        lines: [
                            {
                                orderLineId: 'T_3',
                                quantity: 1,
                            },
                        ],
                        shipping: 1000,
                        adjustment: 119900,
                        paymentId: 'T_4',
                        reason: 'Test refund',
                    },
                }),
            ).rejects.toThrowError('Multiple captures assigned to this order');
        });
        it('Should refund payment fully and settle payment', async ({ expect }) => {
            nock(apiUrl)
                .get(getOrderPath)
                .reply(200, {
                    ...paypalOrder,
                    purchase_units: [
                        {
                            ...paypalOrder.purchase_units[0],
                            payments: {
                                captures: [
                                    {
                                        status: 'COMPLETED',
                                        id: captureId,
                                    },
                                ],
                            },
                        },
                    ],
                })
                .post(postRefundPath)
                .reply(201, {
                    id: refundId,
                });

            const { refundOrder } = await adminClient.query(REFUND_ORDER, {
                input: {
                    lines: [],
                    amount: 120988,
                    shipping: 0,
                    adjustment: 0,
                    paymentId: 'T_4',
                    reason: 'Test refund',
                },
            });

            expect(refundOrder).toBeDefined();
            expect(refundOrder).toEqual({
                id: 'T_1',
                state: 'Settled',
                items: 0,
                transactionId: refundId,
                shipping: 0,
                total: 120988,
                metadata: {},
            });
        });
        it('Should refund payment partially and settle payment', async ({ expect }) => {
            nock(apiUrl)
                .get(getOrderPath)
                .times(2)
                .reply(200, {
                    ...paypalOrder,
                    purchase_units: [
                        {
                            ...paypalOrder.purchase_units[0],
                            payments: {
                                captures: [
                                    {
                                        status: 'COMPLETED',
                                        id: captureId,
                                    },
                                ],
                            },
                        },
                    ],
                })
                .post(postRefundPath)
                .times(2)
                .reply(201, {
                    id: refundId,
                });

            const { refundOrder: firstRefund } = await adminClient.query(REFUND_ORDER, {
                input: {
                    lines: [],
                    amount: 120000,
                    shipping: 0,
                    adjustment: 0,
                    paymentId: 'T_5',
                    reason: 'Test refund',
                },
            });

            const { refundOrder: secondRefund } = await adminClient.query(REFUND_ORDER, {
                input: {
                    lines: [],
                    amount: 988,
                    shipping: 0,
                    adjustment: 0,
                    paymentId: 'T_5',
                    reason: 'Test refund',
                },
            });

            expect(firstRefund).toBeDefined();
            expect(firstRefund).toEqual({
                id: 'T_2',
                state: 'Settled',
                items: 0,
                transactionId: refundId,
                shipping: 0,
                total: 120000,
                metadata: {},
            });

            expect(secondRefund).toBeDefined();
            expect(secondRefund).toEqual({
                id: 'T_3',
                state: 'Settled',
                items: 0,
                transactionId: refundId,
                shipping: 0,
                total: 988,
                metadata: {},
            });
        });
    });
});
