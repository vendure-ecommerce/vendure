import {
    EmailEventConfigArg,
    LanguageCode,
    LocalizedString,
    Maybe,
    StringFieldOption,
} from '@vendure/common/lib/generated-types';
import { ConfigArgType, ID, UiComponentConfig } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';
import { InternalServerError, RequestContext } from '@vendure/core';
import { DEFAULT_LANGUAGE_CODE } from '@vendure/core/src/common/constants';

import {
    EmailEventConfigArgDefinition,
    EmailEventConfigurableOperationDefinition,
} from './graphql/generated-admin-types';

/**
 * @description
 * An array of string values in a given {@link LanguageCode}, used to define human-readable string values.
 * The `ui` property can be used in conjunction with the Vendure Admin UI to specify a custom form input
 * component.
 *
 * @example
 * ```ts
 * const title: LocalizedStringArray = [
 *   { languageCode: LanguageCode.en, value: 'English Title' },
 *   { languageCode: LanguageCode.de, value: 'German Title' },
 *   { languageCode: LanguageCode.zh, value: 'Chinese Title' },
 * ]
 * ```
 *
 * @docsCategory ConfigurableOperationDef
 */
export type LocalizedStringArray = Array<Omit<LocalizedString, '__typename'>>;

export interface EmailEventConfigArgCommonDef<T extends ConfigArgType> {
    type: T;
    required?: boolean;
    defaultValue?: ConfigArgTypeToTsType<T>;
    list?: boolean;
    label?: LocalizedStringArray;
    description?: LocalizedStringArray;
    ui?: UiComponentConfig<string>;
}

export type ConfigArgListDef<
    T extends ConfigArgType,
    C extends EmailEventConfigArgCommonDef<T> = EmailEventConfigArgCommonDef<T>,
> = C & { list: true };

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
    ? EmailEventConfigArgCommonDef<'string'> & StringArgConfig
    : T extends 'int'
      ? EmailEventConfigArgCommonDef<'int'> & IntArgConfig
      : EmailEventConfigArgCommonDef<T> & WithArgConfig<never>;

/**
 * @description
 * A object which defines the configurable arguments which may be passed to
 * functions in those classes which implement the {@link EmailEventConfigurableOperationDef} interface.
 *
 * ## Data types
 * Each argument has a data type, which must be one of {@link ConfigArgType}.
 *
 * @example
 * ```ts
 * {
 *   apiKey: { type: 'string' },
 *   maxRetries: { type: 'int' },
 *   logErrors: { type: 'boolean' },
 * }
 * ```
 *
 * ## Lists
 * Setting the `list` property to `true` will make the argument into an array of the specified
 * data type. For example, if you want to store an array of strings:
 *
 * @example
 * ```ts
 * {
 *   aliases: {
 *     type: 'string',
 *     list: true,
 *   },
 * }
 *```
 * In the Admin UI, this will be rendered as an orderable list of string inputs.
 *
 * ## UI Component
 * The `ui` field allows you to specify a specific input component to be used in the Admin UI.
 * When not set, a default input component is used appropriate to the data type.
 *
 * @example
 * ```ts
 * {
 *   operator: {
 *     type: 'string',
 *     ui: {
 *       component: 'select-form-input',
 *       options: [
 *         { value: 'startsWith' },
 *         { value: 'endsWith' },
 *         { value: 'contains' },
 *         { value: 'doesNotContain' },
 *       ],
 *     },
 *   },
 *   secretKey: {
 *     type: 'string',
 *     ui: { component: 'password-form-input' },
 *   },
 * }
 * ```
 * The available components as well as their configuration options can be found in the {@link DefaultFormConfigHash} docs.
 * Custom UI components may also be defined via an Admin UI extension using the `registerFormInputComponent()` function
 * which is exported from `@vendure/admin-ui/core`.
 *
 * @docsCategory ConfigurableOperationDef
 */
export type EmailEventConfigArgs = {
    [name: string]: ConfigArgDef<ConfigArgType>;
};

/**
 * Represents the ConfigArgs once they have been coerced into JavaScript values for use
 * in business logic.
 */
export type EmailEventConfigArgValues<T extends EmailEventConfigArgs> = {
    [K in keyof T]: ConfigArgDefToType<T[K]>;
};

/**
 * Converts a ConfigArgDef to a TS type, e.g:
 *
 * ConfigArgListDef<'datetime'> -> Date[]
 * ConfigArgDef<'boolean'> -> boolean
 */
export type ConfigArgDefToType<D extends ConfigArgDef<ConfigArgType>> =
    D extends ConfigArgListDef<'int' | 'float'>
        ? number[]
        : D extends ConfigArgDef<'int' | 'float'>
          ? number
          : D extends ConfigArgListDef<'datetime'>
            ? Date[]
            : D extends ConfigArgDef<'datetime'>
              ? Date
              : D extends ConfigArgListDef<'boolean'>
                ? boolean[]
                : D extends ConfigArgDef<'boolean'>
                  ? boolean
                  : D extends ConfigArgListDef<'ID'>
                    ? ID[]
                    : D extends ConfigArgDef<'ID'>
                      ? ID
                      : D extends ConfigArgListDef<'string'>
                        ? string[]
                        : string;

/**
 * Converts a ConfigArgType to a TypeScript type
 *
 * ConfigArgTypeToTsType<'int'> -> number
 */
export type ConfigArgTypeToTsType<T extends ConfigArgType> = T extends 'string'
    ? string
    : T extends 'int'
      ? number
      : T extends 'float'
        ? number
        : T extends 'boolean'
          ? boolean
          : T extends 'datetime'
            ? Date
            : ID;

/**
 * Converts a TS type to a ConfigArgDef, e.g:
 *
 * Date[] -> ConfigArgListDef<'datetime'>
 * boolean -> ConfigArgDef<'boolean'>
 */
export type TypeToConfigArgDef<T extends ConfigArgDefToType<any>> = T extends number
    ? ConfigArgDef<'int' | 'float'>
    : T extends number[]
      ? ConfigArgListDef<'int' | 'float'>
      : T extends Date[]
        ? ConfigArgListDef<'datetime'>
        : T extends Date
          ? ConfigArgDef<'datetime'>
          : T extends boolean[]
            ? ConfigArgListDef<'boolean'>
            : T extends boolean
              ? ConfigArgDef<'boolean'>
              : T extends string[]
                ? ConfigArgListDef<'string'>
                : T extends string
                  ? ConfigArgDef<'string'>
                  : T extends ID[]
                    ? ConfigArgListDef<'ID'>
                    : ConfigArgDef<'ID'>;

/**
 * @description
 * Common configuration options used when creating a new instance of a
 * {@link EmailEventConfigurableOperationDef}
 *
 * @docsCategory ConfigurableOperationDef
 */
export interface EmailEventConfigurableOperationDefOptions<T extends EmailEventConfigArgs> {
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
     * See {@link EmailEventConfigArgs} for available configuration options.
     */
    args: T;
    /**
     * @description
     * A human-readable description for the operation method.
     */
    description: LocalizedStringArray;
}

export class EmailEventConfigurableOperationDef<T extends EmailEventConfigArgs = EmailEventConfigArgs> {
    get args(): T {
        return this.options.args;
    }

    get description(): LocalizedStringArray {
        return this.options.description;
    }

    constructor(protected options: EmailEventConfigurableOperationDefOptions<T>) {}

    /**
     * @description
     * Convert a ConfigurableOperationDef into a ConfigurableOperationDefinition object, typically
     * so that it can be sent via the API.
     */
    toGraphQlType(ctx: RequestContext): EmailEventConfigurableOperationDefinition {
        return {
            description: localizeString(this.description, ctx.languageCode, ctx.channel.defaultLanguageCode),
            args: Object.entries(this.args).map(
                ([name, arg]) =>
                    ({
                        name,
                        type: arg.type,
                        list: arg.list ?? false,
                        required: arg.required ?? true,
                        defaultValue: arg.defaultValue,
                        ui: arg.ui,
                        label:
                            arg.label &&
                            localizeString(arg.label, ctx.languageCode, ctx.channel.defaultLanguageCode),
                        description:
                            arg.description &&
                            localizeString(
                                arg.description,
                                ctx.languageCode,
                                ctx.channel.defaultLanguageCode,
                            ),
                    }) as Required<EmailEventConfigArgDefinition>,
            ),
        };
    }

    /**
     * @description
     * Coverts an array of ConfigArgs into a hash object:
     *
     * from:
     * `[{ name: 'foo', type: 'string', value: 'bar'}]`
     *
     * to:
     * `{ foo: 'bar' }`
     **/
    protected argsArrayToHash(args: EmailEventConfigArg[]): EmailEventConfigArgValues<T> {
        const output: EmailEventConfigArgValues<T> = {} as any;
        for (const arg of args) {
            if (arg && arg.value != null && this.args[arg.name] != null) {
                output[arg.name as keyof EmailEventConfigArgValues<T>] = coerceValueToType<T>(
                    arg.value,
                    this.args[arg.name].type,
                    this.args[arg.name].list || false,
                );
            }
        }
        return output;
    }
}

function localizeString(
    stringArray: LocalizedStringArray,
    languageCode: LanguageCode,
    channelLanguageCode: LanguageCode,
): string {
    let match = stringArray.find(x => x.languageCode === languageCode);
    if (!match) {
        match = stringArray.find(x => x.languageCode === channelLanguageCode);
    }
    if (!match) {
        match = stringArray.find(x => x.languageCode === DEFAULT_LANGUAGE_CODE);
    }
    if (!match) {
        match = stringArray[0];
    }
    return match.value;
}

function coerceValueToType<T extends EmailEventConfigArgs>(
    value: string,
    type: ConfigArgType,
    isList: boolean,
): EmailEventConfigArgValues<T>[keyof T] {
    if (isList) {
        try {
            return (JSON.parse(value) as string[]).map(v => coerceValueToType(v, type, false)) as any;
        } catch (err: any) {
            throw new InternalServerError(
                `Could not parse list value "${value}": ` + JSON.stringify(err.message),
            );
        }
    }
    switch (type) {
        case 'string':
            return value as any;
        case 'int':
            return Number.parseInt(value || '', 10) as any;
        case 'float':
            return Number.parseFloat(value || '') as any;
        case 'datetime':
            return Date.parse(value || '') as any;
        case 'boolean':
            return !!(value && (value.toLowerCase() === 'true' || value === '1')) as any;
        case 'ID':
            return value as any;
        default:
            assertNever(type);
    }
}
