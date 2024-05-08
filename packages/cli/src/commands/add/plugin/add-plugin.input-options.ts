import { z } from 'zod';

import { InputDefinitions, InputOptionType } from '../../../shared/input-option-definitions';

import { findExistingPluginsDir, getPluginDirName } from './add-plugin.service';

export const inputDefinitions: InputDefinitions = {
    options: [
        {
            name: 'name',
            type: InputOptionType.String,
            required: true,
            shortFlag: 'n',
            longName: 'name',
            help: 'The name of the plugin',
            prompt: 'What is the name of the plugin?',
            description: 'The name of the plugin to create',
            validate: (input: string) => {
                const isValid = z
                    .string()
                    .regex(/^[a-z][a-z-0-9]+$/)
                    .safeParse(input).success;

                if (!isValid) {
                    return 'The plugin name must be lowercase and contain only letters, numbers and dashes';
                }
            },
            transform: (input: string) => input.replace(/-?plugin$/i, ''),
        },
        {
            name: 'pluginDir',
            type: InputOptionType.String,
            required: true,
            shortFlag: 'd',
            longName: 'plugin-dir',
            help: 'Add a relative path to your current working directory',
            prompt: 'What is the directory to create the plugin in?',
            description: 'The directory to create the plugin in',
            defaultValue: (currentOptions, project) => {
                const existingPluginDir = findExistingPluginsDir(project);
                return getPluginDirName(currentOptions.name, existingPluginDir);
            },
        },
    ],
};
