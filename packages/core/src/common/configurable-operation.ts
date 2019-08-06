// prettier-ignore
import {
    ConfigArg,
    ConfigArgDefinition,
    ConfigurableOperationDefinition,
    LanguageCode,
    LocalizedString,
    Maybe,
    StringFieldOption,
} from '@vendure/common/lib/generated-types';
import { ConfigArgType } from '@vendure/common/lib/shared-types';
import { simpleDeepClone } from '@vendure/common/lib/simple-deep-clone';

import { RequestContext } from '../api/common/request-context';

import { DEFAULT_LANGUAGE_CODE } from './constants';
import { InternalServerError } from './error/errors';

export type LocalizedStringArray = Array<Omit<LocalizedString, '__typename'>>;

export interface ConfigArgCommonDef<T extends ConfigArgType> {
    type: T;
    label?: LocalizedStringArray;
    description?: LocalizedStringArray;
}

export type WithArgConfig<T> = {
    config?: T;
};

export type StringArgConfig = WithArgConfig<{
    options?: Maybe<StringFieldOption[]>;
}>;
export type IntArgConfig = WithArgConfig<{
    inputType?: 'default' | 'percentage' | 'money';
}>;

export type ConfigArgDef<T extends ConfigArgType> = T extends 'string'
    ? ConfigArgCommonDef<'string'> & StringArgConfig
    : T extends 'int'
    ? ConfigArgCommonDef<'int'> & IntArgConfig
    : ConfigArgCommonDef<T> & WithArgConfig<never>;

export type ConfigArgs<T extends ConfigArgType> = {
    [name: string]: ConfigArgDef<T>;
};

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
                        : string
};

/**
 * Defines a ConfigurableOperation, which is a method which can be configured
 * by the Administrator via the Admin API.
 */
export interface ConfigurableOperationDef {
    code: string;
    args: ConfigArgs<any>;
    description: LocalizedStringArray;
}

/**
 * Convert a ConfigurableOperationDef into a ConfigurableOperation object, typically
 * so that it can be sent via the API.
 */
export function configurableDefToOperation(
    ctx: RequestContext,
    def: ConfigurableOperationDef,
): ConfigurableOperationDefinition {
    return {
        code: def.code,
        description: localizeString(def.description, ctx.languageCode),
        args: Object.entries(def.args).map(
            ([name, arg]) =>
                ({
                    name,
                    type: arg.type,
                    config: localizeConfig(arg, ctx.languageCode),
                    label: arg.label && localizeString(arg.label, ctx.languageCode),
                    description: arg.description && localizeString(arg.description, ctx.languageCode),
                } as Required<ConfigArgDefinition>),
        ),
    };
}

function localizeConfig(
    arg: StringArgConfig | IntArgConfig | WithArgConfig<undefined>,
    languageCode: LanguageCode,
): any {
    const { config } = arg;
    if (!config) {
        return config;
    }
    const clone = simpleDeepClone(config);
    const options: Maybe<StringFieldOption[]> = (clone as any).options;
    if (options) {
        for (const option of options) {
            if (option.label) {
                (option as any).label = localizeString(option.label, languageCode);
            }
        }
    }
    return clone;
}

function localizeString(stringArray: LocalizedStringArray, languageCode: LanguageCode): string {
    let match = stringArray.find(x => x.languageCode === languageCode);
    if (!match) {
        match = stringArray.find(x => x.languageCode === DEFAULT_LANGUAGE_CODE);
    }
    if (!match) {
        match = stringArray[0];
    }
    return match.value;
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
