import {
    FieldInfo,
    isEnumType,
    isScalarType,
} from '@/vdb/framework/document-introspection/get-document-structure.js';
import { StructCustomFieldConfig } from '@vendure/common/lib/generated-types';
import { ResultOf } from 'gql.tada';
import { z, ZodRawShape, ZodType, ZodTypeAny } from 'zod';

import { structCustomFieldFragment } from '../../providers/server-config.js';

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

type StructFieldConfig = ResultOf<typeof structCustomFieldFragment>['fields'][number];

function mapGraphQLCustomFieldToConfig(field: StructFieldConfig): CustomFieldConfig {
    const baseConfig = {
        name: field.name,
        type: field.type,
        list: field.list ?? false,
        nullable: true, // Default to true since GraphQL fields are nullable by default
    };

    switch (field.__typename) {
        case 'StringStructFieldConfig':
            return {
                ...baseConfig,
                pattern: field.pattern ?? undefined,
            };
        case 'IntStructFieldConfig':
            return {
                ...baseConfig,
                intMin: field.intMin ?? undefined,
                intMax: field.intMax ?? undefined,
            };
        case 'FloatStructFieldConfig':
            return {
                ...baseConfig,
                floatMin: field.floatMin ?? undefined,
                floatMax: field.floatMax ?? undefined,
            };
        case 'DateTimeStructFieldConfig':
            return {
                ...baseConfig,
                datetimeMin: field.datetimeMin ?? undefined,
                datetimeMax: field.datetimeMax ?? undefined,
            };
        default:
            return baseConfig;
    }
}

function parseDate(dateStr: string | undefined | null): Date | undefined {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? undefined : date;
}

function createDateValidationSchema(minDate: Date | undefined, maxDate: Date | undefined): ZodType {
    const baseSchema = z.union([z.string(), z.date()]);
    if (!minDate && !maxDate) return baseSchema;

    const dateMinString = minDate?.toLocaleDateString() ?? '';
    const dateMaxString = maxDate?.toLocaleDateString() ?? '';
    const dateMinMessage = minDate ? `Date must be after ${dateMinString}` : '';
    const dateMaxMessage = maxDate ? `Date must be before ${dateMaxString}` : '';

    return baseSchema.refine(
        val => {
            if (!val) return true;
            const date = val instanceof Date ? val : new Date(val);
            if (minDate && date < minDate) return false;
            if (maxDate && date > maxDate) return false;
            return true;
        },
        val => {
            const date = val instanceof Date ? val : new Date(val);
            if (minDate && date < minDate) return { message: dateMinMessage };
            if (maxDate && date > maxDate) return { message: dateMaxMessage };
            return { message: '' };
        },
    );
}

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
                        case 'localeString':
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
                            let zt = z.union([z.string(), z.date()]);
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
                                zt = z.union([z.string(), z.date()]).superRefine((val, ctx) => {
                                    if (!val) return true;
                                    const date = val instanceof Date ? val : new Date(val);
                                    if (customField.datetimeMin && customField.datetimeMin !== '') {
                                        const minDate = new Date(customField.datetimeMin);
                                        if (date < minDate) {
                                            ctx.addIssue({
                                                code: z.ZodIssueCode.custom,
                                                message: dateMinMessage,
                                            });
                                            return false;
                                        }
                                    }
                                    if (customField.datetimeMax && customField.datetimeMax !== '') {
                                        const maxDate = new Date(customField.datetimeMax);
                                        if (date > maxDate) {
                                            ctx.addIssue({
                                                code: z.ZodIssueCode.custom,
                                                message: dateMaxMessage,
                                            });
                                            return false;
                                        }
                                    }
                                    return true;
                                });
                            }
                            zodType = zt;
                            break;
                        }
                        case 'boolean': {
                            const zt = z.boolean();
                            zodType = zt;
                            break;
                        }
                        case 'struct': {
                            // For struct fields, we need to create a nested object schema
                            // The actual struct field configuration should have a 'fields' property
                            const structFieldConfig = customField as StructCustomFieldConfig;
                            if (structFieldConfig.fields && Array.isArray(structFieldConfig.fields)) {
                                const nestedSchema: ZodRawShape = {};
                                for (const structSubField of structFieldConfig.fields) {
                                    // Create validation for each sub-field of the struct
                                    const config = mapGraphQLCustomFieldToConfig(
                                        structSubField as StructFieldConfig,
                                    );
                                    let subFieldType: ZodType;
                                    switch (config.type) {
                                        case 'string': {
                                            let zt = z.string();
                                            if (config.pattern) {
                                                zt = zt.regex(new RegExp(config.pattern), {
                                                    message: `Value must match pattern: ${config.pattern}`,
                                                });
                                            }
                                            subFieldType = zt;
                                            break;
                                        }
                                        case 'int': {
                                            let zt = z.number();
                                            if (config.intMin !== undefined) {
                                                zt = zt.min(config.intMin, {
                                                    message: `Value must be at least ${config.intMin}`,
                                                });
                                            }
                                            if (config.intMax !== undefined) {
                                                zt = zt.max(config.intMax, {
                                                    message: `Value must be at most ${config.intMax}`,
                                                });
                                            }
                                            subFieldType = zt;
                                            break;
                                        }
                                        case 'float': {
                                            let zt = z.number();
                                            if (config.floatMin !== undefined) {
                                                zt = zt.min(config.floatMin, {
                                                    message: `Value must be at least ${config.floatMin}`,
                                                });
                                            }
                                            if (config.floatMax !== undefined) {
                                                zt = zt.max(config.floatMax, {
                                                    message: `Value must be at most ${config.floatMax}`,
                                                });
                                            }
                                            subFieldType = zt;
                                            break;
                                        }
                                        case 'datetime': {
                                            const minDate = parseDate(config.datetimeMin);
                                            const maxDate = parseDate(config.datetimeMax);
                                            subFieldType = createDateValidationSchema(minDate, maxDate);
                                            break;
                                        }
                                        default: {
                                            subFieldType = config.type === 'boolean' ? z.boolean() : z.any();
                                            break;
                                        }
                                    }

                                    // Handle list and nullable for struct sub-fields
                                    if (config.list) {
                                        subFieldType = z.array(subFieldType);
                                    }
                                    if (config.nullable) {
                                        subFieldType = subFieldType.optional().nullable();
                                    }

                                    nestedSchema[config.name] = subFieldType;
                                }
                                zodType = z.object(nestedSchema);
                            } else {
                                // Fallback if struct doesn't have proper fields configuration
                                zodType = z.object({}).passthrough();
                            }
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
