import { Command } from 'commander';

import { enrichProgramWithInputOptions } from '../../../shared/program-builder';
import { analyzeProject } from '../../../shared/shared-prompts';

import { inputDefinitions } from './add-plugin.input-options';
import { generatePlugin } from './add-plugin.service';
import { GeneratePluginOptions } from './types';

export const registerAddPluginNonInteractiveCommand = (program: Command) => {
    const command = program.command('add:plugin').description('Add a plugin to your Vendure project');

    enrichProgramWithInputOptions(command, inputDefinitions);

    command.action(async options => {
        const { project } = await analyzeProject();
        await generatePlugin(project, options as GeneratePluginOptions);
        process.exit(0);
    });
};
