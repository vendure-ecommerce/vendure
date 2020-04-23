/* tslint:disable:no-console */
import { spawn } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';

import { EXTENSION_ROUTES_FILE, MODULES_OUTPUT_DIR, SHARED_EXTENSIONS_FILE } from './constants';
import { getAllTranslationFiles, mergeExtensionTranslations } from './translations';
import {
    AdminUiExtension,
    AdminUiExtensionLazyModule,
    AdminUiExtensionSharedModule,
    Extension,
} from './types';
import {
    copyStaticAsset,
    copyUiDevkit,
    isAdminUiExtension,
    logger,
    normalizeExtensions,
    shouldUseYarn,
} from './utils';

export async function setupScaffold(outputPath: string, extensions: Extension[]) {
    deleteExistingExtensionModules(outputPath);
    copySourceIfNotExists(outputPath);
    const adminUiExtensions = extensions.filter(isAdminUiExtension);
    const normalizedExtensions = normalizeExtensions(adminUiExtensions);
    await copyExtensionModules(outputPath, normalizedExtensions);
    const allTranslationFiles = getAllTranslationFiles(extensions);
    await mergeExtensionTranslations(outputPath, allTranslationFiles);
    copyUiDevkit(outputPath);
    try {
        await checkIfNgccWasRun();
    } catch (e) {
        const cmd = shouldUseYarn() ? 'yarn ngcc' : 'npx ngcc';
        logger.log(
            `An error occurred when running ngcc. Try removing node_modules, re-installing, and then manually running "${cmd}" in the project root.`,
        );
    }
}

/**
 * Deletes the contents of the /modules directory, which contains the plugin
 * extension modules copied over during the last compilation.
 */
function deleteExistingExtensionModules(outputPath: string) {
    fs.removeSync(path.join(outputPath, MODULES_OUTPUT_DIR));
}

/**
 * Copies all files from the extensionPaths of the configured extensions into the
 * admin-ui source tree.
 */
async function copyExtensionModules(outputPath: string, extensions: Array<Required<AdminUiExtension>>) {
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
                await copyStaticAsset(outputPath, asset);
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
            .map(m => `import { ${m.ngModuleName} } from '${getModuleFilePath(e.id, m)}';\n`)
			.join(''),
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
        logger.error(`Could not resolve the "@vendure/admin-ui/core" package!`);
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
        logger.log(
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
