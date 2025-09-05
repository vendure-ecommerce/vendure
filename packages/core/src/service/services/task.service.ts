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
        const staleTasks: ScheduledTaskRecord[] = [];
        Logger.verbose('Cleaning stale task locks', loggerCtx);

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
                    continue;
                }

                try {
                    const taskInfo = (await this.schedulerService.getTaskList()).find(
                        (t: { id: string }) => t.id === task.taskId,
                    );
                    if (!taskInfo) {
                        Logger.verbose(`Task ${task.taskId} not found in scheduler service`, loggerCtx);
                        continue;
                    }

                    const cron = new Cron(taskInfo.schedule);
                    const next1 = cron.nextRun();
                    const next2 = cron.nextRun();

                    if (!next1 || !next2) {
                        continue;
                    }

                    const intervalMs = next2.getTime() - next1.getTime();

                    if (now.getTime() - task.lockedAt.getTime() > intervalMs) {
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

            if (staleTasks.length > 0) {
                for (const task of staleTasks) {
                    await this.connection.rawConnection
                        .getRepository(ScheduledTaskRecord)
                        .update({ taskId: task.taskId }, { lockedAt: null });
                }
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
}
