import { FieldInfo } from '../document-introspection/get-document-structure.js';

/**
 * Transforms relation fields in an entity, extracting IDs from relation objects.
 * This is primarily used for custom fields of type "ID".
 *
 * @param fields - Array of field information
 * @param entity - The entity to transform
 * @returns A new entity with transformed relation fields
 */
export function transformRelationFields<E extends Record<string, any>>(fields: FieldInfo[], entity: E): E {
    // Create a shallow copy to avoid mutating the original entity
    const processedEntity = { ...entity };

    // Skip processing if there are no custom fields
    if (!entity.customFields || !processedEntity.customFields) {
        return processedEntity;
    }

    // Find the customFields field info
    const customFieldsInfo = fields.find(field => field.name === 'customFields' && field.typeInfo);
    if (!customFieldsInfo?.typeInfo) {
        return processedEntity;
    }

    // Process only ID type custom fields
    const idTypeCustomFields = customFieldsInfo.typeInfo.filter(field => field.type === 'ID');

    for (const customField of idTypeCustomFields) {
        const relationField = customField.name;

        if (customField.list) {
            // For list fields, the accessor is the field name without the "Ids" suffix
            const propertyAccessorKey = customField.name.replace(/Ids$/, '');
            const relationValue = entity.customFields[propertyAccessorKey];

            if (relationValue) {
                const relationIdValue = relationValue.map((v: { id: string }) => v.id);
                if (relationIdValue && relationIdValue.length > 0) {
                    processedEntity.customFields[relationField] = relationIdValue;
                }
            }
        } else {
            // For single fields, the accessor is the field name without the "Id" suffix
            const propertyAccessorKey = customField.name.replace(/Id$/, '');
            const relationValue = entity.customFields[propertyAccessorKey];

            if (relationValue) {
                const relationIdValue = relationValue.id;
                if (relationIdValue) {
                    processedEntity.customFields[relationField] = relationIdValue;
                }
            }
        }
    }

    return processedEntity;
}
