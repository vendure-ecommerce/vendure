import { LanguageCode } from '@vendure/common/lib/generated-types';

export type Extension =
    | AdminUiExtension
    | TranslationExtension
    | StaticAssetExtension
    | GlobalStylesExtension;

/**
 * @description
 * Defines extensions to the Admin UI translations. Can be used as a stand-alone extension definition which only adds translations
 * without adding new UI functionality, or as part of a full {@link AdminUiExtension}.
 *
 * @docsCategory UiDevkit
 * @docsPage AdminUiExtension
 */
export interface TranslationExtension {
    /**
     * @description
     * Optional object defining any translation files for the Admin UI. The value should be an object with
     * the key as a 2-character [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes),
     * and the value being a [glob](https://github.com/isaacs/node-glob) for any relevant
     * translation files in JSON format.
     *
     * @example
     * ```TypeScript
     * translations: {
     *   en: path.join(__dirname, 'translations/*.en.json'),
     *   de: path.join(__dirname, 'translations/*.de.json'),
     * }
     * ```
     */
    translations: { [languageCode in LanguageCode]?: string };
}

/**
 * @description
 * Defines extensions which copy static assets to the custom Admin UI application source asset directory.
 *
 * @docsCategory UiDevkit
 * @docsPage AdminUiExtension
 */
export interface StaticAssetExtension {
    /**
     * @description
     * Optional array of paths to static assets which will be copied over to the Admin UI app's `/static`
     * directory.
     */
    staticAssets: StaticAssetDefinition[];
}

/**
 * @description
 * Defines extensions which add global styles to the custom Admin UI application.
 *
 * @docsCategory UiDevkit
 * @docsPage AdminUiExtension
 */
export interface GlobalStylesExtension {
    /**
     * @description
     * Specifies a path (or array of paths) to global style files (css or Sass) which will be
     * incorporated into the Admin UI app global stylesheet.
     */
    globalStyles: string[] | string;
}

/**
 * @description
 * Defines extensions to the Admin UI application by specifying additional
 * Angular [NgModules](https://angular.io/guide/ngmodules) which are compiled
 * into the application.
 *
 * See [Extending the Admin UI](/docs/plugins/extending-the-admin-ui/) for
 * detailed instructions.
 *
 * @docsCategory UiDevkit
 * @docsPage AdminUiExtension
 * @docsWeight 0
 */
export interface AdminUiExtension
    extends Partial<TranslationExtension>,
        Partial<StaticAssetExtension>,
        Partial<GlobalStylesExtension> {
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
}

/**
 * @description
 * A static asset can be provided as a path to the asset, or as an object containing a path and a new
 * name, which will cause the compiler to copy and then rename the asset.
 *
 * @docsCategory UiDevkit
 * @docsPage AdminUiExtension
 */
export type StaticAssetDefinition = string | { path: string; rename: string };

/**
 * @description
 * Configuration defining a single NgModule with which to extend the Admin UI.
 *
 * @docsCategory UiDevkit
 * @docsPage AdminUiExtension
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
 * @docsCategory UiDevkit
 * @docsPage AdminUiExtension
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

/**
 * @description
 * Options to configure how the Admin UI should be compiled.
 *
 * @docsCategory UiDevkit
 */
export interface UiExtensionCompilerOptions {
    /**
     * @description
     * The directory into which the sources for the extended Admin UI will be copied.
     */
    outputPath: string;
    /**
     * @description
     * An array of objects which configure Angular modules and/or
     * translations with which to extend the Admin UI.
     */
    extensions: Extension[];
    /**
     * @description
     * Set to `true` in order to compile the Admin UI in development mode (using the Angular CLI
     * [ng serve](https://angular.io/cli/serve) command). When in dev mode, any changes to
     * UI extension files will be watched and trigger a rebuild of the Admin UI with live
     * reloading.
     *
     * @default false
     */
    devMode?: boolean;
    /**
     * @description
     * Allows the baseHref of the compiled Admin UI app to be set. This determines the prefix
     * of the app, for example with the default value of `'/admin/'`, the Admin UI app
     * will be configured to be served from `http://<host>/admin/`.
     *
     * @default '/admin/'
     */
    baseHref?: string;
    /**
     * @description
     * In watch mode, allows the port of the dev server to be specified. Defaults to the Angular CLI default
     * of `4200`.
     *
     * @default 4200 | undefined
     */
    watchPort?: number;
}

export type Translations = {
    [section: string]: {
        [token: string]: string;
    };
};

export interface BrandingOptions {
    smallLogoPath?: string;
    largeLogoPath?: string;
    faviconPath?: string;
}
