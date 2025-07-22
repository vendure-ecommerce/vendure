import { ScheduledTask } from '../../scheduler/scheduled-task';
import { KeyValueService } from '../../service/helpers/key-value/key-value.service';
import { Logger } from '../logger/vendure-logger';

import { CleanupOrphanedEntriesOptions } from './key-value-types';

/**
 * @description
 * A {@link ScheduledTask} that cleans up orphaned key-value entries from the database.
 * Orphaned entries are entries that no longer have corresponding field definitions
 * in the key-value configuration.
 *
 * This task can be configured with options for dry-run mode, age thresholds,
 * and batch processing settings. Users can override or disable this task entirely
 * using the existing ScheduledTask APIs.
 *
 * @example
 * ```ts
 * // Override the default task with custom options
 * const customCleanupTask = new ScheduledTask({
 *   id: 'clean-orphaned-key-values',
 *   description: 'Custom orphaned key-values cleanup',
 *   schedule: cron => cron.every(7).days(),
 *   async execute({ injector }) {
 *     const keyValueService = injector.get(KeyValueService);
 *     return keyValueService.cleanupOrphanedEntries({
 *       olderThan: '30d',
 *       maxDeleteCount: 500,
 *       batchSize: 50,
 *     });
 *   },
 * });
 * ```
 *
 * @since 3.4.0
 * @docsCategory key-value-storage
 * @docsPage KeyValueStorage
 */
export const cleanOrphanedKeyValuesTask = new ScheduledTask({
    id: 'clean-orphaned-key-values',
    description: 'Clean orphaned key-value entries that no longer have field definitions',
    schedule: cron => cron.every(7).days(),
    params: {
        olderThan: '7d',
    },
    async execute({ injector, params }) {
        const options: CleanupOrphanedEntriesOptions = {
            olderThan: params.olderThan,
            maxDeleteCount: 1000,
            batchSize: 100,
            dryRun: false,
        };

        const keyValueService = injector.get(KeyValueService);
        const result = await keyValueService.cleanupOrphanedEntries(options);

        if (result.dryRun) {
            Logger.info(`Dry run: would delete ${result.deletedCount} orphaned key-value entries`);
            if (result.deletedEntries.length > 0) {
                Logger.verbose(
                    `Sample entries that would be deleted: ${result.deletedEntries
                        .map(entry => `${entry.key} (scope: ${entry.scope})`)
                        .join(', ')}`,
                );
            }
        } else {
            Logger.info(`Deleted ${result.deletedCount} orphaned key-value entries`);
        }

        return {
            orphanedEntriesDeleted: result.deletedCount,
            dryRun: result.dryRun,
            sampleDeleted: result.deletedEntries.length,
        };
    },
});
