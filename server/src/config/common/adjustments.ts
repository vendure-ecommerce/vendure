import { AdjustmentArg } from 'shared/generated-types';

export type ValidArgTypes = 'percentage' | 'money' | 'int' | 'string' | 'datetime' | 'boolean';

export type AdjustmentArgs<T extends ValidArgTypes> = {
    [name: string]: T;
};

export type ArgumentValues<T extends AdjustmentArgs<any>> = {
    [K in keyof T]: T[K] extends 'int' | 'money' | 'percentage'
        ? number
        : T[K] extends 'datetime' ? Date : T[K] extends 'boolean' ? boolean : string
};

export function argsArrayToHash<T>(args: AdjustmentArg[]): ArgumentValues<T> {
    const output: ArgumentValues<T> = {} as any;
    for (const arg of args) {
        if (arg.value != null) {
            output[arg.name] = coerceValueToType<T>(arg);
        }
    }
    return output;
}

function coerceValueToType<T>(arg: AdjustmentArg): ArgumentValues<T>[keyof T] {
    switch (arg.type as ValidArgTypes) {
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
