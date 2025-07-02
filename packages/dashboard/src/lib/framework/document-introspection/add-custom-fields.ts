import { Variables } from '@/vdb/graphql/api.js';
import {
    getServerConfigDocument,
    relationCustomFieldFragment,
    structCustomFieldFragment,
} from '@/vdb/providers/server-config.js';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { CustomFieldConfig } from '@vendure/common/lib/generated-types';
import { ResultOf } from 'gql.tada';
import {
    DefinitionNode,
    DocumentNode,
    FieldNode,
    FragmentDefinitionNode,
    Kind,
    OperationDefinitionNode,
    SelectionNode,
    SelectionSetNode,
} from 'graphql';

import { getOperationTypeInfo } from './get-document-structure.js';

type StructCustomFieldFragment = ResultOf<typeof structCustomFieldFragment>;
type RelationCustomFieldFragment = ResultOf<typeof relationCustomFieldFragment>;

let globalCustomFieldsMap: Map<string, CustomFieldConfig[]> = new Map();

// Memoization cache using WeakMap to avoid memory leaks
const memoizationCache = new WeakMap<DocumentNode, Map<string, TypedDocumentNode<any, any>>>();

/**
 * Creates a cache key for the options object
 */
function createOptionsKey(options?: {
    customFieldsMap?: Map<string, CustomFieldConfig[]>;
    includeCustomFields?: string[];
}): string {
    if (!options) return 'default';

    const parts: string[] = [];

    if (options.customFieldsMap) {
        // Create a deterministic key for the customFieldsMap
        const mapEntries = Array.from(options.customFieldsMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}:${value.length}`);
        parts.push(`map:${mapEntries.join(',')}`);
    }

    if (options.includeCustomFields) {
        parts.push(`include:${options.includeCustomFields.sort().join(',')}`);
    }

    return parts.join('|') || 'default';
}

/**
 * @description
 * This function is used to set the global custom fields map.
 * It is called when the server config is loaded, and then can
 * be used in other parts of the app via the `getCustomFieldsMap` function.
 */
export function setCustomFieldsMap(
    entityCustomFields: ResultOf<
        typeof getServerConfigDocument
    >['globalSettings']['serverConfig']['entityCustomFields'],
) {
    globalCustomFieldsMap = new Map<string, CustomFieldConfig[]>();
    for (const entityCustomField of entityCustomFields) {
        globalCustomFieldsMap.set(
            entityCustomField.entityName,
            entityCustomField.customFields as CustomFieldConfig[],
        );
    }
}

/**
 * @description
 * This function is used to get the global custom fields map.
 */
export function getCustomFieldsMap() {
    return globalCustomFieldsMap;
}

/**
 * Given a GraphQL AST (DocumentNode), this function looks for fragment definitions and adds and configured
 * custom fields to those fragments.
 *
 * This function is memoized to return a stable identity for given inputs.
 */
export function addCustomFields<T, V extends Variables = Variables>(
    documentNode: DocumentNode | TypedDocumentNode<T, V>,
    options?: {
        customFieldsMap?: Map<string, CustomFieldConfig[]>;
        includeCustomFields?: string[];
    },
): TypedDocumentNode<T, V> {
    const optionsKey = createOptionsKey(options);

    // Check if we have a cached result for this document and options
    let documentCache = memoizationCache.get(documentNode);
    if (!documentCache) {
        documentCache = new Map();
        memoizationCache.set(documentNode, documentCache);
    }

    const cachedResult = documentCache.get(optionsKey);
    if (cachedResult) {
        return cachedResult as TypedDocumentNode<T, V>;
    }

    // If not cached, compute the result
    const clone = JSON.parse(JSON.stringify(documentNode)) as DocumentNode;
    const customFields = options?.customFieldsMap || globalCustomFieldsMap;

    const targetNodes: Array<{ typeName: string; selectionSet: SelectionSetNode }> = [];

    const fragmentDefs = clone.definitions.filter(isFragmentDefinition);
    for (const fragmentDef of fragmentDefs) {
        targetNodes.push({
            typeName: fragmentDef.typeCondition.name.value,
            selectionSet: fragmentDef.selectionSet,
        });
    }
    const queryDefs = clone.definitions.filter(isOperationDefinition);

    for (const queryDef of queryDefs) {
        const typeInfo = getOperationTypeInfo(queryDef);
        const fieldNode = queryDef.selectionSet.selections[0] as FieldNode;
        if (typeInfo && fieldNode?.selectionSet) {
            targetNodes.push({
                typeName: typeInfo.type,
                selectionSet: fieldNode.selectionSet,
            });
            addTargetNodesRecursively(fieldNode.selectionSet, typeInfo.type, targetNodes);
        }
    }

    for (const target of targetNodes) {
        let entityType = target.typeName;

        if (entityType === ('OrderAddress' as any)) {
            // OrderAddress is a special case of the Address entity, and shares its custom fields
            // so we treat it as an alias
            entityType = 'Address';
        }

        if (entityType === ('Country' as any)) {
            // Country is an alias of Region
            entityType = 'Region';
        }

        const customFieldsForType = customFields.get(entityType);
        if (customFieldsForType && customFieldsForType.length) {
            // Check if there is already a customFields field in the fragment
            // to avoid duplication
            const existingCustomFieldsField = target.selectionSet.selections.find(
                selection => isFieldNode(selection) && selection.name.value === 'customFields',
            ) as FieldNode | undefined;
            const selectionNodes: SelectionNode[] = customFieldsForType
                .filter(
                    field =>
                        !options?.includeCustomFields || options?.includeCustomFields.includes(field.name),
                )
                .map(
                    customField =>
                        ({
                            kind: Kind.FIELD,
                            name: {
                                kind: Kind.NAME,
                                value: customField.name,
                            },
                            // For "relation" custom fields, we need to also select
                            // all the scalar fields of the related type
                            ...(customField.type === 'relation'
                                ? {
                                      selectionSet: {
                                          kind: Kind.SELECTION_SET,
                                          selections: (
                                              customField as RelationCustomFieldFragment
                                          ).scalarFields.map(f => ({
                                              kind: Kind.FIELD,
                                              name: { kind: Kind.NAME, value: f },
                                          })),
                                      },
                                  }
                                : {}),
                            ...(customField.type === 'struct'
                                ? {
                                      selectionSet: {
                                          kind: Kind.SELECTION_SET,
                                          selections: (customField as StructCustomFieldFragment).fields.map(
                                              f => ({
                                                  kind: Kind.FIELD,
                                                  name: { kind: Kind.NAME, value: f.name },
                                              }),
                                          ),
                                      },
                                  }
                                : {}),
                        }) as FieldNode,
                );
            if (!existingCustomFieldsField) {
                // If no customFields field exists, add one
                (target.selectionSet.selections as SelectionNode[]).push({
                    kind: Kind.FIELD,
                    name: {
                        kind: Kind.NAME,
                        value: 'customFields',
                    },
                    selectionSet: {
                        kind: Kind.SELECTION_SET,
                        selections: selectionNodes,
                    },
                });
            } else {
                // If a customFields field already exists, add the custom fields
                // to the existing selection set
                (existingCustomFieldsField.selectionSet as any) = {
                    kind: Kind.SELECTION_SET,
                    selections: selectionNodes,
                };
            }

            const localizedFields = customFieldsForType.filter(
                field => field.type === 'localeString' || field.type === 'localeText',
            );

            const translationsField = target.selectionSet.selections
                .filter(isFieldNode)
                .find(field => field.name.value === 'translations');

            if (localizedFields.length && translationsField && translationsField.selectionSet) {
                (translationsField.selectionSet.selections as SelectionNode[]).push({
                    name: {
                        kind: Kind.NAME,
                        value: 'customFields',
                    },
                    kind: Kind.FIELD,
                    selectionSet: {
                        kind: Kind.SELECTION_SET,
                        selections: localizedFields.map(
                            customField =>
                                ({
                                    kind: Kind.FIELD,
                                    name: {
                                        kind: Kind.NAME,
                                        value: customField.name,
                                    },
                                }) as FieldNode,
                        ),
                    },
                });
            }
        }
    }

    // Cache the result before returning
    documentCache.set(optionsKey, clone);
    return clone;
}

function isFragmentDefinition(value: DefinitionNode): value is FragmentDefinitionNode {
    return value.kind === Kind.FRAGMENT_DEFINITION;
}

function isOperationDefinition(value: DefinitionNode): value is OperationDefinitionNode {
    return value.kind === Kind.OPERATION_DEFINITION;
}

function isFieldNode(value: SelectionNode): value is FieldNode {
    return value.kind === Kind.FIELD;
}

function addTargetNodesRecursively(
    selectionSet: SelectionSetNode,
    parentTypeName: string,
    targetNodes: Array<{ typeName: string; selectionSet: SelectionSetNode }>,
) {
    for (const selection of selectionSet.selections) {
        if (selection.kind === 'Field' && selection.selectionSet) {
            const fieldNode = selection;
            const typeInfo = getOperationTypeInfo(fieldNode, parentTypeName); // Assuming this function can handle FieldNode
            if (typeInfo && fieldNode.selectionSet) {
                targetNodes.push({
                    typeName: typeInfo.type,
                    selectionSet: fieldNode.selectionSet,
                });
                // Recursively process the selection set of the current field
                addTargetNodesRecursively(fieldNode.selectionSet, typeInfo.type, targetNodes);
            }
        }
    }
}
