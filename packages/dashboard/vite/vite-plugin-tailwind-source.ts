import path from 'path';
import { Plugin } from 'vite';

import { CompileResult } from './utils/compiler.js';
import { ConfigLoaderApi, getConfigLoaderApi } from './vite-plugin-config-loader.js';

/**
 * This Vite plugin transforms the `app/styles.css` file to include a `@source` directive
 * for each dashboard extension's source directory. This allows Tailwind CSS to
 * include styles from these extensions when processing the CSS.
 */
export function dashboardTailwindSourcePlugin(): Plugin {
    let configLoaderApi: ConfigLoaderApi;
    let loadVendureConfigResult: CompileResult;
    return {
        name: 'vendure:dashboard-tailwind-source',
        // Ensure this plugin runs before Tailwind CSS processing
        enforce: 'pre',
        configResolved({ plugins }) {
            configLoaderApi = getConfigLoaderApi(plugins);
        },
        async transform(src, id) {
            if (/app\/styles.css$/.test(id)) {
                if (!loadVendureConfigResult) {
                    loadVendureConfigResult = await configLoaderApi.getVendureConfig();
                }
                const { pluginInfo } = loadVendureConfigResult;
                const dashboardExtensionDirs =
                    pluginInfo
                        ?.flatMap(({ dashboardEntryPath, sourcePluginPath, pluginPath }) => {
                            if (!dashboardEntryPath) {
                                return [];
                            }
                            const sourcePaths = [];
                            if (sourcePluginPath) {
                                sourcePaths.push(
                                    path.join(
                                        path.dirname(sourcePluginPath),
                                        path.dirname(dashboardEntryPath),
                                    ),
                                );
                            }
                            if (pluginPath) {
                                sourcePaths.push(
                                    path.join(path.dirname(pluginPath), path.dirname(dashboardEntryPath)),
                                );
                            }
                            return sourcePaths;
                        })
                        .filter(x => x != null) ?? [];
                const sources = dashboardExtensionDirs
                    .map(extension => {
                        return `@source '${extension}';`;
                    })
                    .join('\n');

                // Find the line with the specific comment and insert sources after it
                const lines = src.split('\n');
                const sourceCommentIndex = lines.findIndex(line =>
                    line.includes(
                        '/* @source rules from extensions will be added here by the dashboardTailwindSourcePlugin */',
                    ),
                );

                if (sourceCommentIndex !== -1) {
                    // Insert the sources after the comment line
                    lines.splice(sourceCommentIndex + 1, 0, sources);
                    const modifiedSrc = lines.join('\n');
                    return {
                        code: modifiedSrc,
                    };
                }

                // If the comment is not found, append sources at the end
                return {
                    code: src + '\n' + sources,
                };
            }
        },
    };
}
