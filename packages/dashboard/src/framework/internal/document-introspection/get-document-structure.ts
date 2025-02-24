import {
    DocumentNode,
    OperationDefinitionNode,
    FieldNode,
    FragmentDefinitionNode,
    FragmentSpreadNode,
} from 'graphql';
import { schemaInfo } from 'virtual:admin-api-schema';

export interface FieldInfo {
    name: string;
    type: string;
    nullable: boolean;
    list: boolean;
    isPaginatedList: boolean;
}

/**
 * Given a DocumentNode of a PaginatedList query, returns information about each
 * of the selected fields.
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

function getQueryInfo(name: string): FieldInfo {
    const fieldInfo = schemaInfo.types.Query[name];
    return {
        name,
        type: fieldInfo[0],
        nullable: fieldInfo[1],
        list: fieldInfo[2],
        isPaginatedList: fieldInfo[3],
    };
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
    return {
        name: fieldName,
        type: fieldInfo[0],
        nullable: fieldInfo[1],
        list: fieldInfo[2],
        isPaginatedList: fieldInfo[3],
    };
}

function collectFields(
    typeName: string,
    fieldNode: FieldNode | FragmentSpreadNode,
    fields: FieldInfo[],
    fragments: Record<string, FragmentDefinitionNode>,
) {
    if (fieldNode.kind === 'Field') {
        fields.push(getObjectFieldInfo(typeName, fieldNode.name.value));
        if (fieldNode.selectionSet) {
            fieldNode.selectionSet.selections.forEach(subSelection => {
                if (subSelection.kind === 'Field') {
                    collectFields(typeName, subSelection, fields, fragments);
                } else if (subSelection.kind === 'FragmentSpread') {
                    const fragmentName = subSelection.name.value;
                    const fragment = fragments[fragmentName];
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
