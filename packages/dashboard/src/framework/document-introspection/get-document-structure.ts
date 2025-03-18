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
                const itemsField = queryField.selectionSet?.selections.find(
                    selection => selection.kind === 'Field' && selection.name.value === 'items',
                ) as FieldNode;
                if (!itemsField) {
                    continue;
                }
                const typeName = getPaginatedListType(fieldInfo.name);
                if (!typeName) {
                    throw new Error(`Could not determine type of items in ${fieldInfo.name}`);
                }
                for (const item of itemsField.selectionSet?.selections ?? []) {
                    if (item.kind === 'Field' || item.kind === 'FragmentSpread') {
                        collectFields(typeName, item, fields, fragments);
                    }
                }
            }
        }
    }

    return fields;
}

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
    return Object.entries(schemaInfo.types[typeName]).map(([fieldName, fieldInfo]) => {
        return getObjectFieldInfo(typeName, fieldName);
    });
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
    return Object.entries(schemaInfo.inputs[name]).map(([fieldName, fieldInfo]) => {
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

function getPaginatedListType(name: string): string | undefined {
    const queryInfo = getQueryInfo(name);
    if (queryInfo.isPaginatedList) {
        const paginagedListType = getObjectFieldInfo(queryInfo.type, 'items').type;
        return paginagedListType;
    }
}

function getObjectFieldInfo(typeName: string, fieldName: string): FieldInfo {
    const fieldInfo = schemaInfo.types[typeName][fieldName];
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
        fields.push(fieldInfo);
        if (fieldNode.selectionSet) {
            fieldNode.selectionSet.selections.forEach(subSelection => {
                if (subSelection.kind === 'Field') {
                    collectFields(fieldInfo.type, subSelection, [], fragments);
                } else if (subSelection.kind === 'FragmentSpread') {
                    const fragmentName = subSelection.name.value;
                    const fragment = fragments[fragmentName];
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
