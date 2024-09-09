import { JsonCompatible } from '@vendure/common/lib/shared-types';

import { Injector } from '../../common/index';
import { ConfigService, Logger } from '../../config/index';
import { CacheStrategy, SetCacheKeyOptions } from '../../config/system/cache-strategy';
import { TransactionalConnection } from '../../connection/index';

import { CacheItem } from './cache-item.entity';

/**
 * A {@link CacheStrategy} that stores the cache in memory using a simple
 * JavaScript Map.
 *
 * **Caution** do not use this in a multi-instance deployment because
 * cache invalidation will not propagate to other instances.
 *
 * @since 3.1.0
 */
export class SqlCacheStrategy implements CacheStrategy {
    protected cacheSize = 10_000;

    constructor(config?: { cacheSize?: number }) {
        if (config?.cacheSize) {
            this.cacheSize = config.cacheSize;
        }
    }

    protected connection: TransactionalConnection;
    protected configService: ConfigService;

    init(injector: Injector) {
        this.connection = injector.get(TransactionalConnection);
        this.configService = injector.get(ConfigService);
    }

    async get<T extends JsonCompatible<T>>(key: string): Promise<T | undefined> {
        const hit = await this.connection.rawConnection.getRepository(CacheItem).findOne({
            where: {
                key,
            },
        });

        if (hit) {
            const now = new Date().getTime();
            if (!hit.expiresAt || (hit.expiresAt && now < hit.expiresAt.getTime())) {
                try {
                    return JSON.parse(hit.value);
                } catch (e: any) {
                    /* */
                }
            } else {
                await this.connection.rawConnection.getRepository(CacheItem).delete({
                    key,
                });
            }
        }
    }

    async set<T extends JsonCompatible<T>>(key: string, value: T, options?: SetCacheKeyOptions) {
        const cacheSize = await this.connection.rawConnection.getRepository(CacheItem).count();
        if (cacheSize > this.cacheSize) {
            // evict oldest
            const subQuery1 = this.connection.rawConnection
                .getRepository(CacheItem)
                .createQueryBuilder('item')
                .select('item.id', 'item_id')
                .orderBy('item.updatedAt', 'DESC')
                .limit(1000)
                .offset(this.cacheSize);
            const subQuery2 = this.connection.rawConnection
                .createQueryBuilder()
                .select('t.item_id')
                .from(`(${subQuery1.getQuery()})`, 't');
            const qb = this.connection.rawConnection
                .getRepository(CacheItem)
                .createQueryBuilder('cache_item')
                .delete()
                .from(CacheItem, 'cache_item')
                .where(`cache_item.id IN (${subQuery2.getQuery()})`);

            try {
                await qb.execute();
            } catch (e: any) {
                Logger.error(`An error occured when attempting to prune the cache: ${e.message as string}`);
            }
        }
        await this.connection.rawConnection.getRepository(CacheItem).upsert(
            new CacheItem({
                key,
                value: JSON.stringify(value),
                expiresAt: options?.ttl ? new Date(new Date().getTime() + options.ttl) : undefined,
            }),
            ['key'],
        );
    }

    async delete(key: string) {
        await this.connection.rawConnection.getRepository(CacheItem).delete({
            key,
        });
    }
}
