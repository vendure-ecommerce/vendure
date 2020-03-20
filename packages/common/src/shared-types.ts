// tslint:disable:no-shadowed-variable
// prettier-ignore
import { LanguageCode } from './generated-types';

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
              : DeepPartial<T[P]>)
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
              : DeepRequired<NonNullable<T[P]>, U>
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
 * int          | int                                   | Int
 * float        | double precision                      | Float
 * boolean      | tinyint (m), bool (p), boolean (s)    | Boolean
 * datetime     | datetime (m,s), timestamp (p)         | DateTime
 *
 * Additionally, the CustomFieldType also dictates which [configuration options](/docs/typescript-api/custom-fields/#configuration-options)
 * are available for that custom field.
 *
 * @docsCategory custom-fields
 */
export type CustomFieldType = 'string' | 'localeString' | 'int' | 'float' | 'boolean' | 'datetime';

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
 * @docsCategory common
 * @docsPage Configurable Operations
 */
export type ConfigArgType = 'string' | 'int' | 'float' | 'boolean' | 'datetime' | 'facetValueIds';

export type ConfigArgSubset<T extends ConfigArgType> = T;

export type CustomFieldsObject = { [key: string]: any };

/**
 * This interface describes the shape of the JSON config file used by the Admin UI.
 */
export interface AdminUiConfig {
    apiHost: string | 'auto';
    apiPort: number | 'auto';
    adminApiPath: string;
    tokenMethod: 'cookie' | 'bearer';
    authTokenHeaderKey: string;
    defaultLanguage: LanguageCode;
    availableLanguages: LanguageCode[];
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
     * The function which will be invoked to start the app compilation process.
     */
    compile: () => Promise<void>;
}
