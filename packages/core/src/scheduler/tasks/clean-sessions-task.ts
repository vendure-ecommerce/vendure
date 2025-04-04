import { SessionService } from '../../service/services/session.service';
import { ScheduledTask } from '../scheduled-task';

/**
 * @description
 * A scheduled task that cleans expired & inactive sessions from the database.
 *
 * @since 3.3.0
 * @docsCategory scheduled-tasks
 */
export const cleanSessionsTask = new ScheduledTask({
    id: 'clean-sessions',
    description: 'Clean expired & inactive sessions from the database',
    params: {
        batchSize: 10_000,
    },
    schedule: cron => cron.everyDayAt(0, 0),
    async execute(injector, params) {
        const sessionService = injector.get(SessionService);
        await sessionService.triggerCleanSessionsJob(params.batchSize);
        return { result: 'Triggered clean sessions job' };
    },
});
