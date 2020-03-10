// tslint:disable:no-shadowed-variable
// prettier-ignore
/**
 * A recursive implementation of the Partial<T> type.
 * Source: https://stackoverflow.com/a/49936686/772859
 */
export type DeepPartial<T> = {
    [P in keyof T]?: null | (T[P] extends Array<infer U>
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
 * A data type for a custom field.
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
}

/**
 * @description
 * Configures the path to a custom-build of the Admin UI app.
 *
 * @docsCategory common
 */
export interface AdminUiApp {
    /**
     * @description
     * The path to the compiled admin ui app files. If not specified, an internal
     * default build is used. This path should contain the `vendure-ui-config.json` file,
     * index.html, the compiled js bundles etc.
     */
    path: string;
    compile?: () => Promise<void>;
}

/**
 * @description
 * Information about the Admin UI app dev server.
 *
 * @docsCategory common
 */
export interface AdminUiAppDevMode {
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
    compile: () => Promise<void>;
    /**
     * @description
     * If this function is specified, it will be invoked when the plugin closes. Intended for
     * ensuring the dev server is shut down as part of the AdminUiPlugin lifecycle.
     */
    onClose?: () => void | Promise<void>;
}

/**
 * @description
 * Defines extensions to the Admin UI application by specifying additional
 * Angular [NgModules](https://angular.io/guide/ngmodules) which are compiled
 * into the application.
 *
 * See [Extending the Admin UI](/docs/developer-guide/plugins/extending-the-admin-ui/) for
 * detailed instructions.
 *
 * @docsCategory AdminUiPlugin
 */
export interface AdminUiExtension {
    /**
     * @description
     * An optional ID for the extension module. Only used internally for generating
     * import paths to your module. If not specified, a unique hash will be used as the id.
     */
    id?: string;

    /**
     * @description
     * The path to the directory containing the extension module(s). The entire contents of this directory
     * will be copied into the Admin UI app, including all TypeScript source files, html templates,
     * scss style sheets etc.
     */
    extensionPath: string;
    /**
     * @description
     * One or more Angular modules which extend the default Admin UI.
     */
    ngModules: Array<AdminUiExtensionSharedModule | AdminUiExtensionLazyModule>;

    /**
     * @description
     * Optional array of paths to static assets which will be copied over to the Admin UI app's `/static`
     * directory.
     */
    staticAssets?: string[];
}

/**
 * @description
 * Configuration defining a single NgModule with which to extend the Admin UI.
 *
 * @docsCategory AdminUiPlugin
 */
export interface AdminUiExtensionSharedModule {
    /**
     * @description
     * Shared modules are directly imported into the main AppModule of the Admin UI
     * and should be used to declare custom form components and define custom
     * navigation items.
     */
    type: 'shared';
    /**
     * @description
     * The name of the file containing the extension module class.
     */
    ngModuleFileName: string;
    /**
     * @description
     * The name of the extension module class.
     */
    ngModuleName: string;
}

/**
 * @description
 * Configuration defining a single NgModule with which to extend the Admin UI.
 *
 * @docsCategory AdminUiPlugin
 */
export interface AdminUiExtensionLazyModule {
    /**
     * @description
     * Lazy modules are lazy-loaded at the `/extensions/` route and should be used for
     * modules which define new views for the Admin UI.
     */
    type: 'lazy';
    /**
     * @description
     * The route specifies the route at which the module will be lazy-loaded. E.g. a value
     * of `'foo'` will cause the module to lazy-load when the `/extensions/foo` route
     * is activated.
     */
    route: string;
    /**
     * @description
     * The name of the file containing the extension module class.
     */
    ngModuleFileName: string;
    /**
     * @description
     * The name of the extension module class.
     */
    ngModuleName: string;
}
