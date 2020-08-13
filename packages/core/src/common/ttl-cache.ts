/**
 * An in-memory cache with a configurable TTL (time to live) which means cache items
 * expire after they have been in the cache longer than that time.
 */
export class TtlCache<K, V> {
    private cache = new Map<K, { value: V; expires: number }>();
    private readonly ttl: number = 30 * 1000;
    private readonly cacheSize: number = 1000;
    constructor(config?: { ttl?: number; cacheSize?: number }) {
        if (config?.ttl) {
            this.ttl = config.ttl;
        }
        if (config?.cacheSize) {
            this.cacheSize = config.cacheSize;
        }
    }

    get(key: K): V | undefined {
        const hit = this.cache.get(key);
        const now = new Date().getTime();
        if (hit) {
            if (hit.expires < now) {
                return hit.value;
            } else {
                this.cache.delete(key);
            }
        }
    }

    set(key: K, value: V) {
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
            expires: new Date().getTime() + this.ttl,
        });
    }

    private first() {
        return this.cache.keys().next().value;
    }
}
