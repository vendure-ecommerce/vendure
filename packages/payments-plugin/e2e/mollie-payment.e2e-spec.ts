import { PaymentStatus } from '@mollie/api-client';
import { DefaultLogger, LogLevel, mergeConfig } from '@vendure/core';
import { createTestEnvironment, E2E_DEFAULT_CHANNEL_TOKEN, SimpleGraphQLClient, TestServer } from '@vendure/testing';
import gql from 'graphql-tag';
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
import { refundOne, setShipping } from './payment-helpers';

export const CREATE_MOLLIE_PAYMENT_INTENT = gql`
    mutation createMolliePaymentIntent($input: MolliePaymentIntentInput!) {
        createMolliePaymentIntent(input: $input) {
            ... on MolliePaymentIntent {
                url
            }
            ... on MolliePaymentIntentError {
                errorCode
                message
            }
        }
    }`;

describe('Mollie payments', () => {
    const mockData = {
        host: 'https://my-vendure.io',
        redirectUrl: 'https://my-storefront/order',
        apiKey: 'myApiKey',
        methodCode: `mollie-payment-${E2E_DEFAULT_CHANNEL_TOKEN}`,
        mollieResponse: {
            id: 'tr_mockId',
            _links: {
                checkout: {
                    href: 'https://www.mollie.com/payscreen/select-method/mock-payment',
                },
            },
            resource: 'payment',
            mode: 'test',
            method: 'test-method',
            profileId: '123',
            settlementAmount: 'test amount',
            customerId: '456',
            authorizedAt: new Date(),
            paidAt: new Date(),
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

    it('Should get payment url', async () => {
        let mollieRequest;
        nock('https://api.mollie.com/')
            .post(/.*/, body => {
                mollieRequest = body;
                return true;
            })
            .reply(200, mockData.mollieResponse);
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        await setShipping(shopClient);
        const { createMolliePaymentIntent } = await shopClient.query(CREATE_MOLLIE_PAYMENT_INTENT, {
            input: {
                paymentMethodCode: mockData.methodCode,
            },
        });
        expect(createMolliePaymentIntent).toEqual({ url: 'https://www.mollie.com/payscreen/select-method/mock-payment' });
        expect(mollieRequest?.metadata.orderCode).toEqual(order.code);
        expect(mollieRequest?.redirectUrl).toEqual(`${mockData.redirectUrl}/${order.code}`);
        expect(mollieRequest?.webhookUrl).toEqual(
            `${mockData.host}/payments/mollie/${E2E_DEFAULT_CHANNEL_TOKEN}/1`,
        );
        expect(mollieRequest?.amount?.value).toBe('3127.60');
        expect(mollieRequest?.amount?.currency).toBeDefined();
    });

    it('Should settle payment for order', async () => {
        nock('https://api.mollie.com/')
            .get(/.*/)
            .reply(200, {
                ...mockData.mollieResponse,
                status: PaymentStatus.paid,
                metadata: { orderCode: order.code },
            });
        await fetch(`http://localhost:${serverPort}/payments/mollie/${E2E_DEFAULT_CHANNEL_TOKEN}/1`, {
            method: 'post',
            body: JSON.stringify({ id: mockData.mollieResponse.id }),
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
        expect(metadata.mode).toBe(mockData.mollieResponse.mode);
        expect(metadata.method).toBe(mockData.mollieResponse.method);
        expect(metadata.profileId).toBe(mockData.mollieResponse.profileId);
        expect(metadata.settlementAmount).toBe(mockData.mollieResponse.settlementAmount);
        expect(metadata.customerId).toBe(mockData.mollieResponse.customerId);
        expect(metadata.authorizedAt).toEqual(mockData.mollieResponse.authorizedAt.toISOString());
        expect(metadata.paidAt).toEqual(mockData.mollieResponse.paidAt.toISOString());
    });

    it('Should fail to refund', async () => {
        let mollieRequest;
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
});
