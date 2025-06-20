import { cancel, log, note, outro, spinner } from '@clack/prompts';
import path from 'path';
import { StructureKind } from 'ts-morph';

import { CliCommand, CliCommandReturnVal } from '../../../shared/cli-command';
import { PackageJson } from '../../../shared/package-json-ref';
import { analyzeProject, selectMultiplePluginClasses } from '../../../shared/shared-prompts';
import { VendurePluginRef } from '../../../shared/vendure-plugin-ref';
import { getRelativeImportPath, getPluginClasses } from '../../../utilities/ast-utils';
import { pauseForPromptDisplay } from '../../../utilities/utils';

import { CodegenConfigRef } from './codegen-config-ref';

export interface AddCodegenOptions {
    plugin?: VendurePluginRef;
    pluginName?: string;
    config?: string;
    isNonInteractive?: boolean;
}

export const addCodegenCommand = new CliCommand({
    id: 'add-codegen',
    category: 'Project: Codegen',
    description: 'Set up GraphQL code generation',
    run: addCodegen,
});

/**
 * Sets up GraphQL code generation for one or more Vendure plugins in the current project.
 *
 * Installs required codegen dependencies, generates a codegen configuration file, and adds a `codegen` script to `package.json`. Supports both interactive and non-interactive modes, allowing plugin selection by reference or name. If a plugin has UI extensions, configures additional client codegen entries. Throws errors if required plugins are not found or if the project root or `package.json` cannot be located.
 *
 * @param options - Optional settings for plugin selection, config file location, and non-interactive mode
 * @returns An object containing the updated project and the generated codegen configuration source file
 */
async function addCodegen(options?: AddCodegenOptions): Promise<CliCommandReturnVal> {
    const providedVendurePlugin = options?.plugin;
    const { project } = await analyzeProject({
        providedVendurePlugin,
        cancelledMessage: 'Add codegen cancelled',
        config: options?.config,
    });

    // Detect non-interactive mode
    const isNonInteractive = options?.isNonInteractive === true;

    let plugin: VendurePluginRef | undefined = providedVendurePlugin;

    // If a plugin name was provided, try to find it
    if (!plugin && options?.pluginName) {
        const pluginClasses = getPluginClasses(project);
        const foundPlugin = pluginClasses.find(p => p.getName() === options.pluginName);

        if (!foundPlugin) {
            // List available plugins if the specified one wasn't found
            const availablePlugins = pluginClasses.map(p => p.getName()).filter(Boolean);
            throw new Error(
                `Plugin "${options.pluginName}" not found. Available plugins:\n` +
                availablePlugins.map(name => `  - ${name as string}`).join('\n')
            );
        }

        plugin = new VendurePluginRef(foundPlugin);
    }

    // In non-interactive mode, we need a plugin specified
    if (isNonInteractive && !plugin) {
        throw new Error('Plugin must be specified when running in non-interactive mode');
    }

    const plugins = plugin
        ? [plugin]
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
    const packageManager = packageJson.determinePackageManager();
    const packageJsonFile = packageJson.locatePackageJsonWithVendureDependency();
    log.info(`Detected package manager: ${packageManager}`);
    if (!packageJsonFile) {
        cancel(`Could not locate package.json file with a dependency on Vendure.`);
        process.exit(1);
    }
    log.info(`Detected package.json: ${packageJsonFile}`);
    try {
        await packageJson.installPackages(packagesToInstall);
    } catch (e: any) {
        log.error(`Failed to install dependencies: ${e.message as string}.`);
    }
    installSpinner.stop('Dependencies installed');

    const configSpinner = spinner();
    configSpinner.start('Configuring codegen file...');
    await pauseForPromptDisplay();

    const codegenFile = new CodegenConfigRef(project, packageJson.getPackageRootDir());

    const rootDir = project.getDirectory('.');
    if (!rootDir) {
        throw new Error('Could not find the root directory of the project');
    }
    for (const pluginRef of plugins) {
        const relativePluginPath = getRelativeImportPath({
            from: rootDir,
            to: pluginRef.classDeclaration.getSourceFile(),
        });
        const generatedTypesPath = `${path.dirname(relativePluginPath)}/gql/generated.ts`;
        codegenFile.addEntryToGeneratesObject({
            name: `'${generatedTypesPath}'`,
            kind: StructureKind.PropertyAssignment,
            initializer: `{ plugins: ['typescript'] }`,
        });

        if (pluginRef.hasUiExtensions()) {
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

    const nextSteps = [
        `You can run codegen by doing the following:`,
        `1. Ensure your dev server is running`,
        `2. Run "npm run codegen"`,
    ];
    note(nextSteps.join('\n'));

    return {
        project,
        modifiedSourceFiles: [codegenFile.sourceFile],
    };
}
