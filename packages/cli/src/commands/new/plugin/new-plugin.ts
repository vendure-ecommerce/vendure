import { cancel, confirm, intro, isCancel, multiselect, outro, text } from '@clack/prompts';
import { camelCase, constantCase, paramCase, pascalCase } from 'change-case';
import * as fs from 'fs-extra';
import path from 'path';

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
    const options: GeneratePluginOptions = { name: '', customEntityName: '' } as any;
    intro('Scaffolding a new Vendure plugin!');
    if (!options.name) {
        const name = await text({
            message: 'What is the name of the plugin?',
            initialValue: '',
            validate: input => {
                if (!/^[a-z][a-z-0-9]+$/.test(input)) {
                    return 'The plugin name must be lowercase and contain only letters, numbers and dashes';
                }
                const proposedPluginDir = getPluginDirName(input);
                if (fs.existsSync(proposedPluginDir)) {
                    return `A directory named "${proposedPluginDir}" already exists. Cannot create plugin in this directory.`;
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
    const confirmation = await confirm({
        message: `Create new plugin in ${pluginDir}?`,
    });

    if (isCancel(confirmation)) {
        cancel(cancelledMessage);
        process.exit(0);
    } else {
        if (confirmation === true) {
            await generatePlugin(options);
        } else {
            cancel(cancelledMessage);
        }
    }
}

export async function generatePlugin(options: GeneratePluginOptions) {
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

    const files: Array<{ render: (context: TemplateContext) => string; path: string }> = [
        {
            render: renderPlugin,
            path: paramCase(nameWithoutPlugin) + '.plugin.ts',
        },
        {
            render: renderTypes,
            path: 'types.ts',
        },
        {
            render: renderConstants,
            path: 'constants.ts',
        },
    ];

    if (options.withApiExtensions) {
        files.push({
            render: renderApiExtensions,
            path: 'api/api-extensions.ts',
        });
        if (options.withCustomEntity) {
            files.push({
                render: renderShopResolverWithEntity,
                path: 'api/shop.resolver.ts',
            });
            files.push({
                render: renderAdminResolverWithEntity,
                path: 'api/admin.resolver.ts',
            });
        } else {
            files.push({
                render: renderShopResolver,
                path: 'api/shop.resolver.ts',
            });
            files.push({
                render: renderAdminResolver,
                path: 'api/admin.resolver.ts',
            });
        }
    }

    if (options.withCustomEntity) {
        files.push({
            render: renderEntity,
            path: `entities/${templateContext.entity.fileName}.ts`,
        });
        files.push({
            render: renderServiceWithEntity,
            path: `services/${templateContext.service.fileName}.ts`,
        });
    } else {
        files.push({
            render: renderService,
            path: `services/${templateContext.service.fileName}.ts`,
        });
    }

    const pluginDir = getPluginDirName(options.name);
    fs.ensureDirSync(pluginDir);
    files.forEach(file => {
        const filePath = path.join(pluginDir, file.path);
        const rendered = file.render(templateContext).trim();
        fs.ensureFileSync(filePath);
        fs.writeFileSync(filePath, rendered);
    });

    outro('✅ Plugin scaffolding complete!');
}

function getPluginDirName(name: string) {
    const nameWithoutPlugin = name.replace(/-?plugin$/i, '');
    return path.join(process.cwd(), paramCase(nameWithoutPlugin));
}
