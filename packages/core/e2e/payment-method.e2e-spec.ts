import { dummyPaymentHandler } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { CreatePaymentMethod, UpdatePaymentMethod } from './graphql/generated-e2e-admin-types';

describe('PaymentMethod resolver', () => {
    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig,
        paymentOptions: {
            paymentMethodHandlers: [dummyPaymentHandler],
        },
    });

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 2,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('create', async () => {
        const { createPaymentMethod } = await adminClient.query<
            CreatePaymentMethod.Mutation,
            CreatePaymentMethod.Variables
        >(CREATE_PAYMENT_METHOD, {
            input: {
                code: 'test-method',
                name: 'Test Method',
                description: 'This is a test payment method',
                enabled: true,
                handler: {
                    code: dummyPaymentHandler.code,
                    arguments: [{ name: 'automaticSettle', value: 'true' }],
                },
            },
        });

        expect(createPaymentMethod).toEqual({
            id: 'T_1',
            name: 'Test Method',
            code: 'test-method',
            description: 'This is a test payment method',
            enabled: true,
            handler: {
                args: [
                    {
                        name: 'automaticSettle',
                        value: 'true',
                    },
                ],
                code: 'dummy-payment-handler',
            },
        });
    });

    it('update', async () => {
        const { updatePaymentMethod } = await adminClient.query<
            UpdatePaymentMethod.Mutation,
            UpdatePaymentMethod.Variables
        >(UPDATE_PAYMENT_METHOD, {
            input: {
                id: 'T_1',
                description: 'modified',
                enabled: false,
                handler: {
                    code: dummyPaymentHandler.code,
                    arguments: [{ name: 'automaticSettle', value: 'false' }],
                },
            },
        });

        expect(updatePaymentMethod).toEqual({
            id: 'T_1',
            name: 'Test Method',
            code: 'test-method',
            description: 'modified',
            enabled: false,
            handler: {
                args: [
                    {
                        name: 'automaticSettle',
                        value: 'false',
                    },
                ],
                code: 'dummy-payment-handler',
            },
        });
    });
});

export const PAYMENT_METHOD_FRAGMENT = gql`
    fragment PaymentMethod on PaymentMethod {
        id
        code
        name
        description
        enabled
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

export const UPDATE_PAYMENT_METHOD = gql`
    mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput!) {
        updatePaymentMethod(input: $input) {
            ...PaymentMethod
        }
    }
    ${PAYMENT_METHOD_FRAGMENT}
`;
