import { LanguageCode } from '@vendure/common/lib/generated-types';
import { CustomFields, mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { assertThrowsWithMessage } from './utils/assert-throws-with-message';
import { fixPostgresTimezone } from './utils/fix-pg-timezone';

fixPostgresTimezone();

// tslint:disable:no-non-null-assertion

const customConfig = mergeConfig(testConfig, {
    dbConnectionOptions: {
        timezone: 'Z',
    },
    customFields: {
        Product: [
            { name: 'nullable', type: 'string' },
            { name: 'notNullable', type: 'string', nullable: false, defaultValue: '' },
            { name: 'stringWithDefault', type: 'string', defaultValue: 'hello' },
            { name: 'localeStringWithDefault', type: 'localeString', defaultValue: 'hola' },
            { name: 'intWithDefault', type: 'int', defaultValue: 5 },
            { name: 'floatWithDefault', type: 'float', defaultValue: 5.5 },
            { name: 'booleanWithDefault', type: 'boolean', defaultValue: true },
            {
                name: 'dateTimeWithDefault',
                type: 'datetime',
                defaultValue: new Date('2019-04-30T12:59:16.4158386Z'),
            },
            { name: 'validateString', type: 'string', pattern: '^[0-9][a-z]+$' },
            { name: 'validateLocaleString', type: 'localeString', pattern: '^[0-9][a-z]+$' },
            { name: 'validateInt', type: 'int', min: 0, max: 10 },
            { name: 'validateFloat', type: 'float', min: 0.5, max: 10.5 },
            {
                name: 'validateDateTime',
                type: 'datetime',
                min: '2019-01-01T08:30',
                max: '2019-06-01T08:30',
            },
            {
                name: 'validateFn1',
                type: 'string',
                validate: value => {
                    if (value !== 'valid') {
                        return `The value ['${value}'] is not valid`;
                    }
                },
            },
            {
                name: 'validateFn2',
                type: 'string',
                validate: value => {
                    if (value !== 'valid') {
                        return [
                            {
                                languageCode: LanguageCode.en,
                                value: `The value ['${value}'] is not valid`,
                            },
                        ];
                    }
                },
            },
            {
                name: 'stringWithOptions',
                type: 'string',
                options: [{ value: 'small' }, { value: 'medium' }, { value: 'large' }],
            },
            {
                name: 'nonPublic',
                type: 'string',
                defaultValue: 'hi!',
                public: false,
            },
            {
                name: 'public',
                type: 'string',
                defaultValue: 'ho!',
                public: true,
            },
            {
                name: 'longString',
                type: 'string',
                length: 10000,
            },
            {
                name: 'readonlyString',
                type: 'string',
                readonly: true,
            },
            {
                name: 'internalString',
                type: 'string',
                internal: true,
            },
        ],
        Facet: [
            {
                name: 'translated',
                type: 'localeString',
            },
        ],
        Customer: [
            {
                name: 'score',
                type: 'int',
                readonly: true,
            },
        ],
    } as CustomFields,
});

describe('Custom fields', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(customConfig);

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

    it('globalSettings.serverConfig.customFieldConfig', async () => {
        const { globalSettings } = await adminClient.query(gql`
            query {
                globalSettings {
                    serverConfig {
                        customFieldConfig {
                            Product {
                                ... on CustomField {
                                    name
                                    type
                                }
                            }
                        }
                    }
                }
            }
        `);

        expect(globalSettings.serverConfig.customFieldConfig).toEqual({
            Product: [
                { name: 'nullable', type: 'string' },
                { name: 'notNullable', type: 'string' },
                { name: 'stringWithDefault', type: 'string' },
                { name: 'localeStringWithDefault', type: 'localeString' },
                { name: 'intWithDefault', type: 'int' },
                { name: 'floatWithDefault', type: 'float' },
                { name: 'booleanWithDefault', type: 'boolean' },
                { name: 'dateTimeWithDefault', type: 'datetime' },
                { name: 'validateString', type: 'string' },
                { name: 'validateLocaleString', type: 'localeString' },
                { name: 'validateInt', type: 'int' },
                { name: 'validateFloat', type: 'float' },
                { name: 'validateDateTime', type: 'datetime' },
                { name: 'validateFn1', type: 'string' },
                { name: 'validateFn2', type: 'string' },
                { name: 'stringWithOptions', type: 'string' },
                { name: 'nonPublic', type: 'string' },
                { name: 'public', type: 'string' },
                { name: 'longString', type: 'string' },
                { name: 'readonlyString', type: 'string' },
                // The internal type should not be exposed at all
                // { name: 'internalString', type: 'string' },
            ],
        });
    });

    it('get nullable with no default', async () => {
        const { product } = await adminClient.query(gql`
            query {
                product(id: "T_1") {
                    id
                    name
                    customFields {
                        nullable
                    }
                }
            }
        `);

        expect(product).toEqual({
            id: 'T_1',
            name: 'Laptop',
            customFields: {
                nullable: null,
            },
        });
    });

    it('get entity with localeString only', async () => {
        const { facet } = await adminClient.query(gql`
            query {
                facet(id: "T_1") {
                    id
                    name
                    customFields {
                        translated
                    }
                }
            }
        `);

        expect(facet).toEqual({
            id: 'T_1',
            name: 'category',
            customFields: {
                translated: null,
            },
        });
    });

    it('get fields with default values', async () => {
        const { product } = await adminClient.query(gql`
            query {
                product(id: "T_1") {
                    id
                    name
                    customFields {
                        stringWithDefault
                        localeStringWithDefault
                        intWithDefault
                        floatWithDefault
                        booleanWithDefault
                        dateTimeWithDefault
                    }
                }
            }
        `);

        expect(product).toEqual({
            id: 'T_1',
            name: 'Laptop',
            customFields: {
                stringWithDefault: 'hello',
                localeStringWithDefault: 'hola',
                intWithDefault: 5,
                floatWithDefault: 5.5,
                booleanWithDefault: true,
                dateTimeWithDefault: '2019-04-30T12:59:16.415Z',
            },
        });
    });

    it(
        'update non-nullable field',
        assertThrowsWithMessage(async () => {
            await adminClient.query(gql`
                mutation {
                    updateProduct(input: { id: "T_1", customFields: { notNullable: null } }) {
                        id
                    }
                }
            `);
        }, "The custom field 'notNullable' value cannot be set to null"),
    );

    it(
        'thows on attempt to update readonly field',
        assertThrowsWithMessage(async () => {
            await adminClient.query(gql`
                mutation {
                    updateProduct(input: { id: "T_1", customFields: { readonlyString: "hello" } }) {
                        id
                    }
                }
            `);
        }, `Field "readonlyString" is not defined by type UpdateProductCustomFieldsInput`),
    );

    it(
        'thows on attempt to update readonly field when no other custom fields defined',
        assertThrowsWithMessage(async () => {
            await adminClient.query(gql`
                mutation {
                    updateCustomer(input: { id: "T_1", customFields: { score: 5 } }) {
                        id
                    }
                }
            `);
        }, `The custom field 'score' is readonly`),
    );

    it(
        'thows on attempt to create readonly field',
        assertThrowsWithMessage(async () => {
            await adminClient.query(gql`
                mutation {
                    createProduct(
                        input: {
                            translations: [{ languageCode: en, name: "test" }]
                            customFields: { readonlyString: "hello" }
                        }
                    ) {
                        id
                    }
                }
            `);
        }, `Field "readonlyString" is not defined by type CreateProductCustomFieldsInput`),
    );

    it('string length allows long strings', async () => {
        const longString = Array.from({ length: 500 }, v => 'hello there!').join(' ');
        const result = await adminClient.query(
            gql`
                mutation($stringValue: String!) {
                    updateProduct(input: { id: "T_1", customFields: { longString: $stringValue } }) {
                        id
                        customFields {
                            longString
                        }
                    }
                }
            `,
            { stringValue: longString },
        );

        expect(result.updateProduct.customFields.longString).toBe(longString);
    });

    describe('validation', () => {
        it(
            'invalid string',
            assertThrowsWithMessage(async () => {
                await adminClient.query(gql`
                    mutation {
                        updateProduct(input: { id: "T_1", customFields: { validateString: "hello" } }) {
                            id
                        }
                    }
                `);
            }, `The custom field 'validateString' value ['hello'] does not match the pattern [^[0-9][a-z]+$]`),
        );

        it(
            'invalid string option',
            assertThrowsWithMessage(async () => {
                await adminClient.query(gql`
                    mutation {
                        updateProduct(input: { id: "T_1", customFields: { stringWithOptions: "tiny" } }) {
                            id
                        }
                    }
                `);
            }, `The custom field 'stringWithOptions' value ['tiny'] is invalid. Valid options are ['small', 'medium', 'large']`),
        );

        it('valid string option', async () => {
            const { updateProduct } = await adminClient.query(gql`
                mutation {
                    updateProduct(input: { id: "T_1", customFields: { stringWithOptions: "medium" } }) {
                        id
                        customFields {
                            stringWithOptions
                        }
                    }
                }
            `);
            expect(updateProduct.customFields.stringWithOptions).toBe('medium');
        });

        it(
            'invalid localeString',
            assertThrowsWithMessage(async () => {
                await adminClient.query(gql`
                    mutation {
                        updateProduct(
                            input: {
                                id: "T_1"
                                translations: [
                                    {
                                        id: "T_1"
                                        languageCode: en
                                        customFields: { validateLocaleString: "servus" }
                                    }
                                ]
                            }
                        ) {
                            id
                        }
                    }
                `);
            }, `The custom field 'validateLocaleString' value ['servus'] does not match the pattern [^[0-9][a-z]+$]`),
        );

        it(
            'invalid int',
            assertThrowsWithMessage(async () => {
                await adminClient.query(gql`
                    mutation {
                        updateProduct(input: { id: "T_1", customFields: { validateInt: 12 } }) {
                            id
                        }
                    }
                `);
            }, `The custom field 'validateInt' value [12] is greater than the maximum [10]`),
        );

        it(
            'invalid float',
            assertThrowsWithMessage(async () => {
                await adminClient.query(gql`
                    mutation {
                        updateProduct(input: { id: "T_1", customFields: { validateFloat: 10.6 } }) {
                            id
                        }
                    }
                `);
            }, `The custom field 'validateFloat' value [10.6] is greater than the maximum [10.5]`),
        );

        it(
            'invalid datetime',
            assertThrowsWithMessage(async () => {
                await adminClient.query(gql`
                    mutation {
                        updateProduct(
                            input: {
                                id: "T_1"
                                customFields: { validateDateTime: "2019-01-01T05:25:00.000Z" }
                            }
                        ) {
                            id
                        }
                    }
                `);
            }, `The custom field 'validateDateTime' value [2019-01-01T05:25:00.000Z] is less than the minimum [2019-01-01T08:30]`),
        );

        it(
            'invalid validate function with string',
            assertThrowsWithMessage(async () => {
                await adminClient.query(gql`
                    mutation {
                        updateProduct(input: { id: "T_1", customFields: { validateFn1: "invalid" } }) {
                            id
                        }
                    }
                `);
            }, `The value ['invalid'] is not valid`),
        );

        it(
            'invalid validate function with localized string',
            assertThrowsWithMessage(async () => {
                await adminClient.query(gql`
                    mutation {
                        updateProduct(input: { id: "T_1", customFields: { validateFn2: "invalid" } }) {
                            id
                        }
                    }
                `);
            }, `The value ['invalid'] is not valid`),
        );
    });

    describe('public access', () => {
        it(
            'non-public throws for Shop API',
            assertThrowsWithMessage(async () => {
                await shopClient.query(gql`
                    query {
                        product(id: "T_1") {
                            id
                            customFields {
                                nonPublic
                            }
                        }
                    }
                `);
            }, `Cannot query field "nonPublic" on type "ProductCustomFields"`),
        );

        it('publicly accessible via Shop API', async () => {
            const { product } = await shopClient.query(gql`
                query {
                    product(id: "T_1") {
                        id
                        customFields {
                            public
                        }
                    }
                }
            `);

            expect(product.customFields.public).toBe('ho!');
        });

        it(
            'internal throws for Shop API',
            assertThrowsWithMessage(async () => {
                await shopClient.query(gql`
                    query {
                        product(id: "T_1") {
                            id
                            customFields {
                                internalString
                            }
                        }
                    }
                `);
            }, `Cannot query field "internalString" on type "ProductCustomFields"`),
        );

        it(
            'internal throws for Admin API',
            assertThrowsWithMessage(async () => {
                await adminClient.query(gql`
                    query {
                        product(id: "T_1") {
                            id
                            customFields {
                                internalString
                            }
                        }
                    }
                `);
            }, `Cannot query field "internalString" on type "ProductCustomFields"`),
        );
    });

    describe('sort & filter', () => {
        it('can sort by custom fields', async () => {
            const { products } = await adminClient.query(gql`
                query {
                    products(options: { sort: { nullable: ASC } }) {
                        totalItems
                    }
                }
            `);

            expect(products.totalItems).toBe(1);
        });

        it('can filter by custom fields', async () => {
            const { products } = await adminClient.query(gql`
                query {
                    products(options: { filter: { stringWithDefault: { contains: "hello" } } }) {
                        totalItems
                    }
                }
            `);

            expect(products.totalItems).toBe(1);
        });

        it(
            'cannot filter by internal field in Admin API',
            assertThrowsWithMessage(async () => {
                await adminClient.query(gql`
                    query {
                        products(options: { filter: { internalString: { contains: "hello" } } }) {
                            totalItems
                        }
                    }
                `);
            }, `Field "internalString" is not defined by type ProductFilterParameter`),
        );

        it(
            'cannot filter by internal field in Shop API',
            assertThrowsWithMessage(async () => {
                await shopClient.query(gql`
                    query {
                        products(options: { filter: { internalString: { contains: "hello" } } }) {
                            totalItems
                        }
                    }
                `);
            }, `Field "internalString" is not defined by type ProductFilterParameter`),
        );
    });
});
