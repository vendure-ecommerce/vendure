import { DeepPartial } from '@vendure/common/lib/shared-types';

import { defaultConfig } from './default-config';
import { mergeConfig } from './merge-config';
import { RuntimeVendureConfig, VendureConfig } from './vendure-config';

let activeConfig = defaultConfig;

/**
 * Override the default config by merging in the supplied values. Should only be used prior to
 * bootstrapping the app.
 */
export function setConfig(userConfig: DeepPartial<VendureConfig>): void {
    activeConfig = mergeConfig(activeConfig, userConfig);
}

/**
 * Returns the app config object. In general this function should only be
 * used before bootstrapping the app. In all other contexts, the {@link ConfigService}
 * should be used to access config settings.
 */
export function getConfig(): Readonly<RuntimeVendureConfig> {
    return activeConfig;
}
