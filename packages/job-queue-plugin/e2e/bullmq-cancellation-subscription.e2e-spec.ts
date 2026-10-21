import { Injector } from '@vendure/core';
import Redis from 'ioredis';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { BullMQJobQueueStrategy } from '../src/bullmq/bullmq-job-queue-strategy';
import { BULLMQ_PLUGIN_OPTIONS } from '../src/bullmq/constants';
import { JobListIndexService } from '../src/bullmq/job-list-index.service';
import { RedisHealthIndicator } from '../src/bullmq/redis-health-indicator';
import { BullMQPluginOptions } from '../src/bullmq/types';

const redisHost = '127.0.0.1';
const redisPort = process.env.CI ? +(process.env.E2E_REDIS_PORT || 6379) : 6379;
const PREFIX = 'cancellation-subscription-e2e';

describe('BullMQJobQueueStrategy cancellation subscription', () => {
    let redis: Redis;

    async function deleteTestKeys() {
        const keys = await redis.keys(`${PREFIX}:*`);
        if (keys.length) {
            await redis.del(...keys);
        }
    }

    async function subscriberCount() {
        const [, count] = (await redis.pubsub('NUMSUB', `${PREFIX}:cancel-job`)) as [string, number];
        return Number(count);
    }

    beforeAll(async () => {
        redis = new Redis({ host: redisHost, port: redisPort });
        await deleteTestKeys();
    });

    afterAll(async () => {
        await deleteTestKeys();
        await redis.quit();
    });

    it('keeps the subscription when start() runs before the subscriber is ready', async () => {
        const options: BullMQPluginOptions = {
            connection: { host: redisHost, port: redisPort, maxRetriesPerRequest: null },
            workerOptions: { prefix: PREFIX },
            queueOptions: { prefix: PREFIX },
        };
        const providers = new Map<unknown, unknown>([
            [BULLMQ_PLUGIN_OPTIONS, options],
            [JobListIndexService, { register: () => undefined, close: () => Promise.resolve() }],
            [RedisHealthIndicator, { isHealthy: () => Promise.resolve({ redis: { status: 'up' } }) }],
        ]);
        const strategy = new BullMQJobQueueStrategy();
        try {
            await strategy.init({ get: (token: unknown) => providers.get(token) } as unknown as Injector);
            const subscriber = (strategy as any).cancellationSub as Redis;
            expect(subscriber.status).not.toBe('ready');

            const started = new Promise<void>((resolve, reject) => {
                subscriber.once('connect', () => {
                    strategy.start('subscription-test', () => Promise.resolve()).then(resolve, reject);
                });
            });
            await started;
            await new Promise(resolve => setTimeout(resolve, 500));

            expect(await subscriberCount()).toBe(1);
        } finally {
            await strategy.destroy().catch(() => undefined);
        }
    });
});
