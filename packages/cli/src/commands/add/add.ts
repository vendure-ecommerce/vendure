import { cancel, intro, isCancel, log, outro, select, spinner } from '@clack/prompts';
import pc from 'picocolors';

import { Messages } from '../../constants';
import { CliCommand } from '../../shared/cli-command';
import { pauseForPromptDisplay } from '../../utilities/utils';

import { addApiExtensionCommand } from './api-extension/add-api-extension';
import { addCodegenCommand } from './codegen/add-codegen';
import { addEntityCommand } from './entity/add-entity';
import { addJobQueueCommand } from './job-queue/add-job-queue';
import { createNewPluginCommand } from './plugin/create-new-plugin';
import { addServiceCommand } from './service/add-service';
import { addUiExtensionsCommand } from './ui-extensions/add-ui-extensions';

const cancelledMessage = 'Add feature cancelled.';

export async function addCommand() {
    // eslint-disable-next-line no-console
    console.log(`\n`);
    intro(pc.blue("✨ Let's add a new feature to your Vendure project!"));
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
            label: `${pc.blue(`${c.category}`)} ${c.description}`,
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
        const { modifiedSourceFiles, project } = await command.run();

        if (modifiedSourceFiles.length) {
            const importsSpinner = spinner();
            importsSpinner.start('Organizing imports...');
            await pauseForPromptDisplay();
            for (const sourceFile of modifiedSourceFiles) {
                sourceFile.organizeImports();
            }
            await project.save();
            importsSpinner.stop('Imports organized');
        }
        outro('✅ Done!');
    } catch (e: any) {
        log.error(e.message as string);
        const isCliMessage = Object.values(Messages).includes(e.message);
        if (!isCliMessage && e.stack) {
            log.error(e.stack);
        }
        outro('❌ Error');
    }
}
