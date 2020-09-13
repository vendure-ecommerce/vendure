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
import { ConfigArgType, DefaultFormComponentConfig, ID } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';

import { RequestContext } from '../api/common/request-context';

import { DEFAULT_LANGUAGE_CODE } from './constants';
import { InternalServerError } from './error/errors';
import { Injector } from './injector';
import { InjectableStrategy } from './types/injectable-strategy';

/**
 * @description
 * An array of string values in a given {@link LanguageCode}, used to define human-readable string values.
 * The `ui` property can be used in conjunction with the Vendure Admin UI to specify a custom form input
 * component.
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
 * @docsCategory ConfigurableOperationDef
 */
export type LocalizedStringArray = Array<Omit<LocalizedString, '__typename'>>;

export type UiComponentConfig =
    | ({ component: 'number-form-input' } & DefaultFormComponentConfig<'number-form-input'>)
    | ({ component: 'date-form-input' } & DefaultFormComponentConfig<'date-form-input'>)
    | ({ component: 'select-form-input' } & DefaultFormComponentConfig<'select-form-input'>)
    | ({ component: 'text-form-input' } & DefaultFormComponentConfig<'text-form-input'>)
    | ({ component: 'boolean-form-input' } & DefaultFormComponentConfig<'boolean-form-input'>)
    | ({ component: 'currency-form-input' } & DefaultFormComponentConfig<'currency-form-input'>)
    | ({ component: 'facet-value-form-input' } & DefaultFormComponentConfig<'facet-value-form-input'>)
    | ({ component: 'product-selector-form-input' } & DefaultFormComponentConfig<
          'product-selector-form-input'
      >)
    | ({ component: 'customer-group-form-input' } & DefaultFormComponentConfig<'customer-group-form-input'>)
    | { component: string; [prop: string]: any };

export interface ConfigArgCommonDef<T extends ConfigArgType> {
    type: T;
    list?: boolean;
    label?: LocalizedStringArray;
    description?: LocalizedStringArray;
    ui?: UiComponentConfig;
}

export type ConfigArgListDef<
    T extends ConfigArgType,
    C extends ConfigArgCommonDef<T> = ConfigArgCommonDef<T>
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
    ? ConfigArgCommonDef<'string'> & StringArgConfig
    : T extends 'int'
    ? ConfigArgCommonDef<'int'> & IntArgConfig
    : ConfigArgCommonDef<T> & WithArgConfig<never>;

/**
 * @description
 * A object which defines the configurable arguments which may be passed to
 * functions in those classes which implement the {@link ConfigurableOperationDef} interface.
 *
 * ## Data types
 * Each argument has a data type, which must be one of {@link ConfigArgType}.
 *
 * @example
 * ```TypeScript
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
 * ```TypeScript
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
 * ```TypeScript
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
export type ConfigArgs = {
    [name: string]: ConfigArgDef<ConfigArgType>;
};

/**
 * Represents the ConfigArgs once they have been coerced into JavaScript values for use
 * in business logic.
 */
export type ConfigArgValues<T extends ConfigArgs> = {
    [K in keyof T]: T[K] extends ConfigArgListDef<'int' | 'float'>
        ? number[]
        : T[K] extends ConfigArgDef<'int' | 'float'>
        ? number
        : T[K] extends ConfigArgListDef<'datetime'>
        ? Date[]
        : T[K] extends ConfigArgDef<'datetime'>
        ? Date
        : T[K] extends ConfigArgListDef<'boolean'>
        ? boolean[]
        : T[K] extends ConfigArgDef<'boolean'>
        ? boolean
        : T[K] extends ConfigArgListDef<'ID'>
        ? ID[]
        : T[K] extends ConfigArgDef<'ID'>
        ? ID
        : T[K] extends ConfigArgListDef<'string'>
        ? string[]
        : string;
};

/**
 * @description
 * Common configuration options used when creating a new instance of a
 * {@link ConfigurableOperationDef} (
 *
 * @docsCategory ConfigurableOperationDef
 */
export interface ConfigurableOperationDefOptions<T extends ConfigArgs> extends InjectableStrategy {
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
 * A ConfigurableOperationDef is a special type of object used extensively by Vendure to define
 * code blocks which have arguments which are configurable at run-time by the administrator.
 *
 * This is the mechanism used by:
 *
 * * {@link CollectionFilter}
 * * {@link PaymentMethodHandler}
 * * {@link PromotionAction}
 * * {@link PromotionCondition}
 * * {@link ShippingCalculator}
 * * {@link ShippingEligibilityChecker}
 *
 * Any class which extends ConfigurableOperationDef works in the same way: it takes a
 * config object as the constructor argument. That config object extends the {@link ConfigurableOperationDefOptions}
 * interface and typically adds some kind of business logic function to it.
 *
 * For example, in the case of `ShippingEligibilityChecker`,
 * it adds the `check()` function to the config object which defines the logic for checking whether an Order is eligible
 * for a particular ShippingMethod.
 *
 * ## The `args` property
 *
 * The key feature of the ConfigurableOperationDef is the `args` property. This is where we define those
 * arguments that are exposed via the Admin UI as data input components. This allows their values to
 * be set at run-time by the Administrator. Those values can then be accessed in the business logic
 * of the operation.
 *
 * The data type of the args can be one of {@link ConfigArgType}, and the configuration is further explained in
 * the docs of {@link ConfigArgs}.
 *
 * ## Dependency Injection
 * If your business logic relies on injectable providers, such as the TypeORM `Connection` object, or any of the
 * internal Vendure services or those defined in a plugin, you can inject them by using the config object's
 * `init()` method, which exposes the {@link Injector}.
 *
 * Here's an example of a ShippingCalculator that injects a service which has been defined in a plugin:
 *
 * @example
 * ```TypeScript
 * import { Injector, ShippingCalculator } from '\@vendure/core';
 * import { ShippingRatesService } from './shipping-rates.service';
 *
 * // We keep reference to our injected service by keeping it
 * // in the top-level scope of the file.
 * let shippingRatesService: ShippingRatesService;
 *
 * export const customShippingCalculator = new ShippingCalculator({
 *   code: 'custom-shipping-calculator',
 *   description: [],
 *   args: {},
 *
 *   init(injector: Injector) {
 *     // The init function is called during bootstrap, and allows
 *     // us to inject any providers we need.
 *     shippingRatesService = injector.get(ShippingRatesService);
 *   },
 *
 *   calculate: async (order, args) => {
 *     // We can now use the injected provider in the business logic.
 *     const { price, priceWithTax } = await shippingRatesService.getRate({
 *       destination: order.shippingAddress,
 *       contents: order.lines,
 *     });
 *
 *     return {
 *       price,
 *       priceWithTax,
 *     };
 *   },
 * });
 * ```
 *
 * @docsCategory ConfigurableOperationDef
 */
export class ConfigurableOperationDef<T extends ConfigArgs = ConfigArgs> {
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
     * @description
     * Convert a ConfigurableOperationDef into a ConfigurableOperationDefinition object, typically
     * so that it can be sent via the API.
     */
    toGraphQlType(ctx: RequestContext): ConfigurableOperationDefinition {
        return {
            code: this.code,
            description: localizeString(this.description, ctx.languageCode),
            args: Object.entries(this.args).map(
                ([name, arg]) =>
                    ({
                        name,
                        type: arg.type,
                        list: arg.list ?? false,
                        ui: arg.ui,
                        label: arg.label && localizeString(arg.label, ctx.languageCode),
                        description: arg.description && localizeString(arg.description, ctx.languageCode),
                    } as Required<ConfigArgDefinition>),
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
    protected argsArrayToHash(args: ConfigArg[]): ConfigArgValues<T> {
        const output: ConfigArgValues<T> = {} as any;
        for (const arg of args) {
            if (arg && arg.value != null) {
                output[arg.name as keyof ConfigArgValues<T>] = coerceValueToType<T>(
                    arg.value,
                    this.args[arg.name].type,
                    this.args[arg.name].list || false,
                );
            }
        }
        return output;
    }
}

function localizeString(stringArray: LocalizedStringArray, languageCode: LanguageCode): string {
    let match = stringArray.find((x) => x.languageCode === languageCode);
    if (!match) {
        match = stringArray.find((x) => x.languageCode === DEFAULT_LANGUAGE_CODE);
    }
    if (!match) {
        match = stringArray[0];
    }
    return match.value;
}

function coerceValueToType<T extends ConfigArgs>(
    value: string,
    type: ConfigArgType,
    isList: boolean,
): ConfigArgValues<T>[keyof T] {
    if (isList) {
        try {
            return (JSON.parse(value) as string[]).map((v) => coerceValueToType(v, type, false)) as any;
        } catch (err) {
            throw new InternalServerError(err.message);
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
