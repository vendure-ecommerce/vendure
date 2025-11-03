import {
    ADMIN_API_PATH,
    DEFAULT_AUTH_TOKEN_HEADER_KEY,
    DEFAULT_CHANNEL_TOKEN_KEY,
} from '@vendure/common/lib/shared-constants';
import { VendureConfig } from '@vendure/core';

import {
    defaultAvailableLanguages,
    defaultAvailableLocales,
    defaultLanguage,
    defaultLocale,
} from '../constants.js';
import { ResolvedUiConfig, UiConfigPluginOptions } from '../vite-plugin-ui-config.js';

export function getUiConfig(config: VendureConfig, pluginOptions: UiConfigPluginOptions): ResolvedUiConfig {
    const { authOptions, apiOptions } = config;

    // Merge API configuration with defaults
    const api = {
        adminApiPath: pluginOptions.api?.adminApiPath ?? apiOptions.adminApiPath ?? ADMIN_API_PATH,
        host: pluginOptions.api?.host ?? 'auto',
        port: pluginOptions.api?.port ?? 'auto',
        tokenMethod:
            pluginOptions.api?.tokenMethod ?? (authOptions.tokenMethod === 'bearer' ? 'bearer' : 'cookie'),
        authTokenHeaderKey:
            pluginOptions.api?.authTokenHeaderKey ??
            authOptions.authTokenHeaderKey ??
            DEFAULT_AUTH_TOKEN_HEADER_KEY,
        channelTokenKey:
            pluginOptions.api?.channelTokenKey ?? apiOptions.channelTokenKey ?? DEFAULT_CHANNEL_TOKEN_KEY,
    };

    // Merge i18n configuration with defaults
    const i18n = {
        defaultLanguage: pluginOptions.i18n?.defaultLanguage ?? defaultLanguage,
        defaultLocale: pluginOptions.i18n?.defaultLocale ?? defaultLocale,
        availableLanguages:
            pluginOptions.i18n?.availableLanguages && pluginOptions.i18n.availableLanguages.length > 0
                ? pluginOptions.i18n.availableLanguages
                : defaultAvailableLanguages,
        availableLocales:
            pluginOptions.i18n?.availableLocales && pluginOptions.i18n.availableLocales.length > 0
                ? pluginOptions.i18n.availableLocales
                : defaultAvailableLocales,
    };

    return {
        api,
        i18n,
    };
}
