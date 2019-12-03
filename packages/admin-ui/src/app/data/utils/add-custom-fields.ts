import {
    DefinitionNode,
    DocumentNode,
    FieldNode,
    FragmentDefinitionNode,
    Kind,
    SelectionNode,
} from 'graphql';

import { CustomFields } from '../../common/generated-types';

/**
 * Given a GraphQL AST (DocumentNode), this function looks for fragment definitions and adds and configured
 * custom fields to those fragments.
 */
export function addCustomFields(documentNode: DocumentNode, customFields: CustomFields): DocumentNode {
    const fragmentDefs = documentNode.definitions.filter(isFragmentDefinition);

    for (const fragmentDef of fragmentDefs) {
        const entityType = fragmentDef.typeCondition.name.value as keyof Pick<
            CustomFields,
            Exclude<keyof CustomFields, '__typename'>
        >;
        const customFieldsForType = customFields[entityType];
        if (customFieldsForType && customFieldsForType.length) {
            (fragmentDef.selectionSet.selections as SelectionNode[]).push({
                name: {
                    kind: Kind.NAME,
                    value: 'customFields',
                },
                kind: Kind.FIELD,
                selectionSet: {
                    kind: Kind.SELECTION_SET,
                    selections: customFieldsForType.map(customField => {
                        return {
                            kind: Kind.FIELD,
                            name: {
                                kind: Kind.NAME,
                                value: customField.name,
                            },
                        } as FieldNode;
                    }),
                },
            });

            const localeStrings = customFieldsForType.filter(field => field.type === 'localeString');

            const translationsField = fragmentDef.selectionSet.selections
                .filter(isFieldNode)
                .find(field => field.name.value === 'translations');

            if (localeStrings.length && translationsField && translationsField.selectionSet) {
                (translationsField.selectionSet.selections as SelectionNode[]).push({
                    name: {
                        kind: Kind.NAME,
                        value: 'customFields',
                    },
                    kind: Kind.FIELD,
                    selectionSet: {
                        kind: Kind.SELECTION_SET,
                        selections: localeStrings.map(customField => {
                            return {
                                kind: Kind.FIELD,
                                name: {
                                    kind: Kind.NAME,
                                    value: customField.name,
                                },
                            } as FieldNode;
                        }),
                    },
                });
            }
        }
    }

    return documentNode;
}

function isFragmentDefinition(value: DefinitionNode): value is FragmentDefinitionNode {
    return value.kind === Kind.FRAGMENT_DEFINITION;
}

function isFieldNode(value: SelectionNode): value is FieldNode {
    return value.kind === Kind.FIELD;
}
