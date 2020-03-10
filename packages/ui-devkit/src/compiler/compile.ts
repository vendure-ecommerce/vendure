import {
    AdminUiApp,
    AdminUiAppDevMode,
    AdminUiExtension,
    AdminUiExtensionLazyModule,
    AdminUiExtensionSharedModule,
} from '@vendure/common/lib/shared-types';
import { ChildProcess, execSync, spawn } from 'child_process';
import { FSWatcher, watch as chokidarWatch } from 'chokidar';
import { createHash } from 'crypto';
import * as fs from 'fs-extra';
import * as path from 'path';

const STATIC_ASSETS_OUTPUT_DIR = 'static-assets';
const MODULES_OUTPUT_DIR = 'src/extensions';
const EXTENSION_ROUTES_FILE = 'src/extension.routes.ts';
const SHARED_EXTENSIONS_FILE = 'src/shared-extensions.module.ts';

export interface UiExtensionCompilerOptions {
    /**
     * @description
     * The directory into which the sources for the extended Admin UI will be copied.
     */
    outputPath: string;
    /**
     * @description
     * An array of objects which configure extension Angular modules
     * to be compiled into and made available by the AdminUi application.
     */
    extensions: AdminUiExtension[];
    /**
     * @description
     * Set to `true` in order to compile the Admin UI in development mode (using the Angular CLI
     * [ng serve](https://angular.io/cli/serve) command). When in watch mode, any changes to
     * UI extension files will be watched and trigger a rebuild of the Admin UI with live
     * reloading.
     *
     * @default false
     */
    watch?: boolean;
    /**
     * @description
     * In watch mode, allows the port of the dev server to be specified. Defaults to the Angular CLI default
     * of `4200`.
     *
     * @default 4200 | undefined
     */
    watchPort?: number;
}

/**
 * Builds the admin-ui app using the Angular CLI `ng build --prod` command.
 */
export function compileUiExtensions({
    outputPath,
    watch,
    watchPort,
    extensions,
}: UiExtensionCompilerOptions): AdminUiApp | AdminUiAppDevMode {
    if (watch) {
        return runWatchMode(outputPath, watchPort || 4200, extensions);
    } else {
        return runCompileMode(outputPath, extensions);
    }
}

function runCompileMode(outputPath: string, extensions: AdminUiExtension[]): AdminUiApp {
    const cmd = shouldUseYarn() ? 'yarn' : 'npm';
    const distPath = path.join(outputPath, 'dist');

    const compile = () =>
        new Promise<void>((resolve, reject) => {
            setupScaffold(outputPath, extensions);
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

function runWatchMode(outputPath: string, port: number, extensions: AdminUiExtension[]): AdminUiAppDevMode {
    const cmd = shouldUseYarn() ? 'yarn' : 'npm';
    const devkitPath = require.resolve('@vendure/ui-devkit');
    let buildProcess: ChildProcess;
    let watcher: FSWatcher | undefined;
    const compile = () =>
        new Promise<void>((resolve, reject) => {
            setupScaffold(outputPath, extensions);
            const normalizedExtensions = normalizeExtensions(extensions);
            buildProcess = spawn(cmd, ['run', 'start', `--port=${port}`, `--poll=1000`], {
                cwd: outputPath,
                shell: true,
                stdio: 'inherit',
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
        });

    const close = () => {
        if (watcher) {
            watcher.close();
        }
        buildProcess.kill();
    };

    process.on('SIGINT', close);
    return { sourcePath: outputPath, port, onClose: close, compile };
}

function setupScaffold(outputPath: string, extensions: AdminUiExtension[]) {
    deleteExistingExtensionModules(outputPath);
    copySourceIfNotExists(outputPath);
    copyExtensionModules(outputPath, normalizeExtensions(extensions));
    copyUiDevkit(outputPath);
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
    path: module.route,
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
${extensions.map(e =>
    e.ngModules
        .filter(m => m.type === 'shared')
        .map(m => `import { ${m.ngModuleName} } from '${getModuleFilePath(e.id, m)}';`)
        .join('\n'),
)}

@NgModule({
    imports: [CommonModule, ${extensions.map(e =>
        e.ngModules
            .filter(m => m.type === 'shared')
            .map(m => m.ngModuleName)
            .join(', '),
    )}],
})
export class SharedExtensionsModule {}
`;
}

function getModuleFilePath(
    id: string,
    module: AdminUiExtensionLazyModule | AdminUiExtensionSharedModule,
): string {
    return `./extensions/${id}/${path.basename(module.ngModuleFileName, 'ts')}`;
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
    const adminUiSrc = path.join(__dirname, '../../admin-ui/static');

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

export function shouldUseYarn(): boolean {
    try {
        execSync('yarnpkg --version', { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
}
