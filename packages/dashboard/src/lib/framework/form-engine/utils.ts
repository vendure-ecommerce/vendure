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
    const processedEntity = { ...entity, customFields: { ...(entity.customFields ?? {}) } };

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
            processedEntity.customFields[relationField] = relationValue?.id;
            delete processedEntity.customFields[propertyAccessorKey];
        }
    }
    return processedEntity;
}

/**
 * @description
 * Due to the schema types, sometimes "create" mutations will have a default empty "id"
 * field which can cause issues if we actually send them with a "create" mutation to the server.
 * This function deletes any empty ID fields on the entity or its nested objects.
 */
export function removeEmptyIdFields<T extends Record<string, any>>(values: T, fields: FieldInfo[]): T {
    if (!values) {
        return values;
    }

    // Create a deep copy to avoid mutating the original values
    const result = structuredClone(values);

    function recursiveRemove(obj: any, fieldDefs: FieldInfo[]) {
        if (Array.isArray(obj)) {
            for (const item of obj) {
                recursiveRemove(item, fieldDefs);
            }
        } else if (typeof obj === 'object' && obj !== null) {
            for (const field of fieldDefs) {
                // Remove empty string ID fields at this level
                if (field.type === 'ID' && typeof obj[field.name] === 'string' && obj[field.name] === '') {
                    delete obj[field.name];
                }
                // If the field is an object or array, recurse into it
                if (Array.isArray(obj[field.name])) {
                    if (field.typeInfo) {
                        for (const item of obj[field.name]) {
                            recursiveRemove(item, field.typeInfo);
                        }
                    }
                } else if (
                    typeof obj[field.name] === 'object' &&
                    obj[field.name] !== null &&
                    field.typeInfo
                ) {
                    recursiveRemove(obj[field.name], field.typeInfo);
                }
            }
        }
    }

    recursiveRemove(result, fields);
    return result;
}
