// prettier-ignore
import { ConfigArg, ConfigurableOperation } from '../../../shared/generated-types';

import { InternalServerError } from './error/errors';

/**
 * Certain entities allow arbitrary configuration arguments to be specified which can then
 * be set in the admin-ui and used in the business logic of the app. These are the valid
 * data types of such arguments. The data type influences:
 * 1. How the argument form field is rendered in the admin-ui
 * 2. The JavaScript type into which the value is coerced before being passed to the business logic.
 */
export type ConfigArgType =
    | 'percentage'
    | 'money'
    | 'int'
    | 'string'
    | 'datetime'
    | 'boolean'
    | 'facetValueIds';

export type ConfigArgs<T extends ConfigArgType> = {
    [name: string]: T;
};

/**
 * Represents the ConfigArgs once they have been coerced into JavaScript values for use
 * in business logic.
 */
export type ConfigArgValues<T extends ConfigArgs<any>> = {
    [K in keyof T]: T[K] extends 'int' | 'money' | 'percentage'
        ? number
        : T[K] extends 'datetime'
        ? Date
        : T[K] extends 'boolean'
        ? boolean
        : T[K] extends 'facetValueIds'
        ? string[]
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
        args: Object.entries(def.args).map(([name, type]) => ({ name, type })),
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
export function argsArrayToHash<T>(args: ConfigArg[]): ConfigArgValues<T> {
    const output: ConfigArgValues<T> = {} as any;
    for (const arg of args) {
        if (arg.value != null) {
            output[arg.name] = coerceValueToType<T>(arg);
        }
    }
    return output;
}

function coerceValueToType<T>(arg: ConfigArg): ConfigArgValues<T>[keyof T] {
    switch (arg.type as ConfigArgType) {
        case 'int':
        case 'money':
            return Number.parseInt(arg.value || '', 10) as any;
        case 'datetime':
            return Date.parse(arg.value || '') as any;
        case 'boolean':
            return !!arg.value as any;
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
