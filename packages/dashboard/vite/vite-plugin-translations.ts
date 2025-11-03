import {
    createCompilationErrorMessage,
    createCompiledCatalog,
    getCatalogForFile,
    getCatalogs,
} from '@lingui/cli/api';
import { getConfig } from '@lingui/conf';
import * as fs from 'fs';
import * as path from 'path';
import type { Plugin } from 'vite';

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

type TranslationFile = {
    name: string;
    path: string;
};

/**
 * @description
 * This Vite plugin compiles
 * @param options
 */
export function translationsPlugin(options: TranslationsPluginOptions): Plugin {
    const { externalPoFiles = [], localesDir = 'src/i18n/locales', outputPath = 'assets/i18n' } = options;

    const linguiConfig = getConfig({ configPath: path.join(options.packageRoot, 'lingui.config.js') });

    const catalogsPromise = getCatalogs(linguiConfig);

    async function compileTranslations(files: TranslationFile[], emitFile: any) {
        const catalogs = await catalogsPromise;
        for (const file of files) {
            const catalogRelativePath = path.relative(options.packageRoot, file.path);
            const fileCatalog = getCatalogForFile(catalogRelativePath, catalogs);

            const { locale, catalog } = fileCatalog;

            const { messages } = await catalog.getTranslations(locale, {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                fallbackLocales: { default: linguiConfig.sourceLocale! },
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                sourceLocale: linguiConfig.sourceLocale!,
            });

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
        async generateBundle() {
            // This runs during the bundle generation phase - emit files directly to build output
            try {
                const resolvedLocalesDir = path.resolve(options.packageRoot, localesDir);

                // Get all built-in .po files
                const builtInFiles = fs
                    .readdirSync(resolvedLocalesDir)
                    .filter(file => file.endsWith('.po'))
                    .map(file => ({
                        name: file,
                        path: path.join(resolvedLocalesDir, file),
                    }));

                await compileTranslations(builtInFiles, this.emitFile);

                this.info(`✓ Processed ${builtInFiles.length} translation files to ${outputPath}`);
            } catch (error) {
                this.error(
                    `Translation plugin error: ${error instanceof Error ? error.message : String(error)}`,
                );
            }
        },
    };
}
