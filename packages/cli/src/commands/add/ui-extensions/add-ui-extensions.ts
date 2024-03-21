import { log, note, outro, spinner } from '@clack/prompts';
import path from 'path';

import { PackageJson } from '../../../shared/package-json-ref';
import { analyzeProject, selectPlugin } from '../../../shared/shared-prompts';
import { VendureConfigRef } from '../../../shared/vendure-config-ref';
import { VendurePluginRef } from '../../../shared/vendure-plugin-ref';
import { createFile, getRelativeImportPath } from '../../../utilities/ast-utils';

import { addUiExtensionStaticProp } from './codemods/add-ui-extension-static-prop/add-ui-extension-static-prop';
import { updateAdminUiPluginInit } from './codemods/update-admin-ui-plugin-init/update-admin-ui-plugin-init';

export async function addUiExtensions(providedVendurePlugin?: VendurePluginRef) {
    const project = await analyzeProject({ providedVendurePlugin });
    const vendurePlugin =
        providedVendurePlugin ?? (await selectPlugin(project, 'Add UI extensions cancelled'));
    const packageJson = new PackageJson(project);

    if (vendurePlugin.hasUiExtensions()) {
        outro('This plugin already has UI extensions configured');
        return;
    }
    addUiExtensionStaticProp(vendurePlugin);

    log.success('Updated the plugin class');
    const installSpinner = spinner();
    installSpinner.start(`Installing dependencies...`);
    try {
        const version = packageJson.determineVendureVersion();
        await packageJson.installPackages([
            {
                pkg: '@vendure/ui-devkit',
                isDevDependency: true,
                version,
            },
        ]);
    } catch (e: any) {
        log.error(`Failed to install dependencies: ${e.message as string}.`);
    }
    installSpinner.stop('Dependencies installed');

    const pluginDir = vendurePlugin.getPluginDir().getPath();
    const providersFile = createFile(project, path.join(__dirname, 'templates/providers.template.ts'));
    providersFile.move(path.join(pluginDir, 'ui', 'providers.ts'));
    const routesFile = createFile(project, path.join(__dirname, 'templates/routes.template.ts'));
    routesFile.move(path.join(pluginDir, 'ui', 'routes.ts'));

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
    if (!providedVendurePlugin) {
        outro('✅  Done!');
    }
}
