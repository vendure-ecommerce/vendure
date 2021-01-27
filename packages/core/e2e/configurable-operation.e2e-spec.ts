import { LanguageCode, mergeConfig, ShippingEligibilityChecker } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { UPDATE_SHIPPING_METHOD } from '../../admin-ui/src/lib/core/src/data/definitions/shipping-definitions';

import { UpdateShippingMethod } from './graphql/generated-e2e-admin-types';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

const testShippingEligibilityChecker = new ShippingEligibilityChecker({
    code: 'test-checker',
    description: [{ languageCode: LanguageCode.en, value: 'test checker' }],
    args: {
        optional: {
            required: false,
            type: 'string',
        },
        required: {
            required: true,
            type: 'string',
        },
    },
    check: ctx => true,
});

describe('Configurable operations', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            shippingOptions: {
                shippingEligibilityCheckers: [testShippingEligibilityChecker],
            },
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('required args', () => {
        it('allows empty optional arg', async () => {
            const { updateShippingMethod } = await adminClient.query<
                UpdateShippingMethod.Mutation,
                UpdateShippingMethod.Variables
            >(UPDATE_SHIPPING_METHOD, {
                input: {
                    id: 'T_1',
                    checker: {
                        code: testShippingEligibilityChecker.code,
                        arguments: [
                            { name: 'optional', value: 'null' },
                            { name: 'required', value: '"foo"' },
                        ],
                    },
                    translations: [],
                },
            });

            expect(updateShippingMethod.checker.args).toEqual([
                {
                    name: 'optional',
                    value: 'null',
                },
                {
                    name: 'required',
                    value: '"foo"',
                },
            ]);
        });

        it(
            'throws if a required arg is null',
            assertThrowsWithMessage(async () => {
                await adminClient.query<UpdateShippingMethod.Mutation, UpdateShippingMethod.Variables>(
                    UPDATE_SHIPPING_METHOD,
                    {
                        input: {
                            id: 'T_1',
                            checker: {
                                code: testShippingEligibilityChecker.code,
                                arguments: [
                                    { name: 'optional', value: 'null' },
                                    { name: 'required', value: 'null' },
                                ],
                            },
                            translations: [],
                        },
                    },
                );
            }, "The argument 'required' is required, but the value is [null]"),
        );
    });
});
