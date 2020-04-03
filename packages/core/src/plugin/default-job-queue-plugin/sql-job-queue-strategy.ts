import { ModuleRef } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/typeorm';
import { JobListOptions, JobState } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { Brackets, Connection } from 'typeorm';

import { JobQueueStrategy } from '../../config/job-queue/job-queue-strategy';
import { Job } from '../../job-queue/job';
import { ProcessContext } from '../../process-context/process-context';
import { ListQueryBuilder } from '../../service/helpers/list-query-builder/list-query-builder';

import { JobRecord } from './job-record.entity';

export class SqlJobQueueStrategy implements JobQueueStrategy {
    private connection: Connection | undefined;
    private listQueryBuilder: ListQueryBuilder;

    init(moduleRef: ModuleRef) {
        const processContext = moduleRef.get(ProcessContext, { strict: false });
        if (processContext.isServer) {
            this.connection = moduleRef.get(getConnectionToken() as any, { strict: false });
            this.listQueryBuilder = moduleRef.get(ListQueryBuilder, { strict: false });
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
                new Brackets((qb) => {
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
            .then((records) => records.map(this.fromRecord));
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
