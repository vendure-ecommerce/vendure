import { Injectable } from '@nestjs/common';
import { Cron } from 'croner';

import { RequestContext } from '../../api/common/request-context';
import { Instrument } from '../../common/instrument-decorator';
import { Logger } from '../../config';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { ScheduledTaskRecord } from '../../plugin/default-scheduler-plugin/scheduled-task-record.entity';
import { SchedulerService } from '../../scheduler/scheduler.service';

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
    async cleanStaleLocks(ctx: RequestContext, batchSize: number) {
        const now = new Date();
        const staleTasks: ScheduledTaskRecord[] = [];

        try {
            await this.clearSelfLockIfStale();

            const lockedTasks = await this.connection.rawConnection
                .getRepository(ScheduledTaskRecord)
                .createQueryBuilder('task')
                .where('task.lockedAt IS NOT NULL')
                .getMany();

            for (const task of lockedTasks) {
                const taskConfig = await this.connection.rawConnection
                    .getRepository(ScheduledTaskRecord)
                    .findOne({ where: { taskId: task.taskId } });

                if (!taskConfig || !task.lockedAt) continue;

                try {
                    const taskInfo = (await this.schedulerService.getTaskList()).find(
                        (t: { id: string }) => t.id === task.taskId,
                    );
                    if (!taskInfo) continue;

                    const cron = new Cron(taskInfo.schedule);
                    const next1 = cron.nextRun();
                    const next2 = cron.nextRun();
                    if (!next1 || !next2) continue;

                    const intervalMs = next2.getTime() - next1.getTime();

                    if (now.getTime() - task.lockedAt.getTime() > intervalMs) {
                        staleTasks.push(task);
                    }
                } catch (e) {
                    Logger.warn(
                        `Could not parse schedule for task ${task.taskId}: ${e instanceof Error ? e.message : String(e)}`,
                        'CleanTaskLockTask',
                    );
                    continue;
                }
            }

            if (staleTasks.length > 0) {
                Logger.info(`Found ${staleTasks.length} tasks with stale locks`, 'CleanTaskLockTask');

                for (const task of staleTasks) {
                    await this.connection.rawConnection
                        .getRepository(ScheduledTaskRecord)
                        .update({ taskId: task.taskId }, { lockedAt: null });

                    Logger.info(
                        `Cleared stale lock for task "${task.taskId}" (locked since ${
                            task.lockedAt ? task.lockedAt.toISOString() : 'unknown'
                        })`,
                        'CleanTaskLockTask',
                    );
                }
            } else {
                Logger.debug('No stale task locks found', 'CleanTaskLockTask');
            }

            return {
                success: true,
                tasksCleared: staleTasks.length,
            };
        } catch (error) {
            Logger.error(
                `Error cleaning up stale task locks: ${error instanceof Error ? error.message : String(error)}`,
                'CleanTaskLockTask',
            );
            throw error;
        }
    }

    /**
     * @description
     * Checks if the cleanup task itself has a stale lock and clears it.
     * This prevents the cleanup task from deadlocking itself.
     */
    private async clearSelfLockIfStale() {
        const now = new Date();
        const cleanupTaskId = 'clean-task-lock';

        const maxCleanupDuration = 5 * 60 * 1000; // maximum cleanup duration 5 minutes

        try {
            const cleanupTask = await this.connection.rawConnection
                .getRepository(ScheduledTaskRecord)
                .findOne({ where: { taskId: cleanupTaskId } });

            if (cleanupTask && cleanupTask.lockedAt) {
                const lockAge = now.getTime() - cleanupTask.lockedAt.getTime();

                if (lockAge > maxCleanupDuration) {
                    await this.connection.rawConnection
                        .getRepository(ScheduledTaskRecord)
                        .update({ taskId: cleanupTaskId }, { lockedAt: null });

                    Logger.warn(
                        `Cleared stale lock for cleanup task "${cleanupTaskId}" (was locked for ${Math.round(lockAge / 1000)}s)`,
                        'TaskService',
                    );
                }
            }
        } catch (error) {
            Logger.warn(
                `Failed to check/clear self lock: ${error instanceof Error ? error.message : String(error)}`,
                'TaskService',
            );
        }
    }
}
