import { GraphQLResolveInfo } from 'graphql';

/**
 * Checks if a specific field is requested in the GraphQL query selection set.
 * Looks for the field within the 'items' selection of a paginated list.
 */
export function isFieldInSelection(
    info: GraphQLResolveInfo,
    fieldName: string,
    parentFieldName = 'items',
): boolean {
    for (const fieldNode of info.fieldNodes) {
        const selections = fieldNode.selectionSet?.selections ?? [];
        for (const selection of selections) {
            if (selection.kind === 'Field' && selection.name.value === parentFieldName) {
                const itemSelections = selection.selectionSet?.selections ?? [];
                for (const itemSelection of itemSelections) {
                    if (itemSelection.kind === 'Field' && itemSelection.name.value === fieldName) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
