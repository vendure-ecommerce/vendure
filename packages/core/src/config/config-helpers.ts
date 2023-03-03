import { mergeConfig } from './merge-config';
import { PartialVendureConfig, RuntimeVendureConfig } from './vendure-config';

let activeConfig: RuntimeVendureConfig;

/**
 * Reset the activeConfig object back to the initial default state.
 */
export function resetConfig() {
    activeConfig = require('./default-config').defaultConfig;
}

/**
 * Override the default config by merging in the supplied values. Should only be used prior to
 * bootstrapping the app.
 */
export function setConfig(userConfig: PartialVendureConfig): void {
    if (!activeConfig) {
        activeConfig = require('./default-config').defaultConfig;
    }
    activeConfig = mergeConfig(activeConfig, userConfig);
}

/**
 * Returns the app config object. In general this function should only be
 * used before bootstrapping the app. In all other contexts, the {@link ConfigService}
 * should be used to access config settings.
 */
export function getConfig(): Readonly<RuntimeVendureConfig> {
    if (!activeConfig) {
        activeConfig = require('./default-config').defaultConfig;
    }
    return activeConfig;
}
