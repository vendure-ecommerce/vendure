import { Injectable } from '@nestjs/common';
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

    private async taskConfigExists(taskId: string): Promise<boolean> {
        const taskConfig = await this.connection.rawConnection
            .getRepository(ScheduledTaskRecord)
            .findOne({ where: { taskId } });
        return !!taskConfig;
    }

    private getScheduleIntervalMs(schedule: string): number {
        const cron = new Cron(schedule);
        const next1 = cron.nextRun();
        const next2 = cron.nextRun();
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

        for (const task of lockedTasks) {
            const exists = await this.taskConfigExists(task.taskId);
            if (!exists || !task.lockedAt) {
                continue;
            }

            const taskInfo = schedulerTasks.find((t: { id: string }) => t.id === task.taskId);
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
        for (const task of staleTasks) {
            await this.connection.rawConnection
                .getRepository(ScheduledTaskRecord)
                .update({ taskId: task.taskId }, { lockedAt: null });

            Logger.verbose(`Successfully cleaned stale task locks for task "${task.taskId}"`);
        }
    }
}
