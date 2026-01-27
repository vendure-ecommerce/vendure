---
title: "VendureDashboardPlugin"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## vendureDashboardPlugin

<GenerationInfo sourceFile="packages/dashboard/vite/vite-plugin-vendure-dashboard.ts" sourceLine="166" packageName="@vendure/dashboard" since="3.4.0" />

This is the Vite plugin which powers the Vendure Dashboard, including:

- Configuring routing, styling and React support
- Analyzing your VendureConfig file and introspecting your schema
- Loading your custom Dashboard extensions

```ts title="Signature"
function vendureDashboardPlugin(options: VitePluginVendureDashboardOptions): PluginOption[]
```
Parameters

### options

<MemberInfo kind="parameter" type={`<a href='/reference/dashboard/vite-plugin/vendure-dashboard-plugin#vitepluginvenduredashboardoptions'>VitePluginVendureDashboardOptions</a>`} />



## VitePluginVendureDashboardOptions

<GenerationInfo sourceFile="packages/dashboard/vite/vite-plugin-vendure-dashboard.ts" sourceLine="31" packageName="@vendure/dashboard" since="3.4.0" />

Options for the <a href='/reference/dashboard/vite-plugin/vendure-dashboard-plugin#venduredashboardplugin'>vendureDashboardPlugin</a> Vite plugin.

```ts title="Signature"
type VitePluginVendureDashboardOptions = {
    /**
     * @description
     * The path to the Vendure server configuration file.
     */
    vendureConfigPath: string | URL;
    /**
     * @description
     * The {@link PathAdapter} allows you to customize the resolution of paths
     * in the compiled Vendure source code which is used as part of the
     * introspection step of building the dashboard.
     *
     * It enables support for more complex repository structures, such as
     * monorepos, where the Vendure server configuration file may not
     * be located in the root directory of the project.
     *
     * If you get compilation errors like "Error loading Vendure config: Cannot find module",
     * you probably need to provide a custom `pathAdapter` to resolve the paths correctly.
     *
     * @example
     * ```ts
     * vendureDashboardPlugin({
     *     tempCompilationDir: join(__dirname, './__vendure-dashboard-temp'),
     *     pathAdapter: {
     *         getCompiledConfigPath: ({ inputRootDir, outputPath, configFileName }) => {
     *             const projectName = inputRootDir.split('/libs/')[1].split('/')[0];
     *             const pathAfterProject = inputRootDir.split(`/libs/${projectName}`)[1];
     *             const compiledConfigFilePath = `${outputPath}/${projectName}${pathAfterProject}`;
     *             return path.join(compiledConfigFilePath, configFileName);
     *         },
     *         transformTsConfigPathMappings: ({ phase, patterns }) => {
     *             // "loading" phase is when the compiled Vendure code is being loaded by
     *             // the plugin, in order to introspect the configuration of your app.
     *             if (phase === 'loading') {
     *                 return patterns.map((p) =>
     *                     p.replace('libs/', '').replace(/.ts$/, '.js'),
     *                 );
     *             }
     *             return patterns;
     *         },
     *     },
     *     // ...
     * }),
     * ```
     */
    pathAdapter?: PathAdapter;
    /**
     * @description
     * The name of the exported variable from the Vendure server configuration file, e.g. `config`.
     * This is only required if the plugin is unable to auto-detect the name of the exported variable.
     */
    vendureConfigExport?: string;
    /**
     * @description
     * The path to the directory where the generated GraphQL Tada files will be output.
     */
    gqlOutputPath?: string;
    tempCompilationDir?: string;
    /**
     * @description
     * Allows you to customize the location of node_modules & glob patterns used to scan for potential
     * Vendure plugins installed as npm packages. If not provided, the compiler will attempt to guess
     * the location based on the location of the `@vendure/core` package.
     */
    pluginPackageScanner?: PackageScannerConfig;
    /**
     * @description
     * Allows you to specify the module system to use when compiling and loading your Vendure config.
     * By default, the compiler will use CommonJS, but you can set it to `esm` if you are using
     * ES Modules in your Vendure project.
     *
     * **Status** Developer preview. If you are using ESM please try this out and provide us with feedback!
     *
     * @since 3.5.1
     * @default 'commonjs'
     */
    module?: 'commonjs' | 'esm';
    /**
     * @description
     * Allows you to selectively disable individual plugins.
     * @example
     * ```ts
     * vendureDashboardPlugin({
     *   vendureConfigPath: './config.ts',
     *   disablePlugins: {
     *     react: true,
     *     lingui: true,
     *   }
     * })
     * ```
     */
    disablePlugins?: {
        tanstackRouter?: boolean;
        react?: boolean;
        lingui?: boolean;
        themeVariables?: boolean;
        tailwindSource?: boolean;
        tailwindcss?: boolean;
        configLoader?: boolean;
        viteConfig?: boolean;
        adminApiSchema?: boolean;
        dashboardMetadata?: boolean;
        uiConfig?: boolean;
        gqlTada?: boolean;
        transformIndexHtml?: boolean;
        translations?: boolean;
        hmr?: boolean;
    };
} & UiConfigPluginOptions &
    ThemeVariablesPluginOptions
```


## PathAdapter

<GenerationInfo sourceFile="packages/dashboard/vite/types.ts" sourceLine="72" packageName="@vendure/dashboard" since="3.4.0" />

The PathAdapter interface allows customization of how paths are handled
when compiling the Vendure config and its imports.

It enables support for more complex repository structures, such as
monorepos, where the Vendure server configuration file may not
be located in the root directory of the project.

If you get compilation errors like "Error loading Vendure config: Cannot find module",
you probably need to provide a custom `pathAdapter` to resolve the paths correctly.

This can take some trial-and-error. Try logging values from the functions to figure out
the exact settings that you need for your repo setup.

*Example*

```ts
vendureDashboardPlugin({
    pathAdapter: {
        getCompiledConfigPath: ({ inputRootDir, outputPath, configFileName }) => {
            const projectName = inputRootDir.split('/libs/')[1].split('/')[0];
            const pathAfterProject = inputRootDir.split(`/libs/${projectName}`)[1];
            const compiledConfigFilePath = `${outputPath}/${projectName}${pathAfterProject}`;
            return path.join(compiledConfigFilePath, configFileName);
        },
        transformTsConfigPathMappings: ({ phase, patterns }) => {
            // "loading" phase is when the compiled Vendure code is being loaded by
            // the plugin, in order to introspect the configuration of your app.
            if (phase === 'loading') {
                return patterns.map((p) =>
                    p.replace('libs/', '').replace(/.ts$/, '.js'),
                );
            }
            return patterns;
        },
    },
    // ...
}),
```

```ts title="Signature"
interface PathAdapter {
    getCompiledConfigPath?: GetCompiledConfigPathFn;
    transformTsConfigPathMappings?: TransformTsConfigPathMappingsFn;
}
```

<div className="members-wrapper">

### getCompiledConfigPath

<MemberInfo kind="property" type={`GetCompiledConfigPathFn`}   />

A function to determine the path to the compiled Vendure config file.
### transformTsConfigPathMappings

<MemberInfo kind="property" type={`TransformTsConfigPathMappingsFn`}   />




</div>


## ApiConfig

<GenerationInfo sourceFile="packages/dashboard/vite/vite-plugin-ui-config.ts" sourceLine="19" packageName="@vendure/dashboard" since="3.4.0" />

Options used by the <a href='/reference/dashboard/vite-plugin/vendure-dashboard-plugin#venduredashboardplugin'>vendureDashboardPlugin</a> to configure how the Dashboard
connects to the Vendure Admin API

```ts title="Signature"
interface ApiConfig {
    host?: string | 'auto';
    port?: number | 'auto';
    adminApiPath?: string;
    tokenMethod?: 'cookie' | 'bearer';
    authTokenHeaderKey?: string;
    channelTokenKey?: string;
}
```

<div className="members-wrapper">

### host

<MemberInfo kind="property" type={`string | 'auto'`} default={`'auto'`}   />

The hostname of the Vendure server which the admin UI will be making API calls
to. If set to "auto", the Admin UI app will determine the hostname from the
current location (i.e. `window.location.hostname`).
### port

<MemberInfo kind="property" type={`number | 'auto'`} default={`'auto'`}   />

The port of the Vendure server which the admin UI will be making API calls
to. If set to "auto", the Admin UI app will determine the port from the
current location (i.e. `window.location.port`).
### adminApiPath

<MemberInfo kind="property" type={`string`} default={`'admin-api'`}   />

The path to the GraphQL Admin API.
### tokenMethod

<MemberInfo kind="property" type={`'cookie' | 'bearer'`} default={`'cookie'`}   />

Whether to use cookies or bearer tokens to track sessions.
Should match the setting of in the server's `tokenMethod` config
option.
### authTokenHeaderKey

<MemberInfo kind="property" type={`string`} default={`'vendure-auth-token'`}   />

The header used when using the 'bearer' auth method. Should match the
setting of the server's `authOptions.authTokenHeaderKey` config option.
### channelTokenKey

<MemberInfo kind="property" type={`string`} default={`'vendure-token'`}   />

The name of the header which contains the channel token. Should match the
setting of the server's `apiOptions.channelTokenKey` config option.


</div>


## I18nConfig

<GenerationInfo sourceFile="packages/dashboard/vite/vite-plugin-ui-config.ts" sourceLine="81" packageName="@vendure/dashboard" since="3.4.0" />

Options used by the <a href='/reference/dashboard/vite-plugin/vendure-dashboard-plugin#venduredashboardplugin'>vendureDashboardPlugin</a> to configure aspects of the
Dashboard UI behaviour.

```ts title="Signature"
interface I18nConfig {
    defaultLanguage?: LanguageCode;
    defaultLocale?: string;
    availableLanguages?: LanguageCode[];
    availableLocales?: string[];
}
```

<div className="members-wrapper">

### defaultLanguage

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>`} default={`<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>.en`}   />

The default language for the Admin UI. Must be one of the
items specified in the `availableLanguages` property.
### defaultLocale

<MemberInfo kind="property" type={`string`}  since="2.2.0"  />

The default locale for the Admin UI. The locale affects the formatting of
currencies & dates. Must be one of the items specified
in the `availableLocales` property.

If not set, the browser default locale will be used.
### availableLanguages

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>[]`}   />

An array of languages for which translations exist for the Admin UI.
### availableLocales

<MemberInfo kind="property" type={`string[]`}  since="2.2.0"  />

An array of locales to be used on Admin UI.


</div>


## UiConfigPluginOptions

<GenerationInfo sourceFile="packages/dashboard/vite/vite-plugin-ui-config.ts" sourceLine="124" packageName="@vendure/dashboard" since="3.4.0" />

Options used by the <a href='/reference/dashboard/vite-plugin/vendure-dashboard-plugin#venduredashboardplugin'>vendureDashboardPlugin</a> to configure aspects of the
Dashboard UI behaviour.

```ts title="Signature"
interface UiConfigPluginOptions {
    api?: ApiConfig;
    i18n?: I18nConfig;
}
```

<div className="members-wrapper">

### api

<MemberInfo kind="property" type={`<a href='/reference/dashboard/vite-plugin/vendure-dashboard-plugin#apiconfig'>ApiConfig</a>`}   />

Configuration for API connection settings
### i18n

<MemberInfo kind="property" type={`<a href='/reference/dashboard/vite-plugin/vendure-dashboard-plugin#i18nconfig'>I18nConfig</a>`}   />

Configuration for internationalization settings


</div>
