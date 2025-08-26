import { Logger, ScheduledTask } from '@vendure/core';

const loggerCtx = `AssemblyStockTriggerTask`;

/**
 * A mock scheduled task that runs for 5 minutes to test
 * task crash handling and stale lock cleanup.
 */
export const assemblyStockTrigger = new ScheduledTask({
    id: 'assembly-stock-trigger',
    description: 'A long-running task (5 minutes) to test crash handling',
    schedule: (cron) => cron.every(6).minutes(),
    async execute({ injector }) {
        Logger.info('Starting long-running task', loggerCtx);

        try {
            // Simulate 5 stages of work, each taking 1 minute
            for (let stage = 1; stage <= 5; stage++) {
                Logger.info(`Stage ${stage}/5: Starting...`, loggerCtx);
                // Simple 1-minute delay
                await new Promise(resolve => setTimeout(resolve, 60_000));
                Logger.info(`Stage ${stage}/5: Complete`, loggerCtx);
            }

            Logger.info('Long-running task completed successfully', loggerCtx);
            return {
                result: 'Task completed all 5 stages',
            };
        } catch (error) {
            Logger.error(`Error in long-running task: ${error as string}`, loggerCtx);
            throw error;
        }
    },
});