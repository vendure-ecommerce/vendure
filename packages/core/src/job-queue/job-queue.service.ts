import { Injectable, OnApplicationBootstrap, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { JobListOptions, JobQueue as GraphQlJobQueue } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { ConfigService } from '../config/config.service';
import { JobQueueStrategy } from '../config/job-queue/job-queue-strategy';
import { Logger } from '../config/logger/vendure-logger';
import { ProcessContext } from '../process-context/process-context';

import { Job } from './job';
import { JobQueue } from './job-queue';
import { CreateQueueOptions, JobData } from './types';

/**
 * @description
 * The JobQueueService is used to create new {@link JobQueue} instances and access
 * existing jobs.
 *
 * @example
 * ```TypeScript
 * // A service which transcodes video files
 * class VideoTranscoderService {
 *
 *   private jobQueue: JobQueue<{ videoId: string; }>;
 *
 *   onModuleInit() {
 *     // The JobQueue is created on initialization
 *     this.jobQueue = this.jobQueueService.createQueue({
 *       name: 'transcode-video',
 *       concurrency: 5,
 *       process: async job => {
 *         try {
 *           const result = await this.transcodeVideo(job.data.videoId);
 *           job.complete(result);
 *         } catch (e) {
 *           job.fail(e);
 *         }
 *       },
 *     });
 *   }
 *
 *   addToTranscodeQueue(videoId: string) {
 *     this.jobQueue.add({ videoId, })
 *   }
 *
 *   private transcodeVideo(videoId: string) {
 *     // e.g. call some external transcoding service
 *   }
 *
 * }
 * ```
 *
 * @docsCategory JobQueue
 */
@Injectable()
export class JobQueueService implements OnApplicationBootstrap, OnModuleDestroy {
    private cleanJobsTimer: NodeJS.Timeout;
    private queues: Array<JobQueue<any>> = [];
    private hasInitialized = false;

    private get jobQueueStrategy(): JobQueueStrategy {
        return this.configService.jobQueueOptions.jobQueueStrategy;
    }

    constructor(private configService: ConfigService, private processContext: ProcessContext) {}

    /** @internal */
    async onApplicationBootstrap() {
        if (this.processContext.isServer) {
            const { pollInterval } = this.configService.jobQueueOptions;
            if (pollInterval < 100) {
                Logger.warn(
                    `jobQueueOptions.pollInterval is set to ${pollInterval}ms. It is not receommended to set this lower than 100ms`,
                );
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.hasInitialized = true;
            for (const queue of this.queues) {
                if (!queue.started) {
                    queue.start();
                }
            }
        }
    }

    /** @internal */
    onModuleDestroy() {
        return Promise.all(this.queues.map(q => q.destroy()));
    }

    /**
     * @description
     * Configures and creates a new {@link JobQueue} instance.
     */
    createQueue<Data extends JobData<Data>>(options: CreateQueueOptions<Data>): JobQueue<Data> {
        const { jobQueueStrategy, pollInterval } = this.configService.jobQueueOptions;
        const queue = new JobQueue(options, jobQueueStrategy, pollInterval);
        if (this.processContext.isServer && this.hasInitialized) {
            queue.start();
        }
        this.queues.push(queue);
        return queue;
    }

    /**
     * @description
     * Gets a job by id. The implementation is handled by the configured
     * {@link JobQueueStrategy}.
     */
    getJob(id: ID): Promise<Job | undefined> {
        return this.jobQueueStrategy.findOne(id);
    }

    /**
     * @description
     * Gets jobs according to the supplied options. The implementation is handled by the configured
     * {@link JobQueueStrategy}.
     */
    getJobs(options?: JobListOptions): Promise<PaginatedList<Job>> {
        return this.jobQueueStrategy.findMany(options);
    }

    /**
     * @description
     * Gets jobs by ids. The implementation is handled by the configured
     * {@link JobQueueStrategy}.
     */
    getJobsById(ids: ID[]): Promise<Job[]> {
        return this.jobQueueStrategy.findManyById(ids);
    }

    /**
     * @description
     * Returns an array of `{ name: string; running: boolean; }` for each
     * registered JobQueue.
     */
    getJobQueues(): GraphQlJobQueue[] {
        return this.queues.map(queue => ({
            name: queue.name,
            running: queue.started,
        }));
    }

    /**
     * @description
     * Removes settled jobs (completed or failed). The implementation is handled by the configured
     * {@link JobQueueStrategy}.
     */
    removeSettledJobs(queueNames: string[], olderThan?: Date) {
        return this.jobQueueStrategy.removeSettledJobs(queueNames, olderThan);
    }
}
