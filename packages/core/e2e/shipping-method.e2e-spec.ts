/* tslint:disable:no-non-null-assertion */
import gql from 'graphql-tag';
import path from 'path';

import { defaultShippingCalculator } from '../src/config/shipping-method/default-shipping-calculator';
import { defaultShippingEligibilityChecker } from '../src/config/shipping-method/default-shipping-eligibility-checker';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import {
    CreateShippingMethod,
    DeleteShippingMethod,
    DeletionResult,
    GetCalculators,
    GetEligibilityCheckers,
    GetShippingMethod,
    GetShippingMethodList,
    TestEligibleMethods,
    TestShippingMethod,
    UpdateShippingMethod,
} from './graphql/generated-e2e-admin-types';
import { TestAdminClient, TestShopClient } from './test-client';
import { TestServer } from './test-server';

describe('ShippingMethod resolver', () => {
    const adminClient = new TestAdminClient();
    const shopClient = new TestShopClient();
    const server = new TestServer();

    beforeAll(async () => {
        const token = await server.init({
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.init();
        await shopClient.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('shippingEligibilityCheckers', async () => {
        const { shippingEligibilityCheckers } = await adminClient.query<GetEligibilityCheckers.Query>(
            GET_ELIGIBILITY_CHECKERS,
        );

        expect(shippingEligibilityCheckers).toEqual([
            {
                args: [
                    {
                        config: {
                            inputType: 'money',
                        },
                        description: 'Order is eligible only if its total is greater or equal to this value',
                        label: 'Minimum order value',
                        name: 'orderMinimum',
                        type: 'int',
                    },
                ],
                code: 'default-shipping-eligibility-checker',
                description: 'Default Shipping Eligibility Checker',
            },
        ]);
    });

    it('shippingCalculators', async () => {
        const { shippingCalculators } = await adminClient.query<GetCalculators.Query>(GET_CALCULATORS);

        expect(shippingCalculators).toEqual([
            {
                args: [
                    {
                        config: {
                            inputType: 'money',
                        },
                        description: null,
                        label: 'Shipping price',
                        name: 'rate',
                        type: 'int',
                    },
                    {
                        config: {
                            inputType: 'percentage',
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
        ]);
    });

    it('shippingMethods', async () => {
        const { shippingMethods } = await adminClient.query<GetShippingMethodList.Query>(
            GET_SHIPPING_METHOD_LIST,
        );
        expect(shippingMethods.totalItems).toEqual(2);
        expect(shippingMethods.items[0].code).toBe('standard-shipping');
        expect(shippingMethods.items[1].code).toBe('express-shipping');
    });

    it('shippingMethod', async () => {
        const { shippingMethod } = await adminClient.query<
            GetShippingMethod.Query,
            GetShippingMethod.Variables
        >(GET_SHIPPING_METHOD, {
            id: 'T_1',
        });
        expect(shippingMethod!.code).toBe('standard-shipping');
    });

    it('createShippingMethod', async () => {
        const { createShippingMethod } = await adminClient.query<
            CreateShippingMethod.Mutation,
            CreateShippingMethod.Variables
        >(CREATE_SHIPPING_METHOD, {
            input: {
                code: 'new-method',
                description: 'new method',
                checker: {
                    code: defaultShippingEligibilityChecker.code,
                    arguments: [],
                },
                calculator: {
                    code: defaultShippingCalculator.code,
                    arguments: [],
                },
            },
        });

        expect(createShippingMethod).toEqual({
            id: 'T_3',
            code: 'new-method',
            description: 'new method',
            calculator: {
                code: 'default-shipping-calculator',
            },
            checker: {
                code: 'default-shipping-eligibility-checker',
            },
        });
    });

    it('updateShippingMethod', async () => {
        const { updateShippingMethod } = await adminClient.query<
            UpdateShippingMethod.Mutation,
            UpdateShippingMethod.Variables
        >(UPDATE_SHIPPING_METHOD, {
            input: {
                id: 'T_3',
                description: 'changed method',
            },
        });

        expect(updateShippingMethod.description).toBe('changed method');
    });

    it('deleteShippingMethod', async () => {
        const listResult1 = await adminClient.query<GetShippingMethodList.Query>(GET_SHIPPING_METHOD_LIST);
        expect(listResult1.shippingMethods.items.map(i => i.id)).toEqual(['T_1', 'T_2', 'T_3']);

        const { deleteShippingMethod } = await adminClient.query<
            DeleteShippingMethod.Mutation,
            DeleteShippingMethod.Variables
        >(DELETE_SHIPPING_METHOD, {
            id: 'T_3',
        });

        expect(deleteShippingMethod).toEqual({
            result: DeletionResult.DELETED,
            message: null,
        });

        const listResult2 = await adminClient.query<GetShippingMethodList.Query>(GET_SHIPPING_METHOD_LIST);
        expect(listResult2.shippingMethods.items.map(i => i.id)).toEqual(['T_1', 'T_2']);
    });

    it('testShippingMethod', async () => {
        const { testShippingMethod } = await adminClient.query<
            TestShippingMethod.Query,
            TestShippingMethod.Variables
        >(TEST_SHIPPING_METHOD, {
            input: {
                calculator: {
                    code: defaultShippingCalculator.code,
                    arguments: [
                        {
                            name: 'rate',
                            type: 'int',
                            value: '1000',
                        },
                        {
                            name: 'taxRate',
                            type: 'int',
                            value: '20',
                        },
                    ],
                },
                checker: {
                    code: defaultShippingEligibilityChecker.code,
                    arguments: [
                        {
                            name: 'orderMinimum',
                            type: 'int',
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
            price: {
                price: 1000,
                priceWithTax: 1200,
            },
        });
    });

    it('testEligibleShippingMethods', async () => {
        const { testEligibleShippingMethods } = await adminClient.query<
            TestEligibleMethods.Query,
            TestEligibleMethods.Variables
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
                id: 'T_1',
                description: 'Standard Shipping',
                price: 500,
                priceWithTax: 500,
            },
            {
                id: 'T_2',
                description: 'Express Shipping',
                price: 1000,
                priceWithTax: 1000,
            },
        ]);
    });
});

const SHIPPING_METHOD_FRAGMENT = gql`
    fragment ShippingMethod on ShippingMethod {
        id
        code
        description
        calculator {
            code
        }
        checker {
            code
        }
    }
`;

const GET_SHIPPING_METHOD_LIST = gql`
    query GetShippingMethodList {
        shippingMethods {
            items {
                ...ShippingMethod
            }
            totalItems
        }
    }
    ${SHIPPING_METHOD_FRAGMENT}
`;

const GET_SHIPPING_METHOD = gql`
    query GetShippingMethod($id: ID!) {
        shippingMethod(id: $id) {
            ...ShippingMethod
        }
    }
    ${SHIPPING_METHOD_FRAGMENT}
`;

const CREATE_SHIPPING_METHOD = gql`
    mutation CreateShippingMethod($input: CreateShippingMethodInput!) {
        createShippingMethod(input: $input) {
            ...ShippingMethod
        }
    }
    ${SHIPPING_METHOD_FRAGMENT}
`;

const UPDATE_SHIPPING_METHOD = gql`
    mutation UpdateShippingMethod($input: UpdateShippingMethodInput!) {
        updateShippingMethod(input: $input) {
            ...ShippingMethod
        }
    }
    ${SHIPPING_METHOD_FRAGMENT}
`;

const DELETE_SHIPPING_METHOD = gql`
    mutation DeleteShippingMethod($id: ID!) {
        deleteShippingMethod(id: $id) {
            result
            message
        }
    }
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
                config
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
                config
            }
        }
    }
`;

const TEST_SHIPPING_METHOD = gql`
    query TestShippingMethod($input: TestShippingMethodInput!) {
        testShippingMethod(input: $input) {
            eligible
            price {
                price
                priceWithTax
            }
        }
    }
`;

export const TEST_ELIGIBLE_SHIPPING_METHODS = gql`
    query TestEligibleMethods($input: TestEligibleShippingMethodsInput!) {
        testEligibleShippingMethods(input: $input) {
            id
            description
            price
            priceWithTax
        }
    }
`;
