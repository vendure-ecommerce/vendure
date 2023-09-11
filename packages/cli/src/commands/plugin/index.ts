import { constantCase, paramCase, pascalCase } from 'change-case';
import { Command } from 'commander';
import * as fs from 'fs-extra';
import path from 'path';

import { render as renderConstants } from './scaffold/constants';
import { render as renderPlugin } from './scaffold/plugin';
import { render as renderTypes } from './scaffold/types';
import { GeneratePluginOptions, TemplateContext } from './types';

export function registerCommand(program: Command) {
    program
        .command('plugin')
        .description('Scaffold a new Vendure plugin')
        .argument('-n, --name <name>', 'The name of the plugin')
        .alias('p')
        .action((name: string) => {
            generatePlugin({ name });
        });
}

export function generatePlugin(options: GeneratePluginOptions) {
    const nameWithoutPlugin = options.name.replace(/-?plugin$/i, '');
    const normalizedName = nameWithoutPlugin + '-plugin';
    const templateContext: TemplateContext = {
        pluginName: pascalCase(normalizedName),
        pluginInitOptionsName: constantCase(normalizedName) + '_OPTIONS',
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

    const pluginDir = path.join(process.cwd(), paramCase(nameWithoutPlugin));
    fs.ensureDirSync(pluginDir);
    files.forEach(file => {
        const filePath = path.join(pluginDir, file.path);
        const rendered = file.render(templateContext);
        fs.writeFileSync(filePath, rendered);
    });
}
