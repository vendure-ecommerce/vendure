/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    defaultShippingCalculator,
    defaultShippingEligibilityChecker,
    ShippingCalculator,
} from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { manualFulfillmentHandler } from '../src/config/fulfillment/manual-fulfillment-handler';

import { SHIPPING_METHOD_FRAGMENT } from './graphql/fragments';
import * as Codegen from './graphql/generated-e2e-admin-types';
import { DeletionResult, LanguageCode } from './graphql/generated-e2e-admin-types';
import {
    CREATE_SHIPPING_METHOD,
    DELETE_SHIPPING_METHOD,
    GET_SHIPPING_METHOD_LIST,
    UPDATE_SHIPPING_METHOD,
} from './graphql/shared-definitions';

const TEST_METADATA = {
    foo: 'bar',
    baz: [1, 2, 3],
};

const calculatorWithMetadata = new ShippingCalculator({
    code: 'calculator-with-metadata',
    description: [{ languageCode: LanguageCode.en, value: 'Has metadata' }],
    args: {},
    calculate: () => {
        return {
            price: 100,
            priceIncludesTax: true,
            taxRate: 0,
            metadata: TEST_METADATA,
        };
    },
});

describe('ShippingMethod resolver', () => {
    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig(),
        shippingOptions: {
            shippingEligibilityCheckers: [defaultShippingEligibilityChecker],
            shippingCalculators: [defaultShippingCalculator, calculatorWithMetadata],
        },
    });

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

    it('shippingEligibilityCheckers', async () => {
        const { shippingEligibilityCheckers } = await adminClient.query<Codegen.GetEligibilityCheckersQuery>(
            GET_ELIGIBILITY_CHECKERS,
        );

        expect(shippingEligibilityCheckers).toEqual([
            {
                args: [
                    {
                        description: 'Order is eligible only if its total is greater or equal to this value',
                        label: 'Minimum order value',
                        name: 'orderMinimum',
                        type: 'int',
                        ui: {
                            component: 'currency-form-input',
                        },
                    },
                ],
                code: 'default-shipping-eligibility-checker',
                description: 'Default Shipping Eligibility Checker',
            },
        ]);
    });

    it('shippingCalculators', async () => {
        const { shippingCalculators } = await adminClient.query<Codegen.GetCalculatorsQuery>(GET_CALCULATORS);

        expect(shippingCalculators).toEqual([
            {
                args: [
                    {
                        ui: {
                            component: 'currency-form-input',
                        },
                        description: null,
                        label: 'Shipping price',
                        name: 'rate',
                        type: 'int',
                    },
                    {
                        label: 'Price includes tax',
                        name: 'includesTax',
                        type: 'string',
                        description: null,
                        ui: {
                            component: 'select-form-input',
                            options: [
                                {
                                    label: [{ languageCode: LanguageCode.en, value: 'Includes tax' }],
                                    value: 'include',
                                },
                                {
                                    label: [{ languageCode: LanguageCode.en, value: 'Excludes tax' }],
                                    value: 'exclude',
                                },
                                {
                                    label: [
                                        { languageCode: LanguageCode.en, value: 'Auto (based on Channel)' },
                                    ],
                                    value: 'auto',
                                },
                            ],
                        },
                    },
                    {
                        ui: {
                            component: 'number-form-input',
                            suffix: '%',
                        },
                        description: null,
                        label: 'Tax rate',
                        name: 'taxRate',
                        type: 'int',
                    },
                ],
                code: 'default-shipping-calculator',
                description: 'Default Flat-Rate Shipping Calculator',
            },
            {
                args: [],
                code: 'calculator-with-metadata',
                description: 'Has metadata',
            },
        ]);
    });

    it('shippingMethods', async () => {
        const { shippingMethods } = await adminClient.query<Codegen.GetShippingMethodListQuery>(
            GET_SHIPPING_METHOD_LIST,
        );
        expect(shippingMethods.totalItems).toEqual(2);
        expect(shippingMethods.items[0].code).toBe('standard-shipping');
        expect(shippingMethods.items[1].code).toBe('express-shipping');
    });

    it('shippingMethod', async () => {
        const { shippingMethod } = await adminClient.query<
            Codegen.GetShippingMethodQuery,
            Codegen.GetShippingMethodQueryVariables
        >(GET_SHIPPING_METHOD, {
            id: 'T_1',
        });
        expect(shippingMethod!.code).toBe('standard-shipping');
    });

    it('createShippingMethod', async () => {
        const { createShippingMethod } = await adminClient.query<
            Codegen.CreateShippingMethodMutation,
            Codegen.CreateShippingMethodMutationVariables
        >(CREATE_SHIPPING_METHOD, {
            input: {
                code: 'new-method',
                fulfillmentHandler: manualFulfillmentHandler.code,
                checker: {
                    code: defaultShippingEligibilityChecker.code,
                    arguments: [
                        {
                            name: 'orderMinimum',
                            value: '0',
                        },
                    ],
                },
                calculator: {
                    code: calculatorWithMetadata.code,
                    arguments: [],
                },
                translations: [{ languageCode: LanguageCode.en, name: 'new method', description: '' }],
            },
        });

        expect(createShippingMethod).toEqual({
            id: 'T_3',
            code: 'new-method',
            name: 'new method',
            description: '',
            calculator: {
                code: 'calculator-with-metadata',
                args: [],
            },
            checker: {
                code: 'default-shipping-eligibility-checker',
                args: [
                    {
                        name: 'orderMinimum',
                        value: '0',
                    },
                ],
            },
        });
    });

    it('testShippingMethod', async () => {
        const { testShippingMethod } = await adminClient.query<
            Codegen.TestShippingMethodQuery,
            Codegen.TestShippingMethodQueryVariables
        >(TEST_SHIPPING_METHOD, {
            input: {
                calculator: {
                    code: calculatorWithMetadata.code,
                    arguments: [],
                },
                checker: {
                    code: defaultShippingEligibilityChecker.code,
                    arguments: [
                        {
                            name: 'orderMinimum',
                            value: '0',
                        },
                    ],
                },
                lines: [{ productVariantId: 'T_1', quantity: 1 }],
                shippingAddress: {
                    streetLine1: '',
                    countryCode: 'GB',
                },
            },
        });

        expect(testShippingMethod).toEqual({
            eligible: true,
            quote: {
                price: 100,
                priceWithTax: 100,
                metadata: TEST_METADATA,
            },
        });
    });

    it('testEligibleShippingMethods', async () => {
        const { testEligibleShippingMethods } = await adminClient.query<
            Codegen.TestEligibleMethodsQuery,
            Codegen.TestEligibleMethodsQueryVariables
        >(TEST_ELIGIBLE_SHIPPING_METHODS, {
            input: {
                lines: [{ productVariantId: 'T_1', quantity: 1 }],
                shippingAddress: {
                    streetLine1: '',
                    countryCode: 'GB',
                },
            },
        });

        expect(testEligibleShippingMethods).toEqual([
            {
                id: 'T_3',
                name: 'new method',
                description: '',
                price: 100,
                priceWithTax: 100,
                metadata: TEST_METADATA,
            },

            {
                id: 'T_1',
                name: 'Standard Shipping',
                description: '',
                price: 500,
                priceWithTax: 500,
                metadata: null,
            },
            {
                id: 'T_2',
                name: 'Express Shipping',
                description: '',
                price: 1000,
                priceWithTax: 1000,
                metadata: null,
            },
        ]);
    });

    it('updateShippingMethod', async () => {
        const { updateShippingMethod } = await adminClient.query<
            Codegen.UpdateShippingMethodMutation,
            Codegen.UpdateShippingMethodMutationVariables
        >(UPDATE_SHIPPING_METHOD, {
            input: {
                id: 'T_3',
                translations: [{ languageCode: LanguageCode.en, name: 'changed method', description: '' }],
            },
        });

        expect(updateShippingMethod.name).toBe('changed method');
    });

    it('deleteShippingMethod', async () => {
        const listResult1 = await adminClient.query<Codegen.GetShippingMethodListQuery>(
            GET_SHIPPING_METHOD_LIST,
        );
        expect(listResult1.shippingMethods.items.map(i => i.id)).toEqual(['T_1', 'T_2', 'T_3']);

        const { deleteShippingMethod } = await adminClient.query<
            Codegen.DeleteShippingMethodMutation,
            Codegen.DeleteShippingMethodMutationVariables
        >(DELETE_SHIPPING_METHOD, {
            id: 'T_3',
        });

        expect(deleteShippingMethod).toEqual({
            result: DeletionResult.DELETED,
            message: null,
        });

        const listResult2 = await adminClient.query<Codegen.GetShippingMethodListQuery>(
            GET_SHIPPING_METHOD_LIST,
        );
        expect(listResult2.shippingMethods.items.map(i => i.id)).toEqual(['T_1', 'T_2']);
    });

    describe('argument ordering', () => {
        it('createShippingMethod corrects order of arguments', async () => {
            const { createShippingMethod } = await adminClient.query<
                Codegen.CreateShippingMethodMutation,
                Codegen.CreateShippingMethodMutationVariables
            >(CREATE_SHIPPING_METHOD, {
                input: {
                    code: 'new-method',
                    fulfillmentHandler: manualFulfillmentHandler.code,
                    checker: {
                        code: defaultShippingEligibilityChecker.code,
                        arguments: [
                            {
                                name: 'orderMinimum',
                                value: '0',
                            },
                        ],
                    },
                    calculator: {
                        code: defaultShippingCalculator.code,
                        arguments: [
                            { name: 'rate', value: '500' },
                            { name: 'taxRate', value: '20' },
                            { name: 'includesTax', value: 'include' },
                        ],
                    },
                    translations: [{ languageCode: LanguageCode.en, name: 'new method', description: '' }],
                },
            });

            expect(createShippingMethod.calculator).toEqual({
                code: defaultShippingCalculator.code,
                args: [
                    { name: 'rate', value: '500' },
                    { name: 'includesTax', value: 'include' },
                    { name: 'taxRate', value: '20' },
                ],
            });
        });

        it('updateShippingMethod corrects order of arguments', async () => {
            const { updateShippingMethod } = await adminClient.query<
                Codegen.UpdateShippingMethodMutation,
                Codegen.UpdateShippingMethodMutationVariables
            >(UPDATE_SHIPPING_METHOD, {
                input: {
                    id: 'T_4',
                    translations: [],
                    calculator: {
                        code: defaultShippingCalculator.code,
                        arguments: [
                            { name: 'rate', value: '500' },
                            { name: 'taxRate', value: '20' },
                            { name: 'includesTax', value: 'include' },
                        ],
                    },
                },
            });

            expect(updateShippingMethod.calculator).toEqual({
                code: defaultShippingCalculator.code,
                args: [
                    { name: 'rate', value: '500' },
                    { name: 'includesTax', value: 'include' },
                    { name: 'taxRate', value: '20' },
                ],
            });
        });

        it('get shippingMethod preserves correct ordering', async () => {
            const { shippingMethod } = await adminClient.query<
                Codegen.GetShippingMethodQuery,
                Codegen.GetShippingMethodQueryVariables
            >(GET_SHIPPING_METHOD, {
                id: 'T_4',
            });

            expect(shippingMethod?.calculator.args).toEqual([
                { name: 'rate', value: '500' },
                { name: 'includesTax', value: 'include' },
                { name: 'taxRate', value: '20' },
            ]);
        });

        it('testShippingMethod corrects order of arguments', async () => {
            const { testShippingMethod } = await adminClient.query<
                Codegen.TestShippingMethodQuery,
                Codegen.TestShippingMethodQueryVariables
            >(TEST_SHIPPING_METHOD, {
                input: {
                    calculator: {
                        code: defaultShippingCalculator.code,
                        arguments: [
                            { name: 'rate', value: '500' },
                            { name: 'taxRate', value: '0' },
                            { name: 'includesTax', value: 'include' },
                        ],
                    },
                    checker: {
                        code: defaultShippingEligibilityChecker.code,
                        arguments: [
                            {
                                name: 'orderMinimum',
                                value: '0',
                            },
                        ],
                    },
                    lines: [{ productVariantId: 'T_1', quantity: 1 }],
                    shippingAddress: {
                        streetLine1: '',
                        countryCode: 'GB',
                    },
                },
            });

            expect(testShippingMethod).toEqual({
                eligible: true,
                quote: {
                    metadata: null,
                    price: 500,
                    priceWithTax: 500,
                },
            });
        });
    });
});

const GET_SHIPPING_METHOD = gql`
    query GetShippingMethod($id: ID!) {
        shippingMethod(id: $id) {
            ...ShippingMethod
        }
    }
    ${SHIPPING_METHOD_FRAGMENT}
`;

const GET_ELIGIBILITY_CHECKERS = gql`
    query GetEligibilityCheckers {
        shippingEligibilityCheckers {
            code
            description
            args {
                name
                type
                description
                label
                ui
            }
        }
    }
`;

const GET_CALCULATORS = gql`
    query GetCalculators {
        shippingCalculators {
            code
            description
            args {
                name
                type
                description
                label
                ui
            }
        }
    }
`;

const TEST_SHIPPING_METHOD = gql`
    query TestShippingMethod($input: TestShippingMethodInput!) {
        testShippingMethod(input: $input) {
            eligible
            quote {
                price
                priceWithTax
                metadata
            }
        }
    }
`;

export const TEST_ELIGIBLE_SHIPPING_METHODS = gql`
    query TestEligibleMethods($input: TestEligibleShippingMethodsInput!) {
        testEligibleShippingMethods(input: $input) {
            id
            name
            description
            price
            priceWithTax
            metadata
        }
    }
`;
