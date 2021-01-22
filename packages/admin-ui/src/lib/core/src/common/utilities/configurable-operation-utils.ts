import { ConfigArgType, CustomFieldType } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';

import {
    ConfigArgDefinition,
    ConfigurableOperation,
    ConfigurableOperationDefinition,
    ConfigurableOperationInput,
} from '../generated-types';

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
    return Array.isArray(value) ? JSON.stringify(value) : (value ?? '').toString();
}

/**
 * Creates an empty ConfigurableOperation object based on the definition.
 */
export function configurableDefinitionToInstance(
    def: ConfigurableOperationDefinition,
): ConfigurableOperation {
    return {
        ...def,
        args: def.args.map(arg => {
            return {
                ...arg,
                value: getDefaultConfigArgValue(arg),
            };
        }),
    } as ConfigurableOperation;
}

/**
 * Converts an object of the type:
 * ```
 * {
 *     code: 'my-operation',
 *     args: {
 *         someProperty: 'foo'
 *     }
 * }
 * ```
 * to the format defined by the ConfigurableOperationInput GraphQL input type:
 * ```
 * {
 *     code: 'my-operation',
 *     args: [
 *         { name: 'someProperty', value: 'foo' }
 *     ]
 * }
 * ```
 */
export function toConfigurableOperationInput(
    operation: ConfigurableOperation,
    formValueOperations: any,
): ConfigurableOperationInput {
    return {
        code: operation.code,
        arguments: Object.values<any>(formValueOperations.args || {}).map((value, j) => ({
            name: operation.args[j].name,
            value: value.hasOwnProperty('value')
                ? encodeConfigArgValue((value as any).value)
                : encodeConfigArgValue(value),
        })),
    };
}

/**
 * Returns a default value based on the type of the config arg.
 */
export function getDefaultConfigArgValue(arg: ConfigArgDefinition): any {
    return arg.list ? [] : getDefaultConfigArgSingleValue(arg.type as ConfigArgType);
}

export function getDefaultConfigArgSingleValue(type: ConfigArgType | CustomFieldType): any {
    switch (type) {
        case 'boolean':
            return 'false';
        case 'int':
        case 'float':
            return '0';
        case 'ID':
            return '';
        case 'string':
        case 'localeString':
            return '';
        case 'datetime':
            return new Date();
        case 'relation':
            return null;
        default:
            assertNever(type);
    }
}
