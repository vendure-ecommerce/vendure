import { JsonCompatible } from '@vendure/common/lib/shared-types';

import { CacheConfig, CacheService } from './cache.service';

/**
 * @description
 * A convenience wrapper around the {@link CacheService} methods which provides a simple
 * API for caching and retrieving data.
 *
 * The advantage of using the `Cache` class rather than directly calling the `CacheService`
 * methods is that it allows you to define a consistent way of generating cache keys and
 * to set default cache options, and takes care of setting the value in cache if it does not
 * already exist.
 *
 * In most cases, using the `Cache` class will result in simpler and more readable code.
 *
 * This class is normally created via the {@link CacheService.createCache} method.
 */
export class Cache {
    constructor(
        private config: CacheConfig,
        private cacheService: CacheService,
    ) {}

    /**
     * @description
     * Retrieves the value from the cache if it exists, otherwise calls the `getValueFn` function
     * to get the value, sets it in the cache and returns it.
     */
    async get<T extends JsonCompatible<T>>(
        id: string | number,
        getValueFn: () => T | Promise<T>,
    ): Promise<T> {
        const key = this.config.getKey(id);
        const cachedValue = await this.cacheService.get<T>(key);
        if (cachedValue) {
            return cachedValue;
        }
        const value = await getValueFn();
        await this.cacheService.set(key, value, this.config.options);
        return value;
    }

    /**
     * @description
     * Deletes one or more items from the cache.
     */
    async delete(id: string | number | Array<string | number>): Promise<void> {
        const ids = Array.isArray(id) ? id : [id];
        const keyArgs = ids.map(_id => this.config.getKey(_id));
        await Promise.all(keyArgs.map(key => this.cacheService.delete(key)));
    }

    /**
     * @description
     * Invalidates one or more tags in the cache.
     */
    async invalidateTags(tags: string[]): Promise<void> {
        await this.cacheService.invalidateTags(tags);
    }
}
