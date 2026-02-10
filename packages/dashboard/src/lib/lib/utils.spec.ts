import { describe, expect, it } from 'vitest';

import { removeReadonlyAndLocalizedCustomFields, transformRelationCustomFieldInputs } from './utils.js';

describe('removeReadonlyAndLocalizedCustomFields', () => {
    it('should remove readonly custom fields from root customFields', () => {
        const values = {
            id: 'entity-1',
            name: 'Test Entity',
            customFields: {
                editableField: 'value1',
                readonlyField: 'readonly-value',
            },
        };
        const customFieldConfigs = [
            { name: 'editableField', type: 'string', readonly: false },
            { name: 'readonlyField', type: 'string', readonly: true },
        ];

        const result = removeReadonlyAndLocalizedCustomFields(values, customFieldConfigs);

        expect(result.customFields).toHaveProperty('editableField');
        expect(result.customFields).not.toHaveProperty('readonlyField');
        expect(result.customFields.editableField).toBe('value1');
    });

    it('should remove localeString and localeText fields from root customFields', () => {
        const values = {
            id: 'entity-1',
            customFields: {
                regularField: 'value1',
                description: 'English description',
                content: 'English content',
            },
        };
        const customFieldConfigs = [
            { name: 'regularField', type: 'string' },
            { name: 'description', type: 'localeString' },
            { name: 'content', type: 'localeText' },
        ];

        const result = removeReadonlyAndLocalizedCustomFields(values, customFieldConfigs);

        expect(result.customFields).toHaveProperty('regularField');
        expect(result.customFields).not.toHaveProperty('description');
        expect(result.customFields).not.toHaveProperty('content');
    });

    it('should transform list relation custom fields to use Ids suffix', () => {
        const values = {
            id: 'entity-1',
            customFields: {
                favorites: [{ id: 'prod1' }, { id: 'prod2' }],
                notes: 'some notes',
            },
        };
        const customFieldConfigs = [
            { name: 'favorites', type: 'relation', list: true },
            { name: 'notes', type: 'string' },
        ];

        const result = removeReadonlyAndLocalizedCustomFields(values, customFieldConfigs);
        const customFields = result.customFields as Record<string, any>;

        expect(customFields).not.toHaveProperty('favorites');
        expect(customFields).toHaveProperty('favoritesIds');
        expect(customFields.favoritesIds).toEqual(['prod1', 'prod2']);
        expect(customFields.notes).toBe('some notes');
    });

    it('should transform single relation custom fields to use Id suffix', () => {
        const values = {
            id: 'entity-1',
            customFields: {
                bestFriend: { id: 'cust123', name: 'John' },
                age: 25,
            },
        };
        const customFieldConfigs = [
            { name: 'bestFriend', type: 'relation', list: false },
            { name: 'age', type: 'int' },
        ];

        const result = removeReadonlyAndLocalizedCustomFields(values, customFieldConfigs);
        const customFields = result.customFields as Record<string, any>;

        expect(customFields).not.toHaveProperty('bestFriend');
        expect(customFields).toHaveProperty('bestFriendId');
        expect(customFields.bestFriendId).toBe('cust123');
        expect(customFields.age).toBe(25);
    });

    it('should handle empty list relation fields', () => {
        const values = {
            customFields: {
                favorites: [],
            },
        };
        const customFieldConfigs = [{ name: 'favorites', type: 'relation', list: true }];

        const result = removeReadonlyAndLocalizedCustomFields(values, customFieldConfigs);
        const customFields = result.customFields as Record<string, any>;

        expect(customFields).not.toHaveProperty('favorites');
        expect(customFields).toHaveProperty('favoritesIds');
        expect(customFields.favoritesIds).toEqual([]);
    });

    it('should handle null relation values', () => {
        const values = {
            customFields: {
                bestFriend: null,
            },
        };
        const customFieldConfigs = [{ name: 'bestFriend', type: 'relation', list: false }];

        const result = removeReadonlyAndLocalizedCustomFields(values, customFieldConfigs);
        const customFields = result.customFields as Record<string, any>;

        expect(customFields).not.toHaveProperty('bestFriend');
        expect(customFields).toHaveProperty('bestFriendId');
        expect(customFields.bestFriendId).toBeNull();
    });

    it('should handle relation fields with string IDs already', () => {
        const values = {
            customFields: {
                favorites: ['prod1', 'prod2'],
            },
        };
        const customFieldConfigs = [{ name: 'favorites', type: 'relation', list: true }];

        const result = removeReadonlyAndLocalizedCustomFields(values, customFieldConfigs);
        const customFields = result.customFields as Record<string, any>;

        expect(customFields.favoritesIds).toEqual(['prod1', 'prod2']);
    });

    it('should not mutate the original values', () => {
        const values = {
            customFields: {
                favorites: [{ id: 'prod1' }],
                readonlyField: 'value',
            },
        };
        const customFieldConfigs = [
            { name: 'favorites', type: 'relation', list: true },
            { name: 'readonlyField', type: 'string', readonly: true },
        ];

        const result = removeReadonlyAndLocalizedCustomFields(values, customFieldConfigs);

        expect(values.customFields).toHaveProperty('favorites');
        expect(values.customFields).toHaveProperty('readonlyField');
        expect(result).not.toBe(values);
    });

    it('should handle translations with readonly custom fields', () => {
        const values = {
            customFields: {
                regularField: 'value',
            },
            translations: [
                {
                    languageCode: 'en',
                    customFields: {
                        translatableField: 'english value',
                        readonlyTranslatable: 'readonly value',
                    },
                },
            ],
        };
        const customFieldConfigs = [
            { name: 'regularField', type: 'string' },
            { name: 'translatableField', type: 'localeString' },
            { name: 'readonlyTranslatable', type: 'localeString', readonly: true },
        ];

        const result = removeReadonlyAndLocalizedCustomFields(values, customFieldConfigs);

        expect(result.translations[0].customFields).toHaveProperty('translatableField');
        expect(result.translations[0].customFields).not.toHaveProperty('readonlyTranslatable');
    });

    it('should return values unchanged if no customFieldConfigs provided', () => {
        const values = {
            customFields: {
                favorites: [{ id: 'prod1' }],
            },
        };

        const result = removeReadonlyAndLocalizedCustomFields(values, []);

        expect(result.customFields).toHaveProperty('favorites');
    });

    it('should return values unchanged if values is null or undefined', () => {
        expect(removeReadonlyAndLocalizedCustomFields(null as any, [])).toBeNull();
        expect(removeReadonlyAndLocalizedCustomFields(undefined as any, [])).toBeUndefined();
    });

    it('should handle multiple relation fields of different types', () => {
        const values = {
            customFields: {
                favorites: [{ id: 'prod1' }],
                bestFriend: { id: 'cust1' },
                notes: 'some notes',
            },
        };
        const customFieldConfigs = [
            { name: 'favorites', type: 'relation', list: true },
            { name: 'bestFriend', type: 'relation', list: false },
            { name: 'notes', type: 'string' },
        ];

        const result = removeReadonlyAndLocalizedCustomFields(values, customFieldConfigs);
        const customFields = result.customFields as Record<string, any>;

        expect(customFields).toHaveProperty('favoritesIds');
        expect(customFields).toHaveProperty('bestFriendId');
        expect(customFields).toHaveProperty('notes');
        expect(customFields).not.toHaveProperty('favorites');
        expect(customFields).not.toHaveProperty('bestFriend');
    });
});

describe('transformRelationCustomFieldInputs', () => {
    it('should transform list relation fields to use Ids suffix', () => {
        const input = {
            customFields: {
                favorites: [{ id: 'prod1' }, { id: 'prod2' }],
            },
        };
        const customFieldConfigs = [{ name: 'favorites', type: 'relation', list: true }];

        transformRelationCustomFieldInputs(input, customFieldConfigs);
        const customFields = input.customFields as Record<string, any>;

        expect(customFields).not.toHaveProperty('favorites');
        expect(customFields).toHaveProperty('favoritesIds');
        expect(customFields.favoritesIds).toEqual(['prod1', 'prod2']);
    });

    it('should transform single relation fields to use Id suffix', () => {
        const input = {
            customFields: {
                bestFriend: { id: 'cust123' },
            },
        };
        const customFieldConfigs = [{ name: 'bestFriend', type: 'relation', list: false }];

        transformRelationCustomFieldInputs(input, customFieldConfigs);
        const customFields = input.customFields as Record<string, any>;

        expect(customFields).not.toHaveProperty('bestFriend');
        expect(customFields).toHaveProperty('bestFriendId');
        expect(customFields.bestFriendId).toBe('cust123');
    });

    it('should handle empty array for list relations', () => {
        const input = {
            customFields: {
                favorites: [],
            },
        };
        const customFieldConfigs = [{ name: 'favorites', type: 'relation', list: true }];

        transformRelationCustomFieldInputs(input, customFieldConfigs);
        const customFields = input.customFields as Record<string, any>;

        expect(customFields.favoritesIds).toEqual([]);
    });

    it('should handle null values', () => {
        const input = {
            customFields: {
                bestFriend: null,
            },
        };
        const customFieldConfigs = [{ name: 'bestFriend', type: 'relation', list: false }];

        transformRelationCustomFieldInputs(input, customFieldConfigs);
        const customFields = input.customFields as Record<string, any>;

        expect(customFields.bestFriendId).toBeNull();
    });

    it('should handle string IDs directly', () => {
        const input = {
            customFields: {
                favorites: ['prod1', 'prod2'],
                bestFriend: 'cust123',
            },
        };
        const customFieldConfigs = [
            { name: 'favorites', type: 'relation', list: true },
            { name: 'bestFriend', type: 'relation', list: false },
        ];

        transformRelationCustomFieldInputs(input, customFieldConfigs);
        const customFields = input.customFields as Record<string, any>;

        expect(customFields.favoritesIds).toEqual(['prod1', 'prod2']);
        expect(customFields.bestFriendId).toBe('cust123');
    });

    it('should not transform non-relation fields', () => {
        const input = {
            customFields: {
                notes: 'some notes',
                count: 5,
            },
        };
        const customFieldConfigs = [
            { name: 'notes', type: 'string' },
            { name: 'count', type: 'int' },
        ];

        transformRelationCustomFieldInputs(input, customFieldConfigs);

        expect(input.customFields.notes).toBe('some notes');
        expect(input.customFields.count).toBe(5);
    });

    it('should do nothing if customFields is missing', () => {
        const input = { name: 'test' } as any;
        const customFieldConfigs = [{ name: 'favorites', type: 'relation', list: true }];

        expect(() => transformRelationCustomFieldInputs(input, customFieldConfigs)).not.toThrow();
    });

    it('should do nothing if customFields is null', () => {
        const input = { customFields: null } as any;
        const customFieldConfigs = [{ name: 'favorites', type: 'relation', list: true }];

        expect(() => transformRelationCustomFieldInputs(input, customFieldConfigs)).not.toThrow();
    });

    it('should handle mixed relation and non-relation fields', () => {
        const input = {
            customFields: {
                favorites: [{ id: 'prod1' }],
                notes: 'some notes',
                bestFriend: { id: 'cust1' },
                count: 5,
            },
        };
        const customFieldConfigs = [
            { name: 'favorites', type: 'relation', list: true },
            { name: 'notes', type: 'string' },
            { name: 'bestFriend', type: 'relation', list: false },
            { name: 'count', type: 'int' },
        ];

        transformRelationCustomFieldInputs(input, customFieldConfigs);
        const customFields = input.customFields as Record<string, any>;

        expect(customFields).toHaveProperty('favoritesIds');
        expect(customFields).toHaveProperty('notes');
        expect(customFields).toHaveProperty('bestFriendId');
        expect(customFields).toHaveProperty('count');
        expect(customFields).not.toHaveProperty('favorites');
        expect(customFields).not.toHaveProperty('bestFriend');
    });
});
