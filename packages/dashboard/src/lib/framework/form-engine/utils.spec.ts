import { graphql, VariablesOf } from 'gql.tada';
import { describe, expect, it } from 'vitest';

import { FieldInfo, getOperationVariablesFields } from '../document-introspection/get-document-structure.js';

import {
    convertEmptyStringsToNull,
    removeEmptyIdFields,
    stripNullNullableFields,
    transformRelationFields,
} from './utils.js';

const createProductDocument = graphql(`
    mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
            id
        }
    }
`);

type CreateProductInput = VariablesOf<typeof createProductDocument>;

describe('removeEmptyIdFields', () => {
    it('should remove empty translation id field', () => {
        const values: CreateProductInput = {
            input: { translations: [{ id: '', languageCode: 'en' }] },
        };
        const fields = getOperationVariablesFields(createProductDocument);
        const result = removeEmptyIdFields(values, fields);

        expect(result).toEqual({ input: { translations: [{ languageCode: 'en' }] } });
    });

    it('should remove empty featuredAsset id field', () => {
        const values: CreateProductInput = {
            input: { featuredAssetId: '', translations: [] },
        };
        const fields = getOperationVariablesFields(createProductDocument);
        const result = removeEmptyIdFields(values, fields);
        expect(result).toEqual({ input: { translations: [] } });
    });
});

describe('transformRelationFields', () => {
    const createFieldsWithListRelation = (): FieldInfo[] => [
        {
            name: 'customFields',
            type: 'CustomFields',
            nullable: true,
            list: false,
            isPaginatedList: false,
            isScalar: false,
            typeInfo: [
                {
                    name: 'featuredProductsIds',
                    type: 'ID',
                    nullable: true,
                    list: true,
                    isPaginatedList: false,
                    isScalar: true,
                },
            ],
        },
    ];

    const createFieldsWithSingleRelation = (): FieldInfo[] => [
        {
            name: 'customFields',
            type: 'CustomFields',
            nullable: true,
            list: false,
            isPaginatedList: false,
            isScalar: false,
            typeInfo: [
                {
                    name: 'featuredProductId',
                    type: 'ID',
                    nullable: true,
                    list: false,
                    isPaginatedList: false,
                    isScalar: true,
                },
            ],
        },
    ];

    it('should extract IDs from list relation and delete original field', () => {
        const entity = {
            customFields: {
                featuredProducts: [
                    { id: '1', name: 'Product 1' },
                    { id: '2', name: 'Product 2' },
                ],
            },
        };
        const result = transformRelationFields(createFieldsWithListRelation(), entity);

        expect(result.customFields).toEqual({ featuredProductsIds: ['1', '2'] });
        expect(result.customFields).not.toHaveProperty('featuredProducts');
    });

    it('should handle empty array for clearing list relations', () => {
        const entity = { customFields: { featuredProducts: [] } };
        const result = transformRelationFields(createFieldsWithListRelation(), entity);

        expect(result.customFields).toEqual({ featuredProductsIds: [] });
    });

    it('should handle undefined/null list relation by deleting field', () => {
        const undefinedResult = transformRelationFields(createFieldsWithListRelation(), { customFields: {} });
        const nullResult = transformRelationFields(createFieldsWithListRelation(), {
            customFields: { featuredProducts: null },
        });

        expect(undefinedResult.customFields).not.toHaveProperty('featuredProductsIds');
        expect(nullResult.customFields).not.toHaveProperty('featuredProducts');
    });

    it('should extract ID from single relation and delete original field', () => {
        const entity = { customFields: { featuredProduct: { id: '1', name: 'Product 1' } } };
        const result = transformRelationFields(createFieldsWithSingleRelation(), entity);

        expect(result.customFields).toEqual({ featuredProductId: '1' });
        expect(result.customFields).not.toHaveProperty('featuredProduct');
    });

    it('should not mutate the original entity', () => {
        const entity = { customFields: { featuredProducts: [{ id: '1' }] } };
        const result = transformRelationFields(createFieldsWithListRelation(), entity);

        expect(entity.customFields.featuredProducts).toEqual([{ id: '1' }]);
        expect(result).not.toBe(entity);
    });

    it('should preserve other custom fields while transforming relations', () => {
        const fields: FieldInfo[] = [
            {
                name: 'customFields',
                type: 'CustomFields',
                nullable: true,
                list: false,
                isPaginatedList: false,
                isScalar: false,
                typeInfo: [
                    {
                        name: 'featuredProductsIds',
                        type: 'ID',
                        nullable: true,
                        list: true,
                        isPaginatedList: false,
                        isScalar: true,
                    },
                    {
                        name: 'notes',
                        type: 'String',
                        nullable: true,
                        list: false,
                        isPaginatedList: false,
                        isScalar: true,
                    },
                ],
            },
        ];
        const entity = { customFields: { featuredProducts: [{ id: '1' }], notes: 'Some notes' } };
        const result = transformRelationFields(fields, entity);

        expect(result.customFields).toEqual({ featuredProductsIds: ['1'], notes: 'Some notes' });
    });
});

describe('convertEmptyStringsToNull', () => {
    it('should not throw when called with null values', () => {
        const fields: FieldInfo[] = [
            {
                name: 'customFields',
                type: 'CustomFieldsInput',
                nullable: true,
                list: false,
                isPaginatedList: false,
                isScalar: false,
            },
        ];
        expect(() => convertEmptyStringsToNull(null as any, fields)).not.toThrow();
        expect(convertEmptyStringsToNull(null as any, fields)).toBeNull();
    });

    it('should preserve empty object for nullable non-scalar fields', () => {
        const fields: FieldInfo[] = [
            {
                name: 'customFields',
                type: 'CustomFieldsInput',
                nullable: true,
                list: false,
                isPaginatedList: false,
                isScalar: false,
            },
        ];
        const values = { customFields: {} };
        const result = convertEmptyStringsToNull(values, fields);
        expect(result.customFields).toEqual({});
    });

    it('should convert empty string to null for nullable DateTime fields', () => {
        const fields: FieldInfo[] = [
            {
                name: 'releaseDate',
                type: 'DateTime',
                nullable: true,
                list: false,
                isPaginatedList: false,
                isScalar: true,
            },
        ];
        const values = { releaseDate: '' };
        const result = convertEmptyStringsToNull(values, fields);
        expect(result.releaseDate).toBeNull();
    });
});

describe('stripNullNullableFields', () => {
    it('should strip null from nullable scalar fields', () => {
        const fields: FieldInfo[] = [
            {
                name: 'outOfStockThreshold',
                type: 'Int',
                nullable: true,
                list: false,
                isPaginatedList: false,
                isScalar: true,
            },
            {
                name: 'weight',
                type: 'Float',
                nullable: true,
                list: false,
                isPaginatedList: false,
                isScalar: true,
            },
            {
                name: 'releaseDate',
                type: 'DateTime',
                nullable: true,
                list: false,
                isPaginatedList: false,
                isScalar: true,
            },
        ];
        const values = { outOfStockThreshold: null, weight: null, releaseDate: null };
        const result = stripNullNullableFields(values, fields);
        expect(result).toEqual({});
    });

    it('should preserve non-null values for nullable fields', () => {
        const fields: FieldInfo[] = [
            {
                name: 'outOfStockThreshold',
                type: 'Int',
                nullable: true,
                list: false,
                isPaginatedList: false,
                isScalar: true,
            },
            {
                name: 'weight',
                type: 'Float',
                nullable: true,
                list: false,
                isPaginatedList: false,
                isScalar: true,
            },
        ];
        const values = { outOfStockThreshold: 5, weight: null };
        const result = stripNullNullableFields(values, fields);
        expect(result).toEqual({ outOfStockThreshold: 5 });
    });

    it('should preserve null for non-nullable fields', () => {
        const fields: FieldInfo[] = [
            {
                name: 'code',
                type: 'String',
                nullable: false,
                list: false,
                isPaginatedList: false,
                isScalar: true,
            },
        ];
        const values = { code: null };
        const result = stripNullNullableFields(values, fields);
        expect(result).toEqual({ code: null });
    });

    it('should handle nested objects with nullable fields', () => {
        const fields: FieldInfo[] = [
            {
                name: 'translations',
                type: 'TranslationInput',
                nullable: false,
                list: true,
                isPaginatedList: false,
                isScalar: false,
                typeInfo: [
                    {
                        name: 'name',
                        type: 'String',
                        nullable: false,
                        list: false,
                        isPaginatedList: false,
                        isScalar: true,
                    },
                    {
                        name: 'description',
                        type: 'String',
                        nullable: true,
                        list: false,
                        isPaginatedList: false,
                        isScalar: true,
                    },
                ],
            },
        ];
        const values = {
            translations: [{ name: 'Test', description: null }],
        };
        const result = stripNullNullableFields(values, fields);
        expect(result).toEqual({ translations: [{ name: 'Test' }] });
    });

    it('should handle null input gracefully', () => {
        const fields: FieldInfo[] = [];
        expect(stripNullNullableFields(null as any, fields)).toBeNull();
    });

    it('should not mutate the original values', () => {
        const fields: FieldInfo[] = [
            {
                name: 'threshold',
                type: 'Int',
                nullable: true,
                list: false,
                isPaginatedList: false,
                isScalar: true,
            },
        ];
        const values = { threshold: null };
        const result = stripNullNullableFields(values, fields);
        expect(values.threshold).toBeNull();
        expect(result).toEqual({});
    });
});
