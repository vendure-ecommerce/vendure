import { VendureConfig } from '@vendure/core';
import { Plugin } from 'vite';

import { ConfigLoaderOptions, loadVendureConfig } from './config-loader.js';

export interface ConfigLoaderApi {
    getVendureConfig(): Promise<VendureConfig>;
}

export const configLoaderName = 'vendure:config-loader';

/**
 * This Vite plugin loads the VendureConfig from the specified file path, and
 * makes it available to other plugins via the `ConfigLoaderApi`.
 */
export function configLoaderPlugin(options: ConfigLoaderOptions): Plugin {
    let vendureConfig: VendureConfig;
    const onConfigLoaded: Array<() => void> = [];
    return {
        name: configLoaderName,
        async buildStart() {
            this.info(`Loading Vendure config...`);
            try {
                const result = await loadVendureConfig({
                    tempDir: options.tempDir,
                    vendureConfigPath: options.vendureConfigPath,
                    vendureConfigExport: options.vendureConfigExport,
                });
                vendureConfig = result.vendureConfig;
                this.info(`Vendure config loaded (using export "${result.exportedSymbolName}")`);
            } catch (e: unknown) {
                if (e instanceof Error) {
                    this.error(`Error loading Vendure config: ${e.message}`);
                }
            }
            onConfigLoaded.forEach(fn => fn());
        },
        api: {
            getVendureConfig(): Promise<VendureConfig> {
                if (vendureConfig) {
                    return Promise.resolve(vendureConfig);
                } else {
                    return new Promise<VendureConfig>(resolve => {
                        onConfigLoaded.push(() => {
                            resolve(vendureConfig);
                        });
                    });
                }
            },
        } satisfies ConfigLoaderApi,
    };
}

/**
 * Inter-plugin dependencies implemented following the pattern given here:
 * https://rollupjs.org/plugin-development/#direct-plugin-communication
 */
export function getConfigLoaderApi(plugins: readonly Plugin[]): ConfigLoaderApi {
    const parentPlugin = plugins.find(plugin => plugin.name === configLoaderName);
    if (!parentPlugin) {
        throw new Error(`This plugin depends on the "${configLoaderName}" plugin.`);
    }
    return parentPlugin.api as ConfigLoaderApi;
}
