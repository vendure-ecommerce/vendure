import { Inject, Injectable } from '@nestjs/common';
import { Logger, ProcessContext } from '@vendure/core';
import { Job, Queue, QueueEvents } from 'bullmq';
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
    private queueEvents: QueueEvents | undefined;

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
        this.queueEvents = new QueueEvents(queue.name, { connection: redisConnection });
        this.setupEventListeners();
        void this.migrateExistingJobs();
    }

    private setupEventListeners() {
        if (!this.queueEvents || !this.queue) return;

        // When a job is added to the queue
        this.queueEvents.on('waiting', ({ jobId }) => {
            void this.updateJobIndex(jobId, 'wait');
        });

        // When a job starts processing
        this.queueEvents.on('active', ({ jobId }) => {
            void this.updateJobIndex(jobId, 'active');
        });

        // When a job completes successfully
        this.queueEvents.on('completed', ({ jobId }) => {
            void this.updateJobIndex(jobId, 'completed');
        });

        // When a job fails
        this.queueEvents.on('failed', ({ jobId }) => {
            void this.updateJobIndex(jobId, 'failed');
        });

        // When a job is delayed
        this.queueEvents.on('delayed', ({ jobId }) => {
            void this.updateJobIndex(jobId, 'delayed');
        });

        // When a job is removed
        this.queueEvents.on('removed', ({ jobId }) => {
            void this.removeJobFromAllIndices(jobId);
        });
    }

    /**
     * When a job's state changes, we need to update the indexed set
     * to reflect the new state of the job.
     */
    private async updateJobIndex(jobId: string, state: string) {
        if (!this.redis || !this.queue) return;

        try {
            const job: Job | undefined = await this.queue.getJob(jobId);
            if (!job) return;

            const prefix = getPrefix(this.options);
            const queuePrefix = `${prefix}:${this.queue.name}:`;
            const timestamp = job.timestamp;

            // Remove from all state indices first
            await this.removeJobFromAllIndices(jobId);

            // Add to the specific state index
            const indexedKey = `${queuePrefix}queue:${job.name}:${state}` as const;
            Logger.debug(`Adding job ${jobId} to indexed key: ${indexedKey}`, loggerCtx);
            await this.redis.zadd(indexedKey, timestamp, jobId);
        } catch (err: unknown) {
            const error = err as Error;
            Logger.error(`Failed to update job index: ${error.message}`, loggerCtx);
        }
    }

    private async removeJobFromAllIndices(jobId: string) {
        if (!this.redis || !this.queue) return;

        try {
            const prefix = this.options.workerOptions?.prefix ?? 'bull';
            const queuePrefix = `${prefix}:${this.queue.name}:`;
            const job: Job | undefined = await this.queue.getJob(jobId);
            if (!job) return;

            const states = ['wait', 'active', 'completed', 'failed', 'delayed'] as const;
            const pipeline = this.redis.pipeline();

            for (const state of states) {
                const indexedKey = `${queuePrefix}queue:${job.name}:${state}` as const;
                pipeline.zrem(indexedKey, jobId);
            }

            await pipeline.exec();
        } catch (err: unknown) {
            const error = err as Error;
            Logger.error(`Failed to remove job from indices: ${error.message}`, loggerCtx);
        }
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

        Logger.info('Starting migration of existing jobs to indexed sets...', loggerCtx);
        const prefix = getPrefix(this.options);
        const queuePrefix = `${prefix}:${this.queue.name}:`;

        // Get counts of jobs in each state
        const counts = await this.queue.getJobCounts();
        Logger.verbose(`Found job counts: ${JSON.stringify(counts)}`, loggerCtx);

        // Get all jobs from each state
        const states = ['wait', 'active', 'completed', 'failed', 'delayed', 'paused'] as const;
        let totalMigrated = 0;

        for (const state of states) {
            if (counts[state] > 0) {
                Logger.debug(`Processing ${counts[state]} jobs in ${state} state`, loggerCtx);
                if (!this.queue) {
                    Logger.error('Queue is not initialized', loggerCtx);
                    continue;
                }
                try {
                    const jobs = await this.queue.getJobs([state], 0, counts[state]);
                    if (!jobs) {
                        Logger.error(`getJobs returned undefined for state ${state}`, loggerCtx);
                        continue;
                    }
                    Logger.debug(`Retrieved ${jobs.length} jobs for state ${state}`, loggerCtx);

                    // Group jobs by queue name
                    const jobsByQueue = new Map<string, Job[]>();
                    for (const job of jobs) {
                        if (!job) {
                            Logger.error('Null job found in results', loggerCtx);
                            continue;
                        }
                        if (!jobsByQueue.has(job.name)) {
                            jobsByQueue.set(job.name, []);
                        }
                        jobsByQueue.get(job.name)?.push(job);
                    }

                    // Create sorted sets for each queue in this state
                    for (const [queueName, queueJobs] of jobsByQueue) {
                        const indexedKey = `${queuePrefix}queue:${queueName}:${state}`;
                        const exists = await this.redis.exists(indexedKey);
                        if (exists === 0) {
                            Logger.info(
                                `Creating indexed set for queue: ${queueName} in state: ${state}`,
                                loggerCtx,
                            );
                            const pipeline = this.redis.pipeline();
                            // Add jobs in batches
                            for (let i = 0; i < queueJobs.length; i += this.BATCH_SIZE) {
                                const batch = queueJobs.slice(i, i + this.BATCH_SIZE);
                                const args = batch
                                    .flatMap(job => [job.timestamp, job.id])
                                    .filter((id): id is string | number => id != null);
                                pipeline.zadd(indexedKey, ...args);
                            }
                            await pipeline.exec();
                            totalMigrated += queueJobs.length;
                        }
                    }
                } catch (err: unknown) {
                    const error = err as Error;
                    Logger.error(`Failed to migrate jobs: ${error.message}`, loggerCtx);
                }
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
            let cursor = '0';
            let jobsRemoved = 0;

            // Use ZSCAN to iterate over the set in batches
            do {
                const [nextCursor, elements] = await this.redis.zscan(key, cursor, 'COUNT', this.BATCH_SIZE);
                cursor = nextCursor;

                if (elements.length > 0) {
                    // Extract job IDs from the elements (they come as [score, id] pairs)
                    const jobIds = elements.filter((_, i) => i % 2 === 0);

                    // Check existence of jobs directly in Redis
                    const pipeline = this.redis.pipeline();
                    for (const jobId of jobIds) {
                        pipeline.exists(`${queuePrefix}${jobId}`);
                    }
                    const existsResults = await pipeline.exec();

                    // Filter out non-existent jobs
                    const jobsToRemove = jobIds.filter((jobId, i) => {
                        const exists = existsResults?.[i]?.[1] === 1;
                        return !exists;
                    });

                    if (jobsToRemove.length > 0) {
                        await this.redis.zrem(key, ...jobsToRemove);
                        jobsRemoved += jobsToRemove.length;
                    }
                }
            } while (cursor !== '0');

            if (jobsRemoved > 0) {
                Logger.verbose(
                    `Cleaned up ${jobsRemoved} non-existent jobs from indexed key: ${key}`,
                    loggerCtx,
                );
            }
            result.push({ queueName: key, jobsRemoved });
        }

        const endTime = Date.now();
        Logger.verbose(`Cleaned up ${keys.length} indexed sets in ${endTime - startTime}ms`, loggerCtx);
        return result;
    }
}
