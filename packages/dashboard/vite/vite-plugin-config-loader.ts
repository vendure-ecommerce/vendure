import { Plugin } from 'vite';

import { ConfigLoaderOptions, loadVendureConfig, LoadVendureConfigResult } from './utils/config-loader.js';

export interface ConfigLoaderApi {
    getVendureConfig(): Promise<LoadVendureConfigResult>;
}

export const configLoaderName = 'vendure:config-loader';

/**
 * This Vite plugin loads the VendureConfig from the specified file path, and
 * makes it available to other plugins via the `ConfigLoaderApi`.
 */
export function configLoaderPlugin(options: ConfigLoaderOptions): Plugin {
    let result: LoadVendureConfigResult;
    const onConfigLoaded: Array<() => void> = [];
    return {
        name: configLoaderName,
        async buildStart() {
            this.info(
                `Loading Vendure config. This can take a short while depending on the size of your project...`,
            );
            try {
                const startTime = Date.now();
                result = await loadVendureConfig({
                    pathAdapter: options.pathAdapter,
                    tempDir: options.tempDir,
                    vendureConfigPath: options.vendureConfigPath,
                    vendureConfigExport: options.vendureConfigExport,
                    logger: {
                        info: (message: string) => this.info(message),
                        warn: (message: string) => this.warn(message),
                        debug: (message: string) => this.debug(message),
                    },
                });
                const endTime = Date.now();
                const duration = endTime - startTime;
                const pluginNames = result.pluginInfo.map(p => p.name).join(', ');
                this.info(`Found ${result.pluginInfo.length} plugins: ${pluginNames}`);
                this.info(
                    `Vendure config loaded (using export "${result.exportedSymbolName}") in ${duration}ms`,
                );
            } catch (e: unknown) {
                if (e instanceof Error) {
                    const message = [
                        e.message,
                        `If you are using a monorepo, you may need to provide a custom pathAdapter to resolve the paths correctly.`,
                    ].join('\n');
                    this.error(`Error loading Vendure config: ${message}`);
                }
            }
            onConfigLoaded.forEach(fn => fn());
        },
        api: {
            getVendureConfig(): Promise<LoadVendureConfigResult> {
                if (result) {
                    return Promise.resolve(result);
                } else {
                    return new Promise<LoadVendureConfigResult>(resolve => {
                        onConfigLoaded.push(() => {
                            resolve(result);
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
