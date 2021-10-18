import { Injector, Job, JobBufferStorageStrategy, JobConfig, Logger } from '@vendure/core';
import Redis, { Cluster, RedisOptions } from 'ioredis';

import { BULLMQ_PLUGIN_OPTIONS, loggerCtx } from './constants';
import { BullMQPluginOptions } from './types';

const BUFFER_LIST_PREFIX = 'vendure-job-buffer';

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

    async add(bufferId: string, job: Job<any>): Promise<Job<any>> {
        const result = await this.redis.lpush(this.keyName(bufferId), this.toJobConfigString(job));
        return job;
    }

    async bufferSize(bufferIds?: string[]): Promise<{ [bufferId: string]: number }> {
        const ids = bufferIds?.length ? bufferIds : await this.getAllBufferIds();
        const result: { [bufferId: string]: number } = {};
        for (const id of bufferIds || []) {
            const key = this.keyName(id);
            const count = await this.redis.llen(key);
            result[id] = count;
        }
        return result;
    }

    async flush(bufferIds?: string[]): Promise<{ [bufferId: string]: Job[] }> {
        const ids = bufferIds?.length ? bufferIds : await this.getAllBufferIds();
        const result: { [bufferId: string]: Job[] } = {};
        for (const id of bufferIds || []) {
            const key = this.keyName(id);
            const items = await this.redis.lrange(key, 0, -1);
            await this.redis.del(key);
            result[id] = items.map(item => this.toJob(item));
        }
        return result;
    }

    private keyName(bufferId: string) {
        return `${BUFFER_LIST_PREFIX}:${bufferId}`;
    }

    private toJobConfigString(job: Job<any>): string {
        const jobConfig: JobConfig<any> = {
            ...job,
            data: job.data,
            id: job.id ?? undefined,
        };
        return JSON.stringify(jobConfig);
    }

    private toJob(jobConfigString: string): Job {
        try {
            const jobConfig: JobConfig<any> = JSON.parse(jobConfigString);
            return new Job(jobConfig);
        } catch (e) {
            Logger.error(`Could not parse buffered job:\n${e.message}`, loggerCtx, e.stack);
            throw e;
        }
    }

    private async getAllBufferIds(): Promise<string[]> {
        const stream = this.redis.scanStream({
            match: `${BUFFER_LIST_PREFIX}:*`,
        });
        const keys = await new Promise<string[]>((resolve, reject) => {
            const allKeys: string[] = [];
            stream.on('data', _keys => allKeys.push(..._keys));
            stream.on('end', () => resolve(allKeys));
            stream.on('error', err => reject(err));
        });

        return keys.map(key => key.replace(`${BUFFER_LIST_PREFIX}:`, ''));
    }
}
