import { ConnectionOptions, QueueSchedulerOptions, WorkerOptions } from 'bullmq';
import { QueueOptions } from 'bullmq';

/**
 * @description
 * Configuration options for the {@link BullMQJobQueuePlugin}.
 *
 * @since 1.2.0
 * @docsCategory job-queue-plugin
 */
export interface BullMQPluginOptions {
    /**
     * @description
     * Connection options which will be passed directly to BullMQ when
     * creating a new Queue, Worker and Scheduler instance.
     *
     * If omitted, it will attempt to connect to Redis at `127.0.0.1:6379`.
     */
    connection?: ConnectionOptions;
    /**
     * @description
     * Additional options used when instantiating the BullMQ
     * Queue instance.
     */
    queueOptions?: Exclude<QueueOptions, 'connection'>;
    /**
     * @description
     * Additional options used when instantiating the BullMQ
     * Worker instance.
     */
    workerOptions?: Exclude<WorkerOptions, 'connection'>;
    /**
     * @description
     * Additional options used when instantiating the BullMQ
     * QueueScheduler instance.
     */
    schedulerOptions?: Exclude<QueueSchedulerOptions, 'connection'>;
}
