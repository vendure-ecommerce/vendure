import { ConfigurableFieldDef } from '@/vdb/framework/form-engine/form-engine-types.js';

export type ValueMode = 'native' | 'json-string';

/**
 * Interface for transforming values between native JavaScript types and JSON strings
 */
export interface ValueTransformer {
    parse: (value: string, fieldDef: ConfigurableFieldDef) => any;
    serialize: (value: any, fieldDef: ConfigurableFieldDef) => string;
}

/**
 * Native value transformer - passes values through unchanged
 */
export const nativeValueTransformer: ValueTransformer = {
    parse: (value: string, fieldDef: ConfigurableFieldDef) => {
        // For native mode, values are already in their correct JavaScript type
        return value;
    },
    serialize: (value: any, fieldDef: ConfigurableFieldDef) => {
        // For native mode, values are already in their correct JavaScript type
        return value;
    },
};

/**
 * JSON string value transformer - converts between JSON strings and native values
 */
export const jsonStringValueTransformer: ValueTransformer = {
    parse: (value: string, fieldDef: ConfigurableFieldDef) => {
        if (!value) {
            return getDefaultValue(fieldDef);
        }

        try {
            // For JSON string mode, parse the string to get the native value
            const parsed = JSON.parse(value);

            // Handle special cases for different field types
            switch (fieldDef.type) {
                case 'boolean':
                    return parsed === true || parsed === 'true';
                case 'int':
                case 'float':
                    return typeof parsed === 'number' ? parsed : parseFloat(parsed) || 0;
                case 'datetime':
                    return parsed;
                default:
                    return parsed;
            }
        } catch (error) {
            // If parsing fails, try to handle as a plain string for certain types
            switch (fieldDef.type) {
                case 'boolean':
                    return value === 'true';
                case 'int':
                case 'float':
                    return parseFloat(value) || 0;
                default:
                    return value;
            }
        }
    },
    serialize: (value: any, fieldDef: ConfigurableFieldDef) => {
        if (value === null || value === undefined) {
            return '';
        }

        // Handle special cases for different field types
        switch (fieldDef.type) {
            case 'boolean':
                return (value === true || value === 'true').toString();
            case 'int':
            case 'float':
                return typeof value === 'number' ? value.toString() : (parseFloat(value) || 0).toString();
            case 'string':
                return typeof value === 'string' ? value : JSON.stringify(value);
            default:
                // For complex values (arrays, objects), serialize as JSON
                return typeof value === 'string' ? value : JSON.stringify(value);
        }
    },
};

/**
 * Get the appropriate value transformer based on the value mode
 */
export function getValueTransformer(valueMode: ValueMode): ValueTransformer {
    switch (valueMode) {
        case 'native':
            return nativeValueTransformer;
        case 'json-string':
            return jsonStringValueTransformer;
        default:
            return nativeValueTransformer;
    }
}

/**
 * Get default value for a field type
 */
function getDefaultValue(fieldDef: ConfigurableFieldDef): any {
    if (fieldDef.list) {
        return [];
    }

    switch (fieldDef.type) {
        case 'string':
        case 'ID':
        case 'localeString':
        case 'localeText':
            return '';
        case 'int':
        case 'float':
            return 0;
        case 'boolean':
            return false;
        case 'datetime':
            return '';
        case 'relation':
            return fieldDef.list ? [] : null;
        case 'struct':
            return fieldDef.list ? [] : {};
        default:
            return '';
    }
}

/**
 * Utility to transform a value using the appropriate transformer
 */
export function transformValue(
    value: any,
    fieldDef: ConfigurableFieldDef,
    valueMode: ValueMode,
    direction: 'parse' | 'serialize',
): any {
    const transformer = getValueTransformer(valueMode);
    return direction === 'parse'
        ? transformer.parse(value, fieldDef)
        : transformer.serialize(value, fieldDef);
}
