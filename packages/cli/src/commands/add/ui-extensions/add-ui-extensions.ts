import { log, note, outro, spinner } from '@clack/prompts';
import path from 'path';
import { ClassDeclaration } from 'ts-morph';

import { selectPluginClass } from '../../../shared/shared-prompts';
import {
    createFile,
    getRelativeImportPath,
    getTsMorphProject,
    getVendureConfig,
} from '../../../utilities/ast-utils';
import { determineVendureVersion, installRequiredPackages } from '../../../utilities/package-utils';

import { addUiExtensionStaticProp } from './codemods/add-ui-extension-static-prop/add-ui-extension-static-prop';
import { updateAdminUiPluginInit } from './codemods/update-admin-ui-plugin-init/update-admin-ui-plugin-init';

export async function addUiExtensions(providedPluginClass?: ClassDeclaration) {
    let pluginClass = providedPluginClass;
    let project = pluginClass?.getProject();
    if (!pluginClass || !project) {
        const projectSpinner = spinner();
        projectSpinner.start('Analyzing project...');
        await new Promise(resolve => setTimeout(resolve, 100));
        project = getTsMorphProject();
        projectSpinner.stop('Project analyzed');
        pluginClass = await selectPluginClass(project, 'Add UI extensions cancelled');
    }

    if (pluginAlreadyHasUiExtensionProp(pluginClass)) {
        outro('This plugin already has UI extensions configured');
        return;
    }
    addUiExtensionStaticProp(pluginClass);

    log.success('Updated the plugin class');
    const installSpinner = spinner();
    installSpinner.start(`Installing dependencies...`);
    try {
        const version = determineVendureVersion();
        await installRequiredPackages([
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

    const pluginDir = pluginClass.getSourceFile().getDirectory().getPath();
    const providersFile = createFile(project, path.join(__dirname, 'templates/providers.template.ts'));
    providersFile.move(path.join(pluginDir, 'ui', 'providers.ts'));
    const routesFile = createFile(project, path.join(__dirname, 'templates/routes.template.ts'));
    routesFile.move(path.join(pluginDir, 'ui', 'routes.ts'));

    log.success('Created UI extension scaffold');

    const vendureConfig = getVendureConfig(project);
    if (!vendureConfig) {
        log.warning(
            `Could not find the VendureConfig declaration in your project. You will need to manually set up the compileUiExtensions function.`,
        );
    } else {
        const pluginClassName = pluginClass.getName() as string;
        const pluginPath = getRelativeImportPath({
            to: vendureConfig.getSourceFile(),
            from: pluginClass.getSourceFile(),
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

    project.saveSync();
    if (!providedPluginClass) {
        outro('✅  Done!');
    }
}

function pluginAlreadyHasUiExtensionProp(pluginClass: ClassDeclaration) {
    const uiProperty = pluginClass.getProperty('ui');
    if (!uiProperty) {
        return false;
    }
    if (uiProperty.isStatic()) {
        return true;
    }
}
