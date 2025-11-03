import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

/**
 * Tests for GitHub issue #3266: Custom field default values not applied when explicitly set to null
 * https://github.com/vendure-ecommerce/vendure/issues/3266
 */

const customConfig = {
    ...testConfig(),
    customFields: {
        Product: [
            { name: 'stringWithDefault', type: 'string', defaultValue: 'hello' },
            { name: 'intWithDefault', type: 'int', defaultValue: 5 },
            { name: 'booleanWithDefault', type: 'boolean', defaultValue: true },
        ],
        Customer: [
            { name: 'stringWithDefault', type: 'string', defaultValue: 'customer-default' },
            { name: 'intWithDefault', type: 'int', defaultValue: 100 },
            { name: 'booleanWithDefault', type: 'boolean', defaultValue: false },
        ],
    },
};

describe('Custom field default values', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(customConfig);

    const CREATE_CUSTOMER = gql`
        mutation CreateCustomer($input: CreateCustomerInput!) {
            createCustomer(input: $input) {
                ... on Customer {
                    id
                    firstName
                    lastName
                    emailAddress
                    customFields {
                        stringWithDefault
                        intWithDefault
                        booleanWithDefault
                    }
                }
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
    `;

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('translatable entity (Product)', () => {
        it('should apply default values when creating product without custom fields', async () => {
            const { createProduct } = await adminClient.query(gql`
                mutation {
                    createProduct(
                        input: {
                            translations: [
                                {
                                    languageCode: en
                                    name: "Test Product 1"
                                    slug: "test-product-1"
                                    description: "Test"
                                }
                            ]
                        }
                    ) {
                        id
                        name
                        customFields {
                            stringWithDefault
                            intWithDefault
                            booleanWithDefault
                        }
                    }
                }
            `);

            expect(createProduct.customFields.stringWithDefault).toBe('hello');
            expect(createProduct.customFields.intWithDefault).toBe(5);
            expect(createProduct.customFields.booleanWithDefault).toBe(true);
        });

        it('should apply default values when creating product with empty custom fields', async () => {
            const { createProduct } = await adminClient.query(gql`
                mutation {
                    createProduct(
                        input: {
                            translations: [
                                {
                                    languageCode: en
                                    name: "Test Product 2"
                                    slug: "test-product-2"
                                    description: "Test"
                                }
                            ]
                            customFields: {}
                        }
                    ) {
                        id
                        name
                        customFields {
                            stringWithDefault
                            intWithDefault
                            booleanWithDefault
                        }
                    }
                }
            `);

            expect(createProduct.customFields.stringWithDefault).toBe('hello');
            expect(createProduct.customFields.intWithDefault).toBe(5);
            expect(createProduct.customFields.booleanWithDefault).toBe(true);
        });

        it('should apply default values when custom fields are explicitly set to null', async () => {
            const { createProduct } = await adminClient.query(gql`
                mutation {
                    createProduct(
                        input: {
                            translations: [
                                {
                                    languageCode: en
                                    name: "Test Product Null"
                                    slug: "test-product-null"
                                    description: "Test"
                                }
                            ]
                            customFields: {
                                stringWithDefault: null
                                intWithDefault: null
                                booleanWithDefault: null
                            }
                        }
                    ) {
                        id
                        name
                        customFields {
                            stringWithDefault
                            intWithDefault
                            booleanWithDefault
                        }
                    }
                }
            `);

            // This is the core issue: when custom fields are explicitly set to null,
            // they should still get their default values
            expect(createProduct.customFields.stringWithDefault).toBe('hello');
            expect(createProduct.customFields.intWithDefault).toBe(5);
            expect(createProduct.customFields.booleanWithDefault).toBe(true);
        });

        it('should not override explicitly provided values', async () => {
            const { createProduct } = await adminClient.query(gql`
                mutation {
                    createProduct(
                        input: {
                            translations: [
                                {
                                    languageCode: en
                                    name: "Test Product Custom"
                                    slug: "test-product-custom"
                                    description: "Test"
                                }
                            ]
                            customFields: {
                                stringWithDefault: "custom value"
                                intWithDefault: 999
                                booleanWithDefault: false
                            }
                        }
                    ) {
                        id
                        name
                        customFields {
                            stringWithDefault
                            intWithDefault
                            booleanWithDefault
                        }
                    }
                }
            `);

            // When explicit values are provided, they should be used instead of defaults
            expect(createProduct.customFields.stringWithDefault).toBe('custom value');
            expect(createProduct.customFields.intWithDefault).toBe(999);
            expect(createProduct.customFields.booleanWithDefault).toBe(false);
        });
    });

    describe('non-translatable entity (Customer)', () => {
        it('should apply default values when creating customer without custom fields', async () => {
            const { createCustomer } = await adminClient.query(CREATE_CUSTOMER, {
                input: {
                    firstName: 'John',
                    lastName: 'Doe',
                    emailAddress: 'john.doe@example.com',
                },
            });

            expect(createCustomer.customFields.stringWithDefault).toBe('customer-default');
            expect(createCustomer.customFields.intWithDefault).toBe(100);
            expect(createCustomer.customFields.booleanWithDefault).toBe(false);
        });

        it('should apply default values when creating customer with empty custom fields', async () => {
            const { createCustomer } = await adminClient.query(CREATE_CUSTOMER, {
                input: {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    emailAddress: 'jane.smith@example.com',
                    customFields: {},
                },
            });

            expect(createCustomer.customFields.stringWithDefault).toBe('customer-default');
            expect(createCustomer.customFields.intWithDefault).toBe(100);
            expect(createCustomer.customFields.booleanWithDefault).toBe(false);
        });

        it('should apply default values when custom fields are explicitly set to null', async () => {
            const { createCustomer } = await adminClient.query(CREATE_CUSTOMER, {
                input: {
                    firstName: 'Bob',
                    lastName: 'Johnson',
                    emailAddress: 'bob.johnson@example.com',
                    customFields: {
                        stringWithDefault: null,
                        intWithDefault: null,
                        booleanWithDefault: null,
                    },
                },
            });

            // This should reproduce the issue for non-translatable entities
            expect(createCustomer.customFields.stringWithDefault).toBe('customer-default');
            expect(createCustomer.customFields.intWithDefault).toBe(100);
            expect(createCustomer.customFields.booleanWithDefault).toBe(false);
        });

        it('should not override explicitly provided values', async () => {
            const { createCustomer } = await adminClient.query(CREATE_CUSTOMER, {
                input: {
                    firstName: 'Alice',
                    lastName: 'Wilson',
                    emailAddress: 'alice.wilson@example.com',
                    customFields: {
                        stringWithDefault: 'custom customer value',
                        intWithDefault: 777,
                        booleanWithDefault: true,
                    },
                },
            });

            // When explicit values are provided, they should be used instead of defaults
            expect(createCustomer.customFields.stringWithDefault).toBe('custom customer value');
            expect(createCustomer.customFields.intWithDefault).toBe(777);
            expect(createCustomer.customFields.booleanWithDefault).toBe(true);
        });
    });
});
