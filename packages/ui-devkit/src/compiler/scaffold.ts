/* tslint:disable:no-console */
import { spawn } from 'child_process';
import * as fs from 'fs-extra';
import glob from 'glob';
import * as path from 'path';

import {
    EXTENSION_ROUTES_FILE,
    GLOBAL_STYLES_OUTPUT_DIR,
    MODULES_OUTPUT_DIR,
    SHARED_EXTENSIONS_FILE,
} from './constants';
import { getAllTranslationFiles, mergeExtensionTranslations } from './translations';
import {
    AdminUiExtensionLazyModule,
    AdminUiExtensionSharedModule,
    AdminUiExtensionWithId,
    Extension,
    GlobalStylesExtension,
    SassVariableOverridesExtension,
    StaticAssetExtension,
} from './types';
import {
    copyStaticAsset,
    copyUiDevkit,
    isAdminUiExtension,
    isGlobalStylesExtension,
    isSassVariableOverridesExtension,
    isStaticAssetExtension,
    isTranslationExtension,
    logger,
    normalizeExtensions,
    shouldUseYarn,
} from './utils';

export async function setupScaffold(outputPath: string, extensions: Extension[]) {
    deleteExistingExtensionModules(outputPath);

    const adminUiExtensions = extensions.filter(isAdminUiExtension);
    const normalizedExtensions = normalizeExtensions(adminUiExtensions);

    const modulePathMapping = generateModulePathMapping(normalizedExtensions);
    copyAdminUiSource(outputPath, modulePathMapping);

    await copyExtensionModules(outputPath, normalizedExtensions);

    const staticAssetExtensions = extensions.filter(isStaticAssetExtension);
    await copyStaticAssets(outputPath, staticAssetExtensions);

    const globalStyleExtensions = extensions.filter(isGlobalStylesExtension);
    const sassVariableOverridesExtension = extensions.find(isSassVariableOverridesExtension);
    await addGlobalStyles(outputPath, globalStyleExtensions, sassVariableOverridesExtension);

    const allTranslationFiles = getAllTranslationFiles(extensions.filter(isTranslationExtension));
    await mergeExtensionTranslations(outputPath, allTranslationFiles);

    copyUiDevkit(outputPath);
    try {
        await checkIfNgccWasRun();
    } catch (e: any) {
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
 * Generates a module path mapping object for all extensions with a "pathAlias"
 * property declared (if any).
 */
function generateModulePathMapping(extensions: AdminUiExtensionWithId[]) {
    const extensionsWithAlias = extensions.filter(e => e.pathAlias);
    if (extensionsWithAlias.length === 0) {
        return undefined;
    }

    return extensionsWithAlias.reduce((acc, e) => {
        // for imports from the index file if there is one
        acc[e.pathAlias as string] = [`src/extensions/${e.id}`];
        // direct access to files / deep imports
        acc[`${e.pathAlias as string}/*`] = [`src/extensions/${e.id}/*`];
        return acc;
    }, {} as Record<string, string[]>);
}

/**
 * Copies all files from the extensionPaths of the configured extensions into the
 * admin-ui source tree.
 */
async function copyExtensionModules(outputPath: string, extensions: AdminUiExtensionWithId[]) {
    const extensionRoutesSource = generateLazyExtensionRoutes(extensions);
    fs.writeFileSync(path.join(outputPath, EXTENSION_ROUTES_FILE), extensionRoutesSource, 'utf8');
    const sharedExtensionModulesSource = generateSharedExtensionModule(extensions);
    fs.writeFileSync(path.join(outputPath, SHARED_EXTENSIONS_FILE), sharedExtensionModulesSource, 'utf8');

    for (const extension of extensions) {
        const dest = path.join(outputPath, MODULES_OUTPUT_DIR, extension.id);
        if (!extension.exclude) {
            fs.copySync(extension.extensionPath, dest);
            continue;
        }

        const exclude = extension.exclude
            .map(e => glob.sync(path.join(extension.extensionPath, e)))
            .flatMap(e => e);
        fs.copySync(extension.extensionPath, dest, {
            filter: name => name === extension.extensionPath || exclude.every(e => e !== name),
        });
    }
}

async function copyStaticAssets(outputPath: string, extensions: Array<Partial<StaticAssetExtension>>) {
    for (const extension of extensions) {
        if (Array.isArray(extension.staticAssets)) {
            for (const asset of extension.staticAssets) {
                await copyStaticAsset(outputPath, asset);
            }
        }
    }
}

async function addGlobalStyles(
    outputPath: string,
    globalStylesExtensions: GlobalStylesExtension[],
    sassVariableOverridesExtension?: SassVariableOverridesExtension,
) {
    const globalStylesDir = path.join(outputPath, 'src', GLOBAL_STYLES_OUTPUT_DIR);
    await fs.remove(globalStylesDir);
    await fs.ensureDir(globalStylesDir);

    const imports: string[] = [];
    for (const extension of globalStylesExtensions) {
        const styleFiles = Array.isArray(extension.globalStyles)
            ? extension.globalStyles
            : [extension.globalStyles];
        for (const styleFile of styleFiles) {
            await copyGlobalStyleFile(outputPath, styleFile);
            imports.push(path.basename(styleFile, path.extname(styleFile)));
        }
    }

    let overridesImport = '';
    if (sassVariableOverridesExtension) {
        const overridesFile = sassVariableOverridesExtension.sassVariableOverrides;
        await copyGlobalStyleFile(outputPath, overridesFile);
        overridesImport = `@import "./${GLOBAL_STYLES_OUTPUT_DIR}/${path.basename(
            overridesFile,
            path.extname(overridesFile),
        )}";\n`;
    }

    const globalStylesSource =
        overridesImport +
        `@import "./styles/styles";\n` +
        imports.map(file => `@import "./${GLOBAL_STYLES_OUTPUT_DIR}/${file}";`).join('\n');

    const globalStylesFile = path.join(outputPath, 'src', 'global-styles.scss');
    await fs.writeFile(globalStylesFile, globalStylesSource, 'utf-8');
}

export async function copyGlobalStyleFile(outputPath: string, stylePath: string) {
    const globalStylesDir = path.join(outputPath, 'src', GLOBAL_STYLES_OUTPUT_DIR);
    const fileBasename = path.basename(stylePath);
    const styleOutputPath = path.join(globalStylesDir, fileBasename);
    await fs.copyFile(stylePath, styleOutputPath);
}

function generateLazyExtensionRoutes(extensions: AdminUiExtensionWithId[]): string {
    const routes: string[] = [];
    for (const extension of extensions as AdminUiExtensionWithId[]) {
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

function generateSharedExtensionModule(extensions: AdminUiExtensionWithId[]) {
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
 * Copies the Admin UI sources & static assets to the outputPath if it does not already
 * exist there.
 */
function copyAdminUiSource(outputPath: string, modulePathMapping: Record<string, string[]> | undefined) {
    const tsconfigFilePath = path.join(outputPath, 'tsconfig.json');
    const indexFilePath = path.join(outputPath, '/src/index.html');
    if (fs.existsSync(tsconfigFilePath) && fs.existsSync(indexFilePath)) {
        configureModulePathMapping(tsconfigFilePath, modulePathMapping);
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
    configureModulePathMapping(tsconfigFilePath, modulePathMapping);

    // copy source files from admin-ui package
    const outputSrc = path.join(outputPath, 'src');
    fs.ensureDirSync(outputSrc);
    fs.copySync(adminUiSrc, outputSrc);
}

/**
 * Adds module path mapping to the bundled tsconfig.json file if defined as a UI extension.
 */
function configureModulePathMapping(
    tsconfigFilePath: string,
    modulePathMapping: Record<string, string[]> | undefined,
) {
    if (!modulePathMapping) {
        return;
    }

    const tsconfig = require(tsconfigFilePath);
    tsconfig.compilerOptions.paths = modulePathMapping;
    fs.writeFileSync(tsconfigFilePath, JSON.stringify(tsconfig, null, 2));
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
