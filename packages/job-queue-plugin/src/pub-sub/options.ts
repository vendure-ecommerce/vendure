export interface PubSubOptions {
    /**
     * @description
     * Number of jobs that can be inflight at the same time.
     *
     * Can be set to a function which receives the queue name and returns
     * the concurrency limit. This is useful for limiting concurrency on
     * queues which have resource-intensive jobs.
     *
     * @example
     * ```ts
     * PubSubPlugin.init({
     *   concurrency: (queueName) => {
     *     if (queueName === 'apply-collection-filters') {
     *       return 1;
     *     }
     *     return 20;
     *   },
     *   queueNamePubSubPair: new Map([...])
     * })
     * ```
     *
     * @default 20
     */
    concurrency?: number | ((queueName: string) => number);
    /**
     * @description
     * This is the mapping of Vendure queue names to PubSub Topics and Subscriptions
     * For each queue a topic and subscription is required to exist.
     */
    queueNamePubSubPair?: Map<string, [string, string]>;
}
