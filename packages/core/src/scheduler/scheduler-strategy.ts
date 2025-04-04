import { Cron } from 'croner';

import { InjectableStrategy } from '../common';

import { ScheduledTask } from './scheduled-task';

export interface SchedulerStrategy extends InjectableStrategy {
    executeTask(task: ScheduledTask): (job: Cron) => Promise<any> | any;
}
