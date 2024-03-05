import { cancel, isCancel, log, select } from '@clack/prompts';
import { Command } from 'commander';

import { addEntity } from './entity/add-entity';
import { addUiExtensions } from './ui-extensions/add-ui-extensions';

const cancelledMessage = 'Add feature cancelled.';

export function registerAddCommand(program: Command) {
    program
        .command('add')
        .description('Add a feature to your Vendure project')
        .action(async () => {
            const featureType = await select({
                message: 'Which feature would you like to add?',
                options: [
                    { value: 'uiExtensions', label: 'Set up Admin UI extensions' },
                    { value: 'entity', label: 'Add a new entity to a plugin' },
                ],
            });
            if (isCancel(featureType)) {
                cancel(cancelledMessage);
                process.exit(0);
            }
            try {
                if (featureType === 'uiExtensions') {
                    await addUiExtensions();
                }
                if (featureType === 'entity') {
                    await addEntity();
                }
            } catch (e: any) {
                log.error(e.message as string);
            }
            process.exit(0);
        });
}
