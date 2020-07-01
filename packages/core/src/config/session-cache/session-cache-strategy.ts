import { ID } from '@vendure/common/lib/shared-types';

import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { UserChannelPermissions } from '../../service/helpers/utils/get-user-channels-permissions';

/**
 * @description
 * A simplified representation of the User associated with the
 * current Session.
 *
 * @docsCategory auth
 * @docsPage SessionCacheStrategy
 */
export type CachedSessionUser = {
    id: ID;
    identifier: string;
    verified: boolean;
    channelPermissions: UserChannelPermissions[];
};

/**
 * @description
 * A simplified representation of a Session which is easy to
 * store.
 *
 * @docsCategory auth
 * @docsPage SessionCacheStrategy
 */
export type CachedSession = {
    /**
     * @description
     * The timestamp after which this cache entry is considered stale and
     * a fresh copy of the data will be set. Based on the `sessionCacheTTL`
     * option.
     */
    cacheExpiry: number;
    id: ID;
    token: string;
    expires: Date;
    activeOrderId?: ID;
    authenticationStrategy?: string;
    user?: CachedSessionUser;
};

/**
 * @description
 * This strategy defines how sessions get cached. Since most requests will need the Session
 * object for permissions data, it can become a bottleneck to go to the database and do a multi-join
 * SQL query each time. Therefore we cache the session data only perform the SQL query once and upon
 * invalidation of the cache.
 *
 * @docsCategory auth
 * @docsPage SessionCacheStrategy
 */
export interface SessionCacheStrategy extends InjectableStrategy {
    /**
     * @description
     * Store the session in the cache. When caching a session, the data
     * should not be modified apart from performing any transforms needed to
     * get it into a state to be stored, e.g. JSON.stringify().
     */
    set(session: CachedSession): void | Promise<void>;

    /**
     * @description
     * Retrieve the session from the cache
     */
    get(sessionToken: string): CachedSession | undefined | Promise<CachedSession | undefined>;

    /**
     * @description
     * Delete a session from the cache
     */
    delete(sessionToken: string): void | Promise<void>;

    /**
     * @description
     * Clear the entire cache
     */
    clear(): void | Promise<void>;
}
