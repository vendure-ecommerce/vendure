import { Connection } from 'typeorm';

import { JobQueueStrategy } from '../config/job-queue/job-queue-strategy';

import { Job } from './job';

export class SqlJobQueueStrategy implements JobQueueStrategy {
    private connection: Connection;

    init(connection: Connection) {
        this.connection = connection;
    }
    add(job: Job): Promise<Job> {
        throw new Error('Method not implemented.');
    }
    next(queueName: string): Promise<Job> {
        return {} as any;
    }
    update(job: Job<{}>): Promise<void> {
        return {} as any;
    }
    findMany(): Promise<Job[]> {
        return {} as any;
    }

    findOne(id: string): Promise<Job> {
        return {} as any;
    }
}
