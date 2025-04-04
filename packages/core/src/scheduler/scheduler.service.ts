import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import CronTime from 'cron-time-generator';
import { Cron } from 'croner';
import cronstrue from 'cronstrue';

import { ConfigService } from '../config/config.service';
import { Logger } from '../config/logger/vendure-logger';

import { NoopSchedulerStrategy } from './noop-scheduler-strategy';
import { ScheduledTask } from './scheduled-task';

export interface TaskInfo {
    id: string;
    schedule: string;
    scheduleDescription: string;
    lastExecutedAt: Date | null;
    nextExecutionAt: Date | null;
    isRunning: boolean;
    lastResult: any;
}

@Injectable()
export class SchedulerService implements OnApplicationBootstrap {
    private jobs: Map<string, { task: ScheduledTask; job: Cron }> = new Map();
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
            this.jobs.set(task.id, { task, job });
        }
    }

    getTaskList(): Promise<TaskInfo[]> {
        return this.configService.schedulerOptions.schedulerStrategy.getTasks().then(tasks =>
            tasks
                .map(task => {
                    const job = this.jobs.get(task.id)?.job;
                    if (!job) {
                        return;
                    }
                    const pattern = job.getPattern();
                    return {
                        id: task.id,
                        schedule: pattern ?? 'unknown',
                        scheduleDescription: pattern ? cronstrue.toString(pattern) : 'unknown',
                        lastExecutedAt: task.lastExecutedAt,
                        nextExecutionAt: job.nextRun(),
                        isRunning: task.isRunning,
                        lastResult: task.lastResult,
                    };
                })
                .filter(x => x !== undefined),
        );
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
