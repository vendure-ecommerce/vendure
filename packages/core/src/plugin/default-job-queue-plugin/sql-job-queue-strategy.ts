import { JobListOptions, JobState } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { Brackets, Connection, EntityManager, FindConditions, In, LessThan } from 'typeorm';

import { Injector } from '../../common/injector';
import { InspectableJobQueueStrategy, JobQueueStrategy } from '../../config';
import { Job, JobData } from '../../job-queue';
import { PollingJobQueueStrategy } from '../../job-queue/polling-job-queue-strategy';
import { TransactionalConnection } from '../../service';
import { ListQueryBuilder } from '../../service/helpers/list-query-builder/list-query-builder';

import { JobRecord } from './job-record.entity';

/**
 * @description
 * A {@link JobQueueStrategy} which uses the configured SQL database to persist jobs in the queue.
 * This strategy is used by the {@link DefaultJobQueuePlugin}.
 *
 * @docsCategory JobQueue
 */
export class SqlJobQueueStrategy extends PollingJobQueueStrategy implements InspectableJobQueueStrategy {
    private connection: Connection | undefined;
    private listQueryBuilder: ListQueryBuilder;

    init(injector: Injector) {
        this.connection = injector.get(TransactionalConnection).rawConnection;
        this.listQueryBuilder = injector.get(ListQueryBuilder);
        super.init(injector);
    }

    destroy() {
        this.connection = undefined;
        super.destroy();
    }

    async add<Data extends JobData<Data> = {}>(job: Job<Data>): Promise<Job<Data>> {
        if (!this.connectionAvailable(this.connection)) {
            throw new Error('Connection not available');
        }
        const newRecord = this.toRecord(job);
        const record = await this.connection.getRepository(JobRecord).save(newRecord);
        return this.fromRecord(record);
    }

    async next(queueName: string): Promise<Job | undefined> {
        if (!this.connectionAvailable(this.connection)) {
            throw new Error('Connection not available');
        }
        const connection = this.connection;
        const connectionType = this.connection.options.type;
        const isSQLite =
            connectionType === 'sqlite' || connectionType === 'sqljs' || connectionType === 'better-sqlite3';

        return new Promise(async (resolve, reject) => {
            if (isSQLite) {
                // SQLite driver does not support concurrent transactions. See https://github.com/typeorm/typeorm/issues/1884
                const result = await this.getNextAndSetAsRunning(connection.manager, queueName);
                resolve(result);
            } else {
                // Selecting the next job is wrapped in a transaction so that we can
                // set a lock on that row and immediately update the status to "RUNNING".
                // This prevents multiple worker processes from taking the same job when
                // running concurrent workers.
                connection.transaction(async transactionManager => {
                    const result = await this.getNextAndSetAsRunning(transactionManager, queueName);
                    resolve(result);
                });
            }
        });
    }

    private async getNextAndSetAsRunning(
        manager: EntityManager,
        queueName: string,
    ): Promise<Job | undefined> {
        const record = await manager
            .getRepository(JobRecord)
            .createQueryBuilder('record')
            .where('record.queueName = :queueName', { queueName })
            .andWhere(
                new Brackets(qb => {
                    qb.where('record.state = :pending', {
                        pending: JobState.PENDING,
                    }).orWhere('record.state = :retrying', { retrying: JobState.RETRYING });
                }),
            )
            .orderBy('record.createdAt', 'ASC')
            .setLock('pessimistic_write')
            .getOne();
        if (record) {
            const job = this.fromRecord(record);
            job.start();
            record.state = JobState.RUNNING;
            await manager.getRepository(JobRecord).save(record);
            return job;
        } else {
            return;
        }
    }

    async update(job: Job<any>): Promise<void> {
        if (!this.connectionAvailable(this.connection)) {
            throw new Error('Connection not available');
        }
        await this.connection.getRepository(JobRecord).save(this.toRecord(job));
    }

    async findMany(options?: JobListOptions): Promise<PaginatedList<Job>> {
        if (!this.connectionAvailable(this.connection)) {
            throw new Error('Connection not available');
        }
        return this.listQueryBuilder
            .build(JobRecord, options)
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items: items.map(this.fromRecord),
                totalItems,
            }));
    }

    async findOne(id: ID): Promise<Job | undefined> {
        if (!this.connectionAvailable(this.connection)) {
            throw new Error('Connection not available');
        }
        const record = await this.connection.getRepository(JobRecord).findOne(id);
        if (record) {
            return this.fromRecord(record);
        }
    }

    async findManyById(ids: ID[]): Promise<Job[]> {
        if (!this.connectionAvailable(this.connection)) {
            throw new Error('Connection not available');
        }
        return this.connection
            .getRepository(JobRecord)
            .findByIds(ids)
            .then(records => records.map(this.fromRecord));
    }

    async removeSettledJobs(queueNames: string[] = [], olderThan?: Date) {
        if (!this.connectionAvailable(this.connection)) {
            throw new Error('Connection not available');
        }
        const findOptions: FindConditions<JobRecord> = {
            ...(0 < queueNames.length ? { queueName: In(queueNames) } : {}),
            isSettled: true,
            settledAt: LessThan(olderThan || new Date()),
        };
        const toDelete = await this.connection.getRepository(JobRecord).find({ where: findOptions });
        const deleteCount = await this.connection.getRepository(JobRecord).count({ where: findOptions });
        await this.connection.getRepository(JobRecord).delete(findOptions);
        return deleteCount;
    }

    private connectionAvailable(connection: Connection | undefined): connection is Connection {
        return !!this.connection && this.connection.isConnected;
    }

    private toRecord(job: Job<any>): JobRecord {
        return new JobRecord({
            id: job.id || undefined,
            queueName: job.queueName,
            data: job.data,
            state: job.state,
            progress: job.progress,
            result: job.result,
            error: job.error,
            startedAt: job.startedAt,
            settledAt: job.settledAt,
            isSettled: job.isSettled,
            retries: job.retries,
            attempts: job.attempts,
        });
    }

    private fromRecord(jobRecord: JobRecord): Job<any> {
        return new Job<any>(jobRecord);
    }
}
