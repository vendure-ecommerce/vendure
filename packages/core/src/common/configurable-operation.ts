// prettier-ignore
import { ConfigArg, ConfigArgType, ConfigurableOperation } from '@vendure/common/generated-types';

import { InternalServerError } from './error/errors';

export type ConfigArgs<T extends ConfigArgType> = {
    [name: string]: T;
};

/**
 * Represents the ConfigArgs once they have been coerced into JavaScript values for use
 * in business logic.
 */
export type ConfigArgValues<T extends ConfigArgs<any>> = {
    [K in keyof T]: T[K] extends ConfigArgType.INT | ConfigArgType.MONEY | ConfigArgType.PERCENTAGE
        ? number
        : T[K] extends ConfigArgType.DATETIME
        ? Date
        : T[K] extends ConfigArgType.BOOLEAN
        ? boolean
        : T[K] extends ConfigArgType.FACET_VALUE_IDS
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
        case ConfigArgType.STRING:
            return arg.value as any;
        case ConfigArgType.INT:
        case ConfigArgType.MONEY:
            return Number.parseInt(arg.value || '', 10) as any;
        case ConfigArgType.DATETIME:
            return Date.parse(arg.value || '') as any;
        case ConfigArgType.BOOLEAN:
            return !!arg.value as any;
        case ConfigArgType.PERCENTAGE:
            return arg.value as any;
        case ConfigArgType.FACET_VALUE_IDS:
            try {
                return JSON.parse(arg.value as any);
            } catch (err) {
                throw new InternalServerError(err.message);
            }
        default:
            return (arg.value as string) as any;
    }
}
