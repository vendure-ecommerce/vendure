---
title: "SessionCacheStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SessionCacheStrategy

<GenerationInfo sourceFile="packages/core/src/config/session-cache/session-cache-strategy.ts" sourceLine="155" packageName="@vendure/core" />

This strategy defines how sessions get cached. Since most requests will need the Session
object for permissions data, it can become a bottleneck to go to the database and do a multi-join
SQL query each time. Therefore, we cache the session data only perform the SQL query once and upon
invalidation of the cache.

The Vendure default is to use a the <a href='/reference/typescript-api/auth/in-memory-session-cache-strategy#inmemorysessioncachestrategy'>InMemorySessionCacheStrategy</a>, which is fast and suitable for
single-instance deployments. However, for multi-instance deployments (horizontally scaled, serverless etc.),
you will need to define a custom strategy that stores the session cache in a shared data store, such as in the
DB or in Redis.

:::info

This is configured via the `authOptions.sessionCacheStrategy` property of
your VendureConfig.

:::

Here's an example implementation using Redis. To use this, you need to add the
[ioredis package](https://www.npmjs.com/package/ioredis) as a dependency.

*Example*

```ts
import { CachedSession, Logger, SessionCacheStrategy, VendurePlugin } from '@vendure/core';
import { Redis, RedisOptions } from 'ioredis';

export interface RedisSessionCachePluginOptions {
  namespace?: string;
  redisOptions?: RedisOptions;
}
const loggerCtx = 'RedisSessionCacheStrategy';
const DEFAULT_NAMESPACE = 'vendure-session-cache';
const DEFAULT_TTL = 86400;

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
      await this.client.set(this.namespace(session.token), JSON.stringify(session), 'EX', DEFAULT_TTL);
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

```ts title="Signature"
interface SessionCacheStrategy extends InjectableStrategy {
    set(session: CachedSession): void | Promise<void>;
    get(sessionToken: string): CachedSession | undefined | Promise<CachedSession | undefined>;
    delete(sessionToken: string): void | Promise<void>;
    clear(): void | Promise<void>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### set

<MemberInfo kind="method" type={`(session: <a href='/reference/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>) => void | Promise&#60;void&#62;`}   />

Store the session in the cache. When caching a session, the data
should not be modified apart from performing any transforms needed to
get it into a state to be stored, e.g. JSON.stringify().
### get

<MemberInfo kind="method" type={`(sessionToken: string) => <a href='/reference/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a> | undefined | Promise&#60;<a href='/reference/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a> | undefined&#62;`}   />

Retrieve the session from the cache
### delete

<MemberInfo kind="method" type={`(sessionToken: string) => void | Promise&#60;void&#62;`}   />

Delete a session from the cache
### clear

<MemberInfo kind="method" type={`() => void | Promise&#60;void&#62;`}   />

Clear the entire cache


</div>


## CachedSessionUser

<GenerationInfo sourceFile="packages/core/src/config/session-cache/session-cache-strategy.ts" sourceLine="14" packageName="@vendure/core" />

A simplified representation of the User associated with the
current Session.

```ts title="Signature"
type CachedSessionUser = {
    id: ID;
    identifier: string;
    verified: boolean;
    channelPermissions: UserChannelPermissions[];
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### identifier

<MemberInfo kind="property" type={`string`}   />


### verified

<MemberInfo kind="property" type={`boolean`}   />


### channelPermissions

<MemberInfo kind="property" type={`UserChannelPermissions[]`}   />




</div>


## CachedSession

<GenerationInfo sourceFile="packages/core/src/config/session-cache/session-cache-strategy.ts" sourceLine="29" packageName="@vendure/core" />

A simplified representation of a Session which is easy to
store.

```ts title="Signature"
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

<div className="members-wrapper">

### cacheExpiry

<MemberInfo kind="property" type={`number`}   />

The timestamp after which this cache entry is considered stale and
a fresh copy of the data will be set. Based on the `sessionCacheTTL`
option.
### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### token

<MemberInfo kind="property" type={`string`}   />


### expires

<MemberInfo kind="property" type={`Date`}   />


### activeOrderId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### authenticationStrategy

<MemberInfo kind="property" type={`string`}   />


### user

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/auth/session-cache-strategy#cachedsessionuser'>CachedSessionUser</a>`}   />


### activeChannelId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />




</div>
