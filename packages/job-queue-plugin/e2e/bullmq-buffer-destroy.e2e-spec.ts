import { Injector, Logger } from '@vendure/core';
import Redis from 'ioredis';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { BULLMQ_PLUGIN_OPTIONS } from '../src/bullmq/constants';
import { RedisJobBufferStorageStrategy } from '../src/bullmq/redis-job-buffer-storage-strategy';
import { BullMQPluginOptions } from '../src/bullmq/types';

const redisHost = '127.0.0.1';
const redisPort = process.env.CI ? +(process.env.E2E_REDIS_PORT || 6379) : 6379;
const CONNECTION_NAME = 'buffer-destroy-e2e-connection';

function createStrategy(connection: BullMQPluginOptions['connection']) {
    const options: BullMQPluginOptions = { connection };
    const strategy = new RedisJobBufferStorageStrategy();
    strategy.init({
        get: (token: unknown) => (token === BULLMQ_PLUGIN_OPTIONS ? options : undefined),
    } as unknown as Injector);
    return strategy;
}

describe('RedisJobBufferStorageStrategy destroy', () => {
    let redis: Redis;

    async function openConnections() {
        const clients = (await redis.client('LIST')) as string;
        return clients.split('\n').filter(line => line.includes(`name=${CONNECTION_NAME}`)).length;
    }

    beforeAll(() => {
        redis = new Redis({ host: redisHost, port: redisPort });
    });

    afterAll(async () => {
        await redis.quit();
    });

    it('closes the Redis connection it opened', async () => {
        const strategy = createStrategy({
            host: redisHost,
            port: redisPort,
            maxRetriesPerRequest: null,
            connectionName: CONNECTION_NAME,
        });
        await strategy.bufferSize([]);
        await vi.waitFor(async () => expect(await openConnections()).toBe(1));

        await strategy.destroy();

        await vi.waitFor(async () => expect(await openConnections()).toBe(0));
    });

    it('logs instead of throwing when the connection is already closed', async () => {
        const strategy = createStrategy({
            host: redisHost,
            port: redisPort,
            maxRetriesPerRequest: null,
            connectionName: CONNECTION_NAME,
        });
        await strategy.bufferSize([]);
        await strategy.destroy();
        const loggerError = vi.spyOn(Logger, 'error').mockImplementation(() => undefined);

        await expect(strategy.destroy()).resolves.toBeUndefined();

        expect(loggerError).toHaveBeenCalledTimes(1);
        expect(loggerError.mock.calls[0][0]).toContain('Error closing Redis connection');
        loggerError.mockRestore();
    });

    it('leaves a connection supplied by the caller open', async () => {
        const supplied = new Redis({
            host: redisHost,
            port: redisPort,
            maxRetriesPerRequest: null,
            connectionName: CONNECTION_NAME,
        });
        const strategy = createStrategy(supplied);
        await supplied.ping();

        await strategy.destroy();

        expect(supplied.status).toBe('ready');
        expect(await openConnections()).toBe(1);
        await supplied.quit();
    });
});
