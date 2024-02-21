import { cancel, intro, isCancel, multiselect, outro, text } from '@clack/prompts';
import { camelCase, constantCase, paramCase, pascalCase } from 'change-case';
import * as fs from 'fs-extra';
import path from 'path';

import { Scaffolder } from '../../../utilities/scaffolder';

import { renderAdminResolver, renderAdminResolverWithEntity } from './scaffold/api/admin.resolver';
import { renderApiExtensions } from './scaffold/api/api-extensions';
import { renderShopResolver, renderShopResolverWithEntity } from './scaffold/api/shop.resolver';
import { renderConstants } from './scaffold/constants';
import { renderEntity } from './scaffold/entities/entity';
import { renderPlugin } from './scaffold/plugin';
import { renderService, renderServiceWithEntity } from './scaffold/services/service';
import { renderTypes } from './scaffold/types';
import { GeneratePluginOptions, TemplateContext } from './types';

const cancelledMessage = 'Plugin setup cancelled.';

export async function newPlugin() {
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
    const features = await multiselect({
        message: 'Which features would you like to include? (use ↑, ↓, space to select)',
        options: [
            { value: 'customEntity', label: 'Custom entity' },
            { value: 'apiExtensions', label: 'GraphQL API extensions' },
        ],
        required: false,
    });
    if (Array.isArray(features)) {
        options.withCustomEntity = features.includes('customEntity');
        options.withApiExtensions = features.includes('apiExtensions');
    }
    if (options.withCustomEntity) {
        const entityName = await text({
            message: 'What is the name of the custom entity?',
            initialValue: '',
            placeholder: '',
            validate: input => {
                if (!input) {
                    return 'The custom entity name cannot be empty';
                }
                const pascalCaseRegex = /^[A-Z][a-zA-Z0-9]*$/;
                if (!pascalCaseRegex.test(input)) {
                    return 'The custom entity name must be in PascalCase, e.g. "ProductReview"';
                }
            },
        });
        if (isCancel(entityName)) {
            cancel(cancelledMessage);
            process.exit(0);
        } else {
            options.customEntityName = pascalCase(entityName);
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
        generatePlugin(options);
    }
}

export function generatePlugin(options: GeneratePluginOptions) {
    const nameWithoutPlugin = options.name.replace(/-?plugin$/i, '');
    const normalizedName = nameWithoutPlugin + '-plugin';
    const templateContext: TemplateContext = {
        ...options,
        pluginName: pascalCase(normalizedName),
        pluginInitOptionsName: constantCase(normalizedName) + '_OPTIONS',
        service: {
            className: pascalCase(nameWithoutPlugin) + 'Service',
            instanceName: camelCase(nameWithoutPlugin) + 'Service',
            fileName: paramCase(nameWithoutPlugin) + '.service',
        },
        entity: {
            className: options.customEntityName,
            instanceName: camelCase(options.customEntityName),
            fileName: paramCase(options.customEntityName) + '.entity',
        },
    };

    const scaffolder = new Scaffolder<TemplateContext>();
    scaffolder.addFile(renderPlugin, paramCase(nameWithoutPlugin) + '.plugin.ts');
    scaffolder.addFile(renderTypes, 'types.ts');
    scaffolder.addFile(renderConstants, 'constants.ts');

    if (options.withApiExtensions) {
        scaffolder.addFile(renderApiExtensions, 'api/api-extensions.ts');
        if (options.withCustomEntity) {
            scaffolder.addFile(renderShopResolverWithEntity, 'api/shop.resolver.ts');
            scaffolder.addFile(renderAdminResolverWithEntity, 'api/admin.resolver.ts');
        } else {
            scaffolder.addFile(renderShopResolver, 'api/shop.resolver.ts');
            scaffolder.addFile(renderAdminResolver, 'api/admin.resolver.ts');
        }
    }

    if (options.withCustomEntity) {
        scaffolder.addFile(renderEntity, `entities/${templateContext.entity.fileName}.ts`);
        scaffolder.addFile(renderServiceWithEntity, `services/${templateContext.service.fileName}.ts`);
    } else {
        scaffolder.addFile(renderService, `services/${templateContext.service.fileName}.ts`);
    }

    const pluginDir = options.pluginDir;
    scaffolder.createScaffold({
        dir: pluginDir,
        context: templateContext,
    });

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
