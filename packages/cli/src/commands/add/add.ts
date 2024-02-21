import { cancel, isCancel, select } from '@clack/prompts';
import { Command } from 'commander';

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
                    { value: 'other', label: 'Other' },
                ],
            });
            if (isCancel(featureType)) {
                cancel(cancelledMessage);
                process.exit(0);
            }
            if (featureType === 'uiExtensions') {
                await addUiExtensions();
            }
            process.exit(0);
        });
}
