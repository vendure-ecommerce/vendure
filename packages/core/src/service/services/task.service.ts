import { Injectable } from '@nestjs/common';
import CronTime from 'cron-time-generator';
import { Cron } from 'croner';

import { Instrument } from '../../common/instrument-decorator';
import { Logger } from '../../config';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { ScheduledTaskRecord } from '../../plugin/default-scheduler-plugin/scheduled-task-record.entity';
import { SchedulerService } from '../../scheduler/scheduler.service';

const loggerCtx = 'CleanTaskLocks';

@Injectable()
@Instrument()
export class TaskService {
    constructor(
        private connection: TransactionalConnection,
        private schedulerService: SchedulerService,
    ) {}

    /**
     * @description
     * Cleans stale task locks from the database.
     */
    async cleanStaleLocks() {
        const now = new Date();
        Logger.verbose('Cleaning stale task locks', loggerCtx);

        try {
            const lockedTasks = await this.fetchLockedTasks();
            const staleTasks = await this.extractStaleTasks(lockedTasks, now);

            if (staleTasks.length > 0) {
                await this.clearLocks(staleTasks);
            } else {
                Logger.debug('No stale task locks found', loggerCtx);
            }

            return {
                success: true,
                tasksCleared: staleTasks.length,
            };
        } catch (error) {
            Logger.error(
                `Error cleaning up stale task locks: ${error instanceof Error ? error.message : String(error)}`,
                loggerCtx,
            );
            throw error;
        }
    }

    private async fetchLockedTasks(): Promise<ScheduledTaskRecord[]> {
        return this.connection.rawConnection
            .getRepository(ScheduledTaskRecord)
            .createQueryBuilder('task')
            .where('task.lockedAt IS NOT NULL')
            .getMany();
    }

    private getScheduleIntervalMs(schedule: string | ((cronTime: typeof CronTime) => string)): number {
        const scheduleString = typeof schedule === 'function' ? schedule(CronTime) : schedule;
        const cron = new Cron(scheduleString);
        const nextFn: () => Date | null | undefined =
            typeof (cron as any).nextRun === 'function'
                ? (cron as any).nextRun.bind(cron)
                : (cron as any).next.bind(cron);
        const next1 = nextFn();
        const next2 = nextFn();
        if (!next1 || !next2) {
            throw new Error('Could not compute next run times');
        }
        return next2.getTime() - next1.getTime();
    }

    private isStale(task: ScheduledTaskRecord, now: Date, intervalMs: number): boolean {
        if (!task.lockedAt) {
            return false;
        }
        return now.getTime() - task.lockedAt.getTime() > intervalMs;
    }

    private async extractStaleTasks(
        lockedTasks: ScheduledTaskRecord[],
        now: Date,
    ): Promise<ScheduledTaskRecord[]> {
        const staleTasks: ScheduledTaskRecord[] = [];
        const schedulerTasks = await this.schedulerService.getTaskList();
        const taskInfoById = new Map<string, { id: string; schedule: string }>(
            schedulerTasks.map((t: { id: string; schedule: string }) => [t.id, t]),
        );

        for (const task of lockedTasks) {
            if (!task.lockedAt) {
                continue;
            }

            const taskInfo = taskInfoById.get(task.taskId);
            if (!taskInfo) {
                Logger.verbose(`Task ${task.taskId} not found in scheduler service`, loggerCtx);
                continue;
            }

            try {
                const intervalMs = this.getScheduleIntervalMs(taskInfo.schedule);
                if (this.isStale(task, now, intervalMs)) {
                    staleTasks.push(task);
                }
            } catch (e) {
                Logger.warn(
                    `Could not parse schedule for task ${task.taskId}: ${e instanceof Error ? e.message : String(e)}`,
                    loggerCtx,
                );
                continue;
            }
        }

        return staleTasks;
    }

    private async clearLocks(staleTasks: ScheduledTaskRecord[]): Promise<void> {
        await this.connection.withTransaction(async ctx => {
            const repo = this.connection.getRepository(ctx, ScheduledTaskRecord);
            for (const task of staleTasks) {
                const result = await repo.update(
                    { taskId: task.taskId, lockedAt: task.lockedAt ?? undefined },
                    { lockedAt: null },
                );
                if (result.affected && result.affected > 0) {
                    Logger.verbose(`Successfully cleaned stale task locks for task "${task.taskId}"`);
                } else {
                    Logger.debug(
                        `Skipped clearing lock for task "${task.taskId}" because the lock has changed since observation`,
                        loggerCtx,
                    );
                }
            }
        });
    }
}
