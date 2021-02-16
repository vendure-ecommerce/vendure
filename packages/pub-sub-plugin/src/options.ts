export interface PubSubOptions {
    /**
     * @description
     * Number of jobs that can be inflight at the same time.
     */
    concurrency?: number;
    /**
     * @description
     * This is the mapping of Vendure queue names to PubSub Topics and Subscriptions
     * For each queue a topic and subscription is required to exist.
     */
    queueNamePubSubPair?: Map<string, [string, string]>;
}
