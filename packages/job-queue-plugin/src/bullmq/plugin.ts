import { HealthCheckRegistryService, PluginCommonModule, VendurePlugin } from '@vendure/core';

import { BullMQJobQueueStrategy } from './bullmq-job-queue-strategy';
import { BULLMQ_PLUGIN_OPTIONS } from './constants';
import { RedisHealthIndicator } from './redis-health-indicator';
import { BullMQPluginOptions } from './types';

/**
 * @description
 * This plugin is a drop-in replacement of the DefaultJobQueuePlugin, which implements a push-based
 * job queue strategy built on top of the popular [BullMQ](https://github.com/taskforcesh/bullmq) library.
 *
 * {{% alert "warning" %}}
 * This plugin was newly released with Vendure v1.2.0 and has yet to receive thorough real-world testing.
 * {{% /alert %}}
 *
 * ## Advantages over the DefaultJobQueuePlugin
 *
 * The advantage of this approach is that jobs are stored in Redis rather than in the database. For more complex
 * applications with many job queues and/or multiple worker instances, this can massively reduce the load on the
 * DB server. The reason for this is that the DefaultJobQueuePlugin uses polling to check for new jobs. By default
 * it will poll every 200ms. A typical Vendure instance uses at least 3 queues (handling emails, collections, search index),
 * so even with a single worker instance this results in 15 queries per second to the DB constantly. Adding more
 * custom queues and multiple worker instances can easily result in 50 or 100 queries per second. At this point
 * performance may be impacted.
 *
 * Using this plugin, no polling is needed, as BullMQ will _push_ jobs to the worker(s) as and when they are added
 * to the queue. This results in significantly more scalable performance characteristics, as well as lower latency
 * in processing jobs.
 *
 * ## Installation
 *
 * `yarn add \@vendure/job-queue-plugin bullmq`
 *
 * or
 *
 * `npm install \@vendure/job-queue-plugin bullmq`
 *
 * @example
 * ```ts
 * import { BullMQJobQueuePlugin } from '\@vendure/job-queue-plugin/package/bullmq';
 *
 * const config: VendureConfig = {
 *   // Add an instance of the plugin to the plugins array
 *   plugins: [
 *     BullMQJobQueuePlugin.init({
 *       connection: {
 *         port: 6379
 *       }
 *     }),
 *   ],
 * };
 * ```
 *
 * ### Running Redis locally
 *
 * To develop with this plugin, you'll need an instance of Redis to connect to. Here's a docker-compose config
 * that will set up [Redis](https://redis.io/) as well as [Redis Commander](https://github.com/joeferner/redis-commander),
 * which is a web-based UI for interacting with Redis:
 *
 * ```YAML
 * version: "3"
 * services:
 *   redis:
 *     image: bitnami/redis:6.2
 *     hostname: redis
 *     container_name: redis
 *     environment:
 *       - ALLOW_EMPTY_PASSWORD=yes
 *     ports:
 *       - "6379:6379"
 *   redis-commander:
 *     container_name: redis-commander
 *     hostname: redis-commander
 *     image: rediscommander/redis-commander:latest
 *     environment:
 *       - REDIS_HOSTS=local:redis:6379
 *     ports:
 *       - "8085:8081"
 * ```
 *
 * ## Concurrency
 *
 * The default concurrency of a single worker is 3, i.e. up to 3 jobs will be processed at the same time.
 * You can change the concurrency in the `workerOptions` passed to the `init()` method:
 *
 * @example
 * ```TypeScript
 * const config: VendureConfig = {
 *   plugins: [
 *     BullMQJobQueuePlugin.init({
 *       workerOptions: {
 *         concurrency: 10,
 *       },
 *     }),
 *   ],
 * };
 * ```
 *
 * @docsCategory job-queue-plugin
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    configuration: config => {
        config.jobQueueOptions.jobQueueStrategy = new BullMQJobQueueStrategy();
        return config;
    },
    providers: [
        { provide: BULLMQ_PLUGIN_OPTIONS, useFactory: () => BullMQJobQueuePlugin.options },
        RedisHealthIndicator,
    ],
})
export class BullMQJobQueuePlugin {
    static options: BullMQPluginOptions;

    /**
     * @description
     * Configures the plugin.
     */
    static init(options: BullMQPluginOptions) {
        this.options = options;
        return this;
    }

    constructor(private registry: HealthCheckRegistryService, private redis: RedisHealthIndicator) {
        registry.registerIndicatorFunction(() => this.redis.isHealthy('redis (job queue)'));
    }
}
