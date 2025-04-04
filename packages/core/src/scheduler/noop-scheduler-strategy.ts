import { Logger } from '../config/logger/vendure-logger';

import { ScheduledTask } from './scheduled-task';
import { SchedulerStrategy } from './scheduler-strategy';

export class NoopSchedulerStrategy implements SchedulerStrategy {
    executeTask(task: ScheduledTask) {
        Logger.warn(`No task scheduler is configured! The task ${task.id} will not be executed.`);
        return () => Promise.resolve();
    }
}
