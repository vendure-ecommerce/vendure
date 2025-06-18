import { Command } from 'commander';

import { CliCommandDefinition } from './cli-command-definition';

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
            });
        }
    });
}
