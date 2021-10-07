import { Injector, Job, JobBufferStorageStrategy } from '@vendure/core';
import Redis, { Cluster, RedisOptions } from 'ioredis';

import { BULLMQ_PLUGIN_OPTIONS } from './constants';
import { BullMQPluginOptions } from './types';

export class RedisJobBufferStorageStrategy implements JobBufferStorageStrategy {
    private redis: Redis.Redis | Redis.Cluster;

    init(injector: Injector) {
        const options = injector.get<BullMQPluginOptions>(BULLMQ_PLUGIN_OPTIONS);
        if (options.connection instanceof Redis) {
            this.redis = options.connection;
        } else if (options.connection instanceof Cluster) {
            this.redis = options.connection;
        } else {
            this.redis = new Redis(options.connection as RedisOptions);
        }
    }

    async add(processorId: string, job: Job<any>): Promise<Job<any>> {
        return job;
    }

    async bufferSize(bufferIds?: string[]): Promise<{ [bufferId: string]: number }> {
        throw new Error('Method not implemented.');
    }

    async flush(bufferIds?: string[]): Promise<{ [bufferId: string]: Array<Job<any>> }> {
        throw new Error('Method not implemented.');
    }
}
