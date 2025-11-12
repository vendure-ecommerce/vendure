import {
    createCompilationErrorMessage,
    createCompiledCatalog,
    getCatalogForFile,
    getCatalogs,
} from '@lingui/cli/api';
import { getConfig } from '@lingui/conf';
import glob from 'fast-glob';
import * as fs from 'fs';
import * as path from 'path';
import type { Plugin } from 'vite';

import { getDashboardPaths } from './utils/get-dashboard-paths.js';
import { ConfigLoaderApi, getConfigLoaderApi } from './vite-plugin-config-loader.js';

export interface TranslationsPluginOptions {
    /**
     * Array of paths to .po files to merge with built-in translations
     */
    externalPoFiles?: string[];
    /**
     * Path to the built-in locales directory
     */
    localesDir?: string;
    /**
     * Output path for merged translations within the build output (e.g., 'i18n')
     */
    outputPath?: string;
    packageRoot: string;
}

type PluginTranslation = {
    pluginRootPath: string;
    translations: string[];
};

/**
 * @description
 * This Vite plugin compiles the source .po files into JS bundles that can be loaded statically.
 * During dev mode, the Lingui plugin is responsible for loading the po files dynamically.
 * @param options
 */
export function translationsPlugin(options: TranslationsPluginOptions): Plugin {
    let configLoaderApi: ConfigLoaderApi;
    const { localesDir = 'src/i18n/locales', outputPath = 'assets/i18n' } = options;

    const linguiConfig = getConfig({ configPath: path.join(options.packageRoot, 'lingui.config.js') });

    async function compileTranslations(pluginTranslations: PluginTranslation[], emitFile: any) {
        const resolvedLocalesDir = path.resolve(options.packageRoot, localesDir);

        for (const pluginTranslation of pluginTranslations) {
            if (pluginTranslation.translations.length === 0) {
                continue;
            }
            linguiConfig.catalogs?.push({
                path: pluginTranslation.translations[0]?.replace(/[a-z_-]+\.po$/, '{locale}') ?? '',
                include: [],
            });
        }

        // Get all built-in .po files
        const builtInFiles = fs
            .readdirSync(resolvedLocalesDir)
            .filter(file => file.endsWith('.po'))
            .map(file => path.join(resolvedLocalesDir, file));

        const pluginFiles = pluginTranslations.flatMap(translation => translation.translations);

        const catalogsPromise = getCatalogs(linguiConfig);
        const catalogs = await catalogsPromise;
        const mergedMessageMap = new Map<string, Record<string, string>>();

        for (const file of [...builtInFiles, ...pluginFiles]) {
            const catalogRelativePath = path.relative(options.packageRoot, file);
            const fileCatalog = getCatalogForFile(catalogRelativePath, catalogs);

            const { locale, catalog } = fileCatalog;

            const { messages } = await catalog.getTranslations(locale, {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                fallbackLocales: { default: linguiConfig.sourceLocale! },
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                sourceLocale: linguiConfig.sourceLocale!,
            });

            const mergedMessages = mergedMessageMap.get(locale) ?? {};
            mergedMessageMap.set(locale, { ...mergedMessages, ...messages });
        }

        for (const [locale, messages] of mergedMessageMap.entries()) {
            const { source: code, errors } = createCompiledCatalog(locale, messages, {
                namespace: 'es',
                pseudoLocale: linguiConfig.pseudoLocale,
            });

            if (errors.length) {
                const message = createCompilationErrorMessage(locale, errors);
                throw new Error(
                    message +
                        `These errors fail build because \`failOnCompileError=true\` in Lingui Vite plugin configuration.`,
                );
            }

            // Emit the compiled JavaScript file to the build output
            const outputFileName = path.posix.join(outputPath, `${locale}.js`);
            emitFile({
                type: 'asset',
                fileName: outputFileName,
                source: code,
            });
        }
    }

    return {
        name: 'vendure:compile-translations',
        configResolved({ plugins }) {
            configLoaderApi = getConfigLoaderApi(plugins);
        },
        async generateBundle() {
            // This runs during the bundle generation phase - emit files directly to build output
            try {
                const { pluginInfo } = await configLoaderApi.getVendureConfig();

                // Get any plugin-provided .po files
                const dashboardPaths = getDashboardPaths(pluginInfo);
                const pluginTranslations: PluginTranslation[] = [];
                for (const dashboardPath of dashboardPaths) {
                    const poPatterns = path.join(dashboardPath, '**/*.po');
                    const translations = await glob(poPatterns, {
                        ignore: [
                            // Standard test & doc files
                            '**/node_modules/**/node_modules/**',
                            '**/*.spec.js',
                            '**/*.test.js',
                        ],
                        onlyFiles: true,
                        absolute: true,
                        followSymbolicLinks: false,
                        stats: false,
                    });
                    pluginTranslations.push({
                        pluginRootPath: dashboardPath,
                        translations,
                    });
                }
                this.info(`Found ${pluginTranslations.length} plugins with translations`);
                await compileTranslations(pluginTranslations, this.emitFile);
            } catch (error) {
                this.error(
                    `Translation plugin error: ${error instanceof Error ? error.message : String(error)}`,
                );
            }
        },
    };
}
