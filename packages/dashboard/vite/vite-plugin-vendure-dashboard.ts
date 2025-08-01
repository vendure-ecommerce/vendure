import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { PluginOption } from 'vite';

import { PathAdapter } from './types.js';
import { PackageScannerConfig } from './utils/compiler.js';
import { adminApiSchemaPlugin } from './vite-plugin-admin-api-schema.js';
import { configLoaderPlugin } from './vite-plugin-config-loader.js';
import { viteConfigPlugin } from './vite-plugin-config.js';
import { dashboardMetadataPlugin } from './vite-plugin-dashboard-metadata.js';
import { gqlTadaPlugin } from './vite-plugin-gql-tada.js';
import { dashboardTailwindSourcePlugin } from './vite-plugin-tailwind-source.js';
import { themeVariablesPlugin, ThemeVariablesPluginOptions } from './vite-plugin-theme.js';
import { transformIndexHtmlPlugin } from './vite-plugin-transform-index.js';
import { uiConfigPlugin, UiConfigPluginOptions } from './vite-plugin-ui-config.js';

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
     * The {@link PathAdapter} allows you to customize the resolution of paths
     * in the compiled Vendure source code which is used as part of the
     * introspection step of building the dashboard.
     *
     * It enables support for more complex repository structures, such as
     * monorepos, where the Vendure server configuration file may not
     * be located in the root directory of the project.
     *
     * If you get compilation errors like "Error loading Vendure config: Cannot find module",
     * you probably need to provide a custom `pathAdapter` to resolve the paths correctly.
     *
     * @example
     * ```ts
     * vendureDashboardPlugin({
     *     tempCompilationDir: join(__dirname, './__vendure-dashboard-temp'),
     *     pathAdapter: {
     *         getCompiledConfigPath: ({ inputRootDir, outputPath, configFileName }) => {
     *             const projectName = inputRootDir.split('/libs/')[1].split('/')[0];
     *             const pathAfterProject = inputRootDir.split(`/libs/${projectName}`)[1];
     *             const compiledConfigFilePath = `${outputPath}/${projectName}${pathAfterProject}`;
     *             return path.join(compiledConfigFilePath, configFileName);
     *         },
     *         transformTsConfigPathMappings: ({ phase, patterns }) => {
     *             // "loading" phase is when the compiled Vendure code is being loaded by
     *             // the plugin, in order to introspect the configuration of your app.
     *             if (phase === 'loading') {
     *                 return patterns.map((p) =>
     *                     p.replace('libs/', '').replace(/.ts$/, '.js'),
     *                 );
     *             }
     *             return patterns;
     *         },
     *     },
     *     // ...
     * }),
     * ```
     */
    pathAdapter?: PathAdapter;
    /**
     * @description
     * The name of the exported variable from the Vendure server configuration file, e.g. `config`.
     * This is only required if the plugin is unable to auto-detect the name of the exported variable.
     */
    vendureConfigExport?: string;
    /**
     * @description
     * The path to the directory where the generated GraphQL Tada files will be output.
     */
    gqlOutputPath?: string;
    tempCompilationDir?: string;
    disableTansStackRouterPlugin?: boolean;
    /**
     * @description
     * Allows you to customize the location of node_modules & glob patterns used to scan for potential
     * Vendure plugins installed as npm packages. If not provided, the compiler will attempt to guess
     * the location based on the location of the `@vendure/core` package.
     */
    pluginPackageScanner?: PackageScannerConfig;
} & UiConfigPluginOptions &
    ThemeVariablesPluginOptions;

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
        // lingui(),
        ...(options.disableTansStackRouterPlugin
            ? []
            : [
                  TanStackRouterVite({
                      autoCodeSplitting: true,
                      routeFileIgnorePattern: '.graphql.ts|components|hooks|utils',
                      routesDirectory: path.join(packageRoot, 'src/app/routes'),
                      generatedRouteTree: path.join(packageRoot, 'src/app/routeTree.gen.ts'),
                  }),
              ]),
        react({
            // babel: {
            //     plugins: ['@lingui/babel-plugin-lingui-macro'],
            // },
        }),
        themeVariablesPlugin({ theme: options.theme }),
        dashboardTailwindSourcePlugin(),
        tailwindcss(),
        configLoaderPlugin({
            vendureConfigPath: normalizedVendureConfigPath,
            outputPath: tempDir,
            pathAdapter: options.pathAdapter,
            pluginPackageScanner: options.pluginPackageScanner,
        }),
        viteConfigPlugin({ packageRoot }),
        adminApiSchemaPlugin(),
        dashboardMetadataPlugin(),
        uiConfigPlugin(options),
        ...(options.gqlOutputPath
            ? [gqlTadaPlugin({ gqlTadaOutputPath: options.gqlOutputPath, tempDir, packageRoot })]
            : []),
        transformIndexHtmlPlugin(),
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
