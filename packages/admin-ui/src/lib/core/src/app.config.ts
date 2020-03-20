import { AdminUiConfig } from '@vendure/common/lib/shared-types';

import { LanguageCode } from './common/generated-types';

let vendureUiConfig: AdminUiConfig | undefined;

export function loadAppConfig(): Promise<void> {
    return fetch('./vendure-ui-config.json')
        .then(res => res.json())
        .then(config => {
            vendureUiConfig = config;
        });
}

export function getAppConfig(): AdminUiConfig {
    if (!vendureUiConfig) {
        throw new Error(`vendure ui config not loaded`);
    }
    return vendureUiConfig;
}
