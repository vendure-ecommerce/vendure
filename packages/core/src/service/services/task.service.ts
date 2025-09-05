import { Injectable } from '@nestjs/common';
import { Cron } from 'croner';

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
    async cleanStaleLocks() {
        const now = new Date();
        const staleTasks: ScheduledTaskRecord[] = [];
        Logger.verbose('Cleaning stale task locks');

        try {
            const lockedTasks = await this.connection.rawConnection
                .getRepository(ScheduledTaskRecord)
                .createQueryBuilder('task')
                .where('task.lockedAt IS NOT NULL')
                .getMany();

            for (const task of lockedTasks) {
                const taskConfig = await this.connection.rawConnection
                    .getRepository(ScheduledTaskRecord)
                    .findOne({ where: { taskId: task.taskId } });

                if (!taskConfig || !task.lockedAt) {
                    Logger.verbose(`Task ${task.taskId} not found or locked at is null`, 'CleanTaskLockTask');
                    continue;
                }

                try {
                    const taskInfo = (await this.schedulerService.getTaskList()).find(
                        (t: { id: string }) => t.id === task.taskId,
                    );
                    if (!taskInfo) {
                        Logger.verbose(
                            `Task ${task.taskId} not found in scheduler service`,
                            'CleanTaskLockTask',
                        );
                        continue;
                    }

                    const cron = new Cron(taskInfo.schedule);
                    const next1 = cron.nextRun();
                    const next2 = cron.nextRun();

                    Logger.verbose(
                        `Next run for task ${task.taskId}: ${next1?.toISOString() ?? 'Time 1 not found'} and ${next2?.toISOString() ?? 'Time 2 not found'}`,
                    );
                    if (!next1 || !next2) {
                        Logger.verbose(`Next run for task ${task.taskId} not found`, 'CleanTaskLockTask');
                        continue;
                    }

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
}
