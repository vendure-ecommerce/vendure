import { graphql, VariablesOf } from 'gql.tada';
import { describe, expect, it } from 'vitest';

import { getOperationVariablesFields } from '../document-introspection/get-document-structure.js';

import { isStringFieldWithOptions, removeEmptyIdFields } from './utils.js';

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

describe('isStringFieldWithOptions', () => {
    it('should return true for minimal custom field', () => {
        expect(
            isStringFieldWithOptions({
                name: 'custom-field',
                label: [],
                requiresPermission: [],
                type: 'string',
                description: [],
                defaultValue: null,
                readonly: null,
                list: false,
                options: null,
                nullable: null,
                pattern: null,
                ui: { component: 'select-form-input', options: [{ value: 'custom-value-1' }] },
            }),
        ).toBe(true);
    });

    it('should return false for custom field with missing options', () => {
        expect(
            isStringFieldWithOptions({
                name: 'custom-field',
                label: [],
                requiresPermission: [],
                type: 'string',
                description: [],
                defaultValue: null,
                readonly: null,
                list: false,
                options: null,
                nullable: null,
                pattern: null,
                ui: {
                    component: 'select-form-input',
                },
            }),
        ).toBe(false);
    });
});
