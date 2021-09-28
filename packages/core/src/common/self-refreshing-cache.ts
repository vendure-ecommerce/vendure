import { Json } from '@vendure/common/lib/shared-types';

import { Logger } from '../config/logger/vendure-logger';

/**
 * @description
 * A cache which automatically refreshes itself if the value is found to be stale.
 */
export interface SelfRefreshingCache<V> {
    /**
     * @description
     * The current value of the cache. If the value is stale, the data will be refreshed and then
     * the fresh value will be returned.
     */
    value(): Promise<V>;

    /**
     * @description
     * Allows a memoized function to be defined. For the given arguments, the `fn` function will
     * be invoked only once and its output cached and returned.
     * The results cache is cleared along with the rest of the cache according to the configured
     * `ttl` value.
     */
    memoize<Args extends any[], R>(args: Args, fn: (value: V, ...args: Args) => R): Promise<R>;

    /**
     * @description
     * Force a refresh of the value, e.g. when it is known that the value has changed such as after
     * an update operation to the source data in the database.
     */
    refresh(): Promise<V>;
}

export interface SelfRefreshingCacheConfig<V> {
    name: string;
    ttl: number;
    refreshFn: () => Promise<V>;
}

/**
 * @description
 * Creates a {@link SelfRefreshingCache} object, which is used to cache a single frequently-accessed value. In this type
 * of cache, the function used to populate the value (`refreshFn`) is defined during the creation of the cache, and
 * it is immediately used to populate the initial value.
 *
 * From there, when the `.value` property is accessed, it will _always_ return a value synchronously. If the
 * value has expired, it will still be returned and the `refreshFn` will be triggered to update the value in the
 * background.
 */
export async function createSelfRefreshingCache<V>(
    config: SelfRefreshingCacheConfig<V>,
): Promise<SelfRefreshingCache<V>> {
    const { ttl, name, refreshFn } = config;
    const initialValue = await refreshFn();
    let value = initialValue;
    let expires = new Date().getTime() + ttl;
    const memoCache = new Map<string, any>();
    const hashArgs = (...args: any[]) => JSON.stringify([args, expires]);
    const refreshValue = (): Promise<V> => {
        Logger.debug(`Refreshing the SelfRefreshingCache "${name}"`);
        return refreshFn()
            .then(newValue => {
                value = newValue;
                expires = new Date().getTime() + ttl;
                memoCache.clear();
                return value;
            })
            .catch(err => {
                Logger.error(
                    `Failed to update SelfRefreshingCache "${name}": ${err.message}`,
                    undefined,
                    err.stack,
                );
                return value;
            });
    };
    const getValue = async (): Promise<V> => {
        const now = new Date().getTime();
        if (expires < now) {
            return refreshValue();
        }
        return value;
    };
    const memoize = async <Args extends any[], R>(
        args: Args,
        fn: (value: V, ...args: Args) => R,
    ): Promise<R> => {
        const cached = memoCache.get(hashArgs(args));
        if (cached) {
            return cached;
        }
        let result: Promise<R>;
        memoCache.set(hashArgs(args), (result = getValue().then(val => fn(val, ...args))));
        return result;
    };
    return {
        value: getValue,
        refresh: refreshValue,
        memoize,
    };
}
