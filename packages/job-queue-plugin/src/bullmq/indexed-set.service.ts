import { Inject, Injectable } from '@nestjs/common';
import { Logger } from '@vendure/core';
import { Job, Queue } from 'bullmq';
import Redis, { Cluster } from 'ioredis';

import { BULLMQ_PLUGIN_OPTIONS, loggerCtx } from './constants';
import { BullMQPluginOptions } from './types';

/**
 * @description
 * In order to efficiently query jobs in the job queue, we use a sorted set in Redis to track jobs
 * added to each queue. This allows to quickly fetch a list of jobs in a given queue without needing
 * to iterate over all jobs in the queue and read the job data.
 *
 * By using this approach we can achieve a several order of magnitude improvement in performance
 * over the former approach of iterating over all jobs via the custom LUA script.
 *
 * This also means that we need to periodically clean up the indexed set to remove jobs that have
 * been removed from the queue.
 */
@Injectable()
export class IndexedSetService {
    private redisConnection: Redis | Cluster;
    private queue: Queue;

    constructor(@Inject(BULLMQ_PLUGIN_OPTIONS) private readonly options: BullMQPluginOptions) {}

    register(redisConnection: Redis | Cluster, queue: Queue) {
        this.redisConnection = redisConnection;
        this.queue = queue;
    }

    add(job: Job) {
        if (!this.redisConnection || !this.queue) {
            throw new Error('Redis connection or queue not registered. The IndexedSetService must be registered with the BullMQJobQueueStrategy.');
        }
        if (!job.id) {
            return;
        }
        // Add to our indexed structure
        const prefix = this.options.workerOptions?.prefix ?? 'bull';
        const queuePrefix = `${prefix}:${this.queue.name}:`;
        const timestamp = Date.now();
        const indexedKey = `${queuePrefix}queue:${job.name}`;
        Logger.verbose(`Adding job ${job.id} to indexed key: ${indexedKey}`, loggerCtx);
        return this.redisConnection.zadd(indexedKey, timestamp, job.id);
    }

    async cleanupIndexedSets() {
        if (!this.redisConnection || !this.queue) {
            throw new Error('Redis connection or queue not registered. The IndexedSetService must be registered with the BullMQJobQueueStrategy.');
        }
        const prefix = this.options.workerOptions?.prefix ?? 'bull';
        const queuePrefix = `${prefix}:${this.queue.name}:`;

        // Get all queue names from our indexed sets
        const keys = await this.redisConnection.keys(`${queuePrefix}queue:*`);
        const result: Array<{ queueName: string; jobsRemoved: number }> = [];
        const startTime = Date.now();
        Logger.verbose(`Cleaning up ${keys.length} indexed sets`, loggerCtx);
        for (const key of keys) {
            const queueName = key.replace(`${queuePrefix}queue:`, '');
            // Get all job IDs from our indexed set
            const jobIds = await (this.redisConnection as any).zrange(key, 0, -1);
            // Check each job's existence in BullMQ
            const jobsToRemove: string[] = [];
            for (const jobId of jobIds) {
                const job = await this.queue.getJob(jobId);
                if (!job) {
                    jobsToRemove.push(jobId);
                }
            }
            // Remove non-existent jobs from our indexed set in batches
            if (jobsToRemove.length > 0) {
                Logger.verbose(
                    `Cleaning up ${jobsToRemove.length} non-existent jobs from indexed key: ${key}`,
                    loggerCtx,
                );
                // Process in batches of 100 to avoid call stack limits
                const BATCH_SIZE = 100;
                for (let i = 0; i < jobsToRemove.length; i += BATCH_SIZE) {
                    const batch = jobsToRemove.slice(i, i + BATCH_SIZE);
                    await (this.redisConnection as any).zrem(key, ...batch);
                }
            }
            result.push({ queueName: key, jobsRemoved: jobsToRemove.length });
        }
        const endTime = Date.now();
        Logger.verbose(`Cleaned up ${keys.length} indexed sets in ${endTime - startTime}ms`, loggerCtx);
        return result;
    }
}
