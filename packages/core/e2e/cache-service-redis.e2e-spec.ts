import { CacheService, Logger, mergeConfig, RedisCachePlugin } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';
import { vi, afterAll, beforeAll, describe, it, expect } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    deletesAKey,
    getReturnsUndefinedForNonExistentKey,
    invalidatesALargeNumberOfKeysByTag,
    invalidatesByMultipleTags,
    invalidatesBySingleTag,
    invalidatesManyByMultipleTags,
    invalidTTLsShouldNotSetKey,
    setsAKey,
    setsAKeyWithSubSecondTtl,
    setsAKeyWithTtl,
    setsArrayOfObjects,
    setsArrayValue,
    setsObjectValue,
} from './fixtures/cache-service-shared-tests';

describe('CacheService with RedisCachePlugin', () => {
    let cacheService: CacheService;
    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            plugins: [
                RedisCachePlugin.init({
                    redisOptions: {
                        host: '127.0.0.1',
                        port: process.env.CI ? +(process.env.E2E_REDIS_PORT || 6379) : 6379,
                    },
                }),
            ],
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
        cacheService = server.app.get(CacheService);
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('get returns undefined for non-existent key', () =>
        getReturnsUndefinedForNonExistentKey(cacheService));

    it('sets a key', () => setsAKey(cacheService));

    it('sets an object value', () => setsObjectValue(cacheService));

    it('sets an array value', () => setsArrayValue(cacheService));

    it('sets an array of objects', () => setsArrayOfObjects(cacheService));

    it('deletes a key', () => deletesAKey(cacheService));

    it('sets a key with ttl', async () => {
        await cacheService.set('test-key1', 'test-value', { ttl: 1000 });
        const result = await cacheService.get('test-key1');
        expect(result).toBe('test-value');

        await new Promise(resolve => setTimeout(resolve, 1500));

        const result2 = await cacheService.get('test-key1');

        expect(result2).toBeUndefined();
    });

    it('sets a key with sub-second ttl', async () => {
        await cacheService.set('test-key2', 'test-value', { ttl: 900 });
        const result = await cacheService.get('test-key2');
        expect(result).toBe('test-value');

        await new Promise(resolve => setTimeout(resolve, 1500));

        const result2 = await cacheService.get('test-key2');

        expect(result2).toBeUndefined();
    });

    it('invalidates by single tag', () => invalidatesBySingleTag(cacheService));

    it('invalidates by multiple tags', () => invalidatesByMultipleTags(cacheService));

    it('invalidates many by multiple tags', () => invalidatesManyByMultipleTags(cacheService));

    it('invalidates a large number of keys by tag', () => invalidatesALargeNumberOfKeysByTag(cacheService));

    it('invalid ttls should not set key', () => invalidTTLsShouldNotSetKey(cacheService));
});
