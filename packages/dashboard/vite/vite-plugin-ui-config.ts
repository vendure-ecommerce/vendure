import { AdminUiPlugin, AdminUiPluginOptions } from '@vendure/admin-ui-plugin';
import { AdminUiConfig, VendureConfig } from '@vendure/core';
import { getPluginDashboardExtensions } from '@vendure/core';
import path from 'path';
import { Plugin } from 'vite';

import { ConfigLoaderApi, getConfigLoaderApi } from './vite-plugin-config-loader.js';

const virtualModuleId = 'virtual:vendure-ui-config';
const resolvedVirtualModuleId = `\0${virtualModuleId}`;

/**
 * This Vite plugin scans the configured plugins for any dashboard extensions and dynamically
 * generates an import statement for each one, wrapped up in a `runDashboardExtensions()`
 * function which can then be imported and executed in the Dashboard app.
 */
export function uiConfigPlugin(): Plugin {
    let configLoaderApi: ConfigLoaderApi;
    let vendureConfig: VendureConfig;

    return {
        name: 'vendure:dashboard-ui-config',
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

                const adminUiPlugin = vendureConfig.plugins?.find(plugin => plugin.name === 'AdminUiPlugin');

                if (!adminUiPlugin) {
                    throw new Error('AdminUiPlugin not found');
                }

                const adminUiOptions = adminUiPlugin.options as AdminUiPluginOptions;

                return `
                    export const uiConfig = ${JSON.stringify(adminUiOptions.adminUiConfig)}
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
