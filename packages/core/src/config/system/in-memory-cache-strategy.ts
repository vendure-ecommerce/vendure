import { JsonCompatible } from '@vendure/common/lib/shared-types';

import { CacheStrategy, SetCacheKeyOptions } from './cache-strategy';

export interface CacheItem<T> {
    value: JsonCompatible<T>;
    expires?: number;
}

/**
 * A {@link CacheStrategy} that stores the cache in memory using a simple
 * JavaScript Map.
 *
 * **Caution** do not use this in a multi-instance deployment because
 * cache invalidation will not propagate to other instances.
 *
 * @since 3.1.0
 */
export class InMemoryCacheStrategy implements CacheStrategy {
    protected cache = new Map<string, CacheItem<any>>();
    protected cacheSize = 10_000;

    constructor(config?: { cacheSize?: number }) {
        if (config?.cacheSize) {
            this.cacheSize = config.cacheSize;
        }
    }

    async get<T extends JsonCompatible<T>>(key: string): Promise<T | undefined> {
        const hit = this.cache.get(key);
        if (hit) {
            const now = new Date().getTime();
            if (!hit.expires || (hit.expires && now < hit.expires)) {
                return hit.value;
            } else {
                this.cache.delete(key);
            }
        }
    }

    async set<T extends JsonCompatible<T>>(key: string, value: T, options?: SetCacheKeyOptions) {
        if (this.cache.has(key)) {
            // delete key to put the item to the end of
            // the cache, marking it as new again
            this.cache.delete(key);
        } else if (this.cache.size === this.cacheSize) {
            // evict oldest
            this.cache.delete(this.first());
        }
        this.cache.set(key, {
            value,
            expires: options?.ttl ? new Date().getTime() + options.ttl : undefined,
        });
    }

    async delete(key: string) {
        this.cache.delete(key);
    }

    private first() {
        return this.cache.keys().next().value;
    }
}
