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
    TestOrderWithPaymentsFragment,
} from '@vendure/core/e2e/graphql/generated-e2e-shop-types';
import { GET_CUSTOMER_LIST } from '@vendure/core/e2e/graphql/shared-definitions';
import { ADD_ITEM_TO_ORDER, ADD_PAYMENT } from '@vendure/core/e2e/graphql/shop-definitions';
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
    const molliePayment = {
        host: 'https://my-vendure.io/',
        redirectUrl: 'https://my-storefront/order/',
        apiKey: 'myApiKey',
        code: `mollie-payment-${E2E_DEFAULT_CHANNEL_TOKEN}`,
        mollieResponse: {
            id: 'tr_EHwnCf3EAk',
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
            plugins: [MolliePlugin.init(molliePayment.host)],
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
                code: molliePayment.code,
                name: 'Mollie payment test',
                description: 'This is a Mollie test payment method',
                enabled: true,
                handler: {
                    code: molliePaymentHandler.code,
                    arguments: [
                        { name: 'redirectUrl', value: molliePayment.redirectUrl },
                        { name: 'apiKey', value: molliePayment.apiKey },
                    ],
                },
            },
        });
        expect(createPaymentMethod.code).toBe(molliePayment.code);
    });

    it('Should add payment to order', async () => {
        // Mock Mollie response
        nock('https://api.mollie.com/')
            .post(/.*/)
            .reply(200, molliePayment.mollieResponse);
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
                    method: molliePayment.code,
                    metadata: {},
                },
            },
        );
        order = addPaymentToOrder as TestOrderWithPaymentsFragment;
        expect(order.state).toEqual('PaymentAuthorized');
        // tslint:disable-next-line:no-non-null-assertion
        const payment = order.payments![0];
        expect(payment.transactionId).toEqual(molliePayment.mollieResponse.id);
        expect(payment.metadata.public.redirectLink).toEqual(molliePayment.mollieResponse._links.checkout.href);
    });

    it('Should settlePayment', async () => {
        nock('https://api.mollie.com/')
            .get(/.*/)
            .reply(200, {
                ...molliePayment.mollieResponse,
                status: PaymentStatus.paid,
                metadata: {orderCode: order.code}
            });
        const res = await fetch(`http://localhost:3050/payments/mollie/${E2E_DEFAULT_CHANNEL_TOKEN}`, {
            method: 'post',
            body: JSON.stringify({ id: molliePayment.mollieResponse.id }),
            headers: { 'Content-Type': 'application/json' },
        });
        expect(res.ok).toBe(true);
    });


});
