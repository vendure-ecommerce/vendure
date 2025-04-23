import { Injectable } from '@nestjs/common';
import { JsonCompatible } from '@vendure/common/lib/shared-types';
import { getActiveSpan } from '@vendure/telemetry';

import { ConfigService } from '../config/config.service';
import { Logger } from '../config/index';
import { CacheStrategy, SetCacheKeyOptions } from '../config/system/cache-strategy';
import { Span } from '../instrumentation';

import { Cache, CacheConfig } from './cache';

/**
 * @description
 * The CacheService is used to cache data in order to optimize performance.
 *
 * Internally it makes use of the configured {@link CacheStrategy} to persist
 * the cache into a key-value store.
 *
 * @since 3.1.0
 * @docsCategory cache
 */
@Injectable()
export class CacheService {
    protected cacheStrategy: CacheStrategy;

    constructor(private configService: ConfigService) {
        this.cacheStrategy = this.configService.systemOptions.cacheStrategy;
    }

    /**
     * @description
     * Creates a new {@link Cache} instance with the given configuration.
     *
     * The `Cache` instance provides a convenience wrapper around the `CacheService`
     * methods.
     */
    @Span('CacheService.createCache')
    createCache(config: CacheConfig): Cache {
        const span = getActiveSpan();
        span?.setAttribute('cache.config', JSON.stringify(config));
        return new Cache(config, this);
    }

    /**
     * @description
     * Gets an item from the cache, or returns undefined if the key is not found, or the
     * item has expired.
     */
    @Span('CacheService.get')
    async get<T extends JsonCompatible<T>>(key: string): Promise<T | undefined> {
        const span = getActiveSpan();

        try {
            const result = await this.cacheStrategy.get(key);
            if (result) {
                span?.setAttribute('cache.hit', true);
                span?.addEvent('cache.hit', { key });
                Logger.debug(`CacheService hit for key [${key}]`);
            }
            return result as T;
        } catch (e: any) {
            span?.setAttribute('cache.hit', false);
            span?.addEvent('cache.miss', { key });
            Logger.error(`Could not get key [${key}] from CacheService`, undefined, e.stack);
        }
    }

    /**
     * @description
     * Sets a key-value pair in the cache. The value must be serializable, so cannot contain
     * things like functions, circular data structures, class instances etc.
     *
     * Optionally a "time to live" (ttl) can be specified, which means that the key will
     * be considered stale after that many milliseconds.
     */
    @Span('CacheService.set')
    async set<T extends JsonCompatible<T>>(
        key: string,
        value: T,
        options?: SetCacheKeyOptions,
    ): Promise<void> {
        const span = getActiveSpan();
        span?.setAttribute('cache.key', key);
        try {
            await this.cacheStrategy.set(key, value, options);
            span?.setAttribute('cache.set', true);
            span?.end();
            Logger.debug(`Set key [${key}] in CacheService`);
        } catch (e: any) {
            span?.setAttribute('cache.set', false);
            span?.end();
            Logger.error(`Could not set key [${key}] in CacheService`, undefined, e.stack);
        }
    }

    /**
     * @description
     * Deletes an item from the cache.
     */
    @Span('CacheService.delete')
    async delete(key: string): Promise<void> {
        const span = getActiveSpan();
        span?.setAttribute('cache.key', key);
        try {
            await this.cacheStrategy.delete(key);
            span?.setAttribute('cache.deleted', true);
            span?.end();
            Logger.debug(`Deleted key [${key}] from CacheService`);
        } catch (e: any) {
            span?.setAttribute('cache.deleted', false);
            span?.end();
            Logger.error(`Could not delete key [${key}] from CacheService`, undefined, e.stack);
        }
    }

    /**
     * @description
     * Deletes all items from the cache which contain at least one matching tag.
     */
    @Span('CacheService.invalidateTags')
    async invalidateTags(tags: string[]): Promise<void> {
        const span = getActiveSpan();
        span?.setAttribute('cache.tags', tags.join(', '));
        try {
            await this.cacheStrategy.invalidateTags(tags);
            span?.setAttribute('cache.invalidated', true);
            span?.end();
            Logger.debug(`Invalidated tags [${tags.join(', ')}] from CacheService`);
        } catch (e: any) {
            span?.setAttribute('cache.invalidated', false);
            span?.end();
            Logger.error(
                `Could not invalidate tags [${tags.join(', ')}] from CacheService`,
                undefined,
                e.stack,
            );
        }
    }
}
