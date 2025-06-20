import { cancel, intro, isCancel, log, outro, select, spinner } from '@clack/prompts';
import pc from 'picocolors';

import { Messages } from '../../constants';
import { CliCommand } from '../../shared/cli-command';
import { pauseForPromptDisplay } from '../../utilities/utils';

import { AddOperationOptions, performAddOperation } from './add-operations';
import { addApiExtensionCommand } from './api-extension/add-api-extension';
import { addCodegenCommand } from './codegen/add-codegen';
import { addEntityCommand } from './entity/add-entity';
import { addJobQueueCommand } from './job-queue/add-job-queue';
import { createNewPluginCommand } from './plugin/create-new-plugin';
import { addServiceCommand } from './service/add-service';
import { addUiExtensionsCommand } from './ui-extensions/add-ui-extensions';

const cancelledMessage = 'Add feature cancelled.';

export interface AddOptions extends AddOperationOptions {}

/**
 * Executes the "add" command, enabling users to add features to a Vendure project in either interactive or non-interactive mode.
 *
 * If any options are provided, the command runs in non-interactive mode using those options; otherwise, it prompts the user interactively.
 *
 * @param options - Optional parameters to configure the add operation non-interactively
 */
export async function addCommand(options?: AddOptions) {
    // If any non-interactive option is supplied, we switch to the non-interactive path
    const nonInteractive = options && Object.values(options).some(v => v !== undefined && v !== false);

    if (nonInteractive) {
        await handleNonInteractiveMode(options as AddOperationOptions);
    } else {
        await handleInteractiveMode();
    }
}

/**
 * Executes the add operation in non-interactive mode using the provided options.
 *
 * Logs a success message if the operation completes successfully. On failure or exception, logs an error message (with stack trace for specific validation errors) and exits the process with status code 1.
 */
async function handleNonInteractiveMode(options: AddOperationOptions) {
    try {
        const result = await performAddOperation(options);
        if (result.success) {
            log.success(result.message);
        } else {
            log.error(result.message);
            process.exit(1);
        }
    } catch (e: any) {
        // For validation errors, show the full error with stack trace
        if (e.message.includes('Plugin name is required')) {
            // Extract error message and stack trace
            const errorMessage = e.message;
            const stackLines = e.stack.split('\n');
            const stackTrace = stackLines.slice(1).join('\n'); // Remove first line (error message)

            // Display stack trace first, then colored error message at the end
            log.error(stackTrace);
            log.error(''); // Add empty line for better readability
            log.error(pc.red('Error:') + ' ' + String(errorMessage));
        } else {
            log.error(e.message as string);
            if (e.stack) {
                log.error(e.stack);
            }
        }
        process.exit(1);
    }
}

/**
 * Guides the user through interactively adding a new feature to a Vendure project.
 *
 * Prompts the user to select a feature to add, executes the corresponding command, organizes imports if source files are modified, and provides feedback on completion or errors.
 */
async function handleInteractiveMode() {
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
