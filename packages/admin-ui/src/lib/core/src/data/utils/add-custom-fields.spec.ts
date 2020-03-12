import { DocumentNode, FieldNode, FragmentDefinitionNode } from 'graphql';

import { CustomFieldConfig, CustomFields } from '../../common/generated-types';

import { addCustomFields } from './add-custom-fields';

// tslint:disable:no-non-null-assertion
describe('addCustomFields()', () => {
    let documentNode: DocumentNode;

    function generateFragmentDefinitionFor(type: keyof CustomFields): FragmentDefinitionNode {
        return {
            kind: 'FragmentDefinition',
            name: {
                kind: 'Name',
                value: type,
            },
            typeCondition: {
                kind: 'NamedType',
                name: {
                    kind: 'Name',
                    value: type,
                },
            },
            directives: [],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [],
            },
        };
    }

    beforeEach(() => {
        documentNode = {
            kind: 'Document',
            definitions: [
                {
                    kind: 'OperationDefinition',
                    operation: 'query',
                    name: {
                        kind: 'Name',
                        value: 'GetProductWithVariants',
                    },
                    variableDefinitions: [],
                    directives: [],
                    selectionSet: {
                        kind: 'SelectionSet',
                        selections: [
                            {
                                kind: 'Field',
                                name: {
                                    kind: 'Name',
                                    value: 'product',
                                },
                                arguments: [],
                                directives: [],
                                selectionSet: {
                                    kind: 'SelectionSet',
                                    selections: [
                                        {
                                            kind: 'FragmentSpread',
                                            name: {
                                                kind: 'Name',
                                                value: 'ProductWithVariants',
                                            },
                                            directives: [],
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
                {
                    kind: 'FragmentDefinition',
                    name: {
                        kind: 'Name',
                        value: 'ProductWithVariants',
                    },
                    typeCondition: {
                        kind: 'NamedType',
                        name: {
                            kind: 'Name',
                            value: 'Product',
                        },
                    },
                    directives: [],
                    selectionSet: {
                        kind: 'SelectionSet',
                        selections: [
                            {
                                kind: 'Field',
                                name: {
                                    kind: 'Name',
                                    value: 'id',
                                },
                                arguments: [],
                                directives: [],
                            },
                            {
                                kind: 'Field',
                                name: {
                                    kind: 'Name',
                                    value: 'translations',
                                },
                                arguments: [],
                                directives: [],
                                selectionSet: {
                                    kind: 'SelectionSet',
                                    selections: [
                                        {
                                            kind: 'Field',
                                            name: {
                                                kind: 'Name',
                                                value: 'languageCode',
                                            },
                                            arguments: [],
                                            directives: [],
                                        },
                                        {
                                            kind: 'Field',
                                            name: {
                                                kind: 'Name',
                                                value: 'name',
                                            },
                                            arguments: [],
                                            directives: [],
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
                generateFragmentDefinitionFor('ProductVariant'),
                generateFragmentDefinitionFor('ProductOptionGroup'),
                generateFragmentDefinitionFor('ProductOption'),
                generateFragmentDefinitionFor('User'),
                generateFragmentDefinitionFor('Customer'),
                generateFragmentDefinitionFor('Address'),
            ],
        };
    });

    it('Adds customFields to Product fragment', () => {
        const customFieldsConfig: Partial<CustomFields> = {
            Product: [{ name: 'custom1', type: 'string' }, { name: 'custom2', type: 'boolean' }],
        };

        const result = addCustomFields(documentNode, customFieldsConfig as CustomFields);
        const productFragmentDef = result.definitions[1] as FragmentDefinitionNode;
        const customFieldsDef = productFragmentDef.selectionSet.selections[2] as FieldNode;
        expect(productFragmentDef.selectionSet.selections.length).toBe(3);
        expect(customFieldsDef.selectionSet!.selections.length).toBe(2);
        expect((customFieldsDef.selectionSet!.selections[0] as FieldNode).name.value).toBe('custom1');
        expect((customFieldsDef.selectionSet!.selections[1] as FieldNode).name.value).toBe('custom2');
    });

    it('Adds customFields to Product translations', () => {
        const customFieldsConfig: Partial<CustomFields> = {
            Product: [{ name: 'customLocaleString', type: 'localeString' }],
        };

        const result = addCustomFields(documentNode, customFieldsConfig as CustomFields);
        const productFragmentDef = result.definitions[1] as FragmentDefinitionNode;
        const translationsField = productFragmentDef.selectionSet.selections[1] as FieldNode;
        const customTranslationFieldsDef = translationsField.selectionSet!.selections[2] as FieldNode;
        expect(translationsField.selectionSet!.selections.length).toBe(3);
        expect((customTranslationFieldsDef.selectionSet!.selections[0] as FieldNode).name.value).toBe(
            'customLocaleString',
        );
    });

    function addsCustomFieldsToType(type: keyof CustomFields, indexOfDefinition: number) {
        const customFieldsConfig: Partial<CustomFields> = {
            [type]: [{ name: 'custom', type: 'boolean' }],
        };

        const result = addCustomFields(documentNode, customFieldsConfig as CustomFields);
        const fragmentDef = result.definitions[indexOfDefinition] as FragmentDefinitionNode;
        const customFieldsDef = fragmentDef.selectionSet.selections[0] as FieldNode;
        expect(fragmentDef.selectionSet.selections.length).toBe(1);
        expect(customFieldsDef.selectionSet!.selections.length).toBe(1);
        expect((customFieldsDef.selectionSet!.selections[0] as FieldNode).name.value).toBe('custom');
    }

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
