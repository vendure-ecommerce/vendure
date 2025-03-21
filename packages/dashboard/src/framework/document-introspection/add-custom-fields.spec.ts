import { CustomFieldConfig, CustomFields } from '@vendure/common/lib/generated-types';
import { graphql } from 'gql.tada';
import {
    DocumentNode,
    FieldNode,
    FragmentDefinitionNode,
    Kind,
    OperationDefinitionNode,
    print,
} from 'graphql';
import { describe, it, expect, beforeEach } from 'vitest';

import { addCustomFields } from './add-custom-fields.js';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
describe('addCustomFields()', () => {
    /**
     * Normalizes the indentation of a string to make it easier to compare with the expected output
     */
    function normalizeIndentation(str: string): string {
        const lines = str.replace(/    /g, '  ').split('\n');
        const indentLength = lines[1].search(/\S|$/); // Find the first non-whitespace character
        return lines
            .map(line => line.slice(indentLength))
            .join('\n')
            .trim()
            .replace(/"/g, '');
    }

    describe('Query handling', () => {
        it('Adds customFields to entity query', () => {
            const documentNode = graphql(`
                query GetProduct {
                    product {
                        id
                        name
                    }
                }
            `);
            const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
            customFieldsConfig.set('Product', [
                { name: 'custom1', type: 'string', list: false },
                { name: 'custom2', type: 'boolean', list: false },
            ]);
            const result = addCustomFields(documentNode, { customFieldsMap: customFieldsConfig });

            expect(print(result)).toBe(
                normalizeIndentation(`
                query GetProduct {
                    product {
                        id
                        name
                        customFields {
                            custom1
                            custom2
                        }
                    }
                }
            `),
            );
        });

        it('Adds customFields to paginated list', () => {
            const documentNode = graphql(`
                query GetProducts {
                    products {
                        items {
                            id
                            name
                        }
                    }
                }
            `);
            const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
            customFieldsConfig.set('Product', [
                { name: 'custom1', type: 'string', list: false },
                { name: 'custom2', type: 'boolean', list: false },
            ]);
            const result = addCustomFields(documentNode, { customFieldsMap: customFieldsConfig });
            expect(print(result)).toBe(
                normalizeIndentation(`
                query GetProducts {
                    products {
                        items {
                            id
                            name
                            customFields {
                                custom1
                                custom2
                            }
                        }
                    }
                }
            `),
            );
        });
    });

    describe('Fragment handling', () => {
        const productWithVariantsFragment = graphql(`
            fragment ProductWithVariants on Product {
                id
                translations {
                    languageCode
                    name
                }
            }
        `);

        const productVariantFragment = graphql(`
            fragment ProductVariant on ProductVariant {
                id
            }
        `);

        const productOptionGroupFragment = graphql(`
            fragment ProductOptionGroup on ProductOptionGroup {
                id
            }
        `);

        const productOptionFragment = graphql(`
            fragment ProductOption on ProductOption {
                id
            }
        `);

        const userFragment = graphql(`
            fragment User on User {
                id
            }
        `);

        const customerFragment = graphql(`
            fragment Customer on Customer {
                id
            }
        `);

        const addressFragment = graphql(`
            fragment Address on Address {
                id
            }
        `);

        let documentNode: DocumentNode;

        beforeEach(() => {
            documentNode = graphql(
                `
                    query GetProductWithVariants {
                        product {
                            ...ProductWithVariants
                        }
                    }
                `,
                [productWithVariantsFragment],
            );
        });

        it('Adds customFields to Product fragment', () => {
            const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
            customFieldsConfig.set('Product', [
                { name: 'custom1', type: 'string', list: false },
                { name: 'custom2', type: 'boolean', list: false },
            ]);

            const result = addCustomFields(documentNode, { customFieldsMap: customFieldsConfig });
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

            const result = addCustomFields(documentNode, { customFieldsMap: customFieldsConfig });
            const productFragmentDef = result.definitions[1] as FragmentDefinitionNode;
            const translationsField = productFragmentDef.selectionSet.selections[1] as FieldNode;
            const customTranslationFieldsDef = translationsField.selectionSet!.selections[2] as FieldNode;
            expect(translationsField.selectionSet!.selections.length).toBe(3);
            expect((customTranslationFieldsDef.selectionSet!.selections[0] as FieldNode).name.value).toBe(
                'customLocaleString',
            );
        });

        function addsCustomFieldsToType(type: keyof CustomFields, fragment: DocumentNode) {
            const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
            customFieldsConfig.set(type, [{ name: 'custom', type: 'boolean', list: false }]);

            const result = addCustomFields(fragment, { customFieldsMap: customFieldsConfig });
            const fragmentDef = result.definitions[0] as FragmentDefinitionNode;
            const customFieldsDef = fragmentDef.selectionSet.selections[1] as FieldNode;
            expect(fragmentDef.selectionSet.selections.length).toBe(2);
            expect(customFieldsDef.selectionSet!.selections.length).toBe(1);
            expect((customFieldsDef.selectionSet!.selections[0] as FieldNode).name.value).toBe('custom');
        }

        it('Does not duplicate customFields selection set', () => {
            const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
            customFieldsConfig.set('Product', [{ name: 'custom', type: 'boolean', list: false }]);
            const result1 = addCustomFields(documentNode, { customFieldsMap: customFieldsConfig });
            const result2 = addCustomFields(result1, { customFieldsMap: customFieldsConfig });

            const fragmentDef = result2.definitions[1] as FragmentDefinitionNode;
            const customFieldSelections = fragmentDef.selectionSet.selections.filter(
                s => s.kind === Kind.FIELD && s.name.value === 'customFields',
            );
            expect(customFieldSelections.length).toBe(1);
        });

        it('Adds customFields to ProductVariant fragment', () => {
            addsCustomFieldsToType('ProductVariant', productVariantFragment);
        });

        it('Adds customFields to ProductOptionGroup fragment', () => {
            addsCustomFieldsToType('ProductOptionGroup', productOptionGroupFragment);
        });

        it('Adds customFields to ProductOption fragment', () => {
            addsCustomFieldsToType('ProductOption', productOptionFragment);
        });

        it('Adds customFields to User fragment', () => {
            addsCustomFieldsToType('User', userFragment);
        });

        it('Adds customFields to Customer fragment', () => {
            addsCustomFieldsToType('Customer', customerFragment);
        });

        it('Adds customFields to Address fragment', () => {
            addsCustomFieldsToType('Address', addressFragment);
        });
    });
});
