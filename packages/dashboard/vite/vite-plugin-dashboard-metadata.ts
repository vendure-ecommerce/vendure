import { VendureConfig } from '@vendure/core';
import { getPluginDashboardExtensions } from '@vendure/core';
import path from 'path';
import { Plugin } from 'vite';

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
    let vendureConfig: VendureConfig;
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
                if (!vendureConfig) {
                    vendureConfig = await configLoaderApi.getVendureConfig();
                }
                const extensions = getPluginDashboardExtensions(vendureConfig.plugins ?? []);
                const extensionData: Array<{ importPath: string }> = extensions.map(extension => {
                    const providedPath = typeof extension === 'string' ? extension : extension.location;
                    const jsPath = normalizeImportPath(options.rootDir, providedPath);
                    return { importPath: `./${jsPath}` };
                });

                this.info(`Found ${extensionData.length} Dashboard extensions`);
                return `
                    export async function runDashboardExtensions() {
                        ${extensionData.map(extension => `await import('${extension.importPath}');`).join('\n')}
                    }
                `;
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
