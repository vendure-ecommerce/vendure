import {
    DEFAULT_AUTH_TOKEN_HEADER_KEY,
    DEFAULT_CHANNEL_TOKEN_KEY,
    ADMIN_API_PATH,
} from '@vendure/common/lib/shared-constants';
import { AdminUiConfig } from '@vendure/common/lib/shared-types';
import { VendureConfig } from '@vendure/core';

import { defaultAvailableLocales } from '../constants.js';
import { defaultLocale, defaultLanguage, defaultAvailableLanguages } from '../constants.js';

export function getAdminUiConfig(
    config: VendureConfig,
    adminUiConfig?: Partial<AdminUiConfig>,
): AdminUiConfig {
    const { authOptions, apiOptions } = config;

    const propOrDefault = <Prop extends keyof AdminUiConfig>(
        prop: Prop,
        defaultVal: AdminUiConfig[Prop],
        isArray: boolean = false,
    ): AdminUiConfig[Prop] => {
        if (isArray) {
            const isValidArray = !!adminUiConfig
                ? !!((adminUiConfig as AdminUiConfig)[prop] as any[])?.length
                : false;

            return !!adminUiConfig && isValidArray ? (adminUiConfig as AdminUiConfig)[prop] : defaultVal;
        } else {
            return adminUiConfig ? (adminUiConfig as AdminUiConfig)[prop] || defaultVal : defaultVal;
        }
    };

    return {
        adminApiPath: propOrDefault('adminApiPath', apiOptions.adminApiPath || ADMIN_API_PATH),
        apiHost: propOrDefault('apiHost', 'auto'),
        apiPort: propOrDefault('apiPort', 'auto'),
        tokenMethod: propOrDefault('tokenMethod', authOptions.tokenMethod === 'bearer' ? 'bearer' : 'cookie'),
        authTokenHeaderKey: propOrDefault(
            'authTokenHeaderKey',
            authOptions.authTokenHeaderKey || DEFAULT_AUTH_TOKEN_HEADER_KEY,
        ),
        channelTokenKey: propOrDefault(
            'channelTokenKey',
            apiOptions.channelTokenKey || DEFAULT_CHANNEL_TOKEN_KEY,
        ),
        defaultLanguage: propOrDefault('defaultLanguage', defaultLanguage),
        defaultLocale: propOrDefault('defaultLocale', defaultLocale),
        availableLanguages: propOrDefault('availableLanguages', defaultAvailableLanguages, true),
        availableLocales: propOrDefault('availableLocales', defaultAvailableLocales, true),
        brand: adminUiConfig?.brand,
        hideVendureBranding: propOrDefault(
            'hideVendureBranding',
            adminUiConfig?.hideVendureBranding || false,
        ),
        hideVersion: propOrDefault('hideVersion', adminUiConfig?.hideVersion || false),
        loginImageUrl: adminUiConfig?.loginImageUrl,
        cancellationReasons: propOrDefault('cancellationReasons', undefined),
    };
}
