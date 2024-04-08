import { cancel, intro, isCancel, log, select, spinner, text } from '@clack/prompts';
import { constantCase, paramCase, pascalCase } from 'change-case';
import * as fs from 'fs-extra';
import path from 'path';

import { CliCommand, CliCommandReturnVal } from '../../../shared/cli-command';
import { VendureConfigRef } from '../../../shared/vendure-config-ref';
import { VendurePluginRef } from '../../../shared/vendure-plugin-ref';
import { addImportsToFile, createFile, getTsMorphProject } from '../../../utilities/ast-utils';
import { pauseForPromptDisplay } from '../../../utilities/utils';
import { addApiExtensionCommand } from '../api-extension/add-api-extension';
import { addCodegenCommand } from '../codegen/add-codegen';
import { addEntityCommand } from '../entity/add-entity';
import { addJobQueueCommand } from '../job-queue/add-job-queue';
import { addServiceCommand } from '../service/add-service';
import { addUiExtensionsCommand } from '../ui-extensions/add-ui-extensions';

import { GeneratePluginOptions, NewPluginTemplateContext } from './types';

export const createNewPluginCommand = new CliCommand({
    id: 'create-new-plugin',
    category: 'Plugin',
    description: 'Create a new Vendure plugin',
    run: createNewPlugin,
});

const cancelledMessage = 'Plugin setup cancelled.';

export async function createNewPlugin(): Promise<CliCommandReturnVal> {
    const options: GeneratePluginOptions = { name: '', customEntityName: '', pluginDir: '' } as any;
    intro('Adding a new Vendure plugin!');
    if (!options.name) {
        const name = await text({
            message: 'What is the name of the plugin?',
            initialValue: 'my-new-feature',
            validate: input => {
                if (!/^[a-z][a-z-0-9]+$/.test(input)) {
                    return 'The plugin name must be lowercase and contain only letters, numbers and dashes';
                }
            },
        });

        if (isCancel(name)) {
            cancel(cancelledMessage);
            process.exit(0);
        } else {
            options.name = name;
        }
    }
    const pluginDir = getPluginDirName(options.name);
    const confirmation = await text({
        message: 'Plugin location',
        initialValue: pluginDir,
        placeholder: '',
        validate: input => {
            if (fs.existsSync(input)) {
                return `A directory named "${input}" already exists. Please specify a different directory.`;
            }
        },
    });

    if (isCancel(confirmation)) {
        cancel(cancelledMessage);
        process.exit(0);
    }

    options.pluginDir = confirmation;
    const { plugin, project, modifiedSourceFiles } = await generatePlugin(options);

    const configSpinner = spinner();
    configSpinner.start('Updating VendureConfig...');
    await pauseForPromptDisplay();
    const vendureConfig = new VendureConfigRef(project);
    vendureConfig.addToPluginsArray(`${plugin.name}.init({})`);
    addImportsToFile(vendureConfig.sourceFile, {
        moduleSpecifier: plugin.getSourceFile(),
        namedImports: [plugin.name],
    });
    await vendureConfig.sourceFile.getProject().save();
    configSpinner.stop('Updated VendureConfig');

    let done = false;
    const followUpCommands = [
        addEntityCommand,
        addServiceCommand,
        addApiExtensionCommand,
        addJobQueueCommand,
        addUiExtensionsCommand,
        addCodegenCommand,
    ];
    let allModifiedSourceFiles = [...modifiedSourceFiles];
    const pluginClassName = plugin.name;
    let workingPlugin = plugin;
    let workingProject = project;
    while (!done) {
        const featureType = await select({
            message: `Add features to ${options.name}?`,
            options: [
                { value: 'no', label: "[Finish] No, I'm done!" },
                ...followUpCommands.map(c => ({
                    value: c.id,
                    label: `[${c.category}] ${c.description}`,
                })),
            ],
        });
        if (isCancel(featureType)) {
            done = true;
        }
        if (featureType === 'no') {
            done = true;
        } else {
            const newProject = getTsMorphProject();
            workingProject = newProject;
            const newPlugin = newProject
                .getSourceFile(workingPlugin.getSourceFile().getFilePath())
                ?.getClass(pluginClassName);
            if (!newPlugin) {
                throw new Error(`Could not find class "${pluginClassName}" in the new project`);
            }
            workingPlugin = new VendurePluginRef(newPlugin);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const command = followUpCommands.find(c => c.id === featureType)!;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            try {
                const result = await command.run({ plugin: new VendurePluginRef(newPlugin) });
                allModifiedSourceFiles = result.modifiedSourceFiles;
                // We format all modified source files and re-load the
                // project to avoid issues with the project state
                for (const sourceFile of allModifiedSourceFiles) {
                    sourceFile.organizeImports();
                }
            } catch (e: any) {
                log.error(`Error adding feature "${command.id}"`);
                log.error(e.stack);
            }

            await workingProject.save();
        }
    }

    return {
        project,
        modifiedSourceFiles: [],
    };
}

export async function generatePlugin(
    options: GeneratePluginOptions,
): Promise<CliCommandReturnVal<{ plugin: VendurePluginRef }>> {
    const nameWithoutPlugin = options.name.replace(/-?plugin$/i, '');
    const normalizedName = nameWithoutPlugin + '-plugin';
    const templateContext: NewPluginTemplateContext = {
        ...options,
        pluginName: pascalCase(normalizedName),
        pluginInitOptionsName: constantCase(normalizedName) + '_OPTIONS',
    };

    const projectSpinner = spinner();
    projectSpinner.start('Generating plugin scaffold...');
    await pauseForPromptDisplay();
    const project = getTsMorphProject({ skipAddingFilesFromTsConfig: true });

    const pluginFile = createFile(project, path.join(__dirname, 'templates/plugin.template.ts'));
    const pluginClass = pluginFile.getClass('TemplatePlugin');
    if (!pluginClass) {
        throw new Error('Could not find the plugin class in the generated file');
    }
    pluginClass.rename(templateContext.pluginName);

    const typesFile = createFile(project, path.join(__dirname, 'templates/types.template.ts'));

    const constantsFile = createFile(project, path.join(__dirname, 'templates/constants.template.ts'));
    constantsFile
        .getVariableDeclaration('TEMPLATE_PLUGIN_OPTIONS')
        ?.rename(templateContext.pluginInitOptionsName)
        .set({ initializer: `Symbol('${templateContext.pluginInitOptionsName}')` });
    constantsFile
        .getVariableDeclaration('loggerCtx')
        ?.set({ initializer: `'${templateContext.pluginName}'` });

    typesFile.move(path.join(options.pluginDir, 'types.ts'));
    pluginFile.move(path.join(options.pluginDir, paramCase(nameWithoutPlugin) + '.plugin.ts'));
    constantsFile.move(path.join(options.pluginDir, 'constants.ts'));

    projectSpinner.stop('Generated plugin scaffold');
    await project.save();
    return {
        project,
        modifiedSourceFiles: [pluginFile, typesFile, constantsFile],
        plugin: new VendurePluginRef(pluginClass),
    };
}

function getPluginDirName(name: string) {
    const cwd = process.cwd();
    const pathParts = cwd.split(path.sep);
    const currentlyInPluginsDir = pathParts[pathParts.length - 1] === 'plugins';
    const currentlyInRootDir = fs.pathExistsSync(path.join(cwd, 'package.json'));
    const nameWithoutPlugin = name.replace(/-?plugin$/i, '');

    if (currentlyInPluginsDir) {
        return path.join(cwd, paramCase(nameWithoutPlugin));
    }
    if (currentlyInRootDir) {
        return path.join(cwd, 'src', 'plugins', paramCase(nameWithoutPlugin));
    }
    return path.join(cwd, paramCase(nameWithoutPlugin));
}
