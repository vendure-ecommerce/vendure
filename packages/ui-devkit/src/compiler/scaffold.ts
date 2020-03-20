/* tslint:disable:no-console */
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { spawn } from 'child_process';
import * as fs from 'fs-extra';
import glob from 'glob';
import * as path from 'path';

import { EXTENSION_ROUTES_FILE, MODULES_OUTPUT_DIR, SHARED_EXTENSIONS_FILE } from './constants';
import {
    AdminUiExtension,
    AdminUiExtensionLazyModule,
    AdminUiExtensionSharedModule,
    Translations,
} from './types';
import { copyStaticAsset, copyUiDevkit, logger, normalizeExtensions, shouldUseYarn } from './utils';

export async function setupScaffold(outputPath: string, extensions: AdminUiExtension[]) {
    deleteExistingExtensionModules(outputPath);
    copySourceIfNotExists(outputPath);
    const normalizedExtensions = normalizeExtensions(extensions);
    await copyExtensionModules(outputPath, normalizedExtensions);
    await mergeExtensionTranslations(outputPath, normalizedExtensions);
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

async function mergeExtensionTranslations(outputPath: string, extensions: Array<Required<AdminUiExtension>>) {
    // First collect all globs by language
    const allTranslations: { [languageCode in LanguageCode]?: string[] } = {};
    for (const extension of extensions) {
        for (const [languageCode, globPattern] of Object.entries(extension.translations)) {
            const code = languageCode as LanguageCode;
            if (globPattern) {
                if (!allTranslations[code]) {
                    allTranslations[code] = [globPattern];
                } else {
                    // tslint:disable-next-line:no-non-null-assertion
                    allTranslations[code]!.push(globPattern);
                }
            }
        }
    }
    // Now merge them into the final language-speicific json files
    const i18nMessagesDir = path.join(outputPath, 'src/i18n-messages');
    for (const [languageCode, globs] of Object.entries(allTranslations)) {
        if (!globs) {
            continue;
        }
        const translationFile = path.join(i18nMessagesDir, `${languageCode}.json`);
        const translationBackupFile = path.join(i18nMessagesDir, `${languageCode}.json.bak`);

        if (fs.existsSync(translationBackupFile)) {
            // restore the original translations from the backup
            await fs.copy(translationBackupFile, translationFile);
        }
        let translations: any = {};
        if (fs.existsSync(translationFile)) {
            // create a backup of the original (unextended) translations
            await fs.copy(translationFile, translationBackupFile);
            try {
                translations = require(translationFile);
            } catch (e) {
                logger.error(`Could not load translation file: ${translationFile}`);
                logger.error(e);
            }
        }

        for (const pattern of globs) {
            const files = glob.sync(pattern);
            for (const file of files) {
                try {
                    const contents = require(file);
                    translations = mergeTranslations(translations, contents);
                } catch (e) {
                    logger.error(`Could not load translation file: ${translationFile}`);
                    logger.error(e);
                }
            }
        }

        // write the final translation files to disk
        const sortedTranslations = sortTranslationKeys(translations);
        await fs.writeFile(translationFile, JSON.stringify(sortedTranslations, null, 2), 'utf8');
    }
}

/**
 * Merges the second set of translations into the first, returning a new translations
 * object.
 */
function mergeTranslations(t1: Translations, t2: Translations): Translations {
    const result = { ...t1 };
    for (const [section, translations] of Object.entries(t2)) {
        result[section] = {
            ...t1[section],
            ...translations,
        };
    }
    return result;
}

function sortTranslationKeys(translations: Translations): Translations {
    const result: Translations = {};
    const sections = Object.keys(translations).sort();
    for (const section of sections) {
        const sortedTokens = Object.entries(translations[section])
            .sort(([keyA], [keyB]) => (keyA < keyB ? -1 : 1))
            .reduce((output, [key, val]) => ({ ...output, [key]: val }), {});
        result[section] = sortedTokens;
    }
    return result;
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
