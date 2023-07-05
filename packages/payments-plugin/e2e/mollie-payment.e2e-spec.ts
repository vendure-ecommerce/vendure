import { OrderStatus } from '@mollie/api-client';
import { ChannelService, LanguageCode, mergeConfig, OrderService, RequestContext } from '@vendure/core';
import {
    SettlePaymentMutation,
    SettlePaymentMutationVariables,
} from '@vendure/core/e2e/graphql/generated-e2e-admin-types';
import { SETTLE_PAYMENT } from '@vendure/core/e2e/graphql/shared-definitions';
import {
    createTestEnvironment,
    E2E_DEFAULT_CHANNEL_TOKEN,
    SimpleGraphQLClient,
    TestServer,
} from '@vendure/testing';
import nock from 'nock';
import fetch from 'node-fetch';
import path from 'path';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { UPDATE_PRODUCT_VARIANTS } from '../../core/e2e/graphql/shared-definitions';
import { MolliePlugin } from '../src/mollie';
import { molliePaymentHandler } from '../src/mollie/mollie.handler';

import { CREATE_PAYMENT_METHOD, GET_CUSTOMER_LIST, GET_ORDER_PAYMENTS } from './graphql/admin-queries';
import {
    CreatePaymentMethodMutation,
    CreatePaymentMethodMutationVariables,
    GetCustomerListQuery,
    GetCustomerListQueryVariables,
} from './graphql/generated-admin-types';
import {
    AddItemToOrderMutation,
    AddItemToOrderMutationVariables,
    GetOrderByCodeQuery,
    GetOrderByCodeQueryVariables,
    TestOrderFragmentFragment,
} from './graphql/generated-shop-types';
import { ADD_ITEM_TO_ORDER, GET_ORDER_BY_CODE } from './graphql/shop-queries';
import {
    addManualPayment,
    CREATE_MOLLIE_PAYMENT_INTENT,
    GET_MOLLIE_PAYMENT_METHODS,
    refundOrderLine,
    setShipping,
} from './payment-helpers';

const mockData = {
    host: 'https://my-vendure.io',
    redirectUrl: 'https://my-storefront/order',
    apiKey: 'myApiKey',
    methodCode: `mollie-payment-${E2E_DEFAULT_CHANNEL_TOKEN}`,
    methodCodeBroken: `mollie-payment-broken-${E2E_DEFAULT_CHANNEL_TOKEN}`,
    mollieOrderResponse: {
        id: 'ord_mockId',
        _links: {
            checkout: {
                href: 'https://www.mollie.com/payscreen/select-method/mock-payment',
            },
        },
        lines: [],
        _embedded: {
            payments: [
                {
                    id: 'tr_mockPayment',
                    status: 'paid',
                    resource: 'payment',
                },
            ],
        },
        resource: 'order',
        mode: 'test',
        method: 'test-method',
        profileId: '123',
        settlementAmount: 'test amount',
        customerId: '456',
        authorizedAt: new Date(),
        paidAt: new Date(),
    },
    molliePaymentMethodsResponse: {
        count: 1,
        _embedded: {
            methods: [
                {
                    resource: 'method',
                    id: 'ideal',
                    description: 'iDEAL',
                    minimumAmount: {
                        value: '0.01',
                        currency: 'EUR',
                    },
                    maximumAmount: {
                        value: '50000.00',
                        currency: 'EUR',
                    },
                    image: {
                        size1x: 'https://www.mollie.com/external/icons/payment-methods/ideal.png',
                        size2x: 'https://www.mollie.com/external/icons/payment-methods/ideal%402x.png',
                        svg: 'https://www.mollie.com/external/icons/payment-methods/ideal.svg',
                    },
                    _links: {
                        self: {
                            href: 'https://api.mollie.com/v2/methods/ideal',
                            type: 'application/hal+json',
                        },
                    },
                },
            ],
        },
        _links: {
            self: {
                href: 'https://api.mollie.com/v2/methods',
                type: 'application/hal+json',
            },
            documentation: {
                href: 'https://docs.mollie.com/reference/v2/methods-api/list-methods',
                type: 'text/html',
            },
        },
    },
};
let shopClient: SimpleGraphQLClient;
let adminClient: SimpleGraphQLClient;
let server: TestServer;
let started = false;
let customers: GetCustomerListQuery['customers']['items'];
let order: TestOrderFragmentFragment;
let serverPort: number;
const SURCHARGE_AMOUNT = -20000;

describe('Mollie payments (with useDynamicRedirectUrl set to true)', () => {
    beforeAll(async () => {
        const devConfig = mergeConfig(testConfig(), {
            plugins: [MolliePlugin.init({ vendureHost: mockData.host })],
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
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    afterEach(async () => {
        nock.cleanAll();
    });

    it('Should start successfully', async () => {
        expect(started).toEqual(true);
        expect(customers).toHaveLength(2);
    });

    describe('Payment intent creation', () => {
        it('Should prepare an order', async () => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrderMutation,
                AddItemToOrderMutationVariables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_5',
                quantity: 10,
            });
            order = addItemToOrder as TestOrderFragmentFragment;
            // Add surcharge
            const ctx = new RequestContext({
                apiType: 'admin',
                isAuthorized: true,
                authorizedAsOwnerOnly: false,
                channel: await server.app.get(ChannelService).getDefaultChannel(),
            });
            await server.app.get(OrderService).addSurchargeToOrder(ctx, 1, {
                description: 'Negative test surcharge',
                listPrice: SURCHARGE_AMOUNT,
            });
            expect(order.code).toBeDefined();
        });

        it('Should add a Mollie paymentMethod', async () => {
            const { createPaymentMethod } = await adminClient.query<
                CreatePaymentMethodMutation,
                CreatePaymentMethodMutationVariables
            >(CREATE_PAYMENT_METHOD, {
                input: {
                    code: mockData.methodCode,
                    enabled: true,
                    handler: {
                        code: molliePaymentHandler.code,
                        arguments: [
                            { name: 'redirectUrl', value: mockData.redirectUrl },
                            { name: 'apiKey', value: mockData.apiKey },
                            { name: 'autoCapture', value: 'false' },
                        ],
                    },
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'Mollie payment test',
                            description: 'This is a Mollie test payment method',
                        },
                    ],
                },
            });
            expect(createPaymentMethod.code).toBe(mockData.methodCode);
        });

        it('Should fail to create payment intent without shippingmethod', async () => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
            const { createMolliePaymentIntent: result } = await shopClient.query(
                CREATE_MOLLIE_PAYMENT_INTENT,
                {
                    input: {
                        paymentMethodCode: mockData.methodCode,
                    },
                },
            );
            expect(result.errorCode).toBe('ORDER_PAYMENT_STATE_ERROR');
        });

        it('Should fail to create payment intent with invalid Mollie method', async () => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
            await setShipping(shopClient);
            const { createMolliePaymentIntent: result } = await shopClient.query(
                CREATE_MOLLIE_PAYMENT_INTENT,
                {
                    input: {
                        paymentMethodCode: mockData.methodCode,
                        molliePaymentMethodCode: 'invalid',
                    },
                },
            );
            expect(result.errorCode).toBe('INELIGIBLE_PAYMENT_METHOD_ERROR');
        });

        it('Should fail to get payment url when items are out of stock', async () => {
            let { updateProductVariants } = await adminClient.query(UPDATE_PRODUCT_VARIANTS, {
                input: {
                    id: 'T_5',
                    trackInventory: 'TRUE',
                    outOfStockThreshold: 0,
                    stockOnHand: 1,
                },
            });
            expect(updateProductVariants[0].stockOnHand).toBe(1);
            const { createMolliePaymentIntent: result } = await shopClient.query(
                CREATE_MOLLIE_PAYMENT_INTENT,
                {
                    input: {
                        paymentMethodCode: mockData.methodCode,
                    },
                },
            );
            expect(result.message).toContain('The following variants are out of stock');
            // Set stock back to not tracking
            ({ updateProductVariants } = await adminClient.query(UPDATE_PRODUCT_VARIANTS, {
                input: {
                    id: 'T_5',
                    trackInventory: 'FALSE',
                },
            }));
            expect(updateProductVariants[0].trackInventory).toBe('FALSE');
        });

        it('Should get payment url without Mollie method', async () => {
            let mollieRequest: any | undefined;
            nock('https://api.mollie.com/')
                .post('/v2/orders', body => {
                    mollieRequest = body;
                    return true;
                })
                .reply(200, mockData.mollieOrderResponse);
            const { createMolliePaymentIntent } = await shopClient.query(CREATE_MOLLIE_PAYMENT_INTENT, {
                input: {
                    paymentMethodCode: mockData.methodCode,
                },
            });
            expect(createMolliePaymentIntent).toEqual({
                url: 'https://www.mollie.com/payscreen/select-method/mock-payment',
            });
            expect(mollieRequest?.orderNumber).toEqual(order.code);
            expect(mollieRequest?.redirectUrl).toEqual(`${mockData.redirectUrl}/${order.code}`);
            expect(mollieRequest?.webhookUrl).toEqual(
                `${mockData.host}/payments/mollie/${E2E_DEFAULT_CHANNEL_TOKEN}/1`,
            );
            expect(mollieRequest?.amount?.value).toBe('1009.90');
            expect(mollieRequest?.amount?.currency).toBe('USD');
            expect(mollieRequest.lines[0].vatAmount.value).toEqual('199.98');
            let totalLineAmount = 0;
            for (const line of mollieRequest.lines) {
                totalLineAmount += Number(line.totalAmount.value);
            }
            // Sum of lines should equal order total
            expect(mollieRequest.amount.value).toEqual(totalLineAmount.toFixed(2));
        });

        it('Should get payment url with Mollie method', async () => {
            nock('https://api.mollie.com/').post('/v2/orders').reply(200, mockData.mollieOrderResponse);
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
            await setShipping(shopClient);
            const { createMolliePaymentIntent } = await shopClient.query(CREATE_MOLLIE_PAYMENT_INTENT, {
                input: {
                    paymentMethodCode: mockData.methodCode,
                    molliePaymentMethodCode: 'ideal',
                },
            });
            expect(createMolliePaymentIntent).toEqual({
                url: 'https://www.mollie.com/payscreen/select-method/mock-payment',
            });
        });

        it('Should get payment url with deducted amount if a payment is already made', async () => {
            let mollieRequest: any | undefined;
            nock('https://api.mollie.com/')
                .post('/v2/orders', body => {
                    mollieRequest = body;
                    return true;
                })
                .reply(200, mockData.mollieOrderResponse);
            await addManualPayment(server, 1, 10000);
            await shopClient.query(CREATE_MOLLIE_PAYMENT_INTENT, {
                input: {
                    paymentMethodCode: mockData.methodCode,
                },
            });
            expect(mollieRequest.amount?.value).toBe('909.90'); // minus 100,00 from manual payment
            let totalLineAmount = 0;
            for (const line of mollieRequest?.lines) {
                totalLineAmount += Number(line.totalAmount.value);
            }
            // Sum of lines should equal order total
            expect(mollieRequest.amount.value).toEqual(totalLineAmount.toFixed(2));
        });

        it('Should get available paymentMethods', async () => {
            nock('https://api.mollie.com/')
                .get('/v2/methods')
                .reply(200, mockData.molliePaymentMethodsResponse);
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
            const { molliePaymentMethods } = await shopClient.query(GET_MOLLIE_PAYMENT_METHODS, {
                input: {
                    paymentMethodCode: mockData.methodCode,
                },
            });
            const method = molliePaymentMethods[0];
            expect(method.code).toEqual('ideal');
            expect(method.minimumAmount).toBeDefined();
            expect(method.maximumAmount).toBeDefined();
            expect(method.image).toBeDefined();
        });
    });

    describe('Handle standard payment methods', () => {
        it('Should transition to ArrangingPayment when partially paid', async () => {
            nock('https://api.mollie.com/')
                .get('/v2/orders/ord_mockId')
                .reply(200, {
                    ...mockData.mollieOrderResponse,
                    // Add a payment of 20.00
                    amount: { value: '20.00', currency: 'EUR' },
                    orderNumber: order.code,
                    status: OrderStatus.paid,
                });
            await fetch(`http://localhost:${serverPort}/payments/mollie/${E2E_DEFAULT_CHANNEL_TOKEN}/1`, {
                method: 'post',
                body: JSON.stringify({ id: mockData.mollieOrderResponse.id }),
                headers: { 'Content-Type': 'application/json' },
            });
            // tslint:disable-next-line:no-non-null-assertion
            const { order: adminOrder } = await adminClient.query(GET_ORDER_PAYMENTS, { id: order!.id });
            expect(adminOrder.state).toBe('ArrangingPayment');
        });

        it('Should place order after paying outstanding amount', async () => {
            nock('https://api.mollie.com/')
                .get('/v2/orders/ord_mockId')
                .reply(200, {
                    ...mockData.mollieOrderResponse,
                    // Add a payment of 1089.90
                    amount: { value: '1089.90', currency: 'EUR' }, // 1109.90 minus the previously paid 20.00
                    orderNumber: order.code,
                    status: OrderStatus.paid,
                });
            await fetch(`http://localhost:${serverPort}/payments/mollie/${E2E_DEFAULT_CHANNEL_TOKEN}/1`, {
                method: 'post',
                body: JSON.stringify({ id: mockData.mollieOrderResponse.id }),
                headers: { 'Content-Type': 'application/json' },
            });
            const { orderByCode } = await shopClient.query<GetOrderByCode.Query, GetOrderByCode.Variables>(
                GET_ORDER_BY_CODE,
                {
                    code: order.code,
                },
            );
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            order = orderByCode!;
            expect(order.state).toBe('PaymentSettled');
        });

        it('Should have Mollie metadata on payment', async () => {
            const {
                order: { payments },
            } = await adminClient.query(GET_ORDER_PAYMENTS, { id: order.id });
            const metadata = payments[1].metadata;
            expect(metadata.mode).toBe(mockData.mollieOrderResponse.mode);
            expect(metadata.method).toBe(mockData.mollieOrderResponse.method);
            expect(metadata.profileId).toBe(mockData.mollieOrderResponse.profileId);
            expect(metadata.authorizedAt).toEqual(mockData.mollieOrderResponse.authorizedAt.toISOString());
            expect(metadata.paidAt).toEqual(mockData.mollieOrderResponse.paidAt.toISOString());
        });

        it('Should fail to refund', async () => {
            nock('https://api.mollie.com/')
                .get('/v2/orders/ord_mockId?embed=payments')
                .reply(200, mockData.mollieOrderResponse);
            nock('https://api.mollie.com/')
                .post('/v2/payments/tr_mockPayment/refunds')
                .reply(200, { status: 'failed', resource: 'payment' });
            const refund = await refundOrderLine(
                adminClient,
                order.lines[0].id,
                1,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                order!.payments[1].id,
                SURCHARGE_AMOUNT,
            );
            expect(refund.state).toBe('Failed');
        });

        it('Should successfully refund the Mollie payment', async () => {
            let mollieRequest;
            nock('https://api.mollie.com/')
                .get('/v2/orders/ord_mockId?embed=payments')
                .reply(200, mockData.mollieOrderResponse);
            nock('https://api.mollie.com/')
                .post('/v2/payments/tr_mockPayment/refunds', body => {
                    mollieRequest = body;
                    return true;
                })
                .reply(200, { status: 'pending', resource: 'payment' });
            const refund = await refundOrderLine(
                adminClient,
                order.lines[0].id,
                10,
                // tslint:disable-next-line:no-non-null-assertion
                order.payments!.find(p => p.amount === 108990)!.id,
                SURCHARGE_AMOUNT,
            );
            expect(mollieRequest?.amount.value).toBe('999.90'); // Only refund mollie amount, not the gift card
            expect(refund.total).toBe(99990);
            expect(refund.state).toBe('Settled');
        });
    });

    describe('Handle pay-later methods', () => {
        it('Should prepare a new order', async () => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrderMutation,
                AddItemToOrderMutationVariables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 2,
            });
            order = addItemToOrder as TestOrderFragmentFragment;
            await setShipping(shopClient);
            expect(order.code).toBeDefined();
        });

        it('Should authorize payment for pay-later payment methods', async () => {
            nock('https://api.mollie.com/')
                .get('/v2/orders/ord_mockId')
                .reply(200, {
                    ...mockData.mollieOrderResponse,
                    amount: { value: '3127.60', currency: 'EUR' },
                    orderNumber: order.code,
                    status: OrderStatus.authorized,
                });
            await fetch(`http://localhost:${serverPort}/payments/mollie/${E2E_DEFAULT_CHANNEL_TOKEN}/1`, {
                method: 'post',
                body: JSON.stringify({ id: mockData.mollieOrderResponse.id }),
                headers: { 'Content-Type': 'application/json' },
            });
            const { orderByCode } = await shopClient.query<GetOrderByCodeQuery, GetOrderByCodeQueryVariables>(
                GET_ORDER_BY_CODE,
                {
                    code: order.code,
                },
            );
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            order = orderByCode!;
            expect(order.state).toBe('PaymentAuthorized');
        });

        it('Should settle payment via settlePayment mutation', async () => {
            // Mock the getOrder Mollie call
            nock('https://api.mollie.com/')
                .get('/v2/orders/ord_mockId')
                .reply(200, {
                    ...mockData.mollieOrderResponse,
                    orderNumber: order.code,
                    status: OrderStatus.authorized,
                });
            // Mock the createShipment call
            let createShipmentBody;
            nock('https://api.mollie.com/')
                .post('/v2/orders/ord_mockId/shipments', body => {
                    createShipmentBody = body;
                    return true;
                })
                .reply(200, { resource: 'shipment', lines: [] });
            const { settlePayment } = await adminClient.query<
                SettlePaymentMutation,
                SettlePaymentMutationVariables
            >(SETTLE_PAYMENT, {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                id: order.payments![0].id,
            });
            const { orderByCode } = await shopClient.query<GetOrderByCodeQuery, GetOrderByCodeQueryVariables>(
                GET_ORDER_BY_CODE,
                {
                    code: order.code,
                },
            );
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            order = orderByCode!;
            expect(createShipmentBody).toBeDefined();
            expect(order.state).toBe('PaymentSettled');
        });
    });

    it('Should add an unusable Mollie paymentMethod (missing redirectUrl)', async () => {
        const { createPaymentMethod } = await adminClient.query<
            CreatePaymentMethod.Mutation,
            CreatePaymentMethod.Variables
        >(CREATE_PAYMENT_METHOD, {
            input: {
                code: mockData.methodCodeBroken,

                enabled: true,
                handler: {
                    code: molliePaymentHandler.code,
                    arguments: [
                        { name: 'apiKey', value: mockData.apiKey },
                        { name: 'autoCapture', value: 'false' },
                    ],
                },
                translations: [
                    {
                        languageCode: LanguageCode.en,
                        name: 'Mollie payment test',
                        description: 'This is a Mollie test payment method',
                    },
                ],
            },
        });
        expect(createPaymentMethod.code).toBe(mockData.methodCodeBroken);
    });

    it('Should prepare an order', async () => {
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        const { addItemToOrder } = await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(
            ADD_ITEM_TO_ORDER,
            {
                productVariantId: 'T_5',
                quantity: 10,
            },
        );
        order = addItemToOrder as TestOrderFragmentFragment;
        // Add surcharge
        const ctx = new RequestContext({
            apiType: 'admin',
            isAuthorized: true,
            authorizedAsOwnerOnly: false,
            channel: await server.app.get(ChannelService).getDefaultChannel(),
        });
        await server.app.get(OrderService).addSurchargeToOrder(ctx, 1, {
            description: 'Negative test surcharge',
            listPrice: SURCHARGE_AMOUNT,
        });
        expect(order.code).toBeDefined();
    });

    it('Should fail to get payment url with Mollie method without redirectUrl configured', async () => {
        nock('https://api.mollie.com/').post('/v2/orders').reply(200, mockData.mollieOrderResponse);
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        await setShipping(shopClient);
        const { createMolliePaymentIntent } = await shopClient.query(CREATE_MOLLIE_PAYMENT_INTENT, {
            input: {
                paymentMethodCode: mockData.methodCodeBroken,
                molliePaymentMethodCode: 'ideal',
            },
        });
        expect(createMolliePaymentIntent.message).toContain(
            'Cannot create payment intent without redirectUrl specified in paymentMethod',
        );
    });
});

describe('Mollie payments (with useDynamicRedirectUrl set to true)', () => {
    beforeAll(async () => {
        const devConfig = mergeConfig(testConfig(), {
            plugins: [MolliePlugin.init({ vendureHost: mockData.host, useDynamicRedirectUrl: true })],
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
        } = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(GET_CUSTOMER_LIST, {
            options: {
                take: 2,
            },
        }));
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    afterEach(async () => {
        nock.cleanAll();
    });

    it('Should start successfully', async () => {
        expect(started).toEqual(true);
        expect(customers).toHaveLength(2);
    });

    it('Should prepare an order', async () => {
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        const { addItemToOrder } = await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(
            ADD_ITEM_TO_ORDER,
            {
                productVariantId: 'T_5',
                quantity: 10,
            },
        );
        order = addItemToOrder as TestOrderFragmentFragment;
        // Add surcharge
        const ctx = new RequestContext({
            apiType: 'admin',
            isAuthorized: true,
            authorizedAsOwnerOnly: false,
            channel: await server.app.get(ChannelService).getDefaultChannel(),
        });
        await server.app.get(OrderService).addSurchargeToOrder(ctx, 1, {
            description: 'Negative test surcharge',
            listPrice: SURCHARGE_AMOUNT,
        });
        expect(order.code).toBeDefined();
    });

    it('Should add a working Mollie paymentMethod without specifying redirectUrl', async () => {
        const { createPaymentMethod } = await adminClient.query<
            CreatePaymentMethod.Mutation,
            CreatePaymentMethod.Variables
        >(CREATE_PAYMENT_METHOD, {
            input: {
                code: mockData.methodCode,
                enabled: true,
                handler: {
                    code: molliePaymentHandler.code,
                    arguments: [
                        { name: 'apiKey', value: mockData.apiKey },
                        { name: 'autoCapture', value: 'false' },
                    ],
                },
                translations: [
                    {
                        languageCode: LanguageCode.en,
                        name: 'Mollie payment test',
                        description: 'This is a Mollie test payment method',
                    },
                ],
            },
        });
        expect(createPaymentMethod.code).toBe(mockData.methodCode);
    });

    it('Should get payment url without Mollie method', async () => {
        await setShipping(shopClient);
        let mollieRequest: any | undefined;
        nock('https://api.mollie.com/')
            .post('/v2/orders', body => {
                mollieRequest = body;
                return true;
            })
            .reply(200, mockData.mollieOrderResponse);
        const { createMolliePaymentIntent } = await shopClient.query(CREATE_MOLLIE_PAYMENT_INTENT, {
            input: {
                paymentMethodCode: mockData.methodCode,
                redirectUrl: mockData.redirectUrl,
            },
        });
        expect(createMolliePaymentIntent).toEqual({
            url: 'https://www.mollie.com/payscreen/select-method/mock-payment',
        });
        expect(mollieRequest?.orderNumber).toEqual(order.code);
        expect(mollieRequest?.redirectUrl).toEqual(mockData.redirectUrl);
        expect(mollieRequest?.webhookUrl).toEqual(
            `${mockData.host}/payments/mollie/${E2E_DEFAULT_CHANNEL_TOKEN}/1`,
        );
        expect(mollieRequest?.amount?.value).toBe('1009.90');
        expect(mollieRequest?.amount?.currency).toBe('USD');
        expect(mollieRequest.lines[0].vatAmount.value).toEqual('199.98');
        let totalLineAmount = 0;
        for (const line of mollieRequest.lines) {
            totalLineAmount += Number(line.totalAmount.value);
        }
        // Sum of lines should equal order total
        expect(mollieRequest.amount.value).toEqual(totalLineAmount.toFixed(2));
    });

    it('Should get payment url with Mollie method', async () => {
        nock('https://api.mollie.com/').post('/v2/orders').reply(200, mockData.mollieOrderResponse);
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        await setShipping(shopClient);
        const { createMolliePaymentIntent } = await shopClient.query(CREATE_MOLLIE_PAYMENT_INTENT, {
            input: {
                paymentMethodCode: mockData.methodCode,
                molliePaymentMethodCode: 'ideal',
                redirectUrl: mockData.redirectUrl,
            },
        });
        expect(createMolliePaymentIntent).toEqual({
            url: 'https://www.mollie.com/payscreen/select-method/mock-payment',
        });
    });

    it('Should fail to get payment url without specifying redirectUrl in the createMolliePaymentIntent mutation', async () => {
        nock('https://api.mollie.com/').post('/v2/orders').reply(200, mockData.mollieOrderResponse);
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        await setShipping(shopClient);
        const { createMolliePaymentIntent } = await shopClient.query(CREATE_MOLLIE_PAYMENT_INTENT, {
            input: {
                paymentMethodCode: mockData.methodCode,
                molliePaymentMethodCode: 'ideal',
            },
        });
        expect(createMolliePaymentIntent.message).toContain(
            'Cannot create payment intent without redirectUrl specified',
        );
    });
});
