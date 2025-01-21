---
title: "RedisCacheStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## RedisCacheStrategy

<GenerationInfo sourceFile="packages/core/src/plugin/redis-cache-plugin/redis-cache-strategy.ts" sourceLine="17" packageName="@vendure/core" since="3.1.0" />

A <a href='/reference/typescript-api/cache/cache-strategy#cachestrategy'>CacheStrategy</a> which stores cached items in a Redis instance.
This is a high-performance cache strategy which is suitable for production use.

```ts title="Signature"
class RedisCacheStrategy implements CacheStrategy {
    constructor(options: RedisCachePluginInitOptions)
    init() => ;
    destroy() => ;
    get(key: string) => Promise<T | undefined>;
    set(key: string, value: T, options?: SetCacheKeyOptions) => Promise<void>;
    delete(key: string) => Promise<void>;
    invalidateTags(tags: string[]) => Promise<void>;
}
```
* Implements: <code><a href='/reference/typescript-api/cache/cache-strategy#cachestrategy'>CacheStrategy</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(options: <a href='/reference/typescript-api/cache/redis-cache-plugin#rediscacheplugininitoptions'>RedisCachePluginInitOptions</a>) => RedisCacheStrategy`}   />


### init

<MemberInfo kind="method" type={`() => `}   />


### destroy

<MemberInfo kind="method" type={`() => `}   />


### get

<MemberInfo kind="method" type={`(key: string) => Promise&#60;T | undefined&#62;`}   />


### set

<MemberInfo kind="method" type={`(key: string, value: T, options?: <a href='/reference/typescript-api/cache/cache-strategy#setcachekeyoptions'>SetCacheKeyOptions</a>) => Promise&#60;void&#62;`}   />


### delete

<MemberInfo kind="method" type={`(key: string) => Promise&#60;void&#62;`}   />


### invalidateTags

<MemberInfo kind="method" type={`(tags: string[]) => Promise&#60;void&#62;`}   />




</div>
