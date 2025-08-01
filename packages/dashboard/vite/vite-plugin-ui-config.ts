import { LanguageCode, VendureConfig } from '@vendure/core';
import { Plugin } from 'vite';

import { getUiConfig } from './utils/ui-config.js';
import { ConfigLoaderApi, getConfigLoaderApi } from './vite-plugin-config-loader.js';

const virtualModuleId = 'virtual:vendure-ui-config';
const resolvedVirtualModuleId = `\0${virtualModuleId}`;

export interface ApiConfig {
    /**
     * @description
     * The hostname of the Vendure server which the admin UI will be making API calls
     * to. If set to "auto", the Admin UI app will determine the hostname from the
     * current location (i.e. `window.location.hostname`).
     *
     * @default 'auto'
     */
    host?: string | 'auto';
    /**
     * @description
     * The port of the Vendure server which the admin UI will be making API calls
     * to. If set to "auto", the Admin UI app will determine the port from the
     * current location (i.e. `window.location.port`).
     *
     * @default 'auto'
     */
    port?: number | 'auto';
    /**
     * @description
     * The path to the GraphQL Admin API.
     *
     * @default 'admin-api'
     */
    adminApiPath?: string;
    /**
     * @description
     * Whether to use cookies or bearer tokens to track sessions.
     * Should match the setting of in the server's `tokenMethod` config
     * option.
     *
     * @default 'cookie'
     */
    tokenMethod?: 'cookie' | 'bearer';
    /**
     * @description
     * The header used when using the 'bearer' auth method. Should match the
     * setting of the server's `authOptions.authTokenHeaderKey` config option.
     *
     * @default 'vendure-auth-token'
     */
    authTokenHeaderKey?: string;
    /**
     * @description
     * The name of the header which contains the channel token. Should match the
     * setting of the server's `apiOptions.channelTokenKey` config option.
     *
     * @default 'vendure-token'
     */
    channelTokenKey?: string;
}

export interface I18nConfig {
    /**
     * @description
     * The default language for the Admin UI. Must be one of the
     * items specified in the `availableLanguages` property.
     *
     * @default LanguageCode.en
     */
    defaultLanguage?: LanguageCode;
    /**
     * @description
     * The default locale for the Admin UI. The locale affects the formatting of
     * currencies & dates. Must be one of the items specified
     * in the `availableLocales` property.
     *
     * If not set, the browser default locale will be used.
     *
     * @since 2.2.0
     */
    defaultLocale?: string;
    /**
     * @description
     * An array of languages for which translations exist for the Admin UI.
     */
    availableLanguages?: LanguageCode[];
    /**
     * @description
     * An array of locales to be used on Admin UI.
     *
     * @since 2.2.0
     */
    availableLocales?: string[];
}

export interface UiConfigPluginOptions {
    /**
     * @description
     * Configuration for API connection settings
     */
    api?: ApiConfig;
    /**
     * @description
     * Configuration for internationalization settings
     */
    i18n?: I18nConfig;
}

/**
 * @description
 * The resolved UI configuration with all defaults applied.
 * This is the type of the configuration object available at runtime.
 */
export interface ResolvedUiConfig {
    /**
     * @description
     * API connection settings with all defaults applied
     */
    api: Required<ApiConfig>;
    /**
     * @description
     * Internationalization settings with all defaults applied.
     * Note: defaultLocale remains optional as it can be undefined.
     */
    i18n: Required<Omit<I18nConfig, 'defaultLocale'>> & Pick<I18nConfig, 'defaultLocale'>;
}

/**
 * This Vite plugin scans the configured plugins for any dashboard extensions and dynamically
 * generates an import statement for each one, wrapped up in a `runDashboardExtensions()`
 * function which can then be imported and executed in the Dashboard app.
 */
export function uiConfigPlugin(options: UiConfigPluginOptions = {}): Plugin {
    let configLoaderApi: ConfigLoaderApi;
    let vendureConfig: VendureConfig;

    return {
        name: 'vendure:dashboard-ui-config',
        configResolved({ plugins }) {
            configLoaderApi = getConfigLoaderApi(plugins);
        },
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },
        async load(id) {
            if (id === resolvedVirtualModuleId) {
                if (!vendureConfig) {
                    const result = await configLoaderApi.getVendureConfig();
                    vendureConfig = result.vendureConfig;
                }

                const config = getUiConfig(vendureConfig, options);

                return `
                    export const uiConfig = ${JSON.stringify(config)}
                `;
            }
        },
    };
}
