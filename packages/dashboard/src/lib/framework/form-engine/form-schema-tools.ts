import {
    FieldInfo,
    isEnumType,
    isScalarType,
} from '@/vdb/framework/document-introspection/get-document-structure.js';
import { z, ZodRawShape, ZodType, ZodTypeAny } from 'zod';

export function createFormSchemaFromFields(fields: FieldInfo[]) {
    const schemaConfig: ZodRawShape = {};
    for (const field of fields) {
        const isScalar = isScalarType(field.type);
        const isEnum = isEnumType(field.type);
        if (isScalar || isEnum) {
            schemaConfig[field.name] = getZodTypeFromField(field);
        } else if (field.typeInfo) {
            let nestedType: ZodType = createFormSchemaFromFields(field.typeInfo);
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

export function getZodTypeFromField(field: FieldInfo): ZodTypeAny {
    let zodType: ZodType;
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
