import { Argument, Command } from 'commander';

import { newPlugin } from './plugin/new-plugin';

export function registerNewCommand(program: Command) {
    program
        .command('new')
        .addArgument(new Argument('<type>', 'type of scaffold').choices(['plugin']))
        .description('Generate scaffold for your Vendure project')
        .action(async (type: string) => {
            if (type === 'plugin') {
                await newPlugin();
            }
        });
}
