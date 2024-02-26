import { cancel, intro, isCancel, outro, spinner, text } from '@clack/prompts';
import { constantCase, paramCase, pascalCase } from 'change-case';
import * as fs from 'fs-extra';
import path from 'path';

import { createFile, getTsMorphProject } from '../../../utilities/ast-utils';

import { GeneratePluginOptions, NewPluginTemplateContext } from './types';

const cancelledMessage = 'Plugin setup cancelled.';

export async function createNewPlugin() {
    const options: GeneratePluginOptions = { name: '', customEntityName: '', pluginDir: '' } as any;
    intro('Scaffolding a new Vendure plugin!');
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
    } else {
        options.pluginDir = confirmation;
        await generatePlugin(options);
    }
}

export async function generatePlugin(options: GeneratePluginOptions) {
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
    pluginFile.getClass('TemplatePlugin')?.rename(templateContext.pluginName);

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

    projectSpinner.stop('Done');
    project.saveSync();
    outro('✅ Plugin scaffolding complete!');
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
