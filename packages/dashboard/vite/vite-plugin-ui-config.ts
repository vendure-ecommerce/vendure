import { AdminUiConfig, VendureConfig } from '@vendure/core';
import path from 'path';
import { Plugin } from 'vite';

import { getAdminUiConfig } from './ui-config.js';
import { ConfigLoaderApi, getConfigLoaderApi } from './vite-plugin-config-loader.js';

const virtualModuleId = 'virtual:vendure-ui-config';
const resolvedVirtualModuleId = `\0${virtualModuleId}`;

export type UiConfigPluginOptions = {
    /**
     * @description
     * The admin UI config to be passed to the Vendure Dashboard.
     */
    adminUiConfig?: Partial<AdminUiConfig>;
};

/**
 * This Vite plugin scans the configured plugins for any dashboard extensions and dynamically
 * generates an import statement for each one, wrapped up in a `runDashboardExtensions()`
 * function which can then be imported and executed in the Dashboard app.
 */
export function uiConfigPlugin({ adminUiConfig }: UiConfigPluginOptions): Plugin {
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

                const config = getAdminUiConfig(vendureConfig, adminUiConfig);

                return `
                    export const uiConfig = ${JSON.stringify(config)}
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
