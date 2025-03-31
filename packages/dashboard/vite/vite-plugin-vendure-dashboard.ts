import { lingui } from '@lingui/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { PluginOption } from 'vite';

import { adminApiSchemaPlugin } from './vite-plugin-admin-api-schema.js';
import { configLoaderPlugin } from './vite-plugin-config-loader.js';
import { dashboardMetadataPlugin } from './vite-plugin-dashboard-metadata.js';
import { gqlTadaPlugin } from './vite-plugin-gql-tada.js';
import { setRootPlugin } from './vite-plugin-set-root.js';
import { UiConfigPluginOptions, uiConfigPlugin } from './vite-plugin-ui-config.js';

/**
 * @description
 * Options for the {@link vendureDashboardPlugin} Vite plugin.
 */
export type VitePluginVendureDashboardOptions = {
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
    /**
     * @description
     * The path to the directory where the generated GraphQL Tada files will be output.
     */
    gqlTadaOutputPath?: string;
    tempCompilationDir?: string;
    disableTansStackRouterPlugin?: boolean;
} & UiConfigPluginOptions;

/**
 * @description
 * This is a Vite plugin which configures a set of plugins required to build the Vendure Dashboard.
 */
export function vendureDashboardPlugin(options: VitePluginVendureDashboardOptions): PluginOption[] {
    const tempDir = options.tempCompilationDir ?? path.join(import.meta.dirname, './.vendure-dashboard-temp');
    const normalizedVendureConfigPath = getNormalizedVendureConfigPath(options.vendureConfigPath);
    const packageRoot = getDashboardPackageRoot();
    const linguiConfigPath = path.join(packageRoot, 'lingui.config.js');

    if (process.env.IS_LOCAL_DEV !== 'true') {
        process.env.LINGUI_CONFIG = linguiConfigPath;
    }

    return [
        // TODO: solve https://github.com/kentcdodds/babel-plugin-macros/issues/87
        lingui(),
        ...(options.disableTansStackRouterPlugin
            ? []
            : [
                  TanStackRouterVite({
                      autoCodeSplitting: true,
                      routeFileIgnorePattern: '.graphql.ts|components',
                      routesDirectory: path.join(packageRoot, 'src/app/routes'),
                      generatedRouteTree: path.join(packageRoot, 'src/app/routeTree.gen.ts'),
                  }),
              ]),
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
        uiConfigPlugin({ adminUiConfig: options.adminUiConfig }),
        ...(options.gqlTadaOutputPath
            ? [gqlTadaPlugin({ gqlTadaOutputPath: options.gqlTadaOutputPath, tempDir, packageRoot })]
            : []),
    ];
}

/**
 * @description
 * Returns the path to the root of the `@vendure/dashboard` package.
 */
function getDashboardPackageRoot(): string {
    const fileUrl = import.meta.resolve('@vendure/dashboard');
    const packagePath = fileUrl.startsWith('file:') ? new URL(fileUrl).pathname : fileUrl;
    return fixWindowsPath(path.join(packagePath, '../../../'));
}

/**
 * Get the normalized path to the Vendure config file given either a string or URL.
 */
export function getNormalizedVendureConfigPath(vendureConfigPath: string | URL): string {
    const stringPath = typeof vendureConfigPath === 'string' ? vendureConfigPath : vendureConfigPath.href;
    if (stringPath.startsWith('file:')) {
        return fixWindowsPath(new URL(stringPath).pathname);
    }
    return fixWindowsPath(stringPath);
}

function fixWindowsPath(filePath: string): string {
    // Fix Windows paths that might start with a leading slash
    if (process.platform === 'win32') {
        // Remove leading slash before drive letter on Windows
        if (/^[/\\][A-Za-z]:/.test(filePath)) {
            return filePath.substring(1);
        }
    }
    return filePath;
}
