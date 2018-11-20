import { ConfigArg } from 'shared/generated-types';

/**
 * Certain entities allow arbitrary configuration arguments to be specified which can then
 * be set in the admin-ui and used in the business logic of the app. These are the valid
 * data types of such arguments. The data type influences:
 * 1. How the argument form field is rendered in the admin-ui
 * 2. The JavaScript type into which the value is coerced before being passed to the business logic.
 */
export type ConfigArgType = 'percentage' | 'money' | 'int' | 'string' | 'datetime' | 'boolean';

export type ConfigArgs<T extends ConfigArgType> = {
    [name: string]: T;
};

// prettier-ignore
/**
 * Represents the ConfigArgs once they have been coerced into JavaScript values for use
 * in business logic.
 */
export type ConfigArgValues<T extends ConfigArgs<any>> = {
    [K in keyof T]: T[K] extends 'int' | 'money' | 'percentage'
        ? number
        : T[K] extends 'datetime' ? Date : T[K] extends 'boolean' ? boolean : string
};

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
        default:
            return (arg.value as string) as any;
    }
}
