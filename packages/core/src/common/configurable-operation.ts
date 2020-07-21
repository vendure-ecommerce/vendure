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
import { Injector } from './injector';
import { InjectableStrategy } from './types/injectable-strategy';

/**
 * @description
 * An array of string values in a given {@link LanguageCode}, used to define human-readable string values.
 *
 * @example
 * ```TypeScript
 * const title: LocalizedStringArray = [
 *   { languageCode: LanguageCode.en, value: 'English Title' },
 *   { languageCode: LanguageCode.de, value: 'German Title' },
 *   { languageCode: LanguageCode.zh, value: 'Chinese Title' },
 * ]
 * ```
 *
 * @docsCategory common
 * @docsPage Configurable Operations
 */
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

/**
 * @description
 * A object which defines the configurable arguments which may be passed to
 * functions in those classes which implement the {@link ConfigurableOperationDef} interface.
 *
 * @example
 * ```TypeScript
 * {
 *   operator: {
 *     type: 'string',
 *     config: {
 *       options: [
 *         { value: 'startsWith' },
 *         { value: 'endsWith' },
 *         { value: 'contains' },
 *         { value: 'doesNotContain' },
 *       ],
 *     },
 *   },
 *   term: { type: 'string' },
 * }
 * ```
 *
 * @docsCategory common
 * @docsPage Configurable Operations
 */
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
 * @description
 * Common configuration options used when creating a new instance of a
 * {@link ConfigurableOperationDef}.
 *
 * @docsCategory common
 * @docsPage Configurable Operations
 */
export interface ConfigurableOperationDefOptions<T extends ConfigArgs<ConfigArgType>>
    extends InjectableStrategy {
    /**
     * @description
     * A unique code used to identify this operation.
     */
    code: string;
    /**
     * @description
     * Optional provider-specific arguments which, when specified, are
     * editable in the admin-ui. For example, args could be used to store an API key
     * for a payment provider service.
     *
     * @example
     * ```ts
     * args: {
     *   apiKey: { type: 'string' },
     * }
     * ```
     *
     * See {@link ConfigArgs} for available configuration options.
     */
    args: T;
    /**
     * @description
     * A human-readable description for the operation method.
     */
    description: LocalizedStringArray;
}

/**
 * @description
 * Defines a ConfigurableOperation, which is a method which can be configured
 * by the Administrator via the Admin API.
 *
 * @docsCategory common
 * @docsPage Configurable Operations
 */
export class ConfigurableOperationDef<T extends ConfigArgs<ConfigArgType>> {
    get code(): string {
        return this.options.code;
    }
    get args(): T {
        return this.options.args;
    }
    get description(): LocalizedStringArray {
        return this.options.description;
    }
    constructor(protected options: ConfigurableOperationDefOptions<T>) {}

    async init(injector: Injector) {
        if (typeof this.options.init === 'function') {
            await this.options.init(injector);
        }
    }
    async destroy() {
        if (typeof this.options.destroy === 'function') {
            await this.options.destroy();
        }
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
    protected argsArrayToHash(args: ConfigArg[]): ConfigArgValues<T> {
        const output: ConfigArgValues<T> = {} as any;
        for (const arg of args) {
            if (arg && arg.value != null) {
                output[arg.name as keyof ConfigArgValues<T>] = coerceValueToType<T>(
                    arg.value,
                    this.args[arg.name],
                );
            }
        }
        return output;
    }
}

/**
 * Convert a ConfigurableOperationDef into a ConfigurableOperation object, typically
 * so that it can be sent via the API.
 */
export function configurableDefToOperation(
    ctx: RequestContext,
    def: ConfigurableOperationDef<ConfigArgs<any>>,
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

function coerceValueToType<T extends ConfigArgs<any>>(
    value: string,
    argDef: ConfigArgDef<any>,
): ConfigArgValues<T>[keyof T] {
    switch (argDef.type as ConfigArgType) {
        case 'string':
            return value as any;
        case 'int':
            return Number.parseInt(value || '', 10) as any;
        case 'datetime':
            return Date.parse(value || '') as any;
        case 'boolean':
            return !!(value && (value.toLowerCase() === 'true' || value === '1')) as any;
        case 'facetValueIds':
            try {
                return JSON.parse(value as any);
            } catch (err) {
                throw new InternalServerError(err.message);
            }
        default:
            return (value as string) as any;
    }
}
