import { TaskService } from '../../service/services/task.service';
import { ScheduledTask } from '../scheduled-task';

/**
 * @description
 * A {@link ScheduledTask} that cleans stale task locks from the database.
 *
 * @example
 * ```ts
 * import { cleanTaskLockTask, VendureConfig } from '@vendure/core';
 *
 * export const config: VendureConfig = {
 *   // ...
 *   schedulerOptions: {
 *     tasks: [
 *       // Use the task as is
 *       cleanTaskLockTask,
 *       // or configure the task
 *       cleanTaskLockTask.configure({
 *         // Run the task every day at 3:00am
 *         // The default schedule is every day at 00:00am
 *         schedule: cron => cron.everyDayAt(3, 0),
 *         params: {
 *           // How many tasks to process in each batch
 *           // Default: 1000
 *           batchSize: 5_000,
 *         },
 *       }),
 *     ],
 *   },
 * };
 * ```
 *
 * @since 3.3.0
 * @docsCategory scheduled-tasks
 */
export const cleanTaskLockTask = new ScheduledTask({
    id: 'clean-task-lock',
    description: 'Clean stale task locks from the database',
    params: {
        batchSize: 1000,
    },
    schedule: cron => cron.every(10).minutes(),
    async execute({ injector, params }) {
        const taskService = injector.get(TaskService);
        await taskService.triggerCleanTaskLocksJob(params.batchSize);
        return { result: 'Triggered clean task locks job' };
    },
});
