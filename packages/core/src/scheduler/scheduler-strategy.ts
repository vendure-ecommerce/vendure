import { UpdateScheduledTaskInput } from '@vendure/common/lib/generated-types';
import { Cron } from 'croner';

import { InjectableStrategy } from '../common';

import { ScheduledTask } from './scheduled-task';

export interface TaskReport {
    id: string;
    lastExecutedAt: Date | null;
    isRunning: boolean;
    lastResult: any;
    enabled: boolean;
}

/**
 * @description
 * This strategy is used to define the mechanism by which scheduled tasks are executed
 * and how they are reported on. The main purpose of this strategy is to ensure
 * that a given task is executed exactly once at the scheduled time, even if there
 * are multiple instances of the worker running.
 *
 * To do this, the strategy must use some form of shared storage and a method of
 * locking so that only a single worker is allowed to execute the task.
 *
 * By default, the {@link DefaultSchedulerStrategy} will use the database to enable
 * this functionality.
 *
 * @since 3.3.0
 * @docsCategory scheduled-tasks
 */
export interface SchedulerStrategy extends InjectableStrategy {
    executeTask(task: ScheduledTask): (job: Cron) => Promise<any> | any;
    getTasks(): Promise<TaskReport[]>;
    getTask(id: string): Promise<TaskReport | undefined>;
    updateTask(input: UpdateScheduledTaskInput): Promise<TaskReport>;
}
