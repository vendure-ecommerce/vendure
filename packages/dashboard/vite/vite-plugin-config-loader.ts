import { VendureConfig } from '@vendure/core';
import { Plugin } from 'vite';

import { ConfigLoaderOptions, loadVendureConfig } from './config-loader.js';

export interface ConfigLoaderApi {
    getVendureConfig(): Promise<VendureConfig>;
}

export const configLoaderName = 'vendure:config-loader';

/**
 * This Vite plugin scans the configured plugins for any dashboard extensions and dynamically
 * generates an import statement for each one, wrapped up in a `runDashboardExtensions()`
 * function which can then be imported and executed in the Dashboard app.
 */
export function configLoaderPlugin(options: ConfigLoaderOptions): Plugin {
    let vendureConfig: VendureConfig;
    let onConfigLoaded = () => {
        /* */
    };
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
            onConfigLoaded();
        },
        api: {
            getVendureConfig(): Promise<VendureConfig> {
                if (vendureConfig) {
                    return Promise.resolve(vendureConfig);
                } else {
                    return new Promise<VendureConfig>(resolve => {
                        onConfigLoaded = () => {
                            resolve(vendureConfig);
                        };
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
