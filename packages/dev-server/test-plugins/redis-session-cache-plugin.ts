import { CachedSession, Logger, SessionCacheStrategy, VendurePlugin } from '@vendure/core';
import IORedis from 'ioredis';

const loggerCtx = 'RedisSessionCacheStrategy';
const DEFAULT_NAMESPACE = 'vendure-session-cache';

export class RedisSessionCacheStrategy implements SessionCacheStrategy {
    private client: IORedis.Redis;

    constructor(private options: RedisSessionCachePluginOptions) {}

    init() {
        this.client = new IORedis(this.options.redisOptions);
        this.client.on('error', err => Logger.error(err.message, loggerCtx, err.stack));
    }

    async get(sessionToken: string): Promise<CachedSession | undefined> {
        const retrieved = await this.client.get(this.namespace(sessionToken));
        if (retrieved) {
            try {
                return JSON.parse(retrieved);
            } catch (e) {
                Logger.error(`Could not parse cached session data: ${e.message}`, loggerCtx);
            }
        }
    }

    async set(session: CachedSession) {
        await this.client.set(this.namespace(session.token), JSON.stringify(session));
    }

    async delete(sessionToken: string) {
        await this.client.del(this.namespace(sessionToken));
    }

    clear() {
        // not implemented
    }

    private namespace(key: string) {
        return `${this.options.namespace ?? DEFAULT_NAMESPACE}:${key}`;
    }
}

export interface RedisSessionCachePluginOptions {
    namespace?: string;
    redisOptions?: IORedis.RedisOptions;
}

@VendurePlugin({
    configuration: config => {
        config.authOptions.sessionCacheStrategy = new RedisSessionCacheStrategy(
            RedisSessionCachePlugin.options,
        );
        return config;
    },
})
export class RedisSessionCachePlugin {
    static options: RedisSessionCachePluginOptions;
    static init(options: RedisSessionCachePluginOptions) {
        this.options = options;
        return this;
    }
}
