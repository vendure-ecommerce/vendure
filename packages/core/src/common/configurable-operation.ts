// prettier-ignore
import { ConfigArg, ConfigurableOperation } from '@vendure/common/lib/generated-types';
import { ConfigArgType } from '@vendure/common/lib/shared-types';

import { InternalServerError } from './error/errors';

export type ConfigArgDef<T extends ConfigArgType> = {
    type: T;
};

export type ConfigArgs<T extends ConfigArgType> = {
    [name: string]: ConfigArgDef<T>;
};

// TODO: replace with string options
export type StringOperator = 'startsWith' | 'endsWith' | 'contains' | 'doesNotContain';

// prettier-ignore
/**
 * Represents the ConfigArgs once they have been coerced into JavaScript values for use
 * in business logic.
 */
export type ConfigArgValues<T extends ConfigArgs<any>> = {
    [K in keyof T]: T[K] extends ConfigArgDef<'int' | 'float'>
        ? number
        : T[K] extends ConfigArgDef<'datetime'>
            ? Date
            : T[K] extends ConfigArgDef<'boolean'>
                ? boolean
                : T[K] extends ConfigArgDef<'facetValueIds'>
                    ? string[]
                    : T[K] extends ConfigArgDef<'stringOperator'>
                        ? StringOperator
                        : string
};

/**
 * Defines a ConfigurableOperation, which is a method which can be configured
 * by the Administrator via the Admin API.
 */
export interface ConfigurableOperationDef {
    code: string;
    args: ConfigArgs<any>;
    description: string;
}

/**
 * Convert a ConfigurableOperationDef into a ConfigurableOperation object, typically
 * so that it can be sent via the API.
 */
export function configurableDefToOperation(def: ConfigurableOperationDef): ConfigurableOperation {
    return {
        code: def.code,
        description: def.description,
        args: Object.entries(def.args).map(([name, arg]) => ({ name, type: arg.type })),
    };
}

/**
 * Coverts an array of ConfigArgs into a hash object:
 *
 * from:
 * [{ name: 'foo', type: 'string', value: 'bar'}]
 *
 * to:
 * { foo: 'bar' }
 **/
export function argsArrayToHash<T extends ConfigArgs<any>>(args: ConfigArg[]): ConfigArgValues<T> {
    const output: ConfigArgValues<T> = {} as any;
    for (const arg of args) {
        if (arg && arg.value != null) {
            output[arg.name as keyof ConfigArgValues<T>] = coerceValueToType<T>(arg);
        }
    }
    return output;
}

function coerceValueToType<T extends ConfigArgs<any>>(arg: ConfigArg): ConfigArgValues<T>[keyof T] {
    switch (arg.type as ConfigArgType) {
        case 'string':
        case 'stringOperator':
            return arg.value as any;
        case 'int':
            return Number.parseInt(arg.value || '', 10) as any;
        case 'datetime':
            return Date.parse(arg.value || '') as any;
        case 'boolean':
            return !!(arg.value && (arg.value.toLowerCase() === 'true' || arg.value === '1')) as any;
        case 'facetValueIds':
            try {
                return JSON.parse(arg.value as any);
            } catch (err) {
                throw new InternalServerError(err.message);
            }
        default:
            return (arg.value as string) as any;
    }
}
