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

export interface SchedulerStrategy extends InjectableStrategy {
    executeTask(task: ScheduledTask): (job: Cron) => Promise<any> | any;
    getTasks(): Promise<TaskReport[]>;
    getTask(id: string): Promise<TaskReport | undefined>;
}
