import { TaskService } from '../../service/services/task.service';
import { ScheduledTask } from '../scheduled-task';

/**
 * @description
 * A {@link ScheduledTask} that cleans stale task locks from the database.
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
