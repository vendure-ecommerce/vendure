import CronTime from 'cron-time-generator';

import { Injector } from '../common/index';
/**
 * @description
 * The configuration for a scheduled task.
 *
 * @since 3.3.0
 */
export interface ScheduledTaskConfig {
    /**
     * @description
     * The unique identifier for the scheduled task.
     */
    id: string;
    /**
     * @description
     * The cron schedule for the scheduled task. This can be a standard cron expression or
     * a function that returns a [cron-time-generator](https://www.npmjs.com/package/cron-time-generator)
     * expression.
     *
     * @example
     * ```ts
     * // Standard cron expression
     * { schedule: '0 0-23/5 * * *', } // every 5 hours
     * { schedule: '0 22 * * *', } // every day at 10:00 PM
     *
     * // Cron-time-generator expression
     * { schedule: cronTime => cronTime.every(2).minutes(), }
     * { schedule: cronTime => cronTime.every(5).hours(), }
     * ```
     */
    schedule: string | ((cronTime: typeof CronTime) => string);
    /**
     * @description
     * The timeout for the scheduled task. If the task takes longer than the timeout, the task
     * will be considered to have failed with a timeout error.
     *
     * @default 60_000ms
     */
    timeout?: number | string;
    /**
     * @description
     * Whether the scheduled task should be prevented from running if it is already running.
     *
     * @default true
     */
    preventOverlap?: boolean;
    /**
     * @description
     * The function that will be executed when the scheduled task is run.
     */
    execute(injector: Injector): Promise<any>;
}

/**
 * @description
 * A scheduled task that will be executed at a given cron schedule.
 *
 * @since 3.3.0
 */
export class ScheduledTask {
    constructor(private readonly config: ScheduledTaskConfig) {}

    get id() {
        return this.config.id;
    }

    get options() {
        return this.config;
    }

    async execute(injector: Injector) {
        return this.config.execute(injector);
    }
}
