import { LanguageCode, mergeConfig } from '@vendure/core';
import { createTestEnvironment, SimpleGraphQLClient, TestServer } from '@vendure/testing';
import { http, HttpResponse, passthrough } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';
import path from 'path';
import { afterAll, afterEach, beforeAll, describe, it, vi } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';
import { paypalPaymentMethodHandler } from '../src/paypal/paypal.handler';
import { PayPalPlugin } from '../src/paypal/paypal.plugin';
import { PayPalOrderInformation } from '../src/paypal/types';

import { CREATE_PAYMENT_METHOD, GET_CUSTOMER_LIST } from './graphql/admin-queries';
import {
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
    CREATE_PAYPAL_ORDER,
    proceedToArrangingPayment,
    setShipping,
} from './payment-helpers';

const mockData = {
    methodCode: 'paypal',
    clientId: '123871',
    clientSecret: '189237129347',
    merchantId: '1209347812ß498713',
    apiUrl: 'https://api.sandbox.paypal.com',
    accessToken: 'KJAWNDKJ123jknweawdfkljanwd',
    /**
     * The PayPal order id.
     */
    order: {
        id: '123123123',
        purchase_units: [
            {
                reference_id: '4BV1V5SP6AKTYXKL',
                amount: {
                    currency_code: 'USD',
                    value: '1209.90',
                    breakdown: {
                        item_total: { currency_code: 'USD', value: '1199.90' },
                        shipping: { currency_code: 'USD', value: '10.00' },
                    },
                },
                payee: {
                    merchant_id: '1209347812ß498713',
                },
            },
        ],
        create_time: '2021-09-01T12:00:00Z',
        intent: 'AUTHORIZE',
        payer: {
            name: {
                given_name: 'John',
                surname: 'Doe',
            },
            email_address: 'john.doe@example.com',
            payer_id: '123123123',
        },
        status: 'APPROVED',
    } as PayPalOrderInformation,
};

const mockAuthentication = http.post(`${mockData.apiUrl}/v1/oauth2/token`, ({ request }) => {
    return HttpResponse.json(
        {
            access_token: mockData.accessToken,
        },
        { status: 201 },
    );
});

let shopClient: SimpleGraphQLClient;
let adminClient: SimpleGraphQLClient;
let server: TestServer;
let started = false;
let customers: GetCustomerListQuery['customers']['items'];
let order: TestOrderFragmentFragment;
let serverPort: number;
let mswServer: SetupServerApi;

describe('PayPal payments', () => {
    beforeAll(async () => {
        const devConfig = mergeConfig(testConfig(), {
            plugins: [
                PayPalPlugin.init({
                    apiUrl: mockData.apiUrl,
                }),
            ],
        });
        const env = createTestEnvironment(devConfig);
        serverPort = devConfig.apiOptions.port;
        shopClient = env.shopClient;
        adminClient = env.adminClient;
        server = env.server;
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 2,
        });
        started = true;
        await adminClient.asSuperAdmin();
        ({
            customers: { items: customers },
        } = await adminClient.query<GetCustomerListQuery, GetCustomerListQueryVariables>(GET_CUSTOMER_LIST, {
            options: {
                take: 2,
            },
        }));

        mswServer = setupServer();
        mswServer.listen({
            onUnhandledRequest: ({ method, url }) => {
                if (!url.includes('/shop-api') && !url.includes('/admin-api')) {
                    throw new Error(`Unhandled ${method} request to ${url}`);
                }
                return passthrough();
            },
        });
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
        mswServer.close();
        mswServer.dispose();
    });

    afterEach(() => {
        mswServer.resetHandlers();
    });

    it('Should start successfully', ({ expect }) => {
        expect(started).toEqual(true);
        expect(customers).toHaveLength(2);
    });

    it('Should create a PayPal payment method', async ({ expect }) => {
        const { createPaymentMethod } = await adminClient.query<
            CreatePaymentMethodMutation,
            CreatePaymentMethodMutationVariables
        >(CREATE_PAYMENT_METHOD, {
            input: {
                code: mockData.methodCode,
                enabled: true,
                handler: {
                    code: paypalPaymentMethodHandler.code,
                    arguments: [
                        { name: 'clientId', value: mockData.clientId },
                        { name: 'clientSecret', value: mockData.clientSecret },
                        { name: 'merchantId', value: mockData.merchantId },
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
        expect(createPaymentMethod.code).toBe(mockData.methodCode);
    });

    it('Should not create a PayPal payment method without args', async ({ expect }) => {
        const queryPromise = adminClient.query<
            CreatePaymentMethodMutation,
            CreatePaymentMethodMutationVariables
        >(CREATE_PAYMENT_METHOD, {
            input: {
                code: mockData.methodCode,
                enabled: true,
                handler: {
                    code: paypalPaymentMethodHandler.code,
                    arguments: [
                        { name: 'clientId', value: mockData.clientId },
                        { name: 'clientSecret', value: mockData.clientSecret },
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
            await expect(createOrderPromise).rejects.toThrowError('Session has no active order');
        });
        it('Should fail when not in ArrangingPayment state', async ({ expect }) => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrderMutation,
                AddItemToOrderMutationVariables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_5',
                quantity: 10,
            });
            order = addItemToOrder as TestOrderFragmentFragment;

            await setShipping(shopClient);
            const createOrderPromise = shopClient.query(CREATE_PAYPAL_ORDER);
            await expect(createOrderPromise).rejects.toThrowError('Order must be in arranging payment state');
        });
        it('Should create an order with correct content', async ({ expect }) => {
            let createOrderRequest: Request | undefined;
            mswServer.use(
                mockAuthentication,
                http.post(`${mockData.apiUrl}/v2/checkout/orders`, ({ request }) => {
                    createOrderRequest = request.clone();
                    return HttpResponse.json(
                        {
                            id: mockData.order.id,
                            links: [],
                        },
                        { status: 201 },
                    );
                }),
            );

            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');

            await proceedToArrangingPayment(shopClient);
            const { createPayPalOrder } = await shopClient.query(CREATE_PAYPAL_ORDER);

            expect(createOrderRequest).toBeDefined();

            const requestBody = (await createOrderRequest?.json()) as any;
            expect(requestBody).toBeDefined();
            expect(requestBody.intent).toBe('AUTHORIZE');
            expect(requestBody.purchase_units.length).toBe(1);

            const purchaseUnit = requestBody.purchase_units[0];
            expect(purchaseUnit).toEqual({
                reference_id: order.code,
                amount: {
                    currency_code: 'USD',
                    value: '1209.90',
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
            expect(createPayPalOrder.id).toBe(mockData.order.id);
            expect(createPayPalOrder.links.length).toBe(0);
        });
        /*
        it('Should use payment method that is assigned to the active channel', () => {});
        it('Should fail when no payment ', () => {});
        */
    });

    describe('Payment creation', () => {
        it('Should print error message when orderId is not set', async ({ expect }) => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');

            const addPaymentToOrderResult = await shopClient.query(ADD_PAYMENT_TO_ORDER, {
                input: {
                    method: mockData.methodCode,
                    metadata: {},
                },
            });
            expect(addPaymentToOrderResult).toEqual({
                addPaymentToOrder: {
                    message: 'The payment failed',
                    errorCode: 'PAYMENT_FAILED_ERROR',
                    paymentErrorMessage:
                        '"orderId" must be set in metadata. Call "createPayPalOrder" to get order id',
                },
            });
        });
        it('Should return validation result if validation fails', async ({ expect }) => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');

            mswServer.use(
                mockAuthentication,
                http.get(`${mockData.apiUrl}/v2/checkout/orders/${mockData.order.id}`, () => {
                    return HttpResponse.json<PayPalOrderInformation>({
                        ...mockData.order,
                        status: 'NOT_APPROVED',
                    });
                }),
            );

            const addPaymentToOrderResult = await shopClient.query(ADD_PAYMENT_TO_ORDER, {
                input: {
                    method: mockData.methodCode,
                    metadata: {
                        orderId: mockData.order.id,
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

            mswServer.use(
                mockAuthentication,
                http.get(`${mockData.apiUrl}/v2/checkout/orders/${mockData.order.id}`, () => {
                    return HttpResponse.json<PayPalOrderInformation>({
                        ...mockData.order,
                        purchase_units: [
                            {
                                ...mockData.order.purchase_units[0],
                                reference_id: order.code,
                            },
                        ],
                    });
                }),
                http.post(`${mockData.apiUrl}/v2/checkout/orders/${mockData.order.id}/authorize`, () => {
                    return HttpResponse.json({}, { status: 400 });
                }),
            );

            const addPaymentToOrderResult = await shopClient.query(ADD_PAYMENT_TO_ORDER, {
                input: {
                    method: mockData.methodCode,
                    metadata: {
                        orderId: mockData.order.id,
                    },
                },
            });
            expect(addPaymentToOrderResult).toEqual({
                addPaymentToOrder: {
                    message: 'The payment failed',
                    errorCode: 'PAYMENT_FAILED_ERROR',
                    paymentErrorMessage: 'Payment authorization failed. Error while accessing PayPal.',
                },
            });
        });
        it('Should authorize and set transactionId and payerId', async ({ expect }) => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');

            mswServer.use(
                mockAuthentication,
                http.get(`${mockData.apiUrl}/v2/checkout/orders/${mockData.order.id}`, () => {
                    return HttpResponse.json<PayPalOrderInformation>({
                        ...mockData.order,
                        purchase_units: [
                            {
                                ...mockData.order.purchase_units[0],
                                reference_id: order.code,
                            },
                        ],
                    });
                }),
                http.post(`${mockData.apiUrl}/v2/checkout/orders/${mockData.order.id}/authorize`, () => {
                    return HttpResponse.json<PayPalOrderInformation>({
                        ...mockData.order,
                        purchase_units: [
                            {
                                ...mockData.order.purchase_units[0],
                                reference_id: order.code,
                                payments: {
                                    authorizations: [
                                        {
                                            id: '1231231',
                                            status: 'CREATED',
                                            amount: {
                                                currency_code: 'USD',
                                                value: '1209.90',
                                            },
                                            create_time: '2021-09-01T12:00:00Z',
                                            expiration_time: '2021-09-01T12:30:00Z',
                                        },
                                    ],
                                },
                            },
                        ],
                    });
                }),
            );

            const addPaymentToOrderResult = await shopClient.query(ADD_PAYMENT_TO_ORDER, {
                input: {
                    method: mockData.methodCode,
                    metadata: {
                        orderId: mockData.order.id,
                    },
                },
            });
            expect(addPaymentToOrderResult).toEqual({
                addPaymentToOrder: {
                    id: order.id,
                    code: order.code,
                    state: 'PaymentAuthorized',
                },
            });
        });
    });

    /*
    describe('Payment settle', () => {
        it('Should capture order and return success', () => {});
        it('Should reauthorize if authorization is expired', () => {});
        it('Should fail when not in Authorized state', () => {});
        it('Should fail when no authorizations are available', () => {});
    });

    describe('Payment refund', () => {
        it('Should refund payment fully and settle payment', () => {});
        it('Should refund payment partially and settle payment', () => {});
        it('Should fail when no captures were found in order details', () => {});
        it('Should fail when multiple captures were found in order details', () => {});
    });
    */
});
