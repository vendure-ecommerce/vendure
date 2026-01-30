import * as babel from '@babel/core';
import type { Plugin } from 'vite';

/**
 * Options for the linguiBabelPlugin.
 */
export interface LinguiBabelPluginOptions {
    /**
     * For testing: manually specify package paths that should have Lingui macros transformed.
     * In production, these are automatically discovered from the VendureConfig plugins.
     */
    additionalPackagePaths?: string[];
}

/**
 * @description
 * A custom Vite plugin that transforms Lingui macros in files using Babel instead of SWC.
 *
 * This plugin solves a critical compatibility issue with SWC plugins:
 * - SWC plugins are compiled Wasm binaries that require exact version matching with `@swc/core`
 * - When users have different SWC versions in their projects (e.g., from Next.js, Nx, etc.),
 *   the Lingui SWC plugin fails with "failed to invoke plugin" errors
 * - Babel has no such binary compatibility issues, making it much more reliable for library code
 *
 * The plugin runs BEFORE `@vitejs/plugin-react` and transforms files containing Lingui macros
 * (imports from `@lingui/core/macro` or `@lingui/react/macro`) using the Babel-based
 * `@lingui/babel-plugin-lingui-macro`.
 *
 * Files processed:
 * - `@vendure/dashboard/src` files (in node_modules for external projects)
 * - `packages/dashboard/src` files (in monorepo development)
 * - User's dashboard extension files (e.g., custom plugins using Lingui)
 * - Third-party npm packages that provide dashboard extensions (discovered automatically)
 *
 * Files NOT processed:
 * - Files that don't contain Lingui macro imports (fast check via string matching)
 * - Non-JS/TS files
 * - node_modules packages that are not discovered as Vendure plugins
 *
 * @see https://github.com/vendurehq/vendure/issues/3929
 * @see https://github.com/lingui/swc-plugin/issues/179
 */
export function linguiBabelPlugin(options?: LinguiBabelPluginOptions): Plugin {
    // Paths of npm packages that should have Lingui macros transformed.
    // This is populated from plugin discovery in buildStart.
    const allowedNodeModulesPackages = new Set<string>();

    // Add any manually specified paths (for testing)
    if (options?.additionalPackagePaths) {
        for (const pkgPath of options.additionalPackagePaths) {
            allowedNodeModulesPackages.add(pkgPath);
        }
    }

    return {
        name: 'vendure:lingui-babel',
        // Run BEFORE @vitejs/plugin-react so the macros are already transformed
        // when the react plugin processes the file
        enforce: 'pre',

        configResolved(config) {
            // Access the configLoaderPlugin API and load discovered plugins
            // This runs after all plugins are resolved but before build starts
            const configLoaderPlugin = config.plugins.find(p => p.name === 'vendure:config-loader');
            if (configLoaderPlugin?.api) {
                const api = configLoaderPlugin.api as {
                    getVendureConfig: () => Promise<{
                        pluginInfo: Array<{ pluginPath: string; sourcePluginPath?: string }>;
                    }>;
                };
                // Queue the config loading - it will be available by the time transform runs
                api.getVendureConfig()
                    .then(result => {
                        for (const plugin of result.pluginInfo) {
                            // Only add npm packages (those without sourcePluginPath are from node_modules)
                            if (!plugin.sourcePluginPath && plugin.pluginPath.includes('node_modules')) {
                                // Extract the package path from the full file path
                                // e.g., /path/to/node_modules/@vendure-ee/plugin/dist/index.js -> @vendure-ee/plugin
                                const packagePath = extractPackagePath(plugin.pluginPath);
                                if (packagePath) {
                                    allowedNodeModulesPackages.add(packagePath);
                                }
                            }
                        }
                    })
                    .catch(() => {
                        // Config loading failed - continue with only manual paths
                    });
            }
        },

        async transform(code, id) {
            // Strip query params for path matching (Vite adds ?v=xxx for cache busting)
            const cleanId = id.split('?')[0];

            // Only process TypeScript/JavaScript files
            if (!/\.[tj]sx?$/.test(cleanId)) {
                return null;
            }

            // Only process files that actually contain Lingui macro imports
            // This is a fast check to avoid running Babel on files that don't need it
            if (!code.includes('@lingui/') || !code.includes('/macro')) {
                return null;
            }

            // Check if this file should be transformed
            if (cleanId.includes('node_modules')) {
                // Always allow @vendure/dashboard source files
                const isVendureDashboard =
                    cleanId.includes('@vendure/dashboard/src') || cleanId.includes('packages/dashboard/src');

                // Check if this is from a discovered Vendure plugin package
                const isDiscoveredPlugin = [...allowedNodeModulesPackages].some(pkgPath =>
                    cleanId.includes(pkgPath),
                );

                if (!isVendureDashboard && !isDiscoveredPlugin) {
                    return null;
                }
            }

            try {
                const result = await babel.transformAsync(code, {
                    filename: id,
                    presets: [
                        ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
                        ['@babel/preset-react', { runtime: 'automatic' }],
                    ],
                    plugins: ['@lingui/babel-plugin-lingui-macro'],
                    sourceMaps: true,
                    // Don't look for babel config files - we want to control the config completely
                    configFile: false,
                    babelrc: false,
                });

                if (!result?.code) {
                    return null;
                }

                return {
                    code: result.code,
                    map: result.map,
                };
            } catch (error) {
                // Log the error but don't crash - let the build continue
                // The lingui vite plugin will catch untransformed macros later
                // eslint-disable-next-line no-console
                console.error(`[vendure:lingui-babel] Failed to transform ${id}:`, error);
                return null;
            }
        },
    };
}

/**
 * Extracts the npm package name from a full file path.
 *
 * Examples:
 * - /path/to/node_modules/@vendure-ee/plugin/dist/index.js -> @vendure-ee/plugin
 * - /path/to/node_modules/some-plugin/lib/index.js -> some-plugin
 * - /path/to/node_modules/.pnpm/@vendure-ee+plugin@1.0.0/node_modules/@vendure-ee/plugin/dist/index.js -> @vendure-ee/plugin
 */
function extractPackagePath(filePath: string): string | undefined {
    // Normalize path separators
    const normalizedPath = filePath.replace(/\\/g, '/');

    // Find the last occurrence of node_modules (handles pnpm structure)
    const lastNodeModulesIndex = normalizedPath.lastIndexOf('node_modules/');
    if (lastNodeModulesIndex === -1) {
        return undefined;
    }

    const afterNodeModules = normalizedPath.slice(lastNodeModulesIndex + 'node_modules/'.length);

    // Handle scoped packages (@scope/package)
    if (afterNodeModules.startsWith('@')) {
        const parts = afterNodeModules.split('/');
        if (parts.length >= 2) {
            return `${parts[0]}/${parts[1]}`;
        }
    } else {
        // Unscoped package
        const parts = afterNodeModules.split('/');
        if (parts.length >= 1) {
            return parts[0];
        }
    }

    return undefined;
}
