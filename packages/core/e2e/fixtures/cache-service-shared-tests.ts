import { CacheService } from '@vendure/core';
import { expect } from 'vitest';

import { TestingCacheTtlProvider } from '../../src/cache/cache-ttl-provider';

export async function getReturnsUndefinedForNonExistentKey(cacheService: CacheService) {
    const result = await cacheService.get('non-existent-key');
    expect(result).toBeUndefined();
}

export async function setsAKey(cacheService: CacheService) {
    await cacheService.set('test-key', 'test-value');
    const result = await cacheService.get('test-key');
    expect(result).toBe('test-value');
}

export async function deletesAKey(cacheService: CacheService) {
    await cacheService.set('test-key', 'test-value');
    await cacheService.delete('test-key');
    const result = await cacheService.get('test-key');

    expect(result).toBeUndefined();
}

export async function setsAKeyWithTtl(cacheService: CacheService, ttlProvider: TestingCacheTtlProvider) {
    ttlProvider.setTime(new Date().getTime());
    await cacheService.set('test-key', 'test-value', { ttl: 1000 });
    const result = await cacheService.get('test-key');
    expect(result).toBe('test-value');

    ttlProvider.incrementTime(2000);

    const result2 = await cacheService.get('test-key');

    expect(result2).toBeUndefined();
}

export async function evictsTheOldestKeyWhenCacheIsFull(cacheService: CacheService) {
    await cacheService.set('key1', 'value1');
    await cacheService.set('key2', 'value2');
    await cacheService.set('key3', 'value3');
    await cacheService.set('key4', 'value4');
    await cacheService.set('key5', 'value5');

    const result1 = await cacheService.get('key1');
    expect(result1).toBe('value1');

    await cacheService.set('key6', 'value6');

    const result2 = await cacheService.get('key1');
    expect(result2).toBeUndefined();
}

export async function invalidatesBySingleTag(cacheService: CacheService) {
    await cacheService.set('taggedKey1', 'value1', { tags: ['tag1'] });
    await cacheService.set('taggedKey2', 'value2', { tags: ['tag2'] });

    expect(await cacheService.get('taggedKey1')).toBe('value1');
    expect(await cacheService.get('taggedKey2')).toBe('value2');

    await cacheService.invalidateTags(['tag1']);

    expect(await cacheService.get('taggedKey1')).toBeUndefined();
    expect(await cacheService.get('taggedKey2')).toBe('value2');
}

export async function invalidatesByMultipleTags(cacheService: CacheService) {
    await cacheService.set('taggedKey1', 'value1', { tags: ['tag1'] });
    await cacheService.set('taggedKey2', 'value2', { tags: ['tag2'] });

    expect(await cacheService.get('taggedKey1')).toBe('value1');
    expect(await cacheService.get('taggedKey2')).toBe('value2');

    await cacheService.invalidateTags(['tag1', 'tag2']);

    expect(await cacheService.get('taggedKey1')).toBeUndefined();
    expect(await cacheService.get('taggedKey2')).toBeUndefined();
}

export async function invalidatesALargeNumberOfKeysByTag(cacheService: CacheService) {
    for (let i = 0; i < 100; i++) {
        await cacheService.set(`taggedKey${i}`, `value${i}`, { tags: ['tag'] });
    }
    await cacheService.invalidateTags(['tag']);

    for (let i = 0; i < 100; i++) {
        expect(await cacheService.get(`taggedKey${i}`)).toBeUndefined();
    }
}
