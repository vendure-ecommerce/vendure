import { note, outro, spinner, log } from '@clack/prompts';
import path from 'path';
import { ClassDeclaration } from 'ts-morph';
import { Logger } from '../../../utilities/logger';
import { determineVendureVersion, installRequiredPackages } from '../../../utilities/package-utils';

import { Scaffolder } from '../../../utilities/scaffolder';
import { getTsMorphProject, getVendureConfig, selectPluginClass } from '../../../utilities/utils';

import { addUiExtensionStaticProp } from './codemods/add-ui-extension-static-prop/add-ui-extension-static-prop';
import { updateAdminUiPluginInit } from './codemods/update-admin-ui-plugin-init/update-admin-ui-plugin-init';
import { renderProviders } from './scaffold/providers';
import { renderRoutes } from './scaffold/routes';

export async function addUiExtensions() {
    const projectSpinner = spinner();
    projectSpinner.start('Analyzing project...');

    await new Promise(resolve => setTimeout(resolve, 100));
    const project = getTsMorphProject();
    projectSpinner.stop('Project analyzed');

    const pluginClass = await selectPluginClass(project, 'Add UI extensions cancelled');
    if (pluginAlreadyHasUiExtensionProp(pluginClass)) {
        outro('This plugin already has a UI extension configured');
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
        log.error(
            `Failed to install dependencies: ${
                e.message as string
            }. Run with --log-level=verbose to see more details.`,
        );
        Logger.verbose(e.stack);
    }
    installSpinner.stop('Dependencies installed');

    const scaffolder = new Scaffolder();
    scaffolder.addFile(renderProviders, 'providers.ts');
    scaffolder.addFile(renderRoutes, 'routes.ts');
    log.success('Created UI extension scaffold');

    const pluginDir = pluginClass.getSourceFile().getDirectory().getPath();
    scaffolder.createScaffold({
        dir: path.join(pluginDir, 'ui'),
        context: {},
    });
    const vendureConfig = getVendureConfig(project);
    if (!vendureConfig) {
        log.warning(
            `Could not find the VendureConfig declaration in your project. You will need to manually set up the compileUiExtensions function.`,
        );
    } else {
        const pluginClassName = pluginClass.getName() as string;
        const pluginPath = convertPathToRelativeImport(
            path.relative(
                vendureConfig.getSourceFile().getDirectory().getPath(),
                pluginClass.getSourceFile().getFilePath(),
            ),
        );
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
    outro('✅  Done!');
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

function convertPathToRelativeImport(filePath: string) {
    // Normalize the path separators
    const normalizedPath = filePath.replace(/\\/g, '/');

    // Remove the file extension
    const parsedPath = path.parse(normalizedPath);
    return `./${parsedPath.dir}/${parsedPath.name}`;
}
