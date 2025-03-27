import {
    DocumentNode,
    OperationDefinitionNode,
    FieldNode,
    FragmentDefinitionNode,
    FragmentSpreadNode,
    VariableDefinitionNode,
} from 'graphql';
import { DefinitionNode, NamedTypeNode, SelectionSetNode, TypeNode } from 'graphql/language/ast.js';
import { schemaInfo } from 'virtual:admin-api-schema';

// for debug purposes
(window as any).schemaInfo = schemaInfo;

export interface FieldInfo {
    name: string;
    type: string;
    nullable: boolean;
    list: boolean;
    isPaginatedList: boolean;
    isScalar: boolean;
    typeInfo?: FieldInfo[];
}

/**
 * @description
 * Given a DocumentNode of a PaginatedList query, returns information about each
 * of the selected fields.
 *
 * Inside React components, use the `useListQueryFields` hook to get this information.
 */
export function getListQueryFields(documentNode: DocumentNode): FieldInfo[] {
    const fields: FieldInfo[] = [];
    const fragments: Record<string, FragmentDefinitionNode> = {};

    // Collect all fragment definitions
    documentNode.definitions.forEach(def => {
        if (def.kind === 'FragmentDefinition') {
            fragments[def.name.value] = def;
        }
    });

    const operationDefinition = documentNode.definitions.find(
        (def): def is OperationDefinitionNode =>
            def.kind === 'OperationDefinition' && def.operation === 'query',
    );

    for (const query of operationDefinition?.selectionSet.selections ?? []) {
        if (query.kind === 'Field') {
            const queryField = query;
            const fieldInfo = getQueryInfo(queryField.name.value);
            if (fieldInfo.isPaginatedList) {
                processPaginatedList(queryField, fieldInfo, fields, fragments);
            } else if (queryField.selectionSet) {
                // Check for nested paginated lists
                findNestedPaginatedLists(queryField, fieldInfo.type, fields, fragments);
            }
        }
    }

    return fields;
}

function processPaginatedList(
    field: FieldNode,
    fieldInfo: FieldInfo,
    fields: FieldInfo[],
    fragments: Record<string, FragmentDefinitionNode>,
) {
    const itemsField = field.selectionSet?.selections.find(
        selection => selection.kind === 'Field' && selection.name.value === 'items',
    ) as FieldNode;
    if (!itemsField) {
        return;
    }
    const typeFields = schemaInfo.types[fieldInfo.type];
    const isPaginatedList = typeFields.hasOwnProperty('items') && typeFields.hasOwnProperty('totalItems');
    if (!isPaginatedList) {
        throw new Error(`Could not determine type of items in ${fieldInfo.name}`);
    }
    const itemsType = getObjectFieldInfo(fieldInfo.type, 'items')?.type;
    if (!itemsType) {
        throw new Error(`Could not determine type of items in ${fieldInfo.name}`);
    }
    for (const item of itemsField.selectionSet?.selections ?? []) {
        if (item.kind === 'Field' || item.kind === 'FragmentSpread') {
            collectFields(itemsType, item, fields, fragments);
        }
    }
}

function findNestedPaginatedLists(
    field: FieldNode,
    parentType: string,
    fields: FieldInfo[],
    fragments: Record<string, FragmentDefinitionNode>,
) {
    for (const selection of field.selectionSet?.selections ?? []) {
        if (selection.kind === 'Field') {
            const fieldInfo = getObjectFieldInfo(parentType, selection.name.value);
            if (!fieldInfo) {
                continue;
            }
            if (fieldInfo.isPaginatedList) {
                processPaginatedList(selection, fieldInfo, fields, fragments);
            } else if (selection.selectionSet && !fieldInfo.isScalar) {
                // Continue recursion
                findNestedPaginatedLists(selection, fieldInfo.type, fields, fragments);
            }
        } else if (selection.kind === 'FragmentSpread') {
            // Handle fragment spread on the parent type
            const fragmentName = selection.name.value;
            const fragment = fragments[fragmentName];
            if (fragment && fragment.typeCondition.name.value === parentType) {
                for (const fragmentSelection of fragment.selectionSet.selections) {
                    if (fragmentSelection.kind === 'Field') {
                        const fieldInfo = getObjectFieldInfo(parentType, fragmentSelection.name.value);
                        if (!fieldInfo) {
                            continue;
                        }
                        if (fieldInfo.isPaginatedList) {
                            processPaginatedList(fragmentSelection, fieldInfo, fields, fragments);
                        } else if (fragmentSelection.selectionSet && !fieldInfo.isScalar) {
                            findNestedPaginatedLists(fragmentSelection, fieldInfo.type, fields, fragments);
                        }
                    }
                }
            }
        }
    }
}

/**
 * @description
 * This function is used to get the fields of the operation variables from a DocumentNode.
 *
 * For example, in the following query:
 *
 * ```graphql
 * mutation UpdateProduct($input: UpdateProductInput!) {
 *   updateProduct(input: $input) {
 *     ...ProductDetail
 *   }
 * }
 * ```
 *
 * The operation variables fields are the fields of the `UpdateProductInput` type.
 */
export function getOperationVariablesFields(documentNode: DocumentNode): FieldInfo[] {
    const fields: FieldInfo[] = [];

    const operationDefinition = documentNode.definitions.find(
        (def): def is OperationDefinitionNode => def.kind === 'OperationDefinition',
    );

    if (operationDefinition?.variableDefinitions) {
        operationDefinition.variableDefinitions.forEach(variable => {
            const unwrappedType = unwrapVariableDefinitionType(variable.type);
            const inputName = unwrappedType.name.value;
            const inputFields = getInputTypeInfo(inputName);
            fields.push(...inputFields);
        });
    }

    return fields;
}

function unwrapVariableDefinitionType(type: TypeNode): NamedTypeNode {
    if (type.kind === 'NonNullType') {
        return unwrapVariableDefinitionType(type.type);
    }
    if (type.kind === 'ListType') {
        return unwrapVariableDefinitionType(type.type);
    }
    return type;
}

/**
 * @description
 * This function is used to get the name of the query from a DocumentNode.
 *
 * For example, in the following query:
 *
 * ```graphql
 * query ProductDetail($id: ID!) {
 *   product(id: $id) {
 *     ...ProductDetail
 *   }
 * }
 * ```
 *
 * The query name is `product`.
 */
export function getQueryName(documentNode: DocumentNode): string {
    const operationDefinition = documentNode.definitions.find(
        (def): def is OperationDefinitionNode =>
            def.kind === 'OperationDefinition' && def.operation === 'query',
    );
    const firstSelection = operationDefinition?.selectionSet.selections[0];
    if (firstSelection?.kind === 'Field') {
        return firstSelection.name.value;
    } else {
        throw new Error('Could not determine query name');
    }
}

/**
 * @description
 * This function is used to get the type information of the query from a DocumentNode.
 *
 * For example, in the following query:
 *
 * ```graphql
 * query ProductDetail($id: ID!) {
 *   product(id: $id) {
 *     ...ProductDetail
 *   }
 * }
 * ```
 *
 * The query type field will be the `Product` type.
 */
export function getQueryTypeFieldInfo(documentNode: DocumentNode): FieldInfo {
    const name = getQueryName(documentNode);
    return getQueryInfo(name);
}

/**
 * @description
 * This function is used to get the path to the paginated list from a DocumentNode.
 *
 * For example, in the following query:
 *
 * ```graphql
 * query GetProductList($options: ProductListOptions) {
 *   products(options: $options) {
 *     items {
 *       ...ProductDetail
 *     }
 *     totalCount
 *   }
 * }
 * ```
 *
 * The path to the paginated list is `['products']`.
 */
export function getObjectPathToPaginatedList(
    documentNode: DocumentNode,
    currentPath: string[] = [],
): string[] {
    // get the query OperationDefinition
    const operationDefinition = documentNode.definitions.find(
        (def): def is OperationDefinitionNode =>
            def.kind === 'OperationDefinition' && def.operation === 'query',
    );
    if (!operationDefinition) {
        throw new Error('Could not find query operation definition');
    }

    return findPaginatedListPath(operationDefinition.selectionSet, 'Query', currentPath);
}

function findPaginatedListPath(
    selectionSet: SelectionSetNode,
    parentType: string,
    currentPath: string[] = [],
): string[] {
    for (const selection of selectionSet.selections) {
        if (selection.kind === 'Field') {
            const fieldNode = selection;
            const fieldInfo = getObjectFieldInfo(parentType, fieldNode.name.value);
            if (!fieldInfo) {
                continue;
            }
            const newPath = [...currentPath, fieldNode.name.value];

            if (fieldInfo.isPaginatedList) {
                return newPath;
            }

            // If this field has a selection set, recursively search it
            if (fieldNode.selectionSet && !fieldInfo.isScalar) {
                const result = findPaginatedListPath(fieldNode.selectionSet, fieldInfo.type, newPath);
                if (result.length > 0) {
                    return result;
                }
            }
        }
    }

    return [];
}

/**
 * @description
 * This function is used to get the name of the mutation from a DocumentNode.
 *
 * For example, in the following mutation:
 *
 * ```graphql
 * mutation CreateProduct($input: CreateProductInput!) {
 *   createProduct(input: $input) {
 *     ...ProductDetail
 *   }
 * }
 * ```
 *
 * The mutation name is `createProduct`.
 */
export function getMutationName(documentNode: DocumentNode): string {
    const operationDefinition = documentNode.definitions.find(
        (def): def is OperationDefinitionNode =>
            def.kind === 'OperationDefinition' && def.operation === 'mutation',
    );
    const firstSelection = operationDefinition?.selectionSet.selections[0];
    if (firstSelection?.kind === 'Field') {
        return firstSelection.name.value;
    } else {
        throw new Error('Could not determine mutation name');
    }
}

/**
 * @description
 * This function is used to get the type information of an operation from a DocumentNode.
 */
export function getOperationTypeInfo(
    definitionNode: DefinitionNode | FieldNode,
    parentTypeName?: string,
): FieldInfo | undefined {
    if (definitionNode.kind === 'OperationDefinition') {
        const firstSelection = definitionNode?.selectionSet.selections[0];
        if (firstSelection?.kind === 'Field') {
            return getQueryInfo(firstSelection.name.value);
        }
    }
    if (definitionNode.kind === 'Field' && parentTypeName) {
        const fieldInfo = getObjectFieldInfo(parentTypeName, definitionNode.name.value);
        return fieldInfo;
    }
}

export function getTypeFieldInfo(typeName: string): FieldInfo[] {
    return Object.entries(schemaInfo.types[typeName])
        .map(([fieldName]) => {
            const fieldInfo = getObjectFieldInfo(typeName, fieldName);
            if (!fieldInfo) {
                return;
            }
            return fieldInfo;
        })
        .filter(x => !!x);
}

function getQueryInfo(name: string): FieldInfo {
    const fieldInfo = schemaInfo.types.Query[name];
    return {
        name,
        type: fieldInfo[0],
        nullable: fieldInfo[1],
        list: fieldInfo[2],
        isPaginatedList: fieldInfo[3],
        isScalar: schemaInfo.scalars.includes(fieldInfo[0]),
    };
}

function getInputTypeInfo(name: string): FieldInfo[] {
    return Object.entries(schemaInfo.inputs[name]).map(([fieldName, fieldInfo]: [string, any]) => {
        const type = fieldInfo[0];
        const isScalar = isScalarType(type);
        const isEnum = isEnumType(type);
        return {
            name: fieldName,
            type,
            nullable: fieldInfo[1],
            list: fieldInfo[2],
            isPaginatedList: fieldInfo[3],
            isScalar,
            typeInfo: !isScalar && !isEnum ? getInputTypeInfo(type) : undefined,
        };
    });
}

export function isScalarType(type: string): boolean {
    return schemaInfo.scalars.includes(type);
}

export function isEnumType(type: string): boolean {
    return schemaInfo.enums[type] != null;
}

function getObjectFieldInfo(typeName: string, fieldName: string): FieldInfo | undefined {
    const fieldInfo = schemaInfo.types[typeName]?.[fieldName];
    if (!fieldInfo) {
        return undefined;
    }
    const type = fieldInfo[0];
    const isScalar = isScalarType(type);
    return {
        name: fieldName,
        type: fieldInfo[0],
        nullable: fieldInfo[1],
        list: fieldInfo[2],
        isPaginatedList: fieldInfo[3],
        isScalar,
    };
}

function collectFields(
    typeName: string,
    fieldNode: FieldNode | FragmentSpreadNode,
    fields: FieldInfo[],
    fragments: Record<string, FragmentDefinitionNode>,
) {
    if (fieldNode.kind === 'Field') {
        const fieldInfo = getObjectFieldInfo(typeName, fieldNode.name.value);
        if (!fieldInfo) {
            return;
        }
        fields.push(fieldInfo);
        if (fieldNode.selectionSet) {
            fieldNode.selectionSet.selections.forEach(subSelection => {
                if (subSelection.kind === 'Field') {
                    collectFields(fieldInfo.type, subSelection, [], fragments);
                } else if (subSelection.kind === 'FragmentSpread') {
                    const fragmentName = subSelection.name.value;
                    const fragment = fragments[fragmentName];
                    if (!fragment) {
                        throw new Error(
                            `Fragment "${fragmentName}" not found. Make sure to include it in the "${typeName}" type query.`,
                        );
                    }
                    // We only want to collect fields from the fragment if it's the same type as
                    // the field we're collecting from
                    if (fragment.name.value !== typeName) {
                        return;
                    }
                    if (fragment) {
                        fragment.selectionSet.selections.forEach(fragmentSelection => {
                            if (fragmentSelection.kind === 'Field') {
                                collectFields(typeName, fragmentSelection, fields, fragments);
                            }
                        });
                    }
                }
            });
        }
    }
    if (fieldNode.kind === 'FragmentSpread') {
        const fragmentName = fieldNode.name.value;
        const fragment = fragments[fragmentName];
        if (fragment) {
            fragment.selectionSet.selections.forEach(fragmentSelection => {
                if (fragmentSelection.kind === 'Field') {
                    collectFields(typeName, fragmentSelection, fields, fragments);
                }
            });
        }
    }
}
