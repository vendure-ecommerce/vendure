import { Command } from 'commander';
import { CliCommandDefinition } from './cli-command-definition';

export function registerCommands(program: Command, commands: CliCommandDefinition[]): void {
    commands.forEach((commandDef) => {
        const command = program
            .command(commandDef.name)
            .description(commandDef.description)
            .action(async (options) => {
                await commandDef.action(options);
            });

        // Add options if they exist
        if (commandDef.options) {
            commandDef.options.forEach((option) => {
                // Handle both required and optional options
                const optionString = option.required 
                    ? option.flag
                    : option.flag.replace(/<([^>]+)>/g, '[$1]');
                
                command.option(optionString, option.description, option.defaultValue);
            });
        }
    });
} 