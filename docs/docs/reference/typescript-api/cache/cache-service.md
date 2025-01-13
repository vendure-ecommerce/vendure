---
title: "CacheService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CacheService

<GenerationInfo sourceFile="packages/core/src/cache/cache.service.ts" sourceLine="20" packageName="@vendure/core" since="3.1.0" />

The CacheService is used to cache data in order to optimize performance.

Internally it makes use of the configured <a href='/reference/typescript-api/cache/cache-strategy#cachestrategy'>CacheStrategy</a> to persist
the cache into a key-value store.

```ts title="Signature"
class CacheService {
    protected cacheStrategy: CacheStrategy;
    constructor(configService: ConfigService)
    createCache(config: CacheConfig) => Cache;
    get(key: string) => Promise<T | undefined>;
    set(key: string, value: T, options?: SetCacheKeyOptions) => Promise<void>;
    delete(key: string) => Promise<void>;
    invalidateTags(tags: string[]) => Promise<void>;
}
```

<div className="members-wrapper">

### cacheStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/cache/cache-strategy#cachestrategy'>CacheStrategy</a>`}   />


### constructor

<MemberInfo kind="method" type={`(configService: ConfigService) => CacheService`}   />


### createCache

<MemberInfo kind="method" type={`(config: <a href='/reference/typescript-api/cache/cache-config#cacheconfig'>CacheConfig</a>) => <a href='/reference/typescript-api/cache/#cache'>Cache</a>`}   />

Creates a new <a href='/reference/typescript-api/cache/#cache'>Cache</a> instance with the given configuration.

The `Cache` instance provides a convenience wrapper around the `CacheService`
methods.
### get

<MemberInfo kind="method" type={`(key: string) => Promise&#60;T | undefined&#62;`}   />

Gets an item from the cache, or returns undefined if the key is not found, or the
item has expired.
### set

<MemberInfo kind="method" type={`(key: string, value: T, options?: <a href='/reference/typescript-api/cache/cache-strategy#setcachekeyoptions'>SetCacheKeyOptions</a>) => Promise&#60;void&#62;`}   />

Sets a key-value pair in the cache. The value must be serializable, so cannot contain
things like functions, circular data structures, class instances etc.

Optionally a "time to live" (ttl) can be specified, which means that the key will
be considered stale after that many milliseconds.
### delete

<MemberInfo kind="method" type={`(key: string) => Promise&#60;void&#62;`}   />

Deletes an item from the cache.
### invalidateTags

<MemberInfo kind="method" type={`(tags: string[]) => Promise&#60;void&#62;`}   />

Deletes all items from the cache which contain at least one matching tag.


</div>
