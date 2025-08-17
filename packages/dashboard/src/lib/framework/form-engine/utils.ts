import {
    AllCustomFieldConfigs,
    BooleanCustomFieldConfig,
    BooleanStructField,
    ConfigurableArgDef,
    ConfigurableFieldDef,
    DateTimeCustomFieldConfig,
    DateTimeStructField,
    FloatCustomFieldConfig,
    FloatStructField,
    IntCustomFieldConfig,
    IntStructField,
    LocaleStringCustomFieldConfig,
    LocaleTextCustomFieldConfig,
    RelationCustomFieldConfig,
    StringCustomFieldConfig,
    StringStructField,
    StructCustomFieldConfig,
    StructField,
    TextCustomFieldConfig,
} from '@/vdb/framework/form-engine/form-engine-types.js';

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

// =============================================================================
// TYPE GUARDS FOR CONFIGURABLE FIELD DEFINITIONS
// =============================================================================

/**
 * Determines if a field definition is a custom field config (vs configurable operation arg)
 */
export function isCustomFieldConfig(input: ConfigurableFieldDef): input is AllCustomFieldConfigs {
    return input.hasOwnProperty('readonly');
}

/**
 * Determines if a field definition is a configurable operation argument
 */
export function isConfigurableArgDef(input: ConfigurableFieldDef): input is ConfigurableArgDef {
    return !input.hasOwnProperty('readonly');
}

// =============================================================================
// TYPE GUARDS FOR SPECIFIC CUSTOM FIELD TYPES
// =============================================================================

/**
 * String custom field with optional pattern and options
 */
export function isStringCustomFieldConfig(input: ConfigurableFieldDef): input is StringCustomFieldConfig {
    return input.type === 'string' && isCustomFieldConfig(input);
}

/**
 * String custom field that has options (select dropdown)
 */
export function isStringFieldWithOptions(input: ConfigurableFieldDef): input is StringCustomFieldConfig {
    const isCustomFieldWithOptions =
        input.type === 'string' &&
        isCustomFieldConfig(input) &&
        input.hasOwnProperty('options') &&
        Array.isArray((input as any).options);
    if (isCustomFieldWithOptions) {
        return true;
    }
    const isConfigArgWithOptions =
        input.type === 'string' && isConfigurableArgDef(input) && Array.isArray(input.ui?.options);
    if (isConfigArgWithOptions) {
        return true;
    }
    return false;
}

/**
 * Locale string custom field
 */
export function isLocaleStringCustomFieldConfig(
    input: ConfigurableFieldDef,
): input is LocaleStringCustomFieldConfig {
    return input.type === 'localeString' && isCustomFieldConfig(input);
}

/**
 * Text custom field (textarea)
 */
export function isTextCustomFieldConfig(input: ConfigurableFieldDef): input is TextCustomFieldConfig {
    return input.type === 'text' && isCustomFieldConfig(input);
}

/**
 * Locale text custom field (localized textarea)
 */
export function isLocaleTextCustomFieldConfig(
    input: ConfigurableFieldDef,
): input is LocaleTextCustomFieldConfig {
    return input.type === 'localeText' && isCustomFieldConfig(input);
}

/**
 * Boolean custom field
 */
export function isBooleanCustomFieldConfig(input: ConfigurableFieldDef): input is BooleanCustomFieldConfig {
    return input.type === 'boolean' && isCustomFieldConfig(input);
}

/**
 * Integer custom field with optional min/max/step
 */
export function isIntCustomFieldConfig(input: ConfigurableFieldDef): input is IntCustomFieldConfig {
    return input.type === 'int' && isCustomFieldConfig(input);
}

/**
 * Float custom field with optional min/max/step
 */
export function isFloatCustomFieldConfig(input: ConfigurableFieldDef): input is FloatCustomFieldConfig {
    return input.type === 'float' && isCustomFieldConfig(input);
}

/**
 * DateTime custom field with optional min/max/step
 */
export function isDateTimeCustomFieldConfig(input: ConfigurableFieldDef): input is DateTimeCustomFieldConfig {
    return input.type === 'datetime' && isCustomFieldConfig(input);
}

/**
 * Relation custom field (references another entity)
 */
export function isRelationCustomFieldConfig(input: ConfigurableFieldDef): input is RelationCustomFieldConfig {
    return input.type === 'relation' && isCustomFieldConfig(input);
}

/**
 * Struct custom field (nested object with sub-fields)
 */
export function isStructCustomFieldConfig(input: ConfigurableFieldDef): input is StructCustomFieldConfig {
    return input.type === 'struct' && isCustomFieldConfig(input);
}

// Legacy alias for backward compatibility
export const isStructFieldConfig = isStructCustomFieldConfig;

// =============================================================================
// TYPE GUARDS FOR STRUCT FIELD TYPES (fields within struct custom fields)
// =============================================================================

/**
 * String field within a struct custom field
 */
export function isStringStructField(input: StructField): input is StringStructField {
    return input.type === 'string';
}

/**
 * String struct field that has options (select dropdown)
 */
export function isStringStructFieldWithOptions(
    input: StructField,
): input is StringStructField & { options: any[] } {
    return (
        input.type === 'string' && input.hasOwnProperty('options') && Array.isArray((input as any).options)
    );
}

/**
 * Integer field within a struct custom field
 */
export function isIntStructField(input: StructField): input is IntStructField {
    return input.type === 'int';
}

/**
 * Float field within a struct custom field
 */
export function isFloatStructField(input: StructField): input is FloatStructField {
    return input.type === 'float';
}

/**
 * Boolean field within a struct custom field
 */
export function isBooleanStructField(input: StructField): input is BooleanStructField {
    return input.type === 'boolean';
}

/**
 * DateTime field within a struct custom field
 */
export function isDateTimeStructField(input: StructField): input is DateTimeStructField {
    return input.type === 'datetime';
}

// =============================================================================
// UTILITY TYPE GUARDS
// =============================================================================

/**
 * Determines if a field is a list/array field
 */
export function isListField(input?: ConfigurableFieldDef): boolean {
    return input && isCustomFieldConfig(input) ? Boolean(input.list) : false;
}

/**
 * Determines if a field is readonly
 */
export function isReadonlyField(input?: ConfigurableFieldDef): boolean {
    return input && isCustomFieldConfig(input) ? Boolean(input.readonly) : false;
}

/**
 * Determines if a field requires special permissions
 */
export function hasPermissionRequirement(input: ConfigurableFieldDef): boolean {
    return isCustomFieldConfig(input) && Boolean(input.requiresPermission);
}

/**
 * Determines if a field is nullable
 */
export function isNullableField(input: ConfigurableFieldDef): boolean {
    return isCustomFieldConfig(input) && Boolean(input.nullable);
}
