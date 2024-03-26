import { cancel, isCancel, log, outro, select } from '@clack/prompts';
import { Command } from 'commander';

import { CliCommand } from '../../shared/cli-command';

import { addApiExtensionCommand } from './api-extension/add-api-extension';
import { addCodegenCommand } from './codegen/add-codegen';
import { addEntityCommand } from './entity/add-entity';
import { addJobQueueCommand } from './job-queue/add-job-queue';
import { createNewPluginCommand } from './plugin/create-new-plugin';
import { addServiceCommand } from './service/add-service';
import { addUiExtensionsCommand } from './ui-extensions/add-ui-extensions';

const cancelledMessage = 'Add feature cancelled.';

export function registerAddCommand(program: Command) {
    program
        .command('add')
        .description('Add a feature to your Vendure project')
        .action(async () => {
            const addCommands: Array<CliCommand<any>> = [
                createNewPluginCommand,
                addEntityCommand,
                addServiceCommand,
                addApiExtensionCommand,
                addJobQueueCommand,
                addUiExtensionsCommand,
                addCodegenCommand,
            ];
            const featureType = await select({
                message: 'Which feature would you like to add?',
                options: addCommands.map(c => ({
                    value: c.id,
                    label: `[${c.category}] ${c.description}`,
                })),
            });
            if (isCancel(featureType)) {
                cancel(cancelledMessage);
                process.exit(0);
            }
            try {
                const command = addCommands.find(c => c.id === featureType);
                if (!command) {
                    throw new Error(`Could not find command with id "${featureType as string}"`);
                }
                const { modifiedSourceFiles } = await command.run();

                for (const sourceFile of modifiedSourceFiles) {
                    sourceFile.organizeImports();
                }
                outro('✅ Done!');
            } catch (e: any) {
                log.error(e.message as string);
                if (e.stack) {
                    log.error(e.stack);
                }
            }
            process.exit(0);
        });
}
