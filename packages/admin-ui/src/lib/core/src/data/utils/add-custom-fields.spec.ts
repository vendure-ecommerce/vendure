import { DocumentNode, FieldNode, FragmentDefinitionNode, Kind, parse } from 'graphql';
import { beforeEach, describe, expect, it } from 'vitest';

import { CustomFieldConfig, CustomFields } from '../../common/generated-types';

import { addCustomFields } from './add-custom-fields';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
describe('addCustomFields()', () => {
    let documentNode: DocumentNode;

    beforeEach(() => {
        const sdl = `
            query GetProductWithVariants {
                product {
                    ...ProductWithVariants
                }
            }

            fragment ProductWithVariants on Product {
                id
                translations {
                    languageCode
                    name
                }
                variants {
                    ...ProductVariant
                }
            }

            fragment ProductVariant on ProductVariant {
            }

            fragment ProductOptionGroup on ProductOptionGroup {
            }

            fragment ProductOption on ProductOption {
            }

            fragment User on User {
            }

            fragment Customer on Customer {
            }

            fragment Address on Address {
            }
        `;

        documentNode = parse(sdl);
    });

    it('Adds customFields to Product fragment', () => {
        const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
        customFieldsConfig.set('Product', [
            { name: 'custom1', type: 'string', list: false },
            { name: 'custom2', type: 'boolean', list: false },
        ]);

        const result = addCustomFields(documentNode, customFieldsConfig);
        const productFragmentDef = result.definitions[1] as FragmentDefinitionNode;
        const customFieldsDef = productFragmentDef.selectionSet.selections[2] as FieldNode;
        expect(productFragmentDef.selectionSet.selections.length).toBe(3);
        expect(customFieldsDef.selectionSet!.selections.length).toBe(2);
        expect((customFieldsDef.selectionSet!.selections[0] as FieldNode).name.value).toBe('custom1');
        expect((customFieldsDef.selectionSet!.selections[1] as FieldNode).name.value).toBe('custom2');
    });

    it('Adds customFields to Product translations', () => {
        const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
        customFieldsConfig.set('Product', [
            { name: 'customLocaleString', type: 'localeString', list: false },
        ]);

        const result = addCustomFields(documentNode, customFieldsConfig);
        const productFragmentDef = result.definitions[1] as FragmentDefinitionNode;
        const translationsField = productFragmentDef.selectionSet.selections[1] as FieldNode;
        const customTranslationFieldsDef = translationsField.selectionSet!.selections[2] as FieldNode;
        expect(translationsField.selectionSet!.selections.length).toBe(3);
        expect((customTranslationFieldsDef.selectionSet!.selections[0] as FieldNode).name.value).toBe(
            'customLocaleString',
        );
    });

    function addsCustomFieldsToType(type: keyof CustomFields, indexOfDefinition: number) {
        const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
        customFieldsConfig.set(type, [{ name: 'custom', type: 'boolean', list: false }]);

        const result = addCustomFields(documentNode, customFieldsConfig);
        const fragmentDef = result.definitions[indexOfDefinition] as FragmentDefinitionNode;
        const customFieldsDef = fragmentDef.selectionSet.selections[0] as FieldNode;
        expect(fragmentDef.selectionSet.selections.length).toBe(1);
        expect(customFieldsDef.selectionSet!.selections.length).toBe(1);
        expect((customFieldsDef.selectionSet!.selections[0] as FieldNode).name.value).toBe('custom');
    }

    it('Does not duplicate customFields selection set', () => {
        const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
        customFieldsConfig.set('Product', [{ name: 'custom', type: 'boolean', list: false }]);
        const result1 = addCustomFields(documentNode, customFieldsConfig);
        const result2 = addCustomFields(result1, customFieldsConfig);

        const fragmentDef = result2.definitions[1] as FragmentDefinitionNode;
        const customFieldSelections = fragmentDef.selectionSet.selections.filter(
            s => s.kind === Kind.FIELD && s.name.value === 'customFields',
        );
        expect(customFieldSelections.length).toBe(1);
    });

    it('Adds customFields to ProductVariant fragment', () => {
        addsCustomFieldsToType('ProductVariant', 2);
    });

    it('Adds customFields to ProductOptionGroup fragment', () => {
        addsCustomFieldsToType('ProductOptionGroup', 3);
    });

    it('Adds customFields to ProductOption fragment', () => {
        addsCustomFieldsToType('ProductOption', 4);
    });

    it('Adds customFields to User fragment', () => {
        addsCustomFieldsToType('User', 5);
    });

    it('Adds customFields to Customer fragment', () => {
        addsCustomFieldsToType('Customer', 6);
    });

    it('Adds customFields to Address fragment', () => {
        addsCustomFieldsToType('Address', 7);
    });
});
