import { ConfigArgType } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';

import { ConfigArgDefinition } from '../generated-types';

/**
 * ConfigArg values are always stored as strings. If they are not primitives, then
 * they are JSON-encoded. This function unwraps them back into their original
 * data type.
 */
export function getConfigArgValue(value: any) {
    try {
        return value ? JSON.parse(value) : undefined;
    } catch (e) {
        return value;
    }
}

export function encodeConfigArgValue(value: any): string {
    return Array.isArray(value) ? JSON.stringify(value) : value.toString();
}

/**
 * Returns a default value based on the type of the config arg.
 */
export function getDefaultConfigArgValue(arg: ConfigArgDefinition): any {
    return arg.list ? [] : getDefaultConfigArgSingleValue(arg.type as ConfigArgType);
}

export function getDefaultConfigArgSingleValue(type: ConfigArgType): any {
    switch (type) {
        case 'boolean':
            return 'false';
        case 'int':
        case 'float':
            return '0';
        case 'ID':
            return '';
        case 'string':
            return '';
        case 'datetime':
            return new Date();
        default:
            assertNever(type);
    }
}
