import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UpdateScheduledTaskInput } from '@vendure/common/lib/generated-types';
import CronTime from 'cron-time-generator';
import { Cron } from 'croner';
import cronstrue from 'cronstrue';

import { ConfigService } from '../config/config.service';
import { Logger } from '../config/logger/vendure-logger';

import { NoopSchedulerStrategy } from './noop-scheduler-strategy';
import { ScheduledTask } from './scheduled-task';
import { TaskReport } from './scheduler-strategy';

export interface TaskInfo {
    id: string;
    description: string;
    schedule: string;
    scheduleDescription: string;
    lastExecutedAt: Date | null;
    nextExecutionAt: Date | null;
    isRunning: boolean;
    lastResult: any;
    enabled: boolean;
}

/**
 * @description
 * The service that is responsible for setting up and querying the scheduled tasks.
 *
 * @since 3.3.0
 * @docsCategory scheduled-tasks
 */
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
            const pattern = job.getPattern();
            if (!pattern) {
                Logger.warn(`Invalid cron pattern for task ${task.id}`);
                continue;
            } else {
                const schedule = cronstrue.toString(pattern);
                Logger.info(`Registered scheduled task: ${task.id} - ${schedule}`);
                this.jobs.set(task.id, { task, job });
            }
        }
    }

    /**
     * @description
     * Returns a list of all the scheduled tasks and their current status.
     */
    getTaskList(): Promise<TaskInfo[]> {
        return this.configService.schedulerOptions.schedulerStrategy
            .getTasks()
            .then(taskReports =>
                taskReports.map(taskReport => this.createTaskInfo(taskReport)).filter(x => x !== undefined),
            );
    }

    updateTask(input: UpdateScheduledTaskInput): Promise<TaskInfo> {
        return this.configService.schedulerOptions.schedulerStrategy.updateTask(input).then(taskReport => {
            const taskInfo = this.createTaskInfo(taskReport);
            if (!taskInfo) {
                throw new Error(`Task ${input.id} not found`);
            }
            return taskInfo;
        });
    }

    private createTaskInfo(taskReport: TaskReport): TaskInfo | undefined {
        const job = this.jobs.get(taskReport.id)?.job;
        const task = this.jobs.get(taskReport.id)?.task;
        if (!job || !task) {
            return;
        }

        const pattern = job.getPattern();
        return {
            id: taskReport.id,
            description: task.options.description ?? '',
            schedule: pattern ?? 'unknown',
            scheduleDescription: pattern ? cronstrue.toString(pattern) : 'unknown',
            lastExecutedAt: taskReport.lastExecutedAt,
            nextExecutionAt: job.nextRun(),
            isRunning: taskReport.isRunning,
            lastResult: taskReport.lastResult,
            enabled: taskReport.enabled,
        };
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
