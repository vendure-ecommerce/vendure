---
title: "RedisCachePlugin"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## RedisCachePlugin

<GenerationInfo sourceFile="packages/core/src/plugin/redis-cache-plugin/redis-cache-plugin.ts" sourceLine="17" packageName="@vendure/core" since="3.1.0" />

This plugin provides a Redis-based <a href='/reference/typescript-api/cache/redis-cache-strategy#rediscachestrategy'>RedisCacheStrategy</a> which stores cached items in a Redis instance.
This is a high-performance cache strategy which is suitable for production use, and is a drop-in
replacement for the <a href='/reference/typescript-api/cache/default-cache-plugin#defaultcacheplugin'>DefaultCachePlugin</a>.

```ts title="Signature"
class RedisCachePlugin {
    static options: RedisCachePluginInitOptions = {
        maxItemSizeInBytes: 128_000,
        redisOptions: {},
        namespace: 'vendure-cache',
    };
    init(options: RedisCachePluginInitOptions) => ;
}
```

<div className="members-wrapper">

### options

<MemberInfo kind="property" type={`RedisCachePluginInitOptions`}   />


### init

<MemberInfo kind="method" type={`(options: RedisCachePluginInitOptions) => `}   />




</div>
