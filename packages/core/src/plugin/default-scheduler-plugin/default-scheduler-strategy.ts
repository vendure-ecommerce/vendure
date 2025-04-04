import { Cron } from 'croner';
import ms from 'ms';

import { Injector } from '../../common';
import { Logger } from '../../config/logger/vendure-logger';
import { TransactionalConnection } from '../../connection';
import { ProcessContext } from '../../process-context';
import { ScheduledTask } from '../../scheduler/scheduled-task';
import { SchedulerStrategy } from '../../scheduler/scheduler-strategy';

import { DEFAULT_SCHEDULER_PLUGIN_OPTIONS } from './constants';
import { ScheduledTaskRecord } from './scheduled-task-record.entity';
import { DefaultSchedulerPluginOptions } from './types';

export class DefaultSchedulerStrategy implements SchedulerStrategy {
    private connection: TransactionalConnection;
    private injector: Injector;
    private processContext: ProcessContext;
    private tasks: Map<string, { task: ScheduledTask; isRegistered: boolean }> = new Map();
    private pluginOptions: DefaultSchedulerPluginOptions;

    init(injector: Injector) {
        this.connection = injector.get(TransactionalConnection);
        this.processContext = injector.get(ProcessContext);
        this.pluginOptions = injector.get(DEFAULT_SCHEDULER_PLUGIN_OPTIONS);
        this.injector = injector;
    }

    executeTask(task: ScheduledTask) {
        return async (job: Cron) => {
            if (this.processContext.isServer) {
                return;
            }
            await this.ensureTaskIsRegistered(task);
            const taskEntity = await this.connection.rawConnection
                .getRepository(ScheduledTaskRecord)
                .createQueryBuilder('task')
                .update()
                .set({ lockedAt: new Date() })
                .where('taskId = :taskId', { taskId: task.id })
                .andWhere('lockedAt IS NULL')
                .execute();
            if (!taskEntity.affected) {
                return;
            }
            try {
                const timeout = task.options.timeout ?? (this.pluginOptions.defaultTimeout as number);
                const timeoutMs = typeof timeout === 'number' ? timeout : ms(timeout);

                let timeoutTimer: NodeJS.Timeout | undefined;
                const timeoutPromise = new Promise((_, reject) => {
                    timeoutTimer = setTimeout(() => {
                        Logger.warn(`Scheduled task ${task.id} timed out after ${timeoutMs}ms`);
                        reject(new Error('Task timed out'));
                    }, timeoutMs);
                });

                const result = await Promise.race([task.execute(this.injector), timeoutPromise]);

                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                }

                await this.connection.rawConnection.getRepository(ScheduledTaskRecord).update(
                    {
                        taskId: task.id,
                    },
                    {
                        lastExecutedAt: new Date(),
                        lockedAt: null,
                        lastResult: result,
                    },
                );
            } catch (error) {
                let errorMessage = 'Unknown error';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                Logger.error(`Scheduled task ${task.id} failed with error: ${errorMessage}`);
                await this.connection.rawConnection.getRepository(ScheduledTaskRecord).update(
                    {
                        taskId: task.id,
                    },
                    {
                        lockedAt: null,
                        lastResult: { error: errorMessage } as any,
                    },
                );
            }
        };
    }

    private async ensureTaskIsRegistered(task: ScheduledTask) {
        if (!this.tasks.get(task.id)?.isRegistered) {
            await this.connection.rawConnection
                .getRepository(ScheduledTaskRecord)
                .createQueryBuilder()
                .insert()
                .into(ScheduledTaskRecord)
                .values({ taskId: task.id })
                .orIgnore()
                .execute();
            this.tasks.set(task.id, { task, isRegistered: true });
        }
    }
}
