import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { JobQueue as GraphQlJobQueue } from '@vendure/common/lib/generated-types';

import { ConfigService, JobQueueStrategy, Logger } from '../config';

import { loggerCtx } from './constants';
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
 *   async onModuleInit() {
 *     // The JobQueue is created on initialization
 *     this.jobQueue = await this.jobQueueService.createQueue({
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
export class JobQueueService implements OnModuleDestroy {
    private queues: Array<JobQueue<any>> = [];
    private hasStarted = false;

    private get jobQueueStrategy(): JobQueueStrategy {
        return this.configService.jobQueueOptions.jobQueueStrategy;
    }

    constructor(private configService: ConfigService) {}

    /** @internal */
    onModuleDestroy() {
        this.hasStarted = false;
        return Promise.all(this.queues.map(q => q.stop()));
    }

    /**
     * @description
     * Configures and creates a new {@link JobQueue} instance.
     */
    async createQueue<Data extends JobData<Data>>(
        options: CreateQueueOptions<Data>,
    ): Promise<JobQueue<Data>> {
        const queue = new JobQueue(options, this.jobQueueStrategy);
        if (this.hasStarted && this.shouldStartQueue(queue.name)) {
            await queue.start();
        }
        this.queues.push(queue);
        return queue;
    }

    async start(): Promise<void> {
        this.hasStarted = true;
        for (const queue of this.queues) {
            if (!queue.started && this.shouldStartQueue(queue.name)) {
                Logger.info(`Starting queue: ${queue.name}`, loggerCtx);
                await queue.start();
            }
        }
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
        if (this.configService.jobQueueOptions.activeQueues.length > 0) {
            if (!this.configService.jobQueueOptions.activeQueues.includes(queueName)) {
                return false;
            }
        }

        return true;
    }
}
