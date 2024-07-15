import { cancel, log, note, outro, spinner } from '@clack/prompts';
import fs from 'fs-extra';
import path from 'path';

import { CliCommand, CliCommandReturnVal } from '../../../shared/cli-command';
import { PackageJson } from '../../../shared/package-json-ref';
import { analyzeProject, selectPlugin } from '../../../shared/shared-prompts';
import { VendureConfigRef } from '../../../shared/vendure-config-ref';
import { VendurePluginRef } from '../../../shared/vendure-plugin-ref';
import { createFile, getRelativeImportPath } from '../../../utilities/ast-utils';

import { addUiExtensionStaticProp } from './codemods/add-ui-extension-static-prop/add-ui-extension-static-prop';
import { updateAdminUiPluginInit } from './codemods/update-admin-ui-plugin-init/update-admin-ui-plugin-init';

export interface AddUiExtensionsOptions {
    plugin?: VendurePluginRef;
}

export const addUiExtensionsCommand = new CliCommand<AddUiExtensionsOptions>({
    id: 'add-ui-extensions',
    category: 'Plugin: UI',
    description: 'Set up Admin UI extensions',
    run: options => addUiExtensions(options),
});

async function addUiExtensions(options?: AddUiExtensionsOptions): Promise<CliCommandReturnVal> {
    const providedVendurePlugin = options?.plugin;
    const { project } = await analyzeProject({ providedVendurePlugin });
    const vendurePlugin =
        providedVendurePlugin ?? (await selectPlugin(project, 'Add UI extensions cancelled'));
    const packageJson = new PackageJson(project);

    if (vendurePlugin.hasUiExtensions()) {
        outro('This plugin already has UI extensions configured');
        return { project, modifiedSourceFiles: [] };
    }
    addUiExtensionStaticProp(vendurePlugin);

    log.success('Updated the plugin class');
    const installSpinner = spinner();
    const packageManager = packageJson.determinePackageManager();
    const packageJsonFile = packageJson.locatePackageJsonWithVendureDependency();
    log.info(`Detected package manager: ${packageManager}`);
    if (!packageJsonFile) {
        cancel(`Could not locate package.json file with a dependency on Vendure.`);
        process.exit(1);
    }
    log.info(`Detected package.json: ${packageJsonFile}`);
    installSpinner.start(`Installing dependencies using ${packageManager}...`);
    try {
        const version = packageJson.determineVendureVersion();
        await packageJson.installPackages([
            {
                pkg: '@vendure/ui-devkit',
                isDevDependency: true,
                version,
            },
            {
                pkg: '@types/react',
                isDevDependency: true,
            },
        ]);
    } catch (e: any) {
        log.error(`Failed to install dependencies: ${e.message as string}.`);
    }
    installSpinner.stop('Dependencies installed');

    const pluginDir = vendurePlugin.getPluginDir().getPath();

    const providersFileDest = path.join(pluginDir, 'ui', 'providers.ts');
    if (!fs.existsSync(providersFileDest)) {
        createFile(project, path.join(__dirname, 'templates/providers.template.ts'), providersFileDest);
    }
    const routesFileDest = path.join(pluginDir, 'ui', 'routes.ts');
    if (!fs.existsSync(routesFileDest)) {
        createFile(project, path.join(__dirname, 'templates/routes.template.ts'), routesFileDest);
    }

    log.success('Created UI extension scaffold');

    const vendureConfig = new VendureConfigRef(project);
    if (!vendureConfig) {
        log.warning(
            `Could not find the VendureConfig declaration in your project. You will need to manually set up the compileUiExtensions function.`,
        );
    } else {
        const pluginClassName = vendurePlugin.name;
        const pluginPath = getRelativeImportPath({
            to: vendurePlugin.classDeclaration.getSourceFile(),
            from: vendureConfig.sourceFile,
        });
        const updated = updateAdminUiPluginInit(vendureConfig, { pluginClassName, pluginPath });
        if (updated) {
            log.success('Updated VendureConfig file');
        } else {
            log.warning(`Could not update \`AdminUiPlugin.init()\` options.`);
            note(
                `You will need to manually set up the compileUiExtensions function,\nadding ` +
                    `the \`${pluginClassName}.ui\` object to the \`extensions\` array.`,
                'Info',
            );
        }
    }

    await project.save();
    return { project, modifiedSourceFiles: [vendurePlugin.classDeclaration.getSourceFile()] };
}
