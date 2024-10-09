import { LanguageCode } from '@vendure/common/lib/generated-types';
import { Asset, CustomFields, mergeConfig, TransactionalConnection } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import { fail } from 'assert';
import gql from 'graphql-tag';
import path from 'path';
import { vi } from 'vitest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { assertThrowsWithMessage } from './utils/assert-throws-with-message';
import { fixPostgresTimezone } from './utils/fix-pg-timezone';

fixPostgresTimezone();

/* eslint-disable @typescript-eslint/no-non-null-assertion */

const validateInjectorSpy = vi.fn();

const customConfig = mergeConfig(testConfig(), {
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
            { name: 'floatWithDefault', type: 'float', defaultValue: 5.5678 },
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
                        return `The value ['${value as string}'] is not valid`;
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
                                value: `The value ['${value as string}'] is not valid`,
                            },
                        ];
                    }
                },
            },
            {
                name: 'validateFn3',
                type: 'string',
                validate: (value, injector) => {
                    const connection = injector.get(TransactionalConnection);
                    validateInjectorSpy(connection);
                },
            },
            {
                name: 'validateFn4',
                type: 'string',
                validate: async (value, injector) => {
                    await new Promise(resolve => setTimeout(resolve, 1));
                    return 'async error';
                },
            },
            {
                name: 'validateRelation',
                type: 'relation',
                entity: Asset,
                validate: async value => {
                    await new Promise(resolve => setTimeout(resolve, 1));
                    return 'relation error';
                },
            },
            {
                name: 'stringWithOptions',
                type: 'string',
                options: [{ value: 'small' }, { value: 'medium' }, { value: 'large' }],
            },
            {
                name: 'nullableStringWithOptions',
                type: 'string',
                nullable: true,
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
                name: 'longLocaleString',
                type: 'localeString',
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
            {
                name: 'stringList',
                type: 'string',
                list: true,
            },
            {
                name: 'localeStringList',
                type: 'localeString',
                list: true,
            },
            {
                name: 'stringListWithDefault',
                type: 'string',
                list: true,
                defaultValue: ['cat'],
            },
            {
                name: 'intListWithValidation',
                type: 'int',
                list: true,
                validate: value => {
                    if (!value.includes(42)) {
                        return 'Must include the number 42!';
                    }
                },
            },
            {
                name: 'uniqueString',
                type: 'string',
                unique: true,
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
        Collection: [
            { name: 'secretKey1', type: 'string', defaultValue: '', public: false, internal: true },
            { name: 'secretKey2', type: 'string', defaultValue: '', public: false, internal: false },
        ],
        OrderLine: [{ name: 'validateInt', type: 'int', min: 0, max: 10 }],
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
                                    list
                                }
                                ... on RelationCustomFieldConfig {
                                    scalarFields
                                }
                            }
                        }
                    }
                }
            }
        `);

        expect(globalSettings.serverConfig.customFieldConfig).toEqual({
            Product: [
                { name: 'nullable', type: 'string', list: false },
                { name: 'notNullable', type: 'string', list: false },
                { name: 'stringWithDefault', type: 'string', list: false },
                { name: 'localeStringWithDefault', type: 'localeString', list: false },
                { name: 'intWithDefault', type: 'int', list: false },
                { name: 'floatWithDefault', type: 'float', list: false },
                { name: 'booleanWithDefault', type: 'boolean', list: false },
                { name: 'dateTimeWithDefault', type: 'datetime', list: false },
                { name: 'validateString', type: 'string', list: false },
                { name: 'validateLocaleString', type: 'localeString', list: false },
                { name: 'validateInt', type: 'int', list: false },
                { name: 'validateFloat', type: 'float', list: false },
                { name: 'validateDateTime', type: 'datetime', list: false },
                { name: 'validateFn1', type: 'string', list: false },
                { name: 'validateFn2', type: 'string', list: false },
                { name: 'validateFn3', type: 'string', list: false },
                { name: 'validateFn4', type: 'string', list: false },
                {
                    name: 'validateRelation',
                    type: 'relation',
                    list: false,
                    scalarFields: [
                        'id',
                        'createdAt',
                        'updatedAt',
                        'name',
                        'type',
                        'fileSize',
                        'mimeType',
                        'width',
                        'height',
                        'source',
                        'preview',
                        'customFields',
                    ],
                },
                { name: 'stringWithOptions', type: 'string', list: false },
                { name: 'nullableStringWithOptions', type: 'string', list: false },
                { name: 'nonPublic', type: 'string', list: false },
                { name: 'public', type: 'string', list: false },
                { name: 'longString', type: 'string', list: false },
                { name: 'longLocaleString', type: 'localeString', list: false },
                { name: 'readonlyString', type: 'string', list: false },
                { name: 'stringList', type: 'string', list: true },
                { name: 'localeStringList', type: 'localeString', list: true },
                { name: 'stringListWithDefault', type: 'string', list: true },
                { name: 'intListWithValidation', type: 'int', list: true },
                { name: 'uniqueString', type: 'string', list: false },
                // The internal type should not be exposed at all
                // { name: 'internalString', type: 'string' },
            ],
        });
    });

    it('globalSettings.serverConfig.entityCustomFields', async () => {
        const { globalSettings } = await adminClient.query(gql`
            query {
                globalSettings {
                    serverConfig {
                        entityCustomFields {
                            entityName
                            customFields {
                                ... on CustomField {
                                    name
                                    type
                                    list
                                }
                                ... on RelationCustomFieldConfig {
                                    scalarFields
                                }
                            }
                        }
                    }
                }
            }
        `);

        const productCustomFields = globalSettings.serverConfig.entityCustomFields.find(
            e => e.entityName === 'Product',
        );
        expect(productCustomFields).toEqual({
            entityName: 'Product',
            customFields: [
                { name: 'nullable', type: 'string', list: false },
                { name: 'notNullable', type: 'string', list: false },
                { name: 'stringWithDefault', type: 'string', list: false },
                { name: 'localeStringWithDefault', type: 'localeString', list: false },
                { name: 'intWithDefault', type: 'int', list: false },
                { name: 'floatWithDefault', type: 'float', list: false },
                { name: 'booleanWithDefault', type: 'boolean', list: false },
                { name: 'dateTimeWithDefault', type: 'datetime', list: false },
                { name: 'validateString', type: 'string', list: false },
                { name: 'validateLocaleString', type: 'localeString', list: false },
                { name: 'validateInt', type: 'int', list: false },
                { name: 'validateFloat', type: 'float', list: false },
                { name: 'validateDateTime', type: 'datetime', list: false },
                { name: 'validateFn1', type: 'string', list: false },
                { name: 'validateFn2', type: 'string', list: false },
                { name: 'validateFn3', type: 'string', list: false },
                { name: 'validateFn4', type: 'string', list: false },
                {
                    name: 'validateRelation',
                    type: 'relation',
                    list: false,
                    scalarFields: [
                        'id',
                        'createdAt',
                        'updatedAt',
                        'name',
                        'type',
                        'fileSize',
                        'mimeType',
                        'width',
                        'height',
                        'source',
                        'preview',
                        'customFields',
                    ],
                },
                { name: 'stringWithOptions', type: 'string', list: false },
                { name: 'nullableStringWithOptions', type: 'string', list: false },
                { name: 'nonPublic', type: 'string', list: false },
                { name: 'public', type: 'string', list: false },
                { name: 'longString', type: 'string', list: false },
                { name: 'longLocaleString', type: 'localeString', list: false },
                { name: 'readonlyString', type: 'string', list: false },
                { name: 'stringList', type: 'string', list: true },
                { name: 'localeStringList', type: 'localeString', list: true },
                { name: 'stringListWithDefault', type: 'string', list: true },
                { name: 'intListWithValidation', type: 'int', list: true },
                { name: 'uniqueString', type: 'string', list: false },
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
                        stringListWithDefault
                    }
                }
            }
        `);

        const customFields = {
            stringWithDefault: 'hello',
            localeStringWithDefault: 'hola',
            intWithDefault: 5,
            floatWithDefault: 5.5678,
            booleanWithDefault: true,
            dateTimeWithDefault: '2019-04-30T12:59:16.415Z',
            // MySQL does not support defaults on TEXT fields, which is what "simple-json" uses
            // internally. See https://stackoverflow.com/q/3466872/772859
            stringListWithDefault: customConfig.dbConnectionOptions.type === 'mysql' ? null : ['cat'],
        };

        expect(product).toEqual({
            id: 'T_1',
            name: 'Laptop',
            customFields,
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
        }, 'The custom field "notNullable" value cannot be set to null'),
    );

    it(
        'throws on attempt to update readonly field',
        assertThrowsWithMessage(async () => {
            await adminClient.query(gql`
                mutation {
                    updateProduct(input: { id: "T_1", customFields: { readonlyString: "hello" } }) {
                        id
                    }
                }
            `);
        }, 'Field "readonlyString" is not defined by type "UpdateProductCustomFieldsInput"'),
    );

    it(
        'throws on attempt to update readonly field when no other custom fields defined',
        assertThrowsWithMessage(async () => {
            await adminClient.query(gql`
                mutation {
                    updateCustomer(input: { id: "T_1", customFields: { score: 5 } }) {
                        ... on Customer {
                            id
                        }
                    }
                }
            `);
        }, 'The custom field "score" is readonly'),
    );

    it(
        'throws on attempt to create readonly field',
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
        }, 'Field "readonlyString" is not defined by type "CreateProductCustomFieldsInput"'),
    );

    it('string length allows long strings', async () => {
        const longString = Array.from({ length: 500 }, v => 'hello there!').join(' ');
        const result = await adminClient.query(
            gql`
                mutation ($stringValue: String!) {
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

    it('string length allows long localeStrings', async () => {
        const longString = Array.from({ length: 500 }, v => 'hello there!').join(' ');
        const result = await adminClient.query(
            gql`
                mutation ($stringValue: String!) {
                    updateProduct(
                        input: {
                            id: "T_1"
                            translations: [
                                { languageCode: en, customFields: { longLocaleString: $stringValue } }
                            ]
                        }
                    ) {
                        id
                        customFields {
                            longLocaleString
                        }
                    }
                }
            `,
            { stringValue: longString },
        );

        expect(result.updateProduct.customFields.longLocaleString).toBe(longString);
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
            }, 'The custom field "validateString" value ["hello"] does not match the pattern [^[0-9][a-z]+$]'),
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
            }, "The custom field \"stringWithOptions\" value [\"tiny\"] is invalid. Valid options are ['small', 'medium', 'large']"),
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

        it('nullable string option with null', async () => {
            const { updateProduct } = await adminClient.query(gql`
                mutation {
                    updateProduct(input: { id: "T_1", customFields: { nullableStringWithOptions: null } }) {
                        id
                        customFields {
                            nullableStringWithOptions
                        }
                    }
                }
            `);
            expect(updateProduct.customFields.nullableStringWithOptions).toBeNull();
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
            }, 'The custom field "validateLocaleString" value ["servus"] does not match the pattern [^[0-9][a-z]+$]'),
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
            }, 'The custom field "validateInt" value [12] is greater than the maximum [10]'),
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
            }, 'The custom field "validateFloat" value [10.6] is greater than the maximum [10.5]'),
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
            }, 'The custom field "validateDateTime" value [2019-01-01T05:25:00.000Z] is less than the minimum [2019-01-01T08:30]'),
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
            }, "The value ['invalid'] is not valid"),
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
            }, "The value ['invalid'] is not valid"),
        );

        it(
            'invalid list field',
            assertThrowsWithMessage(async () => {
                await adminClient.query(gql`
                    mutation {
                        updateProduct(
                            input: { id: "T_1", customFields: { intListWithValidation: [1, 2, 3] } }
                        ) {
                            id
                        }
                    }
                `);
            }, 'Must include the number 42!'),
        );

        it('valid list field', async () => {
            const { updateProduct } = await adminClient.query(gql`
                mutation {
                    updateProduct(input: { id: "T_1", customFields: { intListWithValidation: [1, 42, 3] } }) {
                        id
                        customFields {
                            intListWithValidation
                        }
                    }
                }
            `);
            expect(updateProduct.customFields.intListWithValidation).toEqual([1, 42, 3]);
        });

        it('can inject providers into validation fn', async () => {
            const { updateProduct } = await adminClient.query(gql`
                mutation {
                    updateProduct(input: { id: "T_1", customFields: { validateFn3: "some value" } }) {
                        id
                        customFields {
                            validateFn3
                        }
                    }
                }
            `);
            expect(updateProduct.customFields.validateFn3).toBe('some value');
            expect(validateInjectorSpy).toHaveBeenCalledTimes(1);
            expect(validateInjectorSpy.mock.calls[0][0] instanceof TransactionalConnection).toBe(true);
        });

        it(
            'supports async validation fn',
            assertThrowsWithMessage(async () => {
                await adminClient.query(gql`
                    mutation {
                        updateProduct(input: { id: "T_1", customFields: { validateFn4: "some value" } }) {
                            id
                            customFields {
                                validateFn4
                            }
                        }
                    }
                `);
            }, 'async error'),
        );

        // https://github.com/vendure-ecommerce/vendure/issues/1000
        it(
            'supports validation of relation types',
            assertThrowsWithMessage(async () => {
                await adminClient.query(gql`
                    mutation {
                        updateProduct(input: { id: "T_1", customFields: { validateRelationId: "T_1" } }) {
                            id
                            customFields {
                                validateFn4
                            }
                        }
                    }
                `);
            }, 'relation error'),
        );

        // https://github.com/vendure-ecommerce/vendure/issues/1091
        it('handles well graphql internal fields', async () => {
            // throws "Cannot read property 'args' of undefined" if broken
            await adminClient.query(gql`
                mutation {
                    __typename
                    updateProduct(input: { id: "T_1", customFields: { nullable: "some value" } }) {
                        __typename
                        id
                        customFields {
                            __typename
                            nullable
                        }
                    }
                }
            `);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/1953
        describe('validation of OrderLine custom fields', () => {
            it('addItemToOrder', async () => {
                try {
                    const { addItemToOrder } = await shopClient.query(gql`
                        mutation {
                            addItemToOrder(
                                productVariantId: 1
                                quantity: 1
                                customFields: { validateInt: 11 }
                            ) {
                                ... on Order {
                                    id
                                }
                            }
                        }
                    `);
                    fail('Should have thrown');
                } catch (e) {
                    expect(e.message).toContain(
                        'The custom field "validateInt" value [11] is greater than the maximum [10]',
                    );
                }

                const { addItemToOrder: result } = await shopClient.query(gql`
                    mutation {
                        addItemToOrder(productVariantId: 1, quantity: 1, customFields: { validateInt: 9 }) {
                            ... on Order {
                                id
                                lines {
                                    customFields {
                                        validateInt
                                    }
                                }
                            }
                        }
                    }
                `);

                expect(result.lines[0].customFields).toEqual({ validateInt: 9 });
            });

            it('adjustOrderLine', async () => {
                try {
                    const { adjustOrderLine } = await shopClient.query(gql`
                        mutation {
                            adjustOrderLine(
                                orderLineId: "T_1"
                                quantity: 1
                                customFields: { validateInt: 11 }
                            ) {
                                ... on Order {
                                    id
                                }
                            }
                        }
                    `);
                    fail('Should have thrown');
                } catch (e) {
                    expect(e.message).toContain(
                        'The custom field "validateInt" value [11] is greater than the maximum [10]',
                    );
                }

                const { adjustOrderLine: result } = await shopClient.query(gql`
                    mutation {
                        adjustOrderLine(orderLineId: "T_1", quantity: 1, customFields: { validateInt: 2 }) {
                            ... on Order {
                                id
                                lines {
                                    customFields {
                                        validateInt
                                    }
                                }
                            }
                        }
                    }
                `);

                expect(result.lines[0].customFields).toEqual({ validateInt: 2 });
            });
        });
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
            }, 'Cannot query field "nonPublic" on type "ProductCustomFields"'),
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
            }, 'Cannot query field "internalString" on type "ProductCustomFields"'),
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
            }, 'Cannot query field "internalString" on type "ProductCustomFields"'),
        );

        // https://github.com/vendure-ecommerce/vendure/issues/3049
        it('does not leak private fields via JSON type', async () => {
            const { collection } = await shopClient.query(gql`
                query {
                    collection(id: "T_1") {
                        id
                        customFields
                    }
                }
            `);

            expect(collection.customFields).toBe(null);
        });
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

        // https://github.com/vendure-ecommerce/vendure/issues/1581
        it('can sort by localeString custom fields', async () => {
            const { products } = await adminClient.query(gql`
                query {
                    products(options: { sort: { localeStringWithDefault: ASC } }) {
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

        it('can filter by localeString custom fields', async () => {
            const { products } = await adminClient.query(gql`
                query {
                    products(options: { filter: { localeStringWithDefault: { contains: "hola" } } }) {
                        totalItems
                    }
                }
            `);

            expect(products.totalItems).toBe(1);
        });

        it('can filter by custom list fields', async () => {
            const { products: result1 } = await adminClient.query(gql`
                query {
                    products(options: { filter: { intListWithValidation: { inList: 42 } } }) {
                        totalItems
                    }
                }
            `);

            expect(result1.totalItems).toBe(1);
            const { products: result2 } = await adminClient.query(gql`
                query {
                    products(options: { filter: { intListWithValidation: { inList: 43 } } }) {
                        totalItems
                    }
                }
            `);

            expect(result2.totalItems).toBe(0);
        });

        it(
            'cannot sort by custom list fields',
            assertThrowsWithMessage(async () => {
                await adminClient.query(gql`
                    query {
                        products(options: { sort: { intListWithValidation: ASC } }) {
                            totalItems
                        }
                    }
                `);
            }, 'Field "intListWithValidation" is not defined by type "ProductSortParameter".'),
        );

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
            }, 'Field "internalString" is not defined by type "ProductFilterParameter"'),
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
            }, 'Field "internalString" is not defined by type "ProductFilterParameter"'),
        );
    });

    describe('product on productVariant entity', () => {
        it('is translated', async () => {
            const { productVariants } = await adminClient.query(gql`
                query {
                    productVariants(productId: "T_1") {
                        items {
                            product {
                                name
                                id
                                customFields {
                                    localeStringWithDefault
                                    stringWithDefault
                                }
                            }
                        }
                    }
                }
            `);

            expect(productVariants.items[0].product).toEqual({
                id: 'T_1',
                name: 'Laptop',
                customFields: {
                    localeStringWithDefault: 'hola',
                    stringWithDefault: 'hello',
                },
            });
        });
    });

    describe('unique constraint', () => {
        it('setting unique value works', async () => {
            const result = await adminClient.query(gql`
                mutation {
                    updateProduct(input: { id: "T_1", customFields: { uniqueString: "foo" } }) {
                        id
                        customFields {
                            uniqueString
                        }
                    }
                }
            `);

            expect(result.updateProduct.customFields.uniqueString).toBe('foo');
        });

        it('setting conflicting value fails', async () => {
            try {
                await adminClient.query(gql`
                    mutation {
                        createProduct(
                            input: {
                                translations: [
                                    { languageCode: en, name: "test 2", slug: "test-2", description: "" }
                                ]
                                customFields: { uniqueString: "foo" }
                            }
                        ) {
                            id
                        }
                    }
                `);
                fail('Should have thrown');
            } catch (e: any) {
                let duplicateKeyErrMessage = 'unassigned';
                switch (customConfig.dbConnectionOptions.type) {
                    case 'mariadb':
                    case 'mysql':
                        duplicateKeyErrMessage = "ER_DUP_ENTRY: Duplicate entry 'foo' for key";
                        break;
                    case 'postgres':
                        duplicateKeyErrMessage = 'duplicate key value violates unique constraint';
                        break;
                    case 'sqlite':
                    case 'sqljs':
                        duplicateKeyErrMessage = 'UNIQUE constraint failed: product.customFieldsUniquestring';
                        break;
                }
                expect(e.message).toContain(duplicateKeyErrMessage);
            }
        });
    });
});
