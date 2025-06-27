import { FieldInfo } from '../document-introspection/get-document-structure.js';

export function transformRelationFields<E extends Record<string, any>>(fields: FieldInfo[], entity: E) {
    const processedEntity = { ...entity } as any;

    for (const field of fields) {
        if (field.name !== 'customFields' || !field.typeInfo) {
            continue;
        }

        if (!entity.customFields || !processedEntity.customFields) {
            continue;
        }

        for (const customField of field.typeInfo) {
            if (customField.type === 'ID') {
                const relationField = customField.name;
                const propertyAccessorKey = customField.name.replace(/Id$/, '');
                const relationValue = entity.customFields[propertyAccessorKey];
                const relationIdValue = relationValue?.id;

                if (relationIdValue) {
                    processedEntity.customFields[relationField] = relationIdValue;
                }
            }
        }
    }

    return processedEntity;
}
