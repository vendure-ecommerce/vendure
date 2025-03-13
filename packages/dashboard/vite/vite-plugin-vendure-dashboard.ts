import { lingui } from '@lingui/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { PluginOption } from 'vite';

import { adminApiSchemaPlugin } from './vite-plugin-admin-api-schema.js';
import { configLoaderPlugin } from './vite-plugin-config-loader.js';
import { dashboardMetadataPlugin } from './vite-plugin-dashboard-metadata.js';
import { setRootPlugin } from './vite-plugin-set-root.js';

/**
 * @description
 * Options for the {@link vendureDashboardPlugin} Vite plugin.
 */
export interface VitePluginVendureDashboardOptions {
    /**
     * @description
     * The path to the Vendure server configuration file.
     */
    vendureConfigPath: string | URL;
    /**
     * @description
     * The name of the exported variable from the Vendure server configuration file.
     * This is only required if the plugin is unable to auto-detect the name of the exported variable.
     */
    vendureConfigExport?: string;
}

/**
 * @description
 * This is a Vite plugin which configures a set of plugins required to build the Vendure Dashboard.
 */
export function vendureDashboardPlugin(options: VitePluginVendureDashboardOptions): PluginOption[] {
    const tempDir = path.join(import.meta.dirname, './.vendure-dashboard-temp');
    const normalizedVendureConfigPath = getNormalizedVendureConfigPath(options.vendureConfigPath);
    const packageRoot = getDashboardPackageRoot();
    const linguiConfigPath = path.join(packageRoot, 'lingui.config.js');
    process.env.LINGUI_CONFIG = linguiConfigPath;

    return [
        lingui(),
        TanStackRouterVite({ autoCodeSplitting: true }),
        react({
            babel: {
                plugins: ['@lingui/babel-plugin-lingui-macro'],
            },
        }),
        tailwindcss(),
        configLoaderPlugin({ vendureConfigPath: normalizedVendureConfigPath, tempDir }),
        setRootPlugin({ packageRoot }),
        adminApiSchemaPlugin(),
        dashboardMetadataPlugin({ rootDir: tempDir }),
    ];
}

/**
 * @description
 * Returns the path to the root of the `@vendure/dashboard` package.
 */
function getDashboardPackageRoot(): string {
    const fileUrl = import.meta.resolve('@vendure/dashboard');
    const packagePath = fileUrl.startsWith('file:') ? new URL(fileUrl).pathname : fileUrl;
    return path.join(packagePath, '../..');
}

/**
 * Get the normalized path to the Vendure config file given either a string or URL.
 */
function getNormalizedVendureConfigPath(vendureConfigPath: string | URL): string {
    const stringPath = typeof vendureConfigPath === 'string' ? vendureConfigPath : vendureConfigPath.href;
    if (stringPath.startsWith('file:')) {
        return new URL(stringPath).pathname;
    }
    return stringPath;
}
