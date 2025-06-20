import { Command } from 'commander';

import { CliCommandDefinition, CliCommandOption } from './cli-command-definition';

/**
 * Registers CLI commands and their options with a Commander.js program instance.
 *
 * For each command definition, adds the command with its name, description, and asynchronous action handler. Options and sub-options are registered with appropriate descriptions and formatting.
 *
 * @param program - The Commander.js program instance to which commands will be added
 * @param commands - An array of command definitions specifying names, descriptions, actions, and options
 */
export function registerCommands(program: Command, commands: CliCommandDefinition[]): void {
    commands.forEach(commandDef => {
        const command = program
            .command(commandDef.name)
            .description(commandDef.description)
            .action(async options => {
                await commandDef.action(options);
            });

        // Add options if they exist
        if (commandDef.options) {
            commandDef.options.forEach(option => {
                addOption(command, option);

                // Add sub-options if they exist
                if (option.subOptions) {
                    option.subOptions.forEach(subOption => {
                        // Create a version of the sub-option with indented description
                        const indentedSubOption = {
                            ...subOption,
                            description: `  └─ ${subOption.description}`,
                        };
                        addOption(command, indentedSubOption);
                    });
                }
            });
        }
    });
}

/**
 * Adds an option to a Commander command, formatting the option flags and value placeholders based on whether the option is required.
 *
 * If the option is not required and expects a value, angle brackets in the value placeholder are converted to square brackets to indicate optionality.
 */
function addOption(command: Command, option: CliCommandOption): void {
    const parts: string[] = [];
    if (option.short) {
        parts.push(option.short);
    }
    parts.push(option.long);

    let optionString = parts.join(', ');

    // Handle optional options which expect a value by converting <value> to [value]
    if (!option.required) {
        optionString = optionString.replace(/<([^>]+)>/g, '[$1]');
    }

    command.option(optionString, option.description, option.defaultValue);
}
