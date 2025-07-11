import path from 'path';
import { Plugin } from 'vite';

import { LoadVendureConfigResult } from './utils/config-loader.js';
import { ConfigLoaderApi, getConfigLoaderApi } from './vite-plugin-config-loader.js';

const virtualModuleId = 'virtual:dashboard-extensions';
const resolvedVirtualModuleId = `\0${virtualModuleId}`;

/**
 * This Vite plugin scans the configured plugins for any dashboard extensions and dynamically
 * generates an import statement for each one, wrapped up in a `runDashboardExtensions()`
 * function which can then be imported and executed in the Dashboard app.
 */
export function dashboardMetadataPlugin(): Plugin {
    let configLoaderApi: ConfigLoaderApi;
    let loadVendureConfigResult: LoadVendureConfigResult;
    return {
        name: 'vendure:dashboard-extensions-metadata',
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
                const startTime = Date.now();
                this.debug('Loading dashboard extensions...');

                if (!loadVendureConfigResult) {
                    const configStart = Date.now();
                    loadVendureConfigResult = await configLoaderApi.getVendureConfig();
                    this.debug(`Loaded Vendure config in ${Date.now() - configStart}ms`);
                }

                const { pluginInfo } = loadVendureConfigResult;
                const resolveStart = Date.now();
                const pluginsWithExtensions =
                    pluginInfo
                        ?.map(({ dashboardEntryPath, pluginPath }) => {
                            if (!dashboardEntryPath) {
                                return null;
                            }
                            // Since dashboardEntryPath is now relative to the plugin file,
                            // we need to resolve from the plugin's directory
                            const resolved = path.resolve(path.dirname(pluginPath), dashboardEntryPath);
                            this.debug(`Resolved extension path: ${resolved}`);
                            return resolved;
                        })
                        .filter(x => x != null) ?? [];

                this.info(
                    `Found ${pluginsWithExtensions.length} Dashboard extensions in ${Date.now() - resolveStart}ms`,
                );
                this.debug(`Total dashboard extension loading completed in ${Date.now() - startTime}ms`);

                return `
                    export async function runDashboardExtensions() {
                        ${pluginsWithExtensions
                            .map(extension => {
                                return `await import(\`${extension}\`);`;
                            })
                            .join('\n')}
                }`;
            }
        },
    };
}
