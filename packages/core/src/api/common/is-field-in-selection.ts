import { FieldNode, GraphQLResolveInfo } from 'graphql';

/**
 * Checks if a specific field is requested in the GraphQL query selection set.
 * Looks for the field within the 'items' selection of a paginated list.
 */
export function isFieldInSelection(
    info: GraphQLResolveInfo,
    fieldName: string,
    parentFieldName = 'items',
): boolean {
    const parentSelections = info.fieldNodes.flatMap(node => node.selectionSet?.selections ?? []);
    const parentField = parentSelections.find(
        (s): s is FieldNode => s.kind === 'Field' && s.name.value === parentFieldName,
    );
    const childSelections = parentField?.selectionSet?.selections ?? [];
    return childSelections.some((s): s is FieldNode => s.kind === 'Field' && s.name.value === fieldName);
}
