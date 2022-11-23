import { OrderStatus } from '@mollie/api-client';
import { ChannelService, mergeConfig, OrderService, RequestContext } from '@vendure/core';
import {
    SettlePaymentMutation,
    SettlePaymentMutationVariables,
} from '@vendure/core/e2e/graphql/generated-e2e-admin-types';
import { SETTLE_PAYMENT } from '@vendure/core/e2e/graphql/shared-definitions';
import { createTestEnvironment, E2E_DEFAULT_CHANNEL_TOKEN, SimpleGraphQLClient, TestServer } from '@vendure/testing';
import nock from 'nock';
import fetch from 'node-fetch';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { MolliePlugin } from '../src/mollie';
import { molliePaymentHandler } from '../src/mollie/mollie.handler';

import { CREATE_PAYMENT_METHOD, GET_CUSTOMER_LIST, GET_ORDER_PAYMENTS } from './graphql/admin-queries';
import { CreatePaymentMethod, GetCustomerList, GetCustomerListQuery } from './graphql/generated-admin-types';
import { AddItemToOrder, GetOrderByCode, TestOrderFragmentFragment } from './graphql/generated-shop-types';
import { ADD_ITEM_TO_ORDER, GET_ORDER_BY_CODE } from './graphql/shop-queries';
import { CREATE_MOLLIE_PAYMENT_INTENT, GET_MOLLIE_PAYMENT_METHODS, refundOne, setShipping } from './payment-helpers';

describe('Mollie payments', () => {
    const mockData = {
        host: 'https://my-vendure.io',
        redirectUrl: 'https://my-storefront/order',
        apiKey: 'myApiKey',
        methodCode: `mollie-payment-${E2E_DEFAULT_CHANNEL_TOKEN}`,
        mollieOrderResponse: {
            id: 'ord_mockId',
            _links: {
                checkout: {
                    href: 'https://www.mollie.com/payscreen/select-method/mock-payment',
                },
            },
            lines: [],
            _embedded: {
                payments: [{
                    id: 'tr_mockPayment',
                    status: 'paid',
                    resource: 'payment',
                }],
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
                    }],
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
    beforeAll(async () => {
        const devConfig = mergeConfig(testConfig(), {
            plugins: [MolliePlugin.init({ vendureHost: mockData.host })],
            // Uncomment next line to debug e2e
            // logger: new DefaultLogger({level: LogLevel.Verbose})
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

    it('Should start successfully', async () => {
        expect(started).toEqual(true);
        expect(customers).toHaveLength(2);
    });

    it('Should prepare an order', async () => {
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        const { addItemToOrder } = await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_1',
            quantity: 2,
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
            listPrice: -20000,
        });
        expect(order.code).toBeDefined();
    });

    it('Should add a Mollie paymentMethod', async () => {
        const { createPaymentMethod } = await adminClient.query<CreatePaymentMethod.Mutation,
            CreatePaymentMethod.Variables>(CREATE_PAYMENT_METHOD, {
            input: {
                code: mockData.methodCode,
                name: 'Mollie payment test',
                description: 'This is a Mollie test payment method',
                enabled: true,
                handler: {
                    code: molliePaymentHandler.code,
                    arguments: [
                        { name: 'redirectUrl', value: mockData.redirectUrl },
                        { name: 'apiKey', value: mockData.apiKey },
                        { name: 'autoCapture', value: 'false' },
                    ],
                },
            },
        });
        expect(createPaymentMethod.code).toBe(mockData.methodCode);
    });

    it('Should fail to create payment intent without shippingmethod', async () => {
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        const { createMolliePaymentIntent: result } = await shopClient.query(CREATE_MOLLIE_PAYMENT_INTENT, {
            input: {
                paymentMethodCode: mockData.methodCode,
            },
        });
        expect(result.errorCode).toBe('ORDER_PAYMENT_STATE_ERROR');
    });

    it('Should fail to create payment intent with invalid Mollie method', async () => {
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        await setShipping(shopClient);
        const { createMolliePaymentIntent: result } = await shopClient.query(CREATE_MOLLIE_PAYMENT_INTENT, {
            input: {
                paymentMethodCode: mockData.methodCode,
                molliePaymentMethodCode: 'invalid',
            },
        });
        expect(result.errorCode).toBe('INELIGIBLE_PAYMENT_METHOD_ERROR');
    });

    it('Should get payment url without Mollie method', async () => {
        let mollieRequest;
        nock('https://api.mollie.com/')
            .post(/.*/, body => {
                mollieRequest = body;
                return true;
            })
            .reply(200, mockData.mollieOrderResponse);
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        await setShipping(shopClient);
        const { createMolliePaymentIntent } = await shopClient.query(CREATE_MOLLIE_PAYMENT_INTENT, {
            input: {
                paymentMethodCode: mockData.methodCode,
            },
        });
        expect(createMolliePaymentIntent).toEqual({ url: 'https://www.mollie.com/payscreen/select-method/mock-payment' });
        expect(mollieRequest?.orderNumber).toEqual(order.code);
        expect(mollieRequest?.redirectUrl).toEqual(`${mockData.redirectUrl}/${order.code}`);
        expect(mollieRequest?.webhookUrl).toEqual(
            `${mockData.host}/payments/mollie/${E2E_DEFAULT_CHANNEL_TOKEN}/1`,
        );
        expect(mollieRequest?.amount?.value).toBe('2927.60');
        expect(mollieRequest?.amount?.currency).toBeDefined();
        let totalLineAmount = 0;
        for (const line of mollieRequest.lines) {
            totalLineAmount += Number(line.totalAmount.value);
        }
        // Sum of lines should equal order total
        expect(mollieRequest.amount.value).toEqual(totalLineAmount.toFixed(2));
    });

    it('Should get payment url with Mollie method', async () => {
        let mollieRequest;
        nock('https://api.mollie.com/')
            .post(/.*/, body => {
                mollieRequest = body;
                return true;
            })
            .reply(200, mockData.mollieOrderResponse);
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        await setShipping(shopClient);
        const { createMolliePaymentIntent } = await shopClient.query(CREATE_MOLLIE_PAYMENT_INTENT, {
            input: {
                paymentMethodCode: mockData.methodCode,
                molliePaymentMethodCode: 'ideal',
            },
        });
        expect(createMolliePaymentIntent).toEqual({ url: 'https://www.mollie.com/payscreen/select-method/mock-payment' });
    });

    it('Should immediately settle payment for standard payment methods', async () => {
        nock('https://api.mollie.com/')
            .get(/.*/)
            .reply(200, {
                ...mockData.mollieOrderResponse,
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
        // tslint:disable-next-line:no-non-null-assertion
        order = orderByCode!;
        expect(order.state).toBe('PaymentSettled');
    });

    it('Should have Mollie metadata on payment', async () => {
        const { order: { payments: [{ metadata }] } } = await adminClient.query(GET_ORDER_PAYMENTS, { id: order.id });
        expect(metadata.mode).toBe(mockData.mollieOrderResponse.mode);
        expect(metadata.method).toBe(mockData.mollieOrderResponse.method);
        expect(metadata.profileId).toBe(mockData.mollieOrderResponse.profileId);
        expect(metadata.authorizedAt).toEqual(mockData.mollieOrderResponse.authorizedAt.toISOString());
        expect(metadata.paidAt).toEqual(mockData.mollieOrderResponse.paidAt.toISOString());
    });

    it('Should fail to refund', async () => {
        let mollieRequest;
        nock('https://api.mollie.com/')
            .get('/v2/orders/ord_mockId?embed=payments')
            .twice()
            .reply(200, mockData.mollieOrderResponse);
        nock('https://api.mollie.com/')
            .post(/.*/, body => {
                mollieRequest = body;
                return true;
            })
            .reply(200, { status: 'failed', resource: 'payment' });
        const refund = await refundOne(adminClient, order.lines[0].id, order.payments[0].id);
        expect(refund.state).toBe('Failed');
    });

    it('Should successfully refund', async () => {
        let mollieRequest;
        nock('https://api.mollie.com/')
            .post(/.*/, body => {
                mollieRequest = body;
                return true;
            })
            .reply(200, { status: 'pending', resource: 'payment' });
        const refund = await refundOne(adminClient, order.lines[0].id, order.payments[0].id);
        expect(mollieRequest?.amount.value).toBe('1558.80');
        expect(refund.total).toBe(155880);
        expect(refund.state).toBe('Settled');
    });

    it('Should get available paymentMethods', async () => {
        nock('https://api.mollie.com/')
            .get(/.*/)
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

    it('Should prepare a new order', async () => {
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        const { addItemToOrder } = await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_1',
            quantity: 2,
        });
        order = addItemToOrder as TestOrderFragmentFragment;
        await setShipping(shopClient);
        expect(order.code).toBeDefined();
    });

    it('Should authorize payment for pay-later payment methods', async () => {
        nock('https://api.mollie.com/')
            .get(/.*/)
            .reply(200, {
                ...mockData.mollieOrderResponse,
                orderNumber: order.code,
                status: OrderStatus.authorized,
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
        // tslint:disable-next-line:no-non-null-assertion
        order = orderByCode!;
        expect(order.state).toBe('PaymentAuthorized');
    });

    it('Should settle payment via settlePayment mutation', async () => {
        // Mock the getOrder Mollie call
        nock('https://api.mollie.com/')
            .get(/.*/)
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
        const { settlePayment } = await adminClient.query<SettlePaymentMutation, SettlePaymentMutationVariables>(
            SETTLE_PAYMENT,
            {
                // tslint:disable-next-line:no-non-null-assertion
                id: order.payments![0].id,
            },
        );
        const { orderByCode } = await shopClient.query<GetOrderByCode.Query, GetOrderByCode.Variables>(
            GET_ORDER_BY_CODE,
            {
                code: order.code,
            },
        );
        // tslint:disable-next-line:no-non-null-assertion
        order = orderByCode!;
        expect(createShipmentBody).toBeDefined();
        expect(order.state).toBe('PaymentSettled');
    });


});
