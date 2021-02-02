import { Injectable, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import { JobQueue as GraphQlJobQueue } from '@vendure/common/lib/generated-types';

import { ConfigService, JobQueueStrategy } from '../config';
import { ProcessContext } from '../process-context';

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
 *       process: async job => {
 *         return await this.transcodeVideo(job.data.videoId);
 *       },
 *     });
 *   }
 *
 *   addToTranscodeQueue(videoId: string) {
 *     this.jobQueue.add({ videoId, })
 *   }
 *
 *   private async transcodeVideo(videoId: string) {
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
    private queues: Array<JobQueue<any>> = [];
    private hasInitialized = false;

    private get jobQueueStrategy(): JobQueueStrategy {
        return this.configService.jobQueueOptions.jobQueueStrategy;
    }

    constructor(private configService: ConfigService, private processContext: ProcessContext) {}

    /** @internal */
    async onApplicationBootstrap() {
        this.hasInitialized = true;
        for (const queue of this.queues) {
            if (!queue.started && this.shouldStartQueue(queue.name)) {
                queue.start();
            }
        }
    }

    /** @internal */
    onModuleDestroy() {
        this.hasInitialized = false;
        return Promise.all(this.queues.map(q => q.destroy()));
    }

    /**
     * @description
     * Configures and creates a new {@link JobQueue} instance.
     */
    createQueue<Data extends JobData<Data>>(options: CreateQueueOptions<Data>): JobQueue<Data> {
        const { jobQueueStrategy } = this.configService.jobQueueOptions;
        const queue = new JobQueue(options, jobQueueStrategy);
        if (this.hasInitialized && this.shouldStartQueue(queue.name)) {
            queue.start();
        }
        this.queues.push(queue);
        return queue;
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

    private shouldStartQueue(queueName: string): boolean {
        if (this.processContext.isServer) {
            return false;
        }

        if (this.configService.jobQueueOptions.activeQueues.length > 0) {
            if (!this.configService.jobQueueOptions.activeQueues.includes(queueName)) {
                return false;
            }
        }

        return true;
    }
}
