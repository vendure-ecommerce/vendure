import { Injectable } from '@nestjs/common';
import { JsonCompatible } from '@vendure/common/lib/shared-types';

import { ConfigService } from '../config/config.service';
import { Logger } from '../config/index';
import { CacheStrategy, SetCacheKeyOptions } from '../config/system/cache-strategy';

import { Cache } from './cache';

/**
 * @description
 * Configuration for a new {@link Cache} instance.
 */
export interface CacheConfig {
    /**
     * @description
     * A function which generates a cache key from the given id.
     * This key will be used to store the value in the cache.
     *
     * By convention, the key should be namespaced to avoid conflicts.
     *
     * @example
     * ```ts
     * getKey: id => `MyStrategy.getProductVariantIds.${id}`,
     * ```
     */
    getKey: (id: string | number) => string;
    /**
     * @description
     * Options available when setting the value in the cache.
     */
    options?: SetCacheKeyOptions;
}

/**
 * @description
 * The CacheService is used to cache data in order to optimize performance.
 *
 * Internally it makes use of the configured {@link CacheStrategy} to persist
 * the cache into a key-value store.
 *
 * @since 3.1.0
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
     *
     * @example
     * ```ts
     * const cache = cacheService.createCache({
     *   getKey: id => `ProductVariantIds.${id}`,
     *   options: {
     *     ttl: 1000 * 60 * 60,
     *     tags: ['products'],
     *   },
     * });
     *
     * // This will fetch the value from the cache if it exists, or
     * // fetch it from the ProductService if not, and then cache
     * // using the key 'ProductVariantIds.${id}'.
     * const variantIds = await cache.get(id, async () => {
     *   const variants await ProductService.getVariantsByProductId(ctx, id)
     *   ;
     *   // The cached value must be serializable, so we just return the ids
     *   return variants.map(v => v.id);
     * });
     * ```
     */
    createCache(config: CacheConfig): Cache {
        return new Cache(config, this);
    }

    /**
     * @description
     * Gets an item from the cache, or returns undefined if the key is not found, or the
     * item has expired.
     */
    async get<T extends JsonCompatible<T>>(key: string): Promise<T | undefined> {
        try {
            const result = await this.cacheStrategy.get(key);
            if (result) {
                Logger.debug(`CacheService hit for key [${key}]`);
            }
            return result as T;
        } catch (e: any) {
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
    async set<T extends JsonCompatible<T>>(
        key: string,
        value: T,
        options?: SetCacheKeyOptions,
    ): Promise<void> {
        try {
            await this.cacheStrategy.set(key, value, options);
            Logger.debug(`Set key [${key}] in CacheService`);
        } catch (e: any) {
            Logger.error(`Could not set key [${key}] in CacheService`, undefined, e.stack);
        }
    }

    /**
     * @description
     * Deletes an item from the cache.
     */
    async delete(key: string): Promise<void> {
        try {
            await this.cacheStrategy.delete(key);
            Logger.debug(`Deleted key [${key}] from CacheService`);
        } catch (e: any) {
            Logger.error(`Could not delete key [${key}] from CacheService`, undefined, e.stack);
        }
    }

    /**
     * @description
     * Deletes all items from the cache which contain at least one matching tag.
     */
    async invalidateTags(tags: string[]): Promise<void> {
        try {
            await this.cacheStrategy.invalidateTags(tags);
            Logger.debug(`Invalidated tags [${tags.join(', ')}] from CacheService`);
        } catch (e: any) {
            Logger.error(
                `Could not invalidate tags [${tags.join(', ')}] from CacheService`,
                undefined,
                e.stack,
            );
        }
    }
}
