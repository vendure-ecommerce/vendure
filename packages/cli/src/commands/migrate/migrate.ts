import { cancel, intro, isCancel, log, outro, select } from '@clack/prompts';
import pc from 'picocolors';

import {
    generateMigrationOperation,
    revertMigrationOperation,
    runMigrationsOperation,
} from './migration-operations';

const cancelledMessage = 'Migrate cancelled.';

export interface MigrateOptions {
    generate?: string;
    run?: boolean;
    revert?: boolean;
    outputDir?: string;
}

/**
 * Executes the database migration command in either interactive or non-interactive mode.
 *
 * If migration options are provided, runs the corresponding migration operation without user prompts. Otherwise, launches an interactive prompt for the user to select a migration action.
 *
 * @param options - Optional migration operation parameters to enable non-interactive execution
 */
export async function migrateCommand(options?: MigrateOptions) {
    // Check if any non-interactive options are provided
    if (options?.generate || options?.run || options?.revert) {
        // Non-interactive mode
        await handleNonInteractiveMode(options);
        return;
    }

    // Interactive mode (original behavior)
    await handleInteractiveMode();
}

/**
 * Executes migration operations in non-interactive mode based on the provided options.
 *
 * Depending on the options, this function generates a new migration, runs pending migrations, or reverts the last migration. Logs the outcome and exits the process with code 1 on failure.
 *
 * @param options - Migration operation options specifying which action to perform
 */
async function handleNonInteractiveMode(options: MigrateOptions) {
    try {
        process.env.VENDURE_RUNNING_IN_CLI = 'true';

        if (options.generate) {
            const result = await generateMigrationOperation({
                name: options.generate,
                outputDir: options.outputDir,
            });

            if (result.success) {
                log.success(result.message);
            } else {
                log.error(result.message);
                process.exit(1);
            }
        } else if (options.run) {
            const result = await runMigrationsOperation();

            if (result.success) {
                log.success(result.message);
            } else {
                log.error(result.message);
                process.exit(1);
            }
        } else if (options.revert) {
            const result = await revertMigrationOperation();

            if (result.success) {
                log.success(result.message);
            } else {
                log.error(result.message);
                process.exit(1);
            }
        }

        process.env.VENDURE_RUNNING_IN_CLI = undefined;
    } catch (e: any) {
        log.error(e.message as string);
        if (e.stack) {
            log.error(e.stack);
        }
        process.exit(1);
    }
}

/**
 * Launches an interactive CLI prompt for managing database migrations.
 *
 * Guides the user through generating, running, or reverting migrations based on their selection. Exits the process if the user cancels the prompt.
 */
async function handleInteractiveMode() {
    // eslint-disable-next-line no-console
    console.log(`\n`);
    intro(pc.blue('🛠️️ Vendure migrations'));
    const action = await select({
        message: 'What would you like to do?',
        options: [
            { value: 'generate', label: 'Generate a new migration' },
            { value: 'run', label: 'Run pending migrations' },
            { value: 'revert', label: 'Revert the last migration' },
        ],
    });
    if (isCancel(action)) {
        cancel(cancelledMessage);
        process.exit(0);
    }
    try {
        process.env.VENDURE_RUNNING_IN_CLI = 'true';
        if (action === 'generate') {
            const { generateMigrationCommand } = await import('./generate-migration/generate-migration');
            await generateMigrationCommand.run();
        }
        if (action === 'run') {
            const { runMigrationCommand } = await import('./run-migration/run-migration');
            await runMigrationCommand.run();
        }
        if (action === 'revert') {
            const { revertMigrationCommand } = await import('./revert-migration/revert-migration');
            await revertMigrationCommand.run();
        }
        outro('✅ Done!');
        process.env.VENDURE_RUNNING_IN_CLI = undefined;
    } catch (e: any) {
        log.error(e.message as string);
        if (e.stack) {
            log.error(e.stack);
        }
    }
}
