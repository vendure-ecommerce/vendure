import { CacheTtlProvider } from '../../cache/cache-ttl-provider';

export interface RedisCachePluginInitOptions {
    /**
     * @description
     * The maximum size of a single cache item in bytes. If a cache item exceeds this size, it will not be stored
     * and an error will be logged.
     *
     * @default 128kb
     */
    maxItemSizeInBytes?: number;
    namespace?: string;
    redisOptions?: import('ioredis').RedisOptions;
}
