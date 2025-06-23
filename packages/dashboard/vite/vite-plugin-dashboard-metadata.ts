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
export function dashboardMetadataPlugin(options: { rootDir: string }): Plugin {
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
                if (!loadVendureConfigResult) {
                    loadVendureConfigResult = await configLoaderApi.getVendureConfig();
                }
                const { pluginInfo } = loadVendureConfigResult;
                const pluginsWithExtensions =
                    pluginInfo
                        ?.map(
                            ({ dashboardEntryPath, pluginPath }) =>
                                dashboardEntryPath && path.join(pluginPath, dashboardEntryPath),
                        )
                        .filter(x => x != null) ?? [];

                this.info(`Found ${pluginsWithExtensions.length} Dashboard extensions`);
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

/**
 * Converts an import path to a normalized path relative to the rootDir.
 */
function normalizeImportPath(rootDir: string, importPath: string): string {
    const relativePath = path.relative(rootDir, importPath).replace(/\\/g, '/');
    return relativePath.replace(/\.tsx?$/, '.js');
}
