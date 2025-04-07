import { UpdateScheduledTaskInput } from '@vendure/common/lib/generated-types';
import { Cron } from 'croner';
import ms from 'ms';

import { Injector } from '../../common';
import { assertFound } from '../../common/utils';
import { Logger } from '../../config/logger/vendure-logger';
import { TransactionalConnection } from '../../connection';
import { ProcessContext } from '../../process-context';
import { ScheduledTask } from '../../scheduler/scheduled-task';
import { SchedulerStrategy, TaskReport } from '../../scheduler/scheduler-strategy';

import { DEFAULT_SCHEDULER_PLUGIN_OPTIONS } from './constants';
import { ScheduledTaskRecord } from './scheduled-task-record.entity';
import { DefaultSchedulerPluginOptions } from './types';
/**
 * @description
 * The default {@link SchedulerStrategy} implementation that uses the database to
 * execute scheduled tasks. This strategy is configured when you use the
 * {@link DefaultSchedulerPlugin}.
 *
 * @since 3.3.0
 * @docsCategory scheduled-tasks
 */
export class DefaultSchedulerStrategy implements SchedulerStrategy {
    private connection: TransactionalConnection;
    private injector: Injector;
    private processContext: ProcessContext;
    private tasks: Map<string, { task: ScheduledTask; isRegistered: boolean }> = new Map();
    private pluginOptions: DefaultSchedulerPluginOptions;
    private runningTasks: ScheduledTask[] = [];

    init(injector: Injector) {
        this.connection = injector.get(TransactionalConnection);
        this.processContext = injector.get(ProcessContext);
        this.pluginOptions = injector.get(DEFAULT_SCHEDULER_PLUGIN_OPTIONS);
        this.injector = injector;
    }

    async destroy() {
        for (const task of this.runningTasks) {
            await this.connection.rawConnection
                .getRepository(ScheduledTaskRecord)
                .update({ taskId: task.id }, { lockedAt: null });
            Logger.info(`Released lock for task "${task.id}"`);
        }
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
                .andWhere('enabled = TRUE')
                .execute();
            if (!taskEntity.affected) {
                return;
            }

            Logger.verbose(`Executing scheduled task "${task.id}"`);
            try {
                this.runningTasks.push(task);
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
                        lastResult: result ?? '',
                    },
                );
                Logger.verbose(`Scheduled task "${task.id}" completed successfully`);
                this.runningTasks = this.runningTasks.filter(t => t !== task);
            } catch (error) {
                let errorMessage = 'Unknown error';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                Logger.error(`Scheduled task "${task.id}" failed with error: ${errorMessage}`);
                await this.connection.rawConnection.getRepository(ScheduledTaskRecord).update(
                    {
                        taskId: task.id,
                    },
                    {
                        lockedAt: null,
                        lastResult: { error: errorMessage } as any,
                    },
                );
                this.runningTasks = this.runningTasks.filter(t => t !== task);
            }
        };
    }

    getTasks(): Promise<TaskReport[]> {
        return this.connection.rawConnection
            .getRepository(ScheduledTaskRecord)
            .createQueryBuilder('task')
            .getMany()
            .then(tasks => {
                return tasks.map(task => this.entityToReport(task));
            });
    }

    getTask(id: string): Promise<TaskReport | undefined> {
        return this.connection.rawConnection
            .getRepository(ScheduledTaskRecord)
            .createQueryBuilder('task')
            .where('task.taskId = :id', { id })
            .getOne()
            .then(task => (task ? this.entityToReport(task) : undefined));
    }

    async updateTask(input: UpdateScheduledTaskInput): Promise<TaskReport> {
        await this.connection.rawConnection
            .getRepository(ScheduledTaskRecord)
            .createQueryBuilder('task')
            .update()
            .set({ enabled: input.enabled })
            .where('taskId = :id', { id: input.id })
            .execute();
        return assertFound(this.getTask(input.id));
    }

    private entityToReport(task: ScheduledTaskRecord): TaskReport {
        return {
            id: task.taskId,
            lastExecutedAt: task.lastExecutedAt,
            isRunning: task.lockedAt !== null,
            lastResult: task.lastResult,
            enabled: task.enabled,
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
