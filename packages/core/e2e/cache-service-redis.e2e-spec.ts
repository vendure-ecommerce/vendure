import { CacheService, mergeConfig, RedisCachePlugin } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    deletesAKey,
    evictsTheOldestKeyWhenCacheIsFull,
    getReturnsUndefinedForNonExistentKey,
    invalidatesALargeNumberOfKeysByTag,
    invalidatesByMultipleTags,
    invalidatesBySingleTag,
    invalidatesManyByMultipleTags,
    setsAKey,
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

    it('invalidates by single tag', () => invalidatesBySingleTag(cacheService));

    it('invalidates by multiple tags', () => invalidatesByMultipleTags(cacheService));

    it('invalidates many by multiple tags', () => invalidatesManyByMultipleTags(cacheService));

    it('invalidates a large number of keys by tag', () => invalidatesALargeNumberOfKeysByTag(cacheService));
});
