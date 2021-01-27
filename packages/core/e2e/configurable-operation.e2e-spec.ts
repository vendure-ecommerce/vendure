import { pick } from '@vendure/common/lib/pick';
import { LanguageCode, mergeConfig, ShippingEligibilityChecker } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { GetCheckers, UpdateShippingMethod } from './graphql/generated-e2e-admin-types';
import { UPDATE_SHIPPING_METHOD } from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

const testShippingEligibilityChecker = new ShippingEligibilityChecker({
    code: 'test-checker',
    description: [{ languageCode: LanguageCode.en, value: 'test checker' }],
    args: {
        optional: {
            label: [
                { languageCode: LanguageCode.en, value: 'Optional argument' },
                { languageCode: LanguageCode.de, value: 'Optional eingabe' },
            ],
            description: [
                { languageCode: LanguageCode.en, value: 'This is an optional argument' },
                { languageCode: LanguageCode.de, value: 'Das ist eine optionale eingabe' },
            ],
            required: false,
            type: 'string',
        },
        required: {
            required: true,
            type: 'string',
            defaultValue: 'hello',
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

    it('defaultValue', async () => {
        const { shippingEligibilityCheckers } = await adminClient.query<GetCheckers.Query>(GET_CHECKERS);
        expect(shippingEligibilityCheckers[0].args.map(pick(['name', 'defaultValue']))).toEqual([
            { name: 'optional', defaultValue: null },
            { name: 'required', defaultValue: 'hello' },
        ]);
    });
});

export const GET_CHECKERS = gql`
    query GetCheckers {
        shippingEligibilityCheckers {
            code
            args {
                defaultValue
                description
                label
                list
                name
                required
                type
            }
        }
    }
`;
