import { UpdateScheduledTaskInput } from '@vendure/common/lib/generated-types';
import { Cron } from 'croner';
import ms from 'ms';

import { Injector } from '../../common';
import { assertFound } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { Logger } from '../../config/logger/vendure-logger';
import { TransactionalConnection } from '../../connection';
import { ProcessContext } from '../../process-context';
import { ScheduledTask } from '../../scheduler/scheduled-task';
import { SchedulerStrategy, TaskReport } from '../../scheduler/scheduler-strategy';

import { DEFAULT_SCHEDULER_PLUGIN_OPTIONS } from './constants';
import { ScheduledTaskRecord } from './scheduled-task-record.entity';
import { StaleTaskService } from './stale-task.service';
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
    private intervalRef: NodeJS.Timeout | undefined;
    private readonly tasks: Map<string, { task: ScheduledTask; isRegistered: boolean }> = new Map();
    private pluginOptions: DefaultSchedulerPluginOptions;
    private runningTasks: ScheduledTask[] = [];
    private staleTaskService: StaleTaskService;

    init(injector: Injector) {
        this.connection = injector.get(TransactionalConnection);
        this.pluginOptions = injector.get(DEFAULT_SCHEDULER_PLUGIN_OPTIONS);
        this.injector = injector;
        this.staleTaskService = injector.get(StaleTaskService);

        const runTriggerCheck =
            injector.get(ConfigService).schedulerOptions.runTasksInWorkerOnly === false ||
            injector.get(ProcessContext).isWorker;

        if (runTriggerCheck) {
            this.intervalRef = setInterval(
                () => this.checkForManuallyTriggeredTasks(),
                this.pluginOptions.manualTriggerCheckInterval as number,
            );
        }
    }

    async destroy() {
        if (this.intervalRef) {
            clearInterval(this.intervalRef);
        }
        for (const task of this.runningTasks) {
            await this.connection.rawConnection
                .getRepository(ScheduledTaskRecord)
                .update({ taskId: task.id }, { lockedAt: null });
            Logger.info(`Released lock for task "${task.id}"`);
        }
    }

    registerTask(task: ScheduledTask): void {
        this.tasks.set(task.id, {
            task,
            isRegistered: false,
        });
    }

    executeTask(task: ScheduledTask) {
        return async (job?: Cron) => {
            await this.ensureTaskIsRegistered(task);
            await this.staleTaskService.cleanStaleLocksForTask(task);

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

    async getTasks(): Promise<TaskReport[]> {
        await this.ensureAllTasksAreRegistered();
        return this.connection.rawConnection
            .getRepository(ScheduledTaskRecord)
            .createQueryBuilder('task')
            .getMany()
            .then(tasks => {
                return tasks.map(task => this.entityToReport(task));
            });
    }

    async getTask(id: string): Promise<TaskReport | undefined> {
        await this.ensureTaskIsRegistered(id);
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

    async triggerTask(task: ScheduledTask): Promise<void> {
        Logger.info(`Triggering task: ${task.id}`);
        await this.ensureTaskIsRegistered(task);
        await this.connection.rawConnection
            .getRepository(ScheduledTaskRecord)
            .createQueryBuilder('task')
            .update()
            .set({ manuallyTriggeredAt: new Date() })
            .where('taskId = :id', { id: task.id })
            .execute();
    }

    private async checkForManuallyTriggeredTasks() {
        // Since this is run on an interval, there is an edge case where, during shutdown,
        // the connection may not be initialized anymore.
        if (!this.connection.rawConnection.isInitialized) {
            return;
        }
        let taskEntities: ScheduledTaskRecord[] = [];
        try {
            taskEntities = await this.connection.rawConnection
                .getRepository(ScheduledTaskRecord)
                .createQueryBuilder('task')
                .where('task.manuallyTriggeredAt IS NOT NULL')
                .getMany();
        } catch (e) {
            // This branch can be reached if the connection is closed and then this method
            // is called on the interval. Usually encountered in tests.
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            Logger.error(`Error checking for manually triggered tasks: ${errorMessage}`);
        }

        Logger.debug(`Checking for manually triggered tasks: ${taskEntities.length}`);

        for (const taskEntity of taskEntities) {
            await this.connection.rawConnection
                .getRepository(ScheduledTaskRecord)
                .update({ taskId: taskEntity.taskId }, { manuallyTriggeredAt: null });

            const task = this.tasks.get(taskEntity.taskId);
            if (task) {
                Logger.info(`Executing manually triggered task: ${task.task.id}`);
                void this.executeTask(task.task)();
            }
        }
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

    private async ensureAllTasksAreRegistered() {
        for (const task of this.tasks.values()) {
            await this.ensureTaskIsRegistered(task.task);
        }
    }

    private async ensureTaskIsRegistered(taskOrId: ScheduledTask | string) {
        const taskId = typeof taskOrId === 'string' ? taskOrId : taskOrId.id;
        const task = this.tasks.get(taskId);
        if (task && !task.isRegistered) {
            await this.connection.rawConnection
                .getRepository(ScheduledTaskRecord)
                .createQueryBuilder()
                .insert()
                .into(ScheduledTaskRecord)
                .values({ taskId })
                // Fix for versions lower than MariaDB v10.5 and MySQL: updateEntity(false) prevents TypeORM from
                // using the RETURNING clause after an INSERT. Keep in mind that this query won't return the id of the inserted record.
                .updateEntity(false)
                .orIgnore()
                .execute();

            this.tasks.set(taskId, { task: task.task, isRegistered: true });
        }
    }
}
