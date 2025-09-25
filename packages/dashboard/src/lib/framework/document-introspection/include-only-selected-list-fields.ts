import {
    DocumentNode,
    FieldNode,
    FragmentDefinitionNode,
    FragmentSpreadNode,
    Kind,
    SelectionNode,
    VariableNode,
    visit,
} from 'graphql';

import { getQueryName } from './get-document-structure.js';

/**
 * @description
 * This function takes a list query document such as:
 * ```gql
 * query ProductList($options: ProductListOptions) {
 *     products(options: $options) {
 *         items {
 *             id
 *             createdAt
 *             updatedAt
 *             featuredAsset {
 *                 id
 *                 preview
 *             }
 *             name
 *             slug
 *             enabled
 *         }
 *         totalItems
 *     }
 * }
 * ```
 * and an array of selected columns, and returns a new document which only selects the
 * specified columns. So if `selectedColumns` equals `[{ name: 'id', isCustomField: false }]`,
 * then the resulting document's `items` fields would be `{ id }`.
 *
 * @param listQuery
 */
export function includeOnlySelectedListFields<T extends DocumentNode>(
    listQuery: T,
    selectedColumns: Array<{
        name: string;
        isCustomField: boolean;
    }>,
): T {
    // If no columns selected, return the original document
    if (selectedColumns.length === 0) {
        return listQuery;
    }

    // Get the query name to identify the main list query field
    const queryName = getQueryName(listQuery);

    // Create a set of selected field names for quick lookup
    const selectedFieldNames = new Set(selectedColumns.map(col => col.name));
    const customFieldNames = new Set(selectedColumns.filter(col => col.isCustomField).map(col => col.name));

    // Collect all fragments from the document
    const fragments = collectFragments(listQuery);

    // First pass: identify which fragments are directly used by the items field
    const itemsFragments = getItemsFragments(listQuery, queryName);

    // Visit and transform the document
    const modifiedDocument = visit(listQuery, {
        [Kind.FIELD]: {
            enter(node: FieldNode, key, parent, path, ancestors): FieldNode | undefined {
                // Check if we're at the query root field (e.g., "products")
                const isQueryRoot =
                    ancestors.some(
                        ancestor =>
                            ancestor instanceof Object &&
                            'kind' in ancestor &&
                            ancestor.kind === Kind.OPERATION_DEFINITION &&
                            ancestor.operation === 'query',
                    ) && node.name.value === queryName;

                if (!isQueryRoot) {
                    return undefined;
                }

                // Look for the "items" field within the query root
                if (node.selectionSet) {
                    const modifiedSelections = node.selectionSet.selections.map(selection => {
                        if (selection.kind === Kind.FIELD && selection.name.value === 'items') {
                            // Filter the items field to only include selected columns
                            return filterItemsField(
                                selection,
                                selectedFieldNames,
                                customFieldNames,
                                fragments,
                            );
                        }
                        return selection;
                    });

                    return {
                        ...node,
                        selectionSet: {
                            ...node.selectionSet,
                            selections: modifiedSelections,
                        },
                    };
                }

                return undefined;
            },
        },
        [Kind.FRAGMENT_DEFINITION]: {
            enter(node: FragmentDefinitionNode): FragmentDefinitionNode {
                // Only filter fragments that are directly used by the items field
                if (itemsFragments.has(node.name.value)) {
                    return filterFragment(node, selectedFieldNames, customFieldNames, fragments);
                }
                // Leave other fragments untouched
                return node;
            },
        },
    });

    // Remove unused fragments to prevent GraphQL validation errors
    const withoutUnusedFragments = removeUnusedFragments(modifiedDocument);

    // Remove unused variables to prevent GraphQL validation errors
    return removeUnusedVariables(withoutUnusedFragments);
}

/**
 * Collect all fragments from the document
 */
function collectFragments(document: DocumentNode): Record<string, FragmentDefinitionNode> {
    const fragments: Record<string, FragmentDefinitionNode> = {};
    for (const definition of document.definitions) {
        if (definition.kind === Kind.FRAGMENT_DEFINITION) {
            fragments[definition.name.value] = definition;
        }
    }
    return fragments;
}

/**
 * Get fragments that are directly used by the items field (not nested fragments)
 */
function getItemsFragments(document: DocumentNode, queryName: string): Set<string> {
    const itemsFragments = new Set<string>();

    // Find the items field
    for (const definition of document.definitions) {
        if (definition.kind === Kind.OPERATION_DEFINITION && definition.operation === 'query') {
            for (const selection of definition.selectionSet.selections) {
                if (
                    selection.kind === Kind.FIELD &&
                    selection.name.value === queryName &&
                    selection.selectionSet
                ) {
                    // Found the query field (e.g., "facets")
                    for (const querySelection of selection.selectionSet.selections) {
                        if (
                            querySelection.kind === Kind.FIELD &&
                            querySelection.name.value === 'items' &&
                            querySelection.selectionSet
                        ) {
                            // Found the items field - collect direct fragment spreads
                            for (const itemsSelection of querySelection.selectionSet.selections) {
                                if (itemsSelection.kind === Kind.FRAGMENT_SPREAD) {
                                    itemsFragments.add(itemsSelection.name.value);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return itemsFragments;
}

/**
 * Filter the items field to only include selected columns
 */
function filterItemsField(
    itemsField: FieldNode,
    selectedFieldNames: Set<string>,
    customFieldNames: Set<string>,
    fragments: Record<string, FragmentDefinitionNode>,
): FieldNode {
    if (!itemsField.selectionSet) {
        return itemsField;
    }

    // Collect all available field names from direct selections and fragments
    const availableFields = new Map<string, SelectionNode>();
    const fragmentSpreads = new Map<string, FragmentSpreadNode>();

    // Process direct field selections and fragment spreads
    for (const selection of itemsField.selectionSet.selections) {
        if (selection.kind === Kind.FIELD) {
            availableFields.set(selection.name.value, selection);
        } else if (selection.kind === Kind.FRAGMENT_SPREAD) {
            fragmentSpreads.set(selection.name.value, selection);
            // Collect fields from this fragment
            const fragment = fragments[selection.name.value];
            if (fragment) {
                collectFieldsFromFragment(fragment, fragments, availableFields);
            }
        }
    }

    // Filter selections based on what's selected
    const filteredSelections: SelectionNode[] = [];

    // Always include __typename if it was in the original selection
    if (availableFields.has('__typename')) {
        const typenameField = availableFields.get('__typename');
        if (typenameField) {
            filteredSelections.push(typenameField);
        }
    }

    // Track which fragments are needed
    const neededFragments = new Set<string>();

    // Add selected fields
    for (const fieldName of selectedFieldNames) {
        if (fieldName === '__typename') continue;

        // Check if field is available directly in items
        if (availableFields.has(fieldName)) {
            const isDirectField = itemsField.selectionSet.selections.some(
                sel => sel.kind === Kind.FIELD && sel.name.value === fieldName,
            );

            if (isDirectField) {
                const fieldSelection = availableFields.get(fieldName);
                if (fieldSelection) {
                    filteredSelections.push(fieldSelection);
                }
            } else {
                // Field comes from a fragment
                for (const [fragName] of fragmentSpreads) {
                    const fragment = fragments[fragName];
                    if (fragment && fragmentContainsField(fragment, fieldName, fragments)) {
                        neededFragments.add(fragName);
                    }
                }
            }
        }
    }

    // Handle custom fields
    if (customFieldNames.size > 0 && availableFields.has('customFields')) {
        const isDirectField = itemsField.selectionSet.selections.some(
            sel => sel.kind === Kind.FIELD && sel.name.value === 'customFields',
        );

        if (isDirectField) {
            const customFieldsSelection = availableFields.get('customFields');
            if (customFieldsSelection && customFieldsSelection.kind === Kind.FIELD) {
                const filteredCustomFields = filterCustomFields(customFieldsSelection, customFieldNames);
                if (filteredCustomFields) {
                    filteredSelections.push(filteredCustomFields);
                }
            }
        } else {
            // customFields comes from a fragment
            for (const [fragName] of fragmentSpreads) {
                const fragment = fragments[fragName];
                if (fragment && fragmentContainsField(fragment, 'customFields', fragments)) {
                    neededFragments.add(fragName);
                }
            }
        }
    }

    // Add needed fragment spreads
    for (const fragName of neededFragments) {
        const fragmentSpread = fragmentSpreads.get(fragName);
        if (fragmentSpread) {
            filteredSelections.push(fragmentSpread);
        }
    }

    // Handle inline fragments - keep them as is for now
    for (const selection of itemsField.selectionSet.selections) {
        if (selection.kind === Kind.INLINE_FRAGMENT) {
            filteredSelections.push(selection);
        }
    }

    // If no fields were selected, at least include 'id' to maintain a valid query
    if (
        filteredSelections.length === 0 ||
        (filteredSelections.length === 1 &&
            filteredSelections[0].kind === Kind.FIELD &&
            filteredSelections[0].name.value === '__typename')
    ) {
        // Try to find id field
        if (availableFields.has('id')) {
            const isDirectField = itemsField.selectionSet.selections.some(
                sel => sel.kind === Kind.FIELD && sel.name.value === 'id',
            );

            if (isDirectField) {
                const idField = availableFields.get('id');
                if (idField) {
                    filteredSelections.push(idField);
                }
            } else {
                // id comes from a fragment
                for (const [fragName] of fragmentSpreads) {
                    const fragment = fragments[fragName];
                    if (fragment && fragmentContainsField(fragment, 'id', fragments)) {
                        const fragmentSpread = fragmentSpreads.get(fragName);
                        if (fragmentSpread) {
                            filteredSelections.push(fragmentSpread);
                        }
                        break;
                    }
                }
            }
        } else {
            // Create a minimal id field
            filteredSelections.push({
                kind: Kind.FIELD,
                name: { kind: Kind.NAME, value: 'id' },
            });
        }
    }

    return {
        ...itemsField,
        selectionSet: {
            ...itemsField.selectionSet,
            selections: filteredSelections,
        },
    };
}

/**
 * Collect all fields from a fragment recursively
 */
function collectFieldsFromFragment(
    fragment: FragmentDefinitionNode,
    fragments: Record<string, FragmentDefinitionNode>,
    availableFields: Map<string, SelectionNode>,
): void {
    for (const selection of fragment.selectionSet.selections) {
        if (selection.kind === Kind.FIELD) {
            availableFields.set(selection.name.value, selection);
        } else if (selection.kind === Kind.FRAGMENT_SPREAD) {
            const nestedFragment = fragments[selection.name.value];
            if (nestedFragment) {
                collectFieldsFromFragment(nestedFragment, fragments, availableFields);
            }
        }
    }
}

/**
 * Check if a fragment contains a specific field
 */
function fragmentContainsField(
    fragment: FragmentDefinitionNode,
    fieldName: string,
    fragments: Record<string, FragmentDefinitionNode>,
): boolean {
    for (const selection of fragment.selectionSet.selections) {
        if (selection.kind === Kind.FIELD && selection.name.value === fieldName) {
            return true;
        } else if (selection.kind === Kind.FRAGMENT_SPREAD) {
            const nestedFragment = fragments[selection.name.value];
            if (nestedFragment && fragmentContainsField(nestedFragment, fieldName, fragments)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Filter a fragment to only include selected fields
 */
function filterFragment(
    fragment: FragmentDefinitionNode,
    selectedFieldNames: Set<string>,
    customFieldNames: Set<string>,
    fragments: Record<string, FragmentDefinitionNode>,
): FragmentDefinitionNode {
    const filteredSelections: SelectionNode[] = [];

    for (const selection of fragment.selectionSet.selections) {
        if (selection.kind === Kind.FIELD) {
            const fieldName = selection.name.value;

            if (fieldName === '__typename') {
                filteredSelections.push(selection);
            } else if (selectedFieldNames.has(fieldName)) {
                filteredSelections.push(selection);
            } else if (fieldName === 'customFields' && customFieldNames.size > 0) {
                const filteredCustomFields = filterCustomFields(selection, customFieldNames);
                if (filteredCustomFields) {
                    filteredSelections.push(filteredCustomFields);
                }
            }
        } else if (selection.kind === Kind.FRAGMENT_SPREAD) {
            // Check if the spread fragment contains any selected fields
            const spreadFragment = fragments[selection.name.value];
            if (spreadFragment) {
                let hasSelectedFields = false;
                for (const fieldName of selectedFieldNames) {
                    if (fragmentContainsField(spreadFragment, fieldName, fragments)) {
                        hasSelectedFields = true;
                        break;
                    }
                }
                if (hasSelectedFields) {
                    filteredSelections.push(selection);
                }
            }
        } else if (selection.kind === Kind.INLINE_FRAGMENT) {
            // Keep inline fragments for now - more complex filtering would need type info
            filteredSelections.push(selection);
        }
    }

    // Ensure we have at least one field
    if (filteredSelections.length === 0) {
        // Add id if it exists in the original fragment
        for (const selection of fragment.selectionSet.selections) {
            if (selection.kind === Kind.FIELD && selection.name.value === 'id') {
                filteredSelections.push(selection);
                break;
            }
        }
    }

    return {
        ...fragment,
        selectionSet: {
            ...fragment.selectionSet,
            selections: filteredSelections,
        },
    };
}

/**
 * Filter the customFields selection to only include selected custom fields
 */
function filterCustomFields(customFieldsNode: FieldNode, customFieldNames: Set<string>): FieldNode | null {
    if (!customFieldsNode.selectionSet) {
        return customFieldsNode;
    }

    const filteredSelections = customFieldsNode.selectionSet.selections.filter(selection => {
        if (selection.kind === Kind.FIELD) {
            return customFieldNames.has(selection.name.value);
        }
        // Keep fragments as they might contain selected custom fields
        return true;
    });

    if (filteredSelections.length === 0) {
        return null;
    }

    return {
        ...customFieldsNode,
        selectionSet: {
            ...customFieldsNode.selectionSet,
            selections: filteredSelections,
        },
    };
}

/**
 * Remove unused fragments from the document to prevent GraphQL validation errors
 */
function removeUnusedFragments<T extends DocumentNode>(document: T): T {
    // First, collect all fragment names that are actually used in the document
    const usedFragments = new Set<string>();

    // Helper function to recursively find fragment spreads
    const findFragmentSpreads = (selections: readonly SelectionNode[]) => {
        for (const selection of selections) {
            if (selection.kind === Kind.FRAGMENT_SPREAD) {
                usedFragments.add(selection.name.value);
            } else if (selection.kind === Kind.INLINE_FRAGMENT && selection.selectionSet) {
                findFragmentSpreads(selection.selectionSet.selections);
            } else if (selection.kind === Kind.FIELD && selection.selectionSet) {
                findFragmentSpreads(selection.selectionSet.selections);
            }
        }
    };

    // Look through all operations to find used fragments
    for (const definition of document.definitions) {
        if (definition.kind === Kind.OPERATION_DEFINITION) {
            findFragmentSpreads(definition.selectionSet.selections);
        }
    }

    // Now we need to handle transitive dependencies - fragments that use other fragments
    let foundNewFragments = true;
    while (foundNewFragments) {
        foundNewFragments = false;
        for (const definition of document.definitions) {
            if (definition.kind === Kind.FRAGMENT_DEFINITION && usedFragments.has(definition.name.value)) {
                const previousSize = usedFragments.size;
                findFragmentSpreads(definition.selectionSet.selections);
                if (usedFragments.size > previousSize) {
                    foundNewFragments = true;
                }
            }
        }
    }

    // Filter out unused fragment definitions
    const filteredDefinitions = document.definitions.filter(definition => {
        if (definition.kind === Kind.FRAGMENT_DEFINITION) {
            return usedFragments.has(definition.name.value);
        }
        return true;
    });

    return {
        ...document,
        definitions: filteredDefinitions,
    } as T;
}

/**
 * Remove unused variables from the document to prevent GraphQL validation errors
 */
function removeUnusedVariables<T extends DocumentNode>(document: T): T {
    // First, collect all variable names that are actually used in the document
    const usedVariables = new Set<string>();

    // Helper function to recursively find variable usage
    const findVariableUsage = (selections: readonly SelectionNode[]) => {
        for (const selection of selections) {
            if (selection.kind === Kind.FIELD) {
                // Check field arguments for variable usage
                if (selection.arguments) {
                    for (const arg of selection.arguments) {
                        collectVariablesFromValue(arg.value, usedVariables);
                    }
                }
                // Recursively check nested selections
                if (selection.selectionSet) {
                    findVariableUsage(selection.selectionSet.selections);
                }
            } else if (selection.kind === Kind.INLINE_FRAGMENT && selection.selectionSet) {
                findVariableUsage(selection.selectionSet.selections);
            } else if (selection.kind === Kind.FRAGMENT_SPREAD) {
                // Fragment spreads don't directly contain variables, but we need to check the fragment definition
                // This will be handled when we process fragment definitions
            }
        }
    };

    // Look through all operations and fragments to find used variables
    for (const definition of document.definitions) {
        if (definition.kind === Kind.OPERATION_DEFINITION) {
            findVariableUsage(definition.selectionSet.selections);
        } else if (definition.kind === Kind.FRAGMENT_DEFINITION) {
            findVariableUsage(definition.selectionSet.selections);
        }
    }

    // Filter out unused variable definitions from operations
    const modifiedDefinitions = document.definitions.map(definition => {
        if (definition.kind === Kind.OPERATION_DEFINITION && definition.variableDefinitions) {
            const filteredVariableDefinitions = definition.variableDefinitions.filter(variableDef =>
                usedVariables.has(variableDef.variable.name.value),
            );

            return {
                ...definition,
                variableDefinitions: filteredVariableDefinitions,
            };
        }
        return definition;
    });

    return {
        ...document,
        definitions: modifiedDefinitions,
    } as T;
}

/**
 * Recursively collect variables from a GraphQL value
 */
function collectVariablesFromValue(value: any, usedVariables: Set<string>): void {
    if (value.kind === Kind.VARIABLE) {
        usedVariables.add((value as VariableNode).name.value);
    } else if (value.kind === Kind.LIST) {
        for (const item of value.values) {
            collectVariablesFromValue(item, usedVariables);
        }
    } else if (value.kind === Kind.OBJECT) {
        for (const field of value.fields) {
            collectVariablesFromValue(field.value, usedVariables);
        }
    }
    // For other value types (STRING, INT, FLOAT, BOOLEAN, NULL, ENUM), no variables to collect
}
