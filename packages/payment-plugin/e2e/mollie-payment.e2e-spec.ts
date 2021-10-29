import { PaymentStatus } from '@mollie/api-client';
import { DefaultLogger, LogLevel, mergeConfig } from '@vendure/core';
import {
    CreatePaymentMethod,
    GetCustomerList,
    GetCustomerListQuery,
} from '@vendure/core/e2e/graphql/generated-e2e-admin-types';
import {
    AddItemToOrder,
    AddPaymentToOrder,
    GetOrderByCode,
    GetOrderByCodeWithPayments,
    TestOrderWithPaymentsFragment,
} from '@vendure/core/e2e/graphql/generated-e2e-shop-types';
import { GET_CUSTOMER_LIST } from '@vendure/core/e2e/graphql/shared-definitions';
import {
    ADD_ITEM_TO_ORDER,
    ADD_PAYMENT,
    GET_ORDER_BY_CODE,
    GET_ORDER_BY_CODE_WITH_PAYMENTS,
} from '@vendure/core/e2e/graphql/shop-definitions';
import { proceedToArrangingPayment } from '@vendure/core/e2e/utils/test-order-utils';
import {
    createTestEnvironment,
    E2E_DEFAULT_CHANNEL_TOKEN,
    registerInitializer,
    SimpleGraphQLClient,
    SqljsInitializer,
    testConfig,
    TestServer,
} from '@vendure/testing';
import nock from 'nock';
import fetch from 'node-fetch';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { MolliePlugin } from '../src/mollie';
import { molliePaymentHandler } from '../src/mollie/mollie.handler';

import { CREATE_PAYMENT_METHOD } from './payment-helpers';

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
        },
    };
    let shopClient: SimpleGraphQLClient;
    let adminClient: SimpleGraphQLClient;
    let server: TestServer;
    let started = false;
    let customers: GetCustomerListQuery['customers']['items'];
    let order: TestOrderWithPaymentsFragment;
    beforeAll(async () => {
        registerInitializer('sqljs', new SqljsInitializer('__data__'));
        const devConfig = mergeConfig(testConfig, {
            logger: new DefaultLogger({ level: LogLevel.Debug }),
            plugins: [MolliePlugin.init(mockData.host)],
        });
        const env = createTestEnvironment(devConfig);
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
        ({ customers: { items: customers } } = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(
            GET_CUSTOMER_LIST,
            {
                options: {
                    take: 2,
                },
            },
        ));
    }, 10000);

    afterAll(async () => {
        await server.destroy();
    });

    it('Should start successfully', async () => {
        expect(started).toEqual(true);
        expect(customers).toHaveLength(2);
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

    it('Should add payment to order', async () => {
        let mollieRequest;
        // Mock Mollie response
        nock('https://api.mollie.com/')
            .post(/.*/, (body) => {
                mollieRequest = body;
                return true;
            })
            .reply(200, mockData.mollieResponse);
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_1',
            quantity: 1,
        });
        await proceedToArrangingPayment(shopClient);
        const { addPaymentToOrder } = await shopClient.query<AddPaymentToOrder.Mutation, AddPaymentToOrder.Variables>(
            ADD_PAYMENT,
            {
                input: {
                    method: mockData.methodCode,
                    metadata: {},
                },
            },
        );
        order = addPaymentToOrder as TestOrderWithPaymentsFragment;
        expect(order.state).toEqual('PaymentAuthorized');
        expect(mollieRequest?.metadata.orderCode).toEqual(order.code);
        expect(mollieRequest?.redirectUrl).toEqual(`${mockData.redirectUrl}/${order.code}`);
        expect(mollieRequest?.webhookUrl).toEqual(`${mockData.host}/payments/mollie/${E2E_DEFAULT_CHANNEL_TOKEN}/1`);
        expect(mollieRequest?.amount?.value).toBeDefined();
        expect(mollieRequest?.amount?.currency).toBeDefined();
        // tslint:disable-next-line:no-non-null-assertion
        const payment = order.payments![0];
        expect(payment.transactionId).toEqual(mockData.mollieResponse.id);
        expect(payment.metadata.public.redirectLink).toEqual(mockData.mollieResponse._links.checkout.href);
    });

    it('Should settle payment for order', async () => {
        nock('https://api.mollie.com/')
            .get(/.*/)
            .reply(200, {
                ...mockData.mollieResponse,
                status: PaymentStatus.paid,
                metadata: { orderCode: order.code },
            });
        await fetch(`http://localhost:3050/payments/mollie/${E2E_DEFAULT_CHANNEL_TOKEN}/1`, {
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
        expect(orderByCode?.state).toBe('PaymentSettled');
    });

});
