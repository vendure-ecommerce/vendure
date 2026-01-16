---
title: "InMemorySessionCacheStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## InMemorySessionCacheStrategy

<GenerationInfo sourceFile="packages/core/src/config/session-cache/in-memory-session-cache-strategy.ts" sourceLine="16" packageName="@vendure/core" />

Caches session in memory, using a LRU cache implementation. Not suitable for
multi-server setups since the cache will be local to each instance, reducing
its effectiveness. By default the cache has a size of 1000, meaning that after
1000 sessions have been cached, any new sessions will cause the least-recently-used
session to be evicted (removed) from the cache.

The cache size can be configured by passing a different number to the constructor
function.

```ts title="Signature"
class InMemorySessionCacheStrategy implements SessionCacheStrategy {
    constructor(cacheSize?: number)
    delete(sessionToken: string) => ;
    get(sessionToken: string) => ;
    set(session: CachedSession) => ;
    clear() => ;
}
```
* Implements: <code><a href='/reference/typescript-api/auth/session-cache-strategy#sessioncachestrategy'>SessionCacheStrategy</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(cacheSize?: number) => InMemorySessionCacheStrategy`}   />


### delete

<MemberInfo kind="method" type={`(sessionToken: string) => `}   />


### get

<MemberInfo kind="method" type={`(sessionToken: string) => `}   />


### set

<MemberInfo kind="method" type={`(session: <a href='/reference/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>) => `}   />


### clear

<MemberInfo kind="method" type={`() => `}   />




</div>
