import {
    FieldInfo,
    isEnumType,
    isScalarType,
} from '@/vdb/framework/document-introspection/get-document-structure.js';
import { z, ZodRawShape, ZodType, ZodTypeAny } from 'zod';

type CustomFieldConfig = {
    name: string;
    type: string;
    pattern?: string;
    intMin?: number;
    intMax?: number;
    floatMin?: number;
    floatMax?: number;
    datetimeMin?: string;
    datetimeMax?: string;
    list?: boolean;
    nullable?: boolean;
};

export function createFormSchemaFromFields(
    fields: FieldInfo[],
    customFieldConfigs?: CustomFieldConfig[],
    isTranslationContext = false,
) {
    const schemaConfig: ZodRawShape = {};
    for (const field of fields) {
        const isScalar = isScalarType(field.type);
        const isEnum = isEnumType(field.type);
        if ((isScalar || isEnum) && field.name !== 'customFields') {
            schemaConfig[field.name] = getZodTypeFromField(field, customFieldConfigs);
        } else if (field.name === 'customFields') {
            // Special handling for customFields object
            const customFieldsSchema: ZodRawShape = {};

            if (customFieldConfigs && customFieldConfigs.length > 0) {
                // Filter custom fields based on context
                const translatableTypes = ['localeString', 'localeText'];
                const filteredCustomFields = customFieldConfigs.filter(cf => {
                    if (isTranslationContext) {
                        // In translation context, only include translatable types
                        return translatableTypes.includes(cf.type);
                    } else {
                        // In root context, only include non-translatable types
                        return !translatableTypes.includes(cf.type);
                    }
                });

                for (const customField of filteredCustomFields) {
                    let zodType: ZodType;
                    switch (customField.type) {
                        case 'string': {
                            let zt = z.string();
                            if (customField.pattern) {
                                zt = zt.regex(new RegExp(customField.pattern), {
                                    message: `Value must match pattern: ${customField.pattern}`,
                                });
                            }
                            zodType = zt;
                            break;
                        }
                        case 'int': {
                            let zt = z.number();
                            if (customField.intMin !== undefined) {
                                zt = zt.min(customField.intMin, {
                                    message: `Value must be at least ${customField.intMin}`,
                                });
                            }
                            if (customField.intMax !== undefined) {
                                zt = zt.max(customField.intMax, {
                                    message: `Value must be at most ${customField.intMax}`,
                                });
                            }
                            zodType = zt;
                            break;
                        }
                        case 'float': {
                            let zt = z.number();
                            if (customField.floatMin !== undefined) {
                                zt = zt.min(customField.floatMin, {
                                    message: `Value must be at least ${customField.floatMin}`,
                                });
                            }
                            if (customField.floatMax !== undefined) {
                                zt = zt.max(customField.floatMax, {
                                    message: `Value must be at most ${customField.floatMax}`,
                                });
                            }
                            zodType = zt;
                            break;
                        }
                        case 'datetime': {
                            let zt = z.string();
                            if (customField.datetimeMin || customField.datetimeMax) {
                                const dateMinString = customField.datetimeMin
                                    ? new Date(customField.datetimeMin).toLocaleDateString()
                                    : '';
                                const dateMaxString = customField.datetimeMax
                                    ? new Date(customField.datetimeMax).toLocaleDateString()
                                    : '';
                                const dateMinMessage = customField.datetimeMin
                                    ? `Date must be after ${dateMinString}`
                                    : '';
                                const dateMaxMessage = customField.datetimeMax
                                    ? `Date must be before ${dateMaxString}`
                                    : '';
                                const message = [dateMinMessage, dateMaxMessage].filter(Boolean).join(', ');
                                zt = zt.refine(
                                    val => {
                                        if (!val) return true;
                                        const date = new Date(val);
                                        if (
                                            customField.datetimeMin &&
                                            date < new Date(customField.datetimeMin)
                                        ) {
                                            return false;
                                        }
                                        if (
                                            customField.datetimeMax &&
                                            date > new Date(customField.datetimeMax)
                                        ) {
                                            return false;
                                        }
                                        return true;
                                    },
                                    {
                                        message,
                                    },
                                );
                            }
                            zodType = zt;
                            break;
                        }
                        case 'boolean': {
                            const zt = z.boolean();
                            zodType = zt;
                            break;
                        }
                        case 'localeString': {
                            let zt = z.string();
                            if (customField.pattern) {
                                zt = zt.regex(new RegExp(customField.pattern), {
                                    message: `Value must match pattern: ${customField.pattern}`,
                                });
                            }
                            zodType = zt;
                            break;
                        }
                        case 'localeText': {
                            const zt = z.string();
                            zodType = zt;
                            break;
                        }
                        default: {
                            const zt = z.any();
                            zodType = zt;
                            break;
                        }
                    }

                    if (customField.list) {
                        zodType = z.array(zodType);
                    }
                    if (customField.nullable !== false) {
                        zodType = zodType.optional().nullable();
                    }

                    customFieldsSchema[customField.name] = zodType;
                }
            }

            schemaConfig[field.name] = z.object(customFieldsSchema).optional();
        } else if (field.typeInfo) {
            // Detect if we're processing translations to set the correct context
            const isNestedTranslationContext = field.name === 'translations' || isTranslationContext;
            let nestedType: ZodType = createFormSchemaFromFields(
                field.typeInfo,
                customFieldConfigs,
                isNestedTranslationContext,
            );
            if (field.nullable) {
                nestedType = nestedType.optional().nullable();
            }
            if (field.list) {
                nestedType = z.array(nestedType);
            }
            schemaConfig[field.name] = nestedType;
        }
    }
    return z.object(schemaConfig);
}

export function getDefaultValuesFromFields(fields: FieldInfo[], defaultLanguageCode?: string) {
    const defaultValues: Record<string, any> = {};
    for (const field of fields) {
        if (field.typeInfo) {
            const nestedObjectDefaults = getDefaultValuesFromFields(field.typeInfo, defaultLanguageCode);
            if (field.list) {
                defaultValues[field.name] = [nestedObjectDefaults];
            } else {
                defaultValues[field.name] = nestedObjectDefaults;
            }
        } else {
            defaultValues[field.name] = getDefaultValueFromField(field, defaultLanguageCode);
        }
    }
    return defaultValues;
}

export function getDefaultValueFromField(field: FieldInfo, defaultLanguageCode?: string) {
    if (field.list) {
        return [];
    }
    switch (field.type) {
        case 'String':
        case 'DateTime':
            return '';
        case 'Int':
        case 'Float':
        case 'Money':
            return 0;
        case 'Boolean':
            return false;
        case 'ID':
            return '';
        case 'LanguageCode':
            return defaultLanguageCode || 'en';
        case 'JSON':
            return {};
        default: {
            return '';
        }
    }
}

export function getZodTypeFromField(field: FieldInfo, customFieldConfigs?: CustomFieldConfig[]): ZodTypeAny {
    let zodType: ZodType;

    // This function is only used for non-custom fields, so we don't need custom field logic here
    // Custom fields are handled separately in createFormSchemaFromFields

    switch (field.type) {
        case 'String':
        case 'ID':
        case 'DateTime':
            zodType = z.string();
            break;
        case 'Int':
        case 'Float':
        case 'Money':
            zodType = z.number();
            break;
        case 'Boolean':
            zodType = z.boolean();
            break;
        default:
            zodType = z.any();
    }

    if (field.list) {
        zodType = z.array(zodType);
    }
    if (field.nullable) {
        zodType = zodType.optional().nullable();
    }
    return zodType;
}
