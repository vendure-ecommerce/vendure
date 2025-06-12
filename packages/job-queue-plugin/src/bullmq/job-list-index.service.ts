import { Inject, Injectable } from '@nestjs/common';
import { Logger, ProcessContext } from '@vendure/core';
import { Job, Queue } from 'bullmq';
import Redis, { Cluster } from 'ioredis';

import { BULLMQ_PLUGIN_OPTIONS, loggerCtx } from './constants';
import { BullMQPluginOptions } from './types';
import { getPrefix } from './utils';

/**
 * @description
 * In order to efficiently query jobs in the job queue, we use a "sorted set" in Redis to track jobs
 * added to each queue. This allows to quickly fetch a list of jobs in a given queue without needing
 * to iterate over all jobs in the queue and read the job data.
 *
 * By using this approach we can achieve a several order of magnitude improvement in performance
 * over the former approach of iterating over all jobs via the custom LUA script.
 *
 * This also means that we need to periodically clean up the sorted sets to remove jobs that have
 * been removed from the queue (via the automatic removal features of BullMQ).
 */
@Injectable()
export class JobListIndexService {
    private readonly BATCH_SIZE = 100;
    private redis: Redis | Cluster;
    private queue: Queue | undefined;

    constructor(
        @Inject(BULLMQ_PLUGIN_OPTIONS) private readonly options: BullMQPluginOptions,
        private readonly processContext: ProcessContext,
    ) {}

    /**
     * @description
     * Should be called by the BullMQJobQueueStrategy as soon as the Redis connection and Queue
     * object are available in the init() function.
     */
    register(redisConnection: Redis | Cluster, queue: Queue) {
        this.redis = redisConnection;
        this.queue = queue;
        void this.migrateExistingJobs();
    }

    /**
     * @description
     * Adds a job to the corresponding sorted set, so that we can efficiently query the list of jobs
     * in the queue.
     */
    add(job: Job) {
        if (!this.redis || !this.queue) {
            throw new Error(
                'Redis connection or queue not registered. The IndexedSetService must be registered with the BullMQJobQueueStrategy.',
            );
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
        return this.redis.zadd(indexedKey, timestamp, job.id);
    }

    /**
     * @description
     * This method is used to migrate existing jobs to use the indexed set method of tracking jobs.
     * When the app bootstraps, we check to see if the existing jobs in the queue have a corresponding
     * indexed set. If not, we create the indexed set and add the jobs to it.
     */
    async migrateExistingJobs(): Promise<void> {
        if (this.processContext.isServer) {
            // We only want to perform this work on the worker.
            return;
        }
        if (!this.redis || !this.queue) {
            throw new Error('Redis and Queue must be registered before migrating jobs');
        }
        const prefix = getPrefix(this.options);
        const queuePrefix = `${prefix}:${this.queue.name}:`;

        // Get counts of jobs in each state
        const counts = await this.queue.getJobCounts();
        Logger.verbose(`Found job counts: ${JSON.stringify(counts)}`, loggerCtx);

        // Get all jobs from each state
        const states = ['wait', 'active', 'completed', 'failed', 'delayed', 'paused'] as const;
        const jobsByQueue = new Map<string, Job[]>();

        for (const state of states) {
            if (counts[state] > 0) {
                Logger.verbose(`Processing ${counts[state]} jobs in ${state} state`, loggerCtx);
                const jobs = await this.queue.getJobs([state], 0, counts[state]);
                for (const job of jobs) {
                    if (!jobsByQueue.has(job.name)) {
                        jobsByQueue.set(job.name, []);
                    }
                    jobsByQueue.get(job.name)?.push(job);
                }
            }
        }

        // Create sorted sets for each queue
        let totalMigrated = 0;
        for (const [queueName, jobs] of jobsByQueue) {
            const indexedKey = `${queuePrefix}queue:${queueName}`;
            const exists = await this.redis.exists(indexedKey);
            if (exists === 0) {
                Logger.info(`Creating indexed set for queue: ${queueName}`, loggerCtx);
                const timestamp = Date.now();
                const pipeline = this.redis.pipeline();
                // Add jobs in batches
                for (let i = 0; i < jobs.length; i += this.BATCH_SIZE) {
                    const batch = jobs.slice(i, i + this.BATCH_SIZE);
                    const args = batch
                        .flatMap(job => [timestamp, job.id])
                        .filter((id): id is string | number => id != null);
                    pipeline.zadd(indexedKey, ...args);
                }
                await pipeline.exec();
                totalMigrated += jobs.length;
            }
        }

        if (totalMigrated > 0) {
            Logger.info(`Successfully migrated ${totalMigrated} jobs to indexed sets`, loggerCtx);
        }
    }

    /**
     * @description
     * This method is used to clean up the indexed sets to remove jobs that have been removed from the queue.
     * This is done by checking each job in the indexed set to see if it still exists in the queue. If it does not,
     * it is removed from the indexed set.
     */
    async cleanupIndexedSets() {
        if (!this.redis || !this.queue) {
            throw new Error('Redis and Queue must be registered before cleaning up indexed sets');
        }

        const prefix = getPrefix(this.options);
        const queuePrefix = `${prefix}:${this.queue.name}:`;

        // Get all queue names from our indexed sets
        const keys = await this.redis.keys(`${queuePrefix}queue:*`);
        const result: Array<{ queueName: string; jobsRemoved: number }> = [];
        const startTime = Date.now();
        Logger.verbose(`Cleaning up ${keys.length} indexed sets`, loggerCtx);
        for (const key of keys) {
            const queueName = key.replace(`${queuePrefix}queue:`, '');
            // Get all job IDs from our indexed set
            const jobIds = await this.redis.zrange(key, 0, -1);
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
                // Process in batches to avoid call stack limits
                for (let i = 0; i < jobsToRemove.length; i += this.BATCH_SIZE) {
                    const batch = jobsToRemove.slice(i, i + this.BATCH_SIZE);
                    await this.redis.zrem(key, ...batch);
                }
            }
            result.push({ queueName: key, jobsRemoved: jobsToRemove.length });
        }
        const endTime = Date.now();
        Logger.verbose(`Cleaned up ${keys.length} indexed sets in ${endTime - startTime}ms`, loggerCtx);
        return result;
    }
}
