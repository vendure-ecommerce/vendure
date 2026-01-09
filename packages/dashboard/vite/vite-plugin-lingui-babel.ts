import * as babel from '@babel/core';
import type { Plugin } from 'vite';

/**
 * @description
 * A custom Vite plugin that transforms Lingui macros in the Vendure Dashboard source files
 * using Babel instead of SWC.
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
 * @see https://github.com/vendurehq/vendure/issues/3929
 * @see https://github.com/lingui/swc-plugin/issues/179
 */
export function linguiBabelPlugin(): Plugin {
    return {
        name: 'vendure:lingui-babel',
        // Run BEFORE @vitejs/plugin-react so the macros are already transformed
        // when the react plugin processes the file
        enforce: 'pre',

        async transform(code, id) {
            // Strip query params for path matching (Vite adds ?v=xxx for cache busting)
            const cleanId = id.split('?')[0];

            // Only process files from @vendure/dashboard source
            // This handles both:
            // 1. Local development in monorepo (path contains packages/dashboard/src)
            // 2. External projects (path contains node_modules/@vendure/dashboard/src)
            if (!cleanId.includes('@vendure/dashboard/src') && !cleanId.includes('packages/dashboard/src')) {
                return null;
            }

            // Only process TypeScript/JavaScript files
            if (!/\.[tj]sx?$/.test(cleanId)) {
                return null;
            }

            // Only process files that actually contain Lingui macro imports
            // This is a fast check to avoid running Babel on files that don't need it
            if (!code.includes('@lingui/') || !code.includes('/macro')) {
                return null;
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
