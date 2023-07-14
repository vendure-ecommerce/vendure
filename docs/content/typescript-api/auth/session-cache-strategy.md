---
title: "SessionCacheStrategy"
weight: 10
date: 2023-07-14T16:57:49.690Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# SessionCacheStrategy
<div class="symbol">


# SessionCacheStrategy

{{< generation-info sourceFile="packages/core/src/config/session-cache/session-cache-strategy.ts" sourceLine="147" packageName="@vendure/core">}}

This strategy defines how sessions get cached. Since most requests will need the Session
object for permissions data, it can become a bottleneck to go to the database and do a multi-join
SQL query each time. Therefore, we cache the session data only perform the SQL query once and upon
invalidation of the cache.

The Vendure default is to use a the <a href='/typescript-api/auth/in-memory-session-cache-strategy#inmemorysessioncachestrategy'>InMemorySessionCacheStrategy</a>, which is fast and suitable for
single-instance deployments. However, for multi-instance deployments (horizontally scaled, serverless etc.),
you will need to define a custom strategy that stores the session cache in a shared data store, such as in the
DB or in Redis.

Here's an example implementation using Redis. To use this, you need to add the
[ioredis package](https://www.npmjs.com/package/ioredis) as a dependency.

*Example*

```TypeScript
import { CachedSession, Logger, SessionCacheStrategy, VendurePlugin } from '@vendure/core';
import { Redis, RedisOptions } from 'ioredis';

export interface RedisSessionCachePluginOptions {
  namespace?: string;
  redisOptions?: RedisOptions;
}
const loggerCtx = 'RedisSessionCacheStrategy';
const DEFAULT_NAMESPACE = 'vendure-session-cache';

export class RedisSessionCacheStrategy implements SessionCacheStrategy {
  private client: Redis;
  constructor(private options: RedisSessionCachePluginOptions) {}

  init() {
    this.client = new Redis(this.options.redisOptions as RedisOptions);
    this.client.on('error', err => Logger.error(err.message, loggerCtx, err.stack));
  }

  async destroy() {
    await this.client.quit();
  }

  async get(sessionToken: string): Promise<CachedSession | undefined> {
    try {
      const retrieved = await this.client.get(this.namespace(sessionToken));
      if (retrieved) {
        try {
          return JSON.parse(retrieved);
        } catch (e: any) {
          Logger.error(`Could not parse cached session data: ${e.message}`, loggerCtx);
        }
      }
    } catch (e: any) {
      Logger.error(`Could not get cached session: ${e.message}`, loggerCtx);
    }
  }

  async set(session: CachedSession) {
    try {
      await this.client.set(this.namespace(session.token), JSON.stringify(session));
    } catch (e: any) {
      Logger.error(`Could not set cached session: ${e.message}`, loggerCtx);
    }
  }

  async delete(sessionToken: string) {
    try {
      await this.client.del(this.namespace(sessionToken));
    } catch (e: any) {
      Logger.error(`Could not delete cached session: ${e.message}`, loggerCtx);
    }
  }

  clear() {
    // not implemented
  }

  private namespace(key: string) {
    return `${this.options.namespace ?? DEFAULT_NAMESPACE}:${key}`;
  }
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
```

## Signature

```TypeScript
interface SessionCacheStrategy extends InjectableStrategy {
  set(session: CachedSession): void | Promise<void>;
  get(sessionToken: string): CachedSession | undefined | Promise<CachedSession | undefined>;
  delete(sessionToken: string): void | Promise<void>;
  clear(): void | Promise<void>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### set

{{< member-info kind="method" type="(session: <a href='/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>) => void | Promise&#60;void&#62;"  >}}

{{< member-description >}}Store the session in the cache. When caching a session, the data
should not be modified apart from performing any transforms needed to
get it into a state to be stored, e.g. JSON.stringify().{{< /member-description >}}

### get

{{< member-info kind="method" type="(sessionToken: string) => <a href='/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a> | undefined | Promise&#60;<a href='/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a> | undefined&#62;"  >}}

{{< member-description >}}Retrieve the session from the cache{{< /member-description >}}

### delete

{{< member-info kind="method" type="(sessionToken: string) => void | Promise&#60;void&#62;"  >}}

{{< member-description >}}Delete a session from the cache{{< /member-description >}}

### clear

{{< member-info kind="method" type="() => void | Promise&#60;void&#62;"  >}}

{{< member-description >}}Clear the entire cache{{< /member-description >}}


</div>
<div class="symbol">


# CachedSessionUser

{{< generation-info sourceFile="packages/core/src/config/session-cache/session-cache-strategy.ts" sourceLine="14" packageName="@vendure/core">}}

A simplified representation of the User associated with the
current Session.

## Signature

```TypeScript
type CachedSessionUser = {
  id: ID;
  identifier: string;
  verified: boolean;
  channelPermissions: UserChannelPermissions[];
}
```
## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### identifier

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### verified

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### channelPermissions

{{< member-info kind="property" type="UserChannelPermissions[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CachedSession

{{< generation-info sourceFile="packages/core/src/config/session-cache/session-cache-strategy.ts" sourceLine="29" packageName="@vendure/core">}}

A simplified representation of a Session which is easy to
store.

## Signature

```TypeScript
type CachedSession = {
  cacheExpiry: number;
  id: ID;
  token: string;
  expires: Date;
  activeOrderId?: ID;
  authenticationStrategy?: string;
  user?: CachedSessionUser;
  activeChannelId?: ID;
}
```
## Members

### cacheExpiry

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The timestamp after which this cache entry is considered stale and
a fresh copy of the data will be set. Based on the `sessionCacheTTL`
option.{{< /member-description >}}

### id

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### token

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### expires

{{< member-info kind="property" type="Date"  >}}

{{< member-description >}}{{< /member-description >}}

### activeOrderId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### authenticationStrategy

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### user

{{< member-info kind="property" type="<a href='/typescript-api/auth/session-cache-strategy#cachedsessionuser'>CachedSessionUser</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### activeChannelId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
