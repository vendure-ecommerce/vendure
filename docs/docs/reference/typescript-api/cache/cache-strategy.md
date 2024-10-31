---
title: "CacheStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CacheStrategy

<GenerationInfo sourceFile="packages/core/src/config/system/cache-strategy.ts" sourceLine="36" packageName="@vendure/core" since="3.1.0" />

The CacheStrategy defines how the underlying shared cache mechanism is implemented.

It is used by the <a href='/reference/typescript-api/cache/cache-service#cacheservice'>CacheService</a> to take care of storage and retrieval of items
from the cache.

```ts title="Signature"
interface CacheStrategy extends InjectableStrategy {
    get<T extends JsonCompatible<T>>(key: string): Promise<T | undefined>;
    set<T extends JsonCompatible<T>>(key: string, value: T, options?: SetCacheKeyOptions): Promise<void>;
    delete(key: string): Promise<void>;
    invalidateTags(tags: string[]): Promise<void>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### get

<MemberInfo kind="method" type={`(key: string) => Promise&#60;T | undefined&#62;`}   />

Gets an item from the cache, or returns undefined if the key is not found, or the
item has expired.
### set

<MemberInfo kind="method" type={`(key: string, value: T, options?: SetCacheKeyOptions) => Promise&#60;void&#62;`}   />

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
