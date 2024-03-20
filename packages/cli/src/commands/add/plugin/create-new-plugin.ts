import { cancel, intro, isCancel, outro, select, spinner, text } from '@clack/prompts';
import { constantCase, paramCase, pascalCase } from 'change-case';
import * as fs from 'fs-extra';
import path from 'path';
import { ClassDeclaration } from 'ts-morph';

import { createFile, getTsMorphProject } from '../../../utilities/ast-utils';
import { addEntity } from '../entity/add-entity';
import { addUiExtensions } from '../ui-extensions/add-ui-extensions';

import { GeneratePluginOptions, NewPluginTemplateContext } from './types';

const cancelledMessage = 'Plugin setup cancelled.';

export async function createNewPlugin() {
    const options: GeneratePluginOptions = { name: '', customEntityName: '', pluginDir: '' } as any;
    intro('Adding a new Vendure plugin!');
    if (!options.name) {
        const name = await text({
            message: 'What is the name of the plugin?',
            initialValue: '',
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
    const generatedResult = await generatePlugin(options);

    let done = false;
    while (!done) {
        const featureType = await select({
            message: `Add features to ${options.name}?`,
            options: [
                { value: 'no', label: "[Finish] No, I'm done!" },
                { value: 'entity', label: '[Plugin: Entity] Add a new entity to the plugin' },
                { value: 'uiExtensions', label: '[Plugin: UI] Set up Admin UI extensions' },
            ],
        });
        if (isCancel(featureType)) {
            done = true;
        }
        if (featureType === 'no') {
            done = true;
        } else if (featureType === 'entity') {
            await addEntity(generatedResult.pluginClass);
        } else if (featureType === 'uiExtensions') {
            await addUiExtensions(generatedResult.pluginClass);
        }
    }

    outro('✅ Plugin setup complete!');
}

export async function generatePlugin(
    options: GeneratePluginOptions,
): Promise<{ pluginClass: ClassDeclaration }> {
    const nameWithoutPlugin = options.name.replace(/-?plugin$/i, '');
    const normalizedName = nameWithoutPlugin + '-plugin';
    const templateContext: NewPluginTemplateContext = {
        ...options,
        pluginName: pascalCase(normalizedName),
        pluginInitOptionsName: constantCase(normalizedName) + '_OPTIONS',
    };

    const projectSpinner = spinner();
    projectSpinner.start('Generating plugin scaffold...');
    await new Promise(resolve => setTimeout(resolve, 100));
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
    project.saveSync();
    return {
        pluginClass,
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
