// tslint:disable:no-shadowed-variable
// prettier-ignore
import { LanguageCode, LocalizedString } from './generated-types';

/**
 * A recursive implementation of the Partial<T> type.
 * Source: https://stackoverflow.com/a/49936686/772859
 */
export type DeepPartial<T> = {
    [P in keyof T]?:
        | null
        | (T[P] extends Array<infer U>
              ? Array<DeepPartial<U>>
              : T[P] extends ReadonlyArray<infer U>
              ? ReadonlyArray<DeepPartial<U>>
              : DeepPartial<T[P]>);
};
// tslint:enable:no-shadowed-variable

// tslint:disable:ban-types
/**
 * A recursive implementation of Required<T>.
 * Source: https://github.com/microsoft/TypeScript/issues/15012#issuecomment-365453623
 */
export type DeepRequired<T, U extends object | undefined = undefined> = T extends object
    ? {
          [P in keyof T]-?: NonNullable<T[P]> extends NonNullable<U | Function | Type<any>>
              ? NonNullable<T[P]>
              : DeepRequired<NonNullable<T[P]>, U>;
      }
    : T;
// tslint:enable:ban-types

/**
 * A type representing the type rather than instance of a class.
 */
export interface Type<T> extends Function {
    // tslint:disable-next-line:callable-types
    new (...args: any[]): T;
}

export type Json = null | boolean | number | string | Json[] | { [prop: string]: Json };

/**
 * @description
 * A type representing JSON-compatible values.
 * From https://github.com/microsoft/TypeScript/issues/1897#issuecomment-580962081
 *
 * @docsCategory common
 */
export type JsonCompatible<T> = {
    [P in keyof T]: T[P] extends Json
        ? T[P]
        : Pick<T, P> extends Required<Pick<T, P>>
        ? never
        : JsonCompatible<T[P]>;
};

/**
 * A type describing the shape of a paginated list response
 */
export type PaginatedList<T> = {
    items: T[];
    totalItems: number;
};

/**
 * @description
 * An entity ID. Depending on the configured {@link EntityIdStrategy}, it will be either
 * a `string` or a `number`;
 *
 * @docsCategory common
 */
export type ID = string | number;

/**
 * @description
 * A data type for a custom field. The CustomFieldType determines the data types used in the generated
 * database columns and GraphQL fields as follows (key: m = MySQL, p = Postgres, s = SQLite):
 *
 * Type         | DB type                               | GraphQL type
 * -----        |---------                              |---------------
 * string       | varchar                               | String
 * localeString | varchar                               | String
 * text         | longtext(m), text(p,s)                | String
 * int          | int                                   | Int
 * float        | double precision                      | Float
 * boolean      | tinyint (m), bool (p), boolean (s)    | Boolean
 * datetime     | datetime (m,s), timestamp (p)         | DateTime
 * relation     | many-to-one / many-to-many relation   | As specified in config
 *
 * Additionally, the CustomFieldType also dictates which [configuration options](/docs/typescript-api/custom-fields/#configuration-options)
 * are available for that custom field.
 *
 * @docsCategory custom-fields
 */
export type CustomFieldType =
    | 'string'
    | 'localeString'
    | 'int'
    | 'float'
    | 'boolean'
    | 'datetime'
    | 'relation'
    | 'text';

/**
 * @description
 * Certain entities (those which implement {@link ConfigurableOperationDef}) allow arbitrary
 * configuration arguments to be specified which can then be set in the admin-ui and used in
 * the business logic of the app. These are the valid data types of such arguments.
 * The data type influences:
 *
 * 1. How the argument form field is rendered in the admin-ui
 * 2. The JavaScript type into which the value is coerced before being passed to the business logic.
 *
 * @docsCategory ConfigurableOperationDef
 */
export type ConfigArgType = 'string' | 'int' | 'float' | 'boolean' | 'datetime' | 'ID';

/**
 * @description
 * The ids of the default form input components that ship with the
 * Admin UI.
 *
 * @docsCategory ConfigurableOperationDef
 */
export type DefaultFormComponentId =
    | 'boolean-form-input'
    | 'currency-form-input'
    | 'date-form-input'
    | 'facet-value-form-input'
    | 'number-form-input'
    | 'select-form-input'
    | 'product-selector-form-input'
    | 'customer-group-form-input'
    | 'text-form-input'
    | 'textarea-form-input'
    | 'password-form-input'
    | 'relation-form-input';

/**
 * @description
 * Used to defined the expected arguments for a given default form input component.
 *
 * @docsCategory ConfigurableOperationDef
 */
type DefaultFormConfigHash = {
    'date-form-input': { min?: string; max?: string; yearRange?: number };
    'number-form-input': { min?: number; max?: number; step?: number; prefix?: string; suffix?: string };
    'select-form-input': {
        options?: Array<{ value: string; label?: Array<Omit<LocalizedString, '__typename'>> }>;
    };
    'boolean-form-input': {};
    'currency-form-input': {};
    'facet-value-form-input': {};
    'product-selector-form-input': {};
    'customer-group-form-input': {};
    'text-form-input': {};
    'textarea-form-input': {
        spellcheck?: boolean;
    };
    'password-form-input': {};
    'relation-form-input': {};
};

export type DefaultFormComponentConfig<T extends DefaultFormComponentId> = DefaultFormConfigHash[T];

export type CustomFieldsObject = { [key: string]: any };

/**
 * @description
 * This interface describes JSON config file (vendure-ui-config.json) used by the Admin UI.
 * The values are loaded at run-time by the Admin UI app, and allow core configuration to be
 * managed without the need to re-build the application.
 *
 * @docsCategory AdminUiPlugin
 */
export interface AdminUiConfig {
    /**
     * @description
     * The hostname of the Vendure server which the admin ui will be making API calls
     * to. If set to "auto", the Admin UI app will determine the hostname from the
     * current location (i.e. `window.location.hostname`).
     *
     * @default 'http://localhost'
     */
    apiHost: string | 'auto';
    /**
     * @description
     * The port of the Vendure server which the admin ui will be making API calls
     * to. If set to "auto", the Admin UI app will determine the port from the
     * current location (i.e. `window.location.port`).
     *
     * @default 3000
     */
    apiPort: number | 'auto';
    /**
     * @description
     * The path to the GraphQL Admin API.
     *
     * @default 'admin-api'
     */
    adminApiPath: string;
    /**
     * @description
     * Whether to use cookies or bearer tokens to track sessions.
     * Should match the setting of in the server's `tokenMethod` config
     * option.
     *
     * @default 'cookie'
     */
    tokenMethod: 'cookie' | 'bearer';
    /**
     * @description
     * The header used when using the 'bearer' auth method. Should match the
     * setting of the server's `authOptions.authTokenHeaderKey` config
     * option.
     *
     * @default 'vendure-auth-token'
     */
    authTokenHeaderKey: string;
    /**
     * @description
     * The default language for the Admin UI. Must be one of the
     * items specified in the `availableLanguages` property.
     *
     * @default LanguageCode.en
     */
    defaultLanguage: LanguageCode;
    /**
     * @description
     * An array of languages for which translations exist for the Admin UI.
     *
     * @default [LanguageCode.en, LanguageCode.es]
     */
    availableLanguages: LanguageCode[];
    /**
     * @description
     * If you are using an external {@link AuthenticationStrategy} for the Admin API, you can configure
     * a custom URL for the login page with this option. On logging out or redirecting an unauthenticated
     * user, the Admin UI app will redirect the user to this URL rather than the default username/password
     * screen.
     */
    loginUrl?: string;
    /**
     * @description
     * The custom brand name.
     */
    brand?: string;
    /**
     * @description
     * Option to hide vendure branding.
     *
     * @default false
     */
    hideVendureBranding?: boolean;
    /**
     * @description
     * Option to hide version.
     *
     * @default false
     */
    hideVersion?: boolean;
}

/**
 * @description
 * Configures the path to a custom-build of the Admin UI app.
 *
 * @docsCategory common
 */
export interface AdminUiAppConfig {
    /**
     * @description
     * The path to the compiled admin ui app files. If not specified, an internal
     * default build is used. This path should contain the `vendure-ui-config.json` file,
     * index.html, the compiled js bundles etc.
     */
    path: string;
    /**
     * @description
     * Specifies the url route to the Admin UI app.
     *
     * @default 'admin'
     */
    route?: string;
    /**
     * @description
     * The function which will be invoked to start the app compilation process.
     */
    compile?: () => Promise<void>;
}

/**
 * @description
 * Information about the Admin UI app dev server.
 *
 * @docsCategory common
 */
export interface AdminUiAppDevModeConfig {
    /**
     * @description
     * The path to the uncompiled ui app source files. This path should contain the `vendure-ui-config.json` file.
     */
    sourcePath: string;
    /**
     * @description
     * The port on which the dev server is listening. Overrides the value set by `AdminUiOptions.port`.
     */
    port: number;
    /**
     * @description
     * Specifies the url route to the Admin UI app.
     *
     * @default 'admin'
     */
    route?: string;
    /**
     * @description
     * The function which will be invoked to start the app compilation process.
     */
    compile: () => Promise<void>;
}
