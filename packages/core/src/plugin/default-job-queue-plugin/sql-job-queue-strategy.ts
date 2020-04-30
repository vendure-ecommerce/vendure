import { JobListOptions, JobState } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { Brackets, Connection, FindConditions, In, LessThan } from 'typeorm';

import { Injector } from '../../common/injector';
import { JobQueueStrategy } from '../../config/job-queue/job-queue-strategy';
import { Job } from '../../job-queue/job';
import { ProcessContext } from '../../process-context/process-context';
import { ListQueryBuilder } from '../../service/helpers/list-query-builder/list-query-builder';

import { JobRecord } from './job-record.entity';

/**
 * @description
 * A {@link JobQueueStrategy} which uses the configured SQL database to persist jobs in the queue.
 * This strategy is used by the {@link DefaultJobQueuePlugin}.
 *
 * @docsCategory JobQueue
 */
export class SqlJobQueueStrategy implements JobQueueStrategy {
    private connection: Connection | undefined;
    private listQueryBuilder: ListQueryBuilder;

    init(injector: Injector) {
        const processContext = injector.get(ProcessContext);
        if (processContext.isServer) {
            this.connection = injector.getConnection();
            this.listQueryBuilder = injector.get(ListQueryBuilder);
        }
    }

    async add(job: Job): Promise<Job> {
        if (!this.connectionAvailable(this.connection)) {
            return job;
        }
        const newRecord = this.toRecord(job);
        const record = await this.connection.getRepository(JobRecord).save(newRecord);
        return this.fromRecord(record);
    }

    async next(queueName: string): Promise<Job | undefined> {
        if (!this.connectionAvailable(this.connection)) {
            return;
        }
        const record = await this.connection
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
            .getOne();
        if (record) {
            const job = this.fromRecord(record);
            job.start();
            return job;
        }
    }

    async update(job: Job<any>): Promise<void> {
        if (!this.connectionAvailable(this.connection)) {
            return;
        }
        await this.connection.getRepository(JobRecord).save(this.toRecord(job));
    }

    async findMany(options?: JobListOptions): Promise<PaginatedList<Job>> {
        if (!this.connectionAvailable(this.connection)) {
            return {
                items: [],
                totalItems: 0,
            };
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
            return;
        }
        const record = await this.connection.getRepository(JobRecord).findOne(id);
        if (record) {
            return this.fromRecord(record);
        }
    }

    async findManyById(ids: ID[]): Promise<Job[]> {
        if (!this.connectionAvailable(this.connection)) {
            return [];
        }
        return this.connection
            .getRepository(JobRecord)
            .findByIds(ids)
            .then(records => records.map(this.fromRecord));
    }

    async removeSettledJobs(queueNames: string[] = [], olderThan?: Date) {
        if (!this.connectionAvailable(this.connection)) {
            return 0;
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
            id: job.id,
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
