import { Command } from 'commander';

import { CliCommandDefinition, CliCommandOption } from './cli-command-definition';

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
