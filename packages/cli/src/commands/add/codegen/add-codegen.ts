import { log, note, outro, spinner } from '@clack/prompts';
import path from 'path';
import { StructureKind } from 'ts-morph';

import { analyzeProject, selectMultiplePluginClasses } from '../../../shared/shared-prompts';
import { getRelativeImportPath } from '../../../utilities/ast-utils';
import { CodegenConfigRef } from '../../../utilities/codegen-config-ref';
import { PackageJson } from '../../../utilities/package-utils';
import { VendurePluginRef } from '../../../utilities/vendure-plugin-ref';

export async function addCodegen(providedVendurePlugin?: VendurePluginRef) {
    const project = await analyzeProject({
        providedVendurePlugin,
        cancelledMessage: 'Add codegen cancelled',
    });
    const plugins = providedVendurePlugin
        ? [providedVendurePlugin]
        : await selectMultiplePluginClasses(project, 'Add codegen cancelled');

    const packageJson = new PackageJson(project);
    const installSpinner = spinner();
    installSpinner.start(`Installing dependencies...`);
    const packagesToInstall = [
        {
            pkg: '@graphql-codegen/cli',
            isDevDependency: true,
        },
        {
            pkg: '@graphql-codegen/typescript',
            isDevDependency: true,
        },
    ];
    if (plugins.some(p => p.hasUiExtensions())) {
        packagesToInstall.push({
            pkg: '@graphql-codegen/client-preset',
            isDevDependency: true,
        });
    }
    try {
        await packageJson.installPackages(packagesToInstall);
    } catch (e: any) {
        log.error(`Failed to install dependencies: ${e.message as string}.`);
    }
    installSpinner.stop('Dependencies installed');

    const configSpinner = spinner();
    configSpinner.start('Configuring codegen file...');
    await new Promise(resolve => setTimeout(resolve, 100));

    const codegenFile = new CodegenConfigRef(packageJson.getPackageRootDir());

    const rootDir = project.getDirectory('.');
    if (!rootDir) {
        throw new Error('Could not find the root directory of the project');
    }
    for (const plugin of plugins) {
        const relativePluginPath = getRelativeImportPath({
            from: rootDir,
            to: plugin.classDeclaration.getSourceFile(),
        });
        const generatedTypesPath = `${path.dirname(relativePluginPath)}/gql/generated.ts`;
        codegenFile.addEntryToGeneratesObject({
            name: `'${generatedTypesPath}'`,
            kind: StructureKind.PropertyAssignment,
            initializer: `{ plugins: ['typescript'] }`,
        });

        if (plugin.hasUiExtensions()) {
            const uiExtensionsPath = `${path.dirname(relativePluginPath)}/ui`;
            codegenFile.addEntryToGeneratesObject({
                name: `'${uiExtensionsPath}/gql/'`,
                kind: StructureKind.PropertyAssignment,
                initializer: `{ 
                        preset: 'client',
                        documents: '${uiExtensionsPath}/**/*.ts', 
                        presetConfig: {
                            fragmentMasking: false,
                        },
                     }`,
            });
        }
    }

    packageJson.addScript('codegen', 'graphql-codegen --config codegen.ts');

    configSpinner.stop('Configured codegen file');

    await project.save();
    await codegenFile.save();

    const nextSteps = [
        `You can run codegen by doing the following:`,
        `1. Ensure your dev server is running`,
        `2. Run "npm run codegen"`,
    ];
    note(nextSteps.join('\n'));

    if (!providedVendurePlugin) {
        outro('✅ Codegen setup complete!');
    }
}
