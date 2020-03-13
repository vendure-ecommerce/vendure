/* tslint:disable:no-console */
import { AdminUiAppConfig, AdminUiAppDevModeConfig } from '@vendure/common/lib/shared-types';
import { ChildProcess, execSync, spawn } from 'child_process';
import { FSWatcher, watch as chokidarWatch } from 'chokidar';
import { createHash } from 'crypto';
import * as fs from 'fs-extra';
import * as path from 'path';

import {
    AdminUiExtension,
    AdminUiExtensionLazyModule,
    AdminUiExtensionSharedModule,
    UiExtensionCompilerOptions,
} from './types';

const STATIC_ASSETS_OUTPUT_DIR = 'static-assets';
const MODULES_OUTPUT_DIR = 'src/extensions';
const EXTENSION_ROUTES_FILE = 'src/extension.routes.ts';
const SHARED_EXTENSIONS_FILE = 'src/shared-extensions.module.ts';

/**
 * @description
 * Compiles the Admin UI app with the specified extensions.
 *
 * @docsCategory UiDevkit
 */
export function compileUiExtensions(
    options: UiExtensionCompilerOptions,
): AdminUiAppConfig | AdminUiAppDevModeConfig {
    const { outputPath, devMode, watchPort, extensions } = options;
    if (devMode) {
        return runWatchMode(outputPath, watchPort || 4200, extensions);
    } else {
        return runCompileMode(outputPath, extensions);
    }
}

function runCompileMode(outputPath: string, extensions: AdminUiExtension[]): AdminUiAppConfig {
    const cmd = shouldUseYarn() ? 'yarn' : 'npm';
    const distPath = path.join(outputPath, 'dist');

    const compile = () =>
        new Promise<void>(async (resolve, reject) => {
            await setupScaffold(outputPath, extensions);
            const buildProcess = spawn(cmd, ['run', 'build', `--outputPath=${distPath}`], {
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
            });
        });

    return {
        path: distPath,
        compile,
    };
}

function runWatchMode(
    outputPath: string,
    port: number,
    extensions: AdminUiExtension[],
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
            const normalizedExtensions = normalizeExtensions(extensions);
            buildProcess = spawn(cmd, ['run', 'start', `--port=${port}`, `--poll=1000`], {
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
            }

            if (watcher) {
                // watch the ui-devkit package files too
                watcher.add(devkitPath);
            }

            if (watcher) {
                watcher.on('change', filePath => {
                    const extension = normalizedExtensions.find(e => filePath.includes(e.extensionPath));
                    if (extension) {
                        if (extension.staticAssets) {
                            for (const assetPath of extension.staticAssets) {
                                if (filePath.includes(assetPath)) {
                                    copyStaticAsset(outputPath, assetPath);
                                    return;
                                }
                            }
                        }
                        const outputDir = path.join(outputPath, MODULES_OUTPUT_DIR, extension.id);
                        const filePart = path.relative(extension.extensionPath, filePath);
                        const dest = path.join(outputDir, filePart);
                        fs.copyFile(filePath, dest);
                    }
                    if (filePath.includes(devkitPath)) {
                        copyUiDevkit(outputPath);
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
    return { sourcePath: outputPath, port, compile };
}

async function setupScaffold(outputPath: string, extensions: AdminUiExtension[]) {
    deleteExistingExtensionModules(outputPath);
    copySourceIfNotExists(outputPath);
    copyExtensionModules(outputPath, normalizeExtensions(extensions));
    copyUiDevkit(outputPath);
    try {
        await checkIfNgccWasRun();
    } catch (e) {
        const cmd = shouldUseYarn() ? 'yarn ngcc' : 'npx ngcc';
        console.log(
            `An error occurred when running ngcc. Try removing node_modules, re-installing, and then manually running "${cmd}" in the project root.`,
        );
    }
}

/**
 * Deletes the contents of the /modules directory, which contains the plugin
 * extension modules copied over during the last compilation.
 */
export function deleteExistingExtensionModules(outputPath: string) {
    fs.removeSync(path.join(outputPath, MODULES_OUTPUT_DIR));
}

/**
 * Ensures each extension has an ID. If not defined by the user, a deterministic ID is generated
 * from a hash of the extension config.
 */
function normalizeExtensions(extensions?: AdminUiExtension[]): Array<Required<AdminUiExtension>> {
    return (extensions || []).map(e => {
        if (e.id) {
            return e as Required<AdminUiExtension>;
        }
        const hash = createHash('sha256');
        hash.update(JSON.stringify(e));
        const id = hash.digest('hex');
        return { staticAssets: [], ...e, id };
    });
}

/**
 * Copies all files from the extensionPaths of the configured extensions into the
 * admin-ui source tree.
 */
export function copyExtensionModules(outputPath: string, extensions: Array<Required<AdminUiExtension>>) {
    const extensionRoutesSource = generateLazyExtensionRoutes(extensions);
    fs.writeFileSync(path.join(outputPath, EXTENSION_ROUTES_FILE), extensionRoutesSource, 'utf8');
    const sharedExtensionModulesSource = generateSharedExtensionModule(extensions);
    fs.writeFileSync(path.join(outputPath, SHARED_EXTENSIONS_FILE), sharedExtensionModulesSource, 'utf8');

    for (const extension of extensions) {
        const dirName = path.basename(path.dirname(extension.extensionPath));
        const dest = path.join(outputPath, MODULES_OUTPUT_DIR, extension.id);
        fs.copySync(extension.extensionPath, dest);
        if (Array.isArray(extension.staticAssets)) {
            for (const asset of extension.staticAssets) {
                copyStaticAsset(outputPath, asset);
            }
        }
    }
}

function generateLazyExtensionRoutes(extensions: Array<Required<AdminUiExtension>>): string {
    const routes: string[] = [];
    for (const extension of extensions as Array<Required<AdminUiExtension>>) {
        for (const module of extension.ngModules) {
            if (module.type === 'lazy') {
                routes.push(`  {
    path: 'extensions/${module.route}',
    loadChildren: () => import('${getModuleFilePath(extension.id, module)}').then(m => m.${
                    module.ngModuleName
                }),
  }`);
            }
        }
    }
    return `export const extensionRoutes = [${routes.join(',\n')}];\n`;
}

function generateSharedExtensionModule(extensions: Array<Required<AdminUiExtension>>) {
    return `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
${extensions
    .map(e =>
        e.ngModules
            .filter(m => m.type === 'shared')
            .map(m => `import { ${m.ngModuleName} } from '${getModuleFilePath(e.id, m)}';\n`),
    )
    .join('')}

@NgModule({
    imports: [CommonModule, ${extensions
        .map(e =>
            e.ngModules
                .filter(m => m.type === 'shared')
                .map(m => m.ngModuleName)
                .join(', '),
        )
        .join(', ')}],
})
export class SharedExtensionsModule {}
`;
}

function getModuleFilePath(
    id: string,
    module: AdminUiExtensionLazyModule | AdminUiExtensionSharedModule,
): string {
    return `./extensions/${id}/${path.basename(module.ngModuleFileName, '.ts')}`;
}

/**
 * Copies over any files defined by the extensions' `staticAssets` array to the shared
 * static assets directory. When the app is built by the ng cli, this assets directory is
 * the copied over to the final static assets location (i.e. http://domain/admin/assets/)
 */
export function copyStaticAsset(outputPath: string, staticAssetPath: string) {
    const stats = fs.statSync(staticAssetPath);
    if (stats.isDirectory()) {
        const assetDirname = path.basename(staticAssetPath);
        fs.copySync(staticAssetPath, path.join(outputPath, STATIC_ASSETS_OUTPUT_DIR, assetDirname));
    } else {
        fs.copySync(staticAssetPath, path.join(outputPath, STATIC_ASSETS_OUTPUT_DIR));
    }
}

/**
 * Copy the @vendure/ui-devkit files to the static assets dir.
 */
export function copyUiDevkit(outputPath: string) {
    const devkitDir = path.join(outputPath, STATIC_ASSETS_OUTPUT_DIR, 'devkit');
    fs.ensureDirSync(devkitDir);
    fs.copySync(require.resolve('@vendure/ui-devkit'), path.join(devkitDir, 'ui-devkit.js'));
}

/**
 * Copy the Admin UI sources & static assets to the outputPath if it does not already
 * exists there.
 */
function copySourceIfNotExists(outputPath: string) {
    const angularJsonFile = path.join(outputPath, 'angular.json');
    const indexFile = path.join(outputPath, '/src/index.html');
    if (fs.existsSync(angularJsonFile) && fs.existsSync(indexFile)) {
        return;
    }
    const scaffoldDir = path.join(__dirname, '../scaffold');
    const adminUiSrc = path.join(require.resolve('@vendure/admin-ui'), '../../static');

    if (!fs.existsSync(scaffoldDir)) {
        throw new Error(`Could not find the admin ui scaffold files at ${scaffoldDir}`);
    }
    if (!fs.existsSync(adminUiSrc)) {
        throw new Error(`Could not find the @vendure/admin-ui sources. Looked in ${adminUiSrc}`);
    }

    // copy scaffold
    fs.removeSync(outputPath);
    fs.ensureDirSync(outputPath);
    fs.copySync(scaffoldDir, outputPath);

    // copy source files from admin-ui package
    const outputSrc = path.join(outputPath, 'src');
    fs.ensureDirSync(outputSrc);
    fs.copySync(adminUiSrc, outputSrc);
}

/**
 * Attempts to find out it the ngcc compiler has been run on the Angular packages, and if not,
 * attemps to run it. This is done this way because attempting to run ngcc from a sub-directory
 * where the angular libs are in a higher-level node_modules folder currently results in the error
 * NG6002, see https://github.com/angular/angular/issues/35747.
 *
 * However, when ngcc is run from the root, it works.
 */
async function checkIfNgccWasRun(): Promise<void> {
    const coreUmdFile = require.resolve('@vendure/admin-ui/core');
    if (!coreUmdFile) {
        console.log(`Could not resolve the "@vendure/admin-ui/core" package!`);
        return;
    }
    // ngcc creates a particular folder after it has been run once
    const ivyDir = path.join(coreUmdFile, '../..', '__ivy_ngcc__');
    if (fs.existsSync(ivyDir)) {
        return;
    }
    // Looks like ngcc has not been run, so attempt to do so.
    const rootDir = coreUmdFile.split('node_modules')[0];
    return new Promise((resolve, reject) => {
        console.log(
            'Running the Angular Ivy compatibility compiler (ngcc) on Vendure Admin UI dependencies ' +
                '(this is only needed on the first run)...',
        );
        const cmd = shouldUseYarn() ? 'yarn' : 'npx';
        const ngccProcess = spawn(
            cmd,
            [
                'ngcc',
                '--properties es2015 browser module main',
                '--first-only',
                '--create-ivy-entry-points',
                '-l=error',
            ],
            {
                cwd: rootDir,
                shell: true,
                stdio: 'inherit',
            },
        );

        ngccProcess.on('close', code => {
            if (code !== 0) {
                reject(code);
            } else {
                resolve();
            }
        });
    });
}

export function shouldUseYarn(): boolean {
    try {
        execSync('yarnpkg --version', { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
}
