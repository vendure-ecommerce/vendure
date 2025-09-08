import { Logger, ScheduledTask } from '@vendure/core';


const loggerCtx = `LongRunningTaskTriggerTask`;

/**
 * A scheduled task that triggers the assembly stock sync job
 * to update assembly stock levels from KEA.
 */
export const longRunningTaskTrigger = new ScheduledTask({
  id: 'long-running-task-trigger',
  description: 'Triggers long running task',
  schedule: (cron) => cron.every(30).minutes(),
  async execute({ injector }) {

    Logger.verbose('Starting scheduled long running task', loggerCtx);

    try {
      await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
      return { ok: true };
    } catch (error) {
      if (error instanceof Error) {
        Logger.error(`Error triggering long running task: ${error.message}`, loggerCtx);
      }
      throw error;
    }
  },
});
