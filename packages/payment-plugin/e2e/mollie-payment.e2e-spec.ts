import { DefaultLogger, dummyPaymentHandler, LogLevel, mergeConfig } from '@vendure/core';
import { CreatePaymentMethod } from '@vendure/core/e2e/graphql/generated-e2e-admin-types';
import {
    createTestEnvironment,
    registerInitializer,
    SimpleGraphQLClient,
    SqljsInitializer,
    testConfig,
    TestServer,
} from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { MolliePlugin } from '../src/mollie';

describe('Mollie payments', () => {
    let shopClient: SimpleGraphQLClient;
    let adminClient: SimpleGraphQLClient;
    let server: TestServer;
    let started = false;
    beforeAll(async () => {
        registerInitializer('sqljs', new SqljsInitializer('__data__'));
        const devConfig = mergeConfig(testConfig, {
            logger: new DefaultLogger({ level: LogLevel.Debug }),
            plugins: [MolliePlugin],
        });
        const env = createTestEnvironment(devConfig);
        shopClient = env.shopClient;
        adminClient = env.adminClient;
        server = env.server;
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
        });
        started = true;
    }, 10000);

    afterAll(async () => {
        await server.destroy();
    });

    it('Starts successfully', async () => {
        expect(started).toEqual(true);
    });

    it('Adds a Mollie paymentMethod', async () => {
        await adminClient.asSuperAdmin();
        const { createPaymentMethod } = await adminClient.query<
            CreatePaymentMethod.Mutation,
            CreatePaymentMethod.Variables
        >(CREATE_PAYMENT_METHOD, {
            input: {
                code: 'mollie-payment-test',
                name: 'Mollie payment test',
                description: 'This is a Mollie test payment method',
                enabled: true,
                handler: {
                    code: 'mollie-payment-handler',
                    arguments: [
                        { name: 'redirectUrl', value: 'https://some-callback.io/order' },
                        { name: 'apiKey', value: 'someApiKey' },
                    ],
                },
            },
        });
        expect(createPaymentMethod.code).toBe('mollie-payment-test');
    });
});

export const PAYMENT_METHOD_FRAGMENT = gql`
    fragment PaymentMethod on PaymentMethod {
        id
        code
        name
        description
        enabled
        checker {
            code
            args {
                name
                value
            }
        }
        handler {
            code
            args {
                name
                value
            }
        }
    }
`;

export const CREATE_PAYMENT_METHOD = gql`
    mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {
        createPaymentMethod(input: $input) {
            ...PaymentMethod
        }
    }
    ${PAYMENT_METHOD_FRAGMENT}
`;
