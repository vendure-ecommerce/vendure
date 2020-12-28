/* tslint:disable:no-console */
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { AdminUiAppConfig, AdminUiAppDevModeConfig } from '@vendure/common/lib/shared-types';
import { ChildProcess, spawn } from 'child_process';
import { FSWatcher, watch as chokidarWatch } from 'chokidar';
import * as fs from 'fs-extra';
import * as path from 'path';

import { DEFAULT_BASE_HREF, MODULES_OUTPUT_DIR } from './constants';
import { setupScaffold } from './scaffold';
import { getAllTranslationFiles, mergeExtensionTranslations } from './translations';
import { Extension, StaticAssetDefinition, UiExtensionCompilerOptions } from './types';
import {
    copyStaticAsset,
    copyUiDevkit,
    getStaticAssetPath,
    isAdminUiExtension,
    normalizeExtensions,
    shouldUseYarn,
} from './utils';

/**
 * @description
 * Compiles the Admin UI app with the specified extensions.
 *
 * @docsCategory UiDevkit
 */
export function compileUiExtensions(
    options: UiExtensionCompilerOptions,
): AdminUiAppConfig | AdminUiAppDevModeConfig {
    const { outputPath, baseHref, devMode, watchPort, extensions } = options;
    if (devMode) {
        return runWatchMode(outputPath, baseHref || DEFAULT_BASE_HREF, watchPort || 4200, extensions);
    } else {
        return runCompileMode(outputPath, baseHref || DEFAULT_BASE_HREF, extensions);
    }
}

function runCompileMode(outputPath: string, baseHref: string, extensions: Extension[]): AdminUiAppConfig {
    const cmd = shouldUseYarn() ? 'yarn' : 'npm';
    const distPath = path.join(outputPath, 'dist');

    const compile = () =>
        new Promise<void>(async (resolve, reject) => {
            await setupScaffold(outputPath, extensions);
            const buildProcess = spawn(
                cmd,
                ['run', 'build', `--outputPath=${distPath}`, `--base-href=${baseHref}`],
                {
                    cwd: outputPath,
                    shell: true,
                    stdio: 'inherit',
                },
            );

            buildProcess.on('close', code => {
                if (code !== 0) {
                    reject(code);
                } else {
                    resolve();
                }
            });
        });

    return {
        path: distPath,
        compile,
        route: baseHrefToRoute(baseHref),
    };
}

function runWatchMode(
    outputPath: string,
    baseHref: string,
    port: number,
    extensions: Extension[],
): AdminUiAppDevModeConfig {
    const cmd = shouldUseYarn() ? 'yarn' : 'npm';
    const devkitPath = require.resolve('@vendure/ui-devkit');
    let buildProcess: ChildProcess;
    let watcher: FSWatcher | undefined;
    let close: () => void = () => {
        /* */
    };
    const compile = () =>
        new Promise<void>(async (resolve, reject) => {
            await setupScaffold(outputPath, extensions);
            const adminUiExtensions = extensions.filter(isAdminUiExtension);
            const normalizedExtensions = normalizeExtensions(adminUiExtensions);
            const allTranslationFiles = getAllTranslationFiles(extensions);
            buildProcess = spawn(cmd, ['run', 'start', `--port=${port}`, `--base-href=${baseHref}`], {
                cwd: outputPath,
                shell: true,
                stdio: 'inherit',
            });

            buildProcess.on('close', code => {
                if (code !== 0) {
                    reject(code);
                } else {
                    resolve();
                }
                close();
            });

            for (const extension of normalizedExtensions) {
                if (!watcher) {
                    watcher = chokidarWatch(extension.extensionPath, {
                        depth: 4,
                        ignored: '**/node_modules/',
                    });
                } else {
                    watcher.add(extension.extensionPath);
                }
                if (extension.staticAssets) {
                    for (const staticAssetDef of extension.staticAssets) {
                        const assetPath = getStaticAssetPath(staticAssetDef);
                        watcher.add(assetPath);
                    }
                }
            }
            for (const translationFiles of Object.values(allTranslationFiles)) {
                if (!translationFiles) {
                    continue;
                }
                for (const file of translationFiles) {
                    if (!watcher) {
                        watcher = chokidarWatch(file);
                    } else {
                        watcher.add(file);
                    }
                }
            }

            if (watcher) {
                // watch the ui-devkit package files too
                watcher.add(devkitPath);
            }

            if (watcher) {
                const allStaticAssetDefs = adminUiExtensions.reduce(
                    (defs, e) => [...defs, ...(e.staticAssets || [])],
                    [] as StaticAssetDefinition[],
                );

                watcher.on('change', async filePath => {
                    const extension = normalizedExtensions.find(e => filePath.includes(e.extensionPath));
                    if (extension) {
                        const outputDir = path.join(outputPath, MODULES_OUTPUT_DIR, extension.id);
                        const filePart = path.relative(extension.extensionPath, filePath);
                        const dest = path.join(outputDir, filePart);
                        await fs.copyFile(filePath, dest);
                    }
                    if (filePath.includes(devkitPath)) {
                        copyUiDevkit(outputPath);
                    }
                    for (const staticAssetDef of allStaticAssetDefs) {
                        const assetPath = getStaticAssetPath(staticAssetDef);
                        if (filePath.includes(assetPath)) {
                            await copyStaticAsset(outputPath, staticAssetDef);
                            return;
                        }
                    }
                    for (const languageCode of Object.keys(allTranslationFiles)) {
                        // tslint:disable-next-line:no-non-null-assertion
                        const translationFiles = allTranslationFiles[languageCode as LanguageCode]!;
                        for (const file of translationFiles) {
                            if (filePath.includes(path.normalize(file))) {
                                await mergeExtensionTranslations(outputPath, {
                                    [languageCode]: translationFiles,
                                });
                            }
                        }
                    }
                });
            }
            resolve();
        });

    close = () => {
        if (watcher) {
            watcher.close();
        }
        if (buildProcess) {
            buildProcess.kill();
        }
    };

    process.on('SIGINT', close);
    return { sourcePath: outputPath, port, compile, route: baseHrefToRoute(baseHref) };
}

function baseHrefToRoute(baseHref: string): string {
    return baseHref.replace(/^\//, '').replace(/\/$/, '');
}
