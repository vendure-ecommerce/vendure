import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import CronTime from 'cron-time-generator';
import { Cron } from 'croner';

import { ConfigService } from '../config/config.service';
import { Logger } from '../config/logger/vendure-logger';

import { NoopSchedulerStrategy } from './noop-scheduler-strategy';
import { ScheduledTask } from './scheduled-task';

@Injectable()
export class SchedulerService implements OnApplicationBootstrap {
    private jobs: Cron[] = [];
    constructor(private configService: ConfigService) {}

    onApplicationBootstrap() {
        const schedulerStrategy = this.configService.schedulerOptions.schedulerStrategy;
        if (!schedulerStrategy || schedulerStrategy instanceof NoopSchedulerStrategy) {
            Logger.warn('No scheduler strategy is configured! Scheduled tasks will not be executed.');
            Logger.warn(
                'Please use the `DefaultSchedulerPlugin` (or alternative) to enable scheduled tasks.',
            );
            return;
        }
        const scheduledTasks = this.configService.schedulerOptions.tasks ?? [];

        for (const task of scheduledTasks) {
            const job = this.createCronJob(task);
            this.jobs.push(job);
        }
    }

    private createCronJob(task: ScheduledTask) {
        const schedulerStrategy = this.configService.schedulerOptions.schedulerStrategy;
        const protectCallback = (_job: Cron) => {
            const currentRun = _job.currentRun();
            if (currentRun) {
                Logger.warn(
                    `Task invocation of ${task.id} at ${new Date().toISOString()} was blocked because an existing task is still running at ${currentRun.toISOString()}`,
                );
            }
        };

        const schedule =
            typeof task.options.schedule === 'function'
                ? task.options.schedule(CronTime)
                : task.options.schedule;

        const job = new Cron(
            schedule,
            {
                name: task.id,
                protect: task.options.preventOverlap ? protectCallback : undefined,
            },
            () => schedulerStrategy.executeTask(task)(job),
        );
        return job;
    }
}
