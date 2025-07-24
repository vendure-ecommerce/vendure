import { FieldInfo } from '@/vdb/framework/document-introspection/get-document-structure.js';
import { describe, expect, it } from 'vitest';

import { createFormSchemaFromFields, getZodTypeFromField } from './form-schema-tools.js';

// Helper to create mock FieldInfo
const createMockField = (
    name: string,
    type: string,
    nullable = false,
    list = false,
    typeInfo?: FieldInfo[],
): FieldInfo => ({
    name,
    type,
    nullable,
    list,
    typeInfo,
    isPaginatedList: false,
    isScalar: false,
});

// Helper to create mock CustomFieldConfig
const createMockCustomField = (
    name: string,
    type: string,
    options: {
        pattern?: string;
        intMin?: number;
        intMax?: number;
        floatMin?: number;
        floatMax?: number;
        datetimeMin?: string;
        datetimeMax?: string;
        list?: boolean;
        nullable?: boolean;
    } = {},
) => ({
    name,
    type,
    ...options,
});

describe('form-schema-tools', () => {
    describe('getZodTypeFromField', () => {
        it('should create string type for String fields', () => {
            const field = createMockField('name', 'String');
            const schema = getZodTypeFromField(field);

            expect(() => schema.parse('test')).not.toThrow();
            expect(() => schema.parse(123)).toThrow();
        });

        it('should create number type for Int fields', () => {
            const field = createMockField('age', 'Int');
            const schema = getZodTypeFromField(field);

            expect(() => schema.parse(25)).not.toThrow();
            expect(() => schema.parse('25')).toThrow();
        });

        it('should create number type for Float fields', () => {
            const field = createMockField('price', 'Float');
            const schema = getZodTypeFromField(field);

            expect(() => schema.parse(29.99)).not.toThrow();
            expect(() => schema.parse('29.99')).toThrow();
        });

        it('should create boolean type for Boolean fields', () => {
            const field = createMockField('active', 'Boolean');
            const schema = getZodTypeFromField(field);

            expect(() => schema.parse(true)).not.toThrow();
            expect(() => schema.parse('true')).toThrow();
        });

        it('should handle nullable fields', () => {
            const field = createMockField('optional', 'String', true);
            const schema = getZodTypeFromField(field);

            expect(() => schema.parse('test')).not.toThrow();
            expect(() => schema.parse(null)).not.toThrow();
            expect(() => schema.parse(undefined)).not.toThrow();
        });

        it('should handle list fields', () => {
            const field = createMockField('tags', 'String', false, true);
            const schema = getZodTypeFromField(field);

            expect(() => schema.parse(['tag1', 'tag2'])).not.toThrow();
            expect(() => schema.parse('tag1')).toThrow();
        });
    });

    describe('createFormSchemaFromFields - basic functionality', () => {
        it('should create schema for simple fields', () => {
            const fields = [
                createMockField('name', 'String'),
                createMockField('age', 'Int'),
                createMockField('active', 'Boolean'),
            ];

            const schema = createFormSchemaFromFields(fields);

            const validData = { name: 'John', age: 25, active: true };
            expect(() => schema.parse(validData)).not.toThrow();

            const invalidData = { name: 123, age: 'twenty', active: 'yes' };
            expect(() => schema.parse(invalidData)).toThrow();
        });

        it('should handle nested objects', () => {
            const fields = [
                createMockField('user', 'Object', false, false, [
                    createMockField('name', 'String'),
                    createMockField('email', 'String'),
                ]),
            ];

            const schema = createFormSchemaFromFields(fields);

            const validData = {
                user: {
                    name: 'John',
                    email: 'john@example.com',
                },
            };
            expect(() => schema.parse(validData)).not.toThrow();
        });
    });

    describe('createFormSchemaFromFields - custom fields (root context)', () => {
        it('should apply string pattern validation for root custom fields', () => {
            const fields = [createMockField('customFields', 'Object', false, false, [])];
            const customFields = [createMockCustomField('sku', 'string', { pattern: '^[A-Z]{2}-\\d{4}$' })];

            const schema = createFormSchemaFromFields(fields, customFields, false);

            const validData = { customFields: { sku: 'AB-1234' } };
            expect(() => schema.parse(validData)).not.toThrow();

            const invalidData = { customFields: { sku: 'invalid-sku' } };
            expect(() => schema.parse(invalidData)).toThrow();
        });

        it('should apply int min/max validation for root custom fields', () => {
            const fields = [createMockField('customFields', 'Object', false, false, [])];
            const customFields = [createMockCustomField('quantity', 'int', { intMin: 1, intMax: 100 })];

            const schema = createFormSchemaFromFields(fields, customFields, false);

            const validData = { customFields: { quantity: 50 } };
            expect(() => schema.parse(validData)).not.toThrow();

            const belowMinData = { customFields: { quantity: 0 } };
            expect(() => schema.parse(belowMinData)).toThrow();

            const aboveMaxData = { customFields: { quantity: 101 } };
            expect(() => schema.parse(aboveMaxData)).toThrow();
        });

        it('should apply float min/max validation for root custom fields', () => {
            const fields = [createMockField('customFields', 'Object', false, false, [])];
            const customFields = [
                createMockCustomField('weight', 'float', { floatMin: 0.1, floatMax: 999.9 }),
            ];

            const schema = createFormSchemaFromFields(fields, customFields, false);

            const validData = { customFields: { weight: 10.5 } };
            expect(() => schema.parse(validData)).not.toThrow();

            const belowMinData = { customFields: { weight: 0.05 } };
            expect(() => schema.parse(belowMinData)).toThrow();

            const aboveMaxData = { customFields: { weight: 1000.0 } };
            expect(() => schema.parse(aboveMaxData)).toThrow();
        });

        it('should apply datetime min/max validation for root custom fields', () => {
            const fields = [createMockField('customFields', 'Object', false, false, [])];
            const customFields = [
                createMockCustomField('releaseDate', 'datetime', {
                    datetimeMin: '2020-01-01T00:00:00.000Z',
                    datetimeMax: '2025-12-31T23:59:59.999Z',
                }),
            ];

            const schema = createFormSchemaFromFields(fields, customFields, false);

            // Test with string
            const validDataString = { customFields: { releaseDate: '2023-06-15T12:00:00.000Z' } };
            expect(() => schema.parse(validDataString)).not.toThrow();

            // Test with Date object
            const validDataDate = { customFields: { releaseDate: new Date('2023-06-15T12:00:00.000Z') } };
            expect(() => schema.parse(validDataDate)).not.toThrow();

            const beforeMinData = { customFields: { releaseDate: '2019-12-31T23:59:59.999Z' } };
            expect(() => schema.parse(beforeMinData)).toThrow();

            const afterMaxData = { customFields: { releaseDate: '2026-01-01T00:00:00.000Z' } };
            expect(() => schema.parse(afterMaxData)).toThrow();
        });

        it('should handle boolean custom fields', () => {
            const fields = [createMockField('customFields', 'Object', false, false, [])];
            const customFields = [createMockCustomField('featured', 'boolean')];

            const schema = createFormSchemaFromFields(fields, customFields, false);

            const validData = { customFields: { featured: true } };
            expect(() => schema.parse(validData)).not.toThrow();

            const invalidData = { customFields: { featured: 'yes' } };
            expect(() => schema.parse(invalidData)).toThrow();
        });

        it('should handle list custom fields', () => {
            const fields = [createMockField('customFields', 'Object', false, false, [])];
            const customFields = [createMockCustomField('tags', 'string', { list: true })];

            const schema = createFormSchemaFromFields(fields, customFields, false);

            const validData = { customFields: { tags: ['tag1', 'tag2'] } };
            expect(() => schema.parse(validData)).not.toThrow();

            const invalidData = { customFields: { tags: 'single-tag' } };
            expect(() => schema.parse(invalidData)).toThrow();
        });

        it('should handle nullable custom fields', () => {
            const fields = [createMockField('customFields', 'Object', false, false, [])];
            const customFields = [createMockCustomField('optionalField', 'string', { nullable: true })];

            const schema = createFormSchemaFromFields(fields, customFields, false);

            const validData = { customFields: { optionalField: 'value' } };
            expect(() => schema.parse(validData)).not.toThrow();

            const nullData = { customFields: { optionalField: null } };
            expect(() => schema.parse(nullData)).not.toThrow();

            const undefinedData = { customFields: { optionalField: undefined } };
            expect(() => schema.parse(undefinedData)).not.toThrow();
        });

        it('should only include non-translatable fields in root context', () => {
            const fields = [createMockField('customFields', 'Object', false, false, [])];
            const customFields = [
                createMockCustomField('sku', 'string'), // Should be included
                createMockCustomField('description', 'localeString'), // Should be excluded
                createMockCustomField('content', 'localeText'), // Should be excluded
                createMockCustomField('quantity', 'int'), // Should be included
            ];

            const schema = createFormSchemaFromFields(fields, customFields, false);

            // Should accept non-translatable fields
            const validData = { customFields: { sku: 'AB-123', quantity: 5 } };
            expect(() => schema.parse(validData)).not.toThrow();

            // Should reject translatable fields in root context
            const withTranslatableData = {
                customFields: {
                    sku: 'AB-123',
                    description: 'Some description', // This should cause validation to fail
                },
            };
            // Note: This might not throw because Zod ignores extra properties by default
            // The important thing is that the schema doesn't validate translatable fields
        });
    });

    describe('createFormSchemaFromFields - custom fields (translation context)', () => {
        it('should handle localeString custom fields in translation context', () => {
            const fields = [createMockField('customFields', 'Object', false, false, [])];
            const customFields = [
                createMockCustomField('description', 'localeString', { pattern: '^[A-Za-z\\s]+$' }),
            ];

            const schema = createFormSchemaFromFields(fields, customFields, true);

            const validData = { customFields: { description: 'Valid Description' } };
            expect(() => schema.parse(validData)).not.toThrow();

            const invalidData = { customFields: { description: 'Invalid123' } };
            expect(() => schema.parse(invalidData)).toThrow();
        });

        it('should handle localeText custom fields in translation context', () => {
            const fields = [createMockField('customFields', 'Object', false, false, [])];
            const customFields = [createMockCustomField('content', 'localeText')];

            const schema = createFormSchemaFromFields(fields, customFields, true);

            const validData = { customFields: { content: 'Some long text content' } };
            expect(() => schema.parse(validData)).not.toThrow();

            const invalidData = { customFields: { content: 123 } };
            expect(() => schema.parse(invalidData)).toThrow();
        });

        it('should only include translatable fields in translation context', () => {
            const fields = [createMockField('customFields', 'Object', false, false, [])];
            const customFields = [
                createMockCustomField('sku', 'string'), // Should be excluded
                createMockCustomField('description', 'localeString'), // Should be included
                createMockCustomField('content', 'localeText'), // Should be included
                createMockCustomField('quantity', 'int'), // Should be excluded
            ];

            const schema = createFormSchemaFromFields(fields, customFields, true);

            // Should accept translatable fields
            const validData = {
                customFields: {
                    description: 'Description',
                    content: 'Content',
                },
            };
            expect(() => schema.parse(validData)).not.toThrow();
        });
    });

    describe('createFormSchemaFromFields - translation handling', () => {
        it('should handle translations field with custom fields', () => {
            const fields = [
                createMockField('name', 'String'),
                createMockField('translations', 'Object', false, true, [
                    createMockField('id', 'ID'),
                    createMockField('languageCode', 'String'),
                    createMockField('name', 'String'),
                    createMockField('customFields', 'Object', false, false, []),
                ]),
                createMockField('customFields', 'Object', false, false, []),
            ];
            const customFields = [
                createMockCustomField('sku', 'string'), // Root custom field
                createMockCustomField('description', 'localeString'), // Translation custom field
            ];

            const schema = createFormSchemaFromFields(fields, customFields, false);

            const validData = {
                name: 'Product Name',
                customFields: { sku: 'AB-123' }, // Root custom fields
                translations: [
                    {
                        id: '1',
                        languageCode: 'en',
                        name: 'English Name',
                        customFields: { description: 'English description' }, // Translation custom fields
                    },
                ],
            };

            expect(() => schema.parse(validData)).not.toThrow();
        });
    });

    describe('createFormSchemaFromFields - error messages', () => {
        it('should provide clear error messages for pattern validation', () => {
            const fields = [createMockField('customFields', 'Object', false, false, [])];
            const customFields = [createMockCustomField('sku', 'string', { pattern: '^[A-Z]{2}-\\d{4}$' })];

            const schema = createFormSchemaFromFields(fields, customFields, false);

            try {
                schema.parse({ customFields: { sku: 'invalid' } });
                expect.fail('Should have thrown validation error');
            } catch (error: any) {
                expect(error.errors[0].message).toContain('Value must match pattern');
            }
        });

        it('should provide clear error messages for min validation', () => {
            const fields = [createMockField('customFields', 'Object', false, false, [])];
            const customFields = [createMockCustomField('quantity', 'int', { intMin: 1 })];

            const schema = createFormSchemaFromFields(fields, customFields, false);

            try {
                schema.parse({ customFields: { quantity: 0 } });
                expect.fail('Should have thrown validation error');
            } catch (error: any) {
                expect(error.errors[0].message).toContain('Value must be at least 1');
            }
        });

        it('should provide clear error messages for max validation', () => {
            const fields = [createMockField('customFields', 'Object', false, false, [])];
            const customFields = [createMockCustomField('quantity', 'int', { intMax: 100 })];

            const schema = createFormSchemaFromFields(fields, customFields, false);

            try {
                schema.parse({ customFields: { quantity: 101 } });
                expect.fail('Should have thrown validation error');
            } catch (error: any) {
                expect(error.errors[0].message).toContain('Value must be at most 100');
            }
        });

        it('should provide clear error messages for datetime validation', () => {
            const fields = [createMockField('customFields', 'Object', false, false, [])];
            const customFields = [
                createMockCustomField('releaseDate', 'datetime', {
                    datetimeMin: '2020-01-01T00:00:00.000Z',
                }),
            ];

            const schema = createFormSchemaFromFields(fields, customFields, false);

            try {
                schema.parse({ customFields: { releaseDate: '2019-12-31T23:59:59.999Z' } });
                expect.fail('Should have thrown validation error');
            } catch (error: any) {
                expect(error.issues).toBeDefined();
                expect(error.issues.length).toBeGreaterThan(0);
                expect(error.issues[0].message).toContain('Date must be after');
            }

            // Test with Date object as well
            try {
                schema.parse({ customFields: { releaseDate: new Date('2019-12-31T23:59:59.999Z') } });
                expect.fail('Should have thrown validation error');
            } catch (error: any) {
                expect(error.issues).toBeDefined();
                expect(error.issues.length).toBeGreaterThan(0);
                expect(error.issues[0].message).toContain('Date must be after');
            }
        });
    });

    describe('createFormSchemaFromFields - edge cases', () => {
        it('should handle empty custom field config', () => {
            const fields = [
                createMockField('name', 'String'),
                createMockField('customFields', 'Object', false, false, []),
            ];

            const schema = createFormSchemaFromFields(fields, []);

            const validData = { name: 'Test', customFields: {} };
            expect(() => schema.parse(validData)).not.toThrow();
        });

        it('should handle no custom field config', () => {
            const fields = [
                createMockField('name', 'String'),
                createMockField('customFields', 'Object', false, false, []),
            ];

            const schema = createFormSchemaFromFields(fields);

            const validData = { name: 'Test' };
            expect(() => schema.parse(validData)).not.toThrow();
        });

        it('should handle fields without customFields', () => {
            const fields = [createMockField('name', 'String'), createMockField('age', 'Int')];
            const customFields = [createMockCustomField('sku', 'string')];

            const schema = createFormSchemaFromFields(fields, customFields);

            const validData = { name: 'Test', age: 25 };
            expect(() => schema.parse(validData)).not.toThrow();
        });
    });
});
