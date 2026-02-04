---
title: "DefaultSessionCacheStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultSessionCacheStrategy

<GenerationInfo sourceFile="packages/core/src/config/session-cache/default-session-cache-strategy.ts" sourceLine="17" packageName="@vendure/core" since="3.1.0" />

The default <a href='/reference/typescript-api/auth/session-cache-strategy#sessioncachestrategy'>SessionCacheStrategy</a> delegates to the configured
<a href='/reference/typescript-api/cache/cache-strategy#cachestrategy'>CacheStrategy</a> to store the session data. This should be suitable
for most use-cases, assuming you select a suitable <a href='/reference/typescript-api/cache/cache-strategy#cachestrategy'>CacheStrategy</a>

```ts title="Signature"
class DefaultSessionCacheStrategy implements SessionCacheStrategy {
    protected cacheService: CacheService;
    constructor(options?: {
            ttl?: number;
            cachePrefix?: string;
        })
    init(injector: Injector) => ;
    set(session: CachedSession) => Promise<void>;
    get(sessionToken: string) => Promise<CachedSession | undefined>;
    delete(sessionToken: string) => void | Promise<void>;
    clear() => Promise<void>;
}
```
* Implements: <code><a href='/reference/typescript-api/auth/session-cache-strategy#sessioncachestrategy'>SessionCacheStrategy</a></code>



<div className="members-wrapper">

### cacheService

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/cache/cache-service#cacheservice'>CacheService</a>`}   />


### constructor

<MemberInfo kind="method" type={`(options?: {             ttl?: number;             cachePrefix?: string;         }) => DefaultSessionCacheStrategy`}   />


### init

<MemberInfo kind="method" type={`(injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>) => `}   />


### set

<MemberInfo kind="method" type={`(session: <a href='/reference/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>) => Promise&#60;void&#62;`}   />


### get

<MemberInfo kind="method" type={`(sessionToken: string) => Promise&#60;<a href='/reference/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a> | undefined&#62;`}   />


### delete

<MemberInfo kind="method" type={`(sessionToken: string) => void | Promise&#60;void&#62;`}   />


### clear

<MemberInfo kind="method" type={`() => Promise&#60;void&#62;`}   />




</div>
