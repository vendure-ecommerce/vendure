import {
    ArgumentNode,
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

// Simple LRU-style cache for memoization
const filterCache = new Map<string, DocumentNode>();
const MAX_CACHE_SIZE = 100;

// Fast document fingerprinting using WeakMap for reference tracking
const documentIds = new WeakMap<DocumentNode, string>();
let documentCounter = 0;

/**
 * Get a fast, stable ID for a document node
 */
function getDocumentId(document: DocumentNode): string {
    let id = documentIds.get(document);
    if (!id) {
        // For new documents, create a lightweight structural hash
        id = createDocumentFingerprint(document);
        documentIds.set(document, id);
    }
    return id;
}

/**
 * Create a lightweight fingerprint of document structure (much faster than print())
 */
function createDocumentFingerprint(document: DocumentNode): string {
    const parts: string[] = [];

    for (const def of document.definitions) {
        if (def.kind === Kind.OPERATION_DEFINITION) {
            parts.push(`op:${def.operation}:${def.name?.value || 'anon'}`);
            // Just count selections, don't traverse them
            parts.push(`sel:${def.selectionSet.selections.length}`);
        } else if (def.kind === Kind.FRAGMENT_DEFINITION) {
            parts.push(`frag:${def.name.value}:${def.typeCondition.name.value}`);
            parts.push(`sel:${def.selectionSet.selections.length}`);
        }
    }

    return `doc_${++documentCounter}_${parts.join('_')}`;
}

/**
 * Create a stable cache key from document and selected columns
 */
function createCacheKey(
    document: DocumentNode,
    selectedColumns: Array<{ name: string; isCustomField: boolean }>,
): string {
    const docId = getDocumentId(document);
    const columnsKey = selectedColumns
        .map(col => `${col.name}:${String(col.isCustomField)}`)
        .sort()
        .join(',');
    return `${docId}|${columnsKey}`;
}

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

    // Check cache first
    const cacheKey = createCacheKey(listQuery, selectedColumns);
    if (filterCache.has(cacheKey)) {
        return filterCache.get(cacheKey) as T;
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
    const result = removeUnusedVariables(withoutUnusedFragments);

    // Cache the result with LRU eviction
    if (filterCache.size >= MAX_CACHE_SIZE) {
        const firstKey = filterCache.keys().next().value;
        if (firstKey) {
            filterCache.delete(firstKey);
        }
    }
    filterCache.set(cacheKey, result);
    return result;
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
 * Context for filtering field selections
 */
interface FieldSelectionContext {
    itemsField: FieldNode;
    availableFields: Map<string, SelectionNode>;
    fragmentSpreads: Map<string, FragmentSpreadNode>;
    fragments: Record<string, FragmentDefinitionNode>;
    neededFragments: Set<string>;
    filteredSelections: SelectionNode[];
}

/**
 * Check if a field is selected directly in the items field (not from a fragment)
 */
function isDirectField(fieldName: string, itemsField: FieldNode): boolean {
    if (!itemsField.selectionSet) return false;
    return itemsField.selectionSet.selections.some(
        sel => sel.kind === Kind.FIELD && sel.name.value === fieldName,
    );
}

/**
 * Add a regular field to filtered selections
 */
function addRegularField(fieldName: string, context: FieldSelectionContext): void {
    if (!context.availableFields.has(fieldName)) return;

    if (isDirectField(fieldName, context.itemsField)) {
        const fieldSelection = context.availableFields.get(fieldName);
        if (fieldSelection) {
            context.filteredSelections.push(fieldSelection);
        }
    } else {
        // Field comes from a fragment - mark fragments as needed
        for (const [fragName] of context.fragmentSpreads) {
            const fragment = context.fragments[fragName];
            if (fragment && fragmentContainsField(fragment, fieldName, context.fragments)) {
                context.neededFragments.add(fragName);
            }
        }
    }
}

/**
 * Add custom fields to filtered selections
 */
function addCustomFields(customFieldNames: Set<string>, context: FieldSelectionContext): void {
    if (customFieldNames.size === 0 || !context.availableFields.has('customFields')) return;

    if (isDirectField('customFields', context.itemsField)) {
        const customFieldsSelection = context.availableFields.get('customFields');
        if (customFieldsSelection && customFieldsSelection.kind === Kind.FIELD) {
            const filteredCustomFields = filterCustomFields(customFieldsSelection, customFieldNames);
            if (filteredCustomFields) {
                context.filteredSelections.push(filteredCustomFields);
            }
        }
    } else {
        // customFields comes from a fragment
        for (const [fragName] of context.fragmentSpreads) {
            const fragment = context.fragments[fragName];
            if (fragment && fragmentContainsField(fragment, 'customFields', context.fragments)) {
                context.neededFragments.add(fragName);
            }
        }
    }
}

/**
 * Ensure at least id field is included to maintain valid query
 */
function ensureIdField(context: FieldSelectionContext): void {
    const hasValidFields =
        context.filteredSelections.length > 0 &&
        !(
            context.filteredSelections.length === 1 &&
            context.filteredSelections[0].kind === Kind.FIELD &&
            context.filteredSelections[0].name.value === '__typename'
        );

    if (hasValidFields) return;

    if (context.availableFields.has('id')) {
        if (isDirectField('id', context.itemsField)) {
            const idField = context.availableFields.get('id');
            if (idField) {
                context.filteredSelections.push(idField);
            }
        } else {
            // id comes from a fragment
            for (const [fragName] of context.fragmentSpreads) {
                const fragment = context.fragments[fragName];
                if (fragment && fragmentContainsField(fragment, 'id', context.fragments)) {
                    const fragmentSpread = context.fragmentSpreads.get(fragName);
                    if (fragmentSpread) {
                        context.filteredSelections.push(fragmentSpread);
                    }
                    break;
                }
            }
        }
    } else {
        // Create a minimal id field
        context.filteredSelections.push({
            kind: Kind.FIELD,
            name: { kind: Kind.NAME, value: 'id' },
        });
    }
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

    // Initialize context
    const context: FieldSelectionContext = {
        itemsField,
        availableFields: new Map(),
        fragmentSpreads: new Map(),
        fragments,
        neededFragments: new Set(),
        filteredSelections: [],
    };

    // Collect available fields and fragment spreads
    for (const selection of itemsField.selectionSet.selections) {
        if (selection.kind === Kind.FIELD) {
            context.availableFields.set(selection.name.value, selection);
        } else if (selection.kind === Kind.FRAGMENT_SPREAD) {
            context.fragmentSpreads.set(selection.name.value, selection);
            // Collect fields from this fragment
            const fragment = fragments[selection.name.value];
            if (fragment) {
                collectFieldsFromFragment(fragment, fragments, context.availableFields);
            }
        }
    }

    // Add __typename if it was in the original selection
    if (context.availableFields.has('__typename')) {
        const typenameField = context.availableFields.get('__typename');
        if (typenameField) {
            context.filteredSelections.push(typenameField);
        }
    }

    // Add selected regular fields
    for (const fieldName of selectedFieldNames) {
        if (fieldName === '__typename') continue;
        addRegularField(fieldName, context);
    }

    // Add custom fields
    addCustomFields(customFieldNames, context);

    // Add needed fragment spreads
    for (const fragName of context.neededFragments) {
        const fragmentSpread = context.fragmentSpreads.get(fragName);
        if (fragmentSpread) {
            context.filteredSelections.push(fragmentSpread);
        }
    }

    // Add inline fragments (keep as is for now)
    for (const selection of itemsField.selectionSet.selections) {
        if (selection.kind === Kind.INLINE_FRAGMENT) {
            context.filteredSelections.push(selection);
        }
    }

    // Ensure we have at least an id field
    ensureIdField(context);

    return {
        ...itemsField,
        selectionSet: {
            ...itemsField.selectionSet,
            selections: context.filteredSelections,
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
    const collector = new VariableUsageCollector();
    const usedVariables = collector.collectFromDocument(document);

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
 * Variable usage collector that traverses GraphQL structures
 */
class VariableUsageCollector {
    private usedVariables = new Set<string>();

    /**
     * Collect variables from a GraphQL value (recursive)
     */
    private collectFromValue(value: any): void {
        switch (value.kind) {
            case Kind.VARIABLE:
                this.usedVariables.add((value as VariableNode).name.value);
                break;
            case Kind.LIST:
                value.values.forEach((item: any) => this.collectFromValue(item));
                break;
            case Kind.OBJECT:
                value.fields.forEach((field: any) => this.collectFromValue(field.value));
                break;
            // For other value types (STRING, INT, FLOAT, BOOLEAN, NULL, ENUM), no variables to collect
        }
    }

    /**
     * Collect variables from field arguments
     */
    private collectFromArguments(args: readonly ArgumentNode[]): void {
        args.forEach(arg => this.collectFromValue(arg.value));
    }

    /**
     * Collect variables from selection set (recursive)
     */
    private collectFromSelections(selections: readonly SelectionNode[]): void {
        selections.forEach(selection => {
            switch (selection.kind) {
                case Kind.FIELD:
                    if (selection.arguments) {
                        this.collectFromArguments(selection.arguments);
                    }
                    if (selection.selectionSet) {
                        this.collectFromSelections(selection.selectionSet.selections);
                    }
                    break;
                case Kind.INLINE_FRAGMENT:
                    if (selection.selectionSet) {
                        this.collectFromSelections(selection.selectionSet.selections);
                    }
                    break;
                case Kind.FRAGMENT_SPREAD:
                    // Fragment spreads are handled when processing fragment definitions
                    break;
            }
        });
    }

    /**
     * Collect all used variables from a document
     */
    collectFromDocument(document: DocumentNode): Set<string> {
        this.usedVariables.clear();

        document.definitions.forEach(definition => {
            if (
                definition.kind === Kind.OPERATION_DEFINITION ||
                definition.kind === Kind.FRAGMENT_DEFINITION
            ) {
                this.collectFromSelections(definition.selectionSet.selections);
            }
        });

        return new Set(this.usedVariables);
    }
}

/**
 * Selection processor interface for different types of selection handling
 */
interface SelectionProcessor {
    processField(field: FieldNode): void;

    processFragmentSpread(spread: FragmentSpreadNode): void;

    processInlineFragment(inline: any): void;
}

/**
 * Helper class to iterate through selections with consistent patterns
 */
class SelectionTraverser {
    static traverse(selections: readonly SelectionNode[], processor: SelectionProcessor): void {
        for (const selection of selections) {
            switch (selection.kind) {
                case Kind.FIELD:
                    processor.processField(selection);
                    break;
                case Kind.FRAGMENT_SPREAD:
                    processor.processFragmentSpread(selection);
                    break;
                case Kind.INLINE_FRAGMENT:
                    processor.processInlineFragment(selection);
                    break;
            }
        }
    }
}
