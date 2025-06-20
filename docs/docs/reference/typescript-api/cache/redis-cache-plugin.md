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

<GenerationInfo sourceFile="packages/core/src/plugin/redis-cache-plugin/redis-cache-plugin.ts" sourceLine="25" packageName="@vendure/core" since="3.1.0" />

This plugin provides a Redis-based <a href='/reference/typescript-api/cache/redis-cache-strategy#rediscachestrategy'>RedisCacheStrategy</a> which stores cached items in a Redis instance.
This is a high-performance cache strategy which is suitable for production use, and is a drop-in
replacement for the <a href='/reference/typescript-api/cache/default-cache-plugin#defaultcacheplugin'>DefaultCachePlugin</a>.

Note: To use this plugin, you need to manually install the `ioredis` package:

```shell
npm install ioredis@^5.3.2
```

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

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/cache/redis-cache-plugin#rediscacheplugininitoptions'>RedisCachePluginInitOptions</a>`}   />


### init

<MemberInfo kind="method" type={`(options: <a href='/reference/typescript-api/cache/redis-cache-plugin#rediscacheplugininitoptions'>RedisCachePluginInitOptions</a>) => `}   />




</div>


## RedisCachePluginInitOptions

<GenerationInfo sourceFile="packages/core/src/plugin/redis-cache-plugin/types.ts" sourceLine="9" packageName="@vendure/core" since="3.1.0" />

Configuration options for the <a href='/reference/typescript-api/cache/redis-cache-plugin#rediscacheplugin'>RedisCachePlugin</a>.

```ts title="Signature"
interface RedisCachePluginInitOptions {
    maxItemSizeInBytes?: number;
    namespace?: string;
    redisOptions?: import('ioredis').RedisOptions;
}
```

<div className="members-wrapper">

### maxItemSizeInBytes

<MemberInfo kind="property" type={`number`} default={`128kb`}   />

The maximum size of a single cache item in bytes. If a cache item exceeds this size, it will not be stored
and an error will be logged.
### namespace

<MemberInfo kind="property" type={`string`} default={`'vendure-cache'`}   />

The namespace to use for all keys stored in Redis. This can be useful if you are sharing a Redis instance
between multiple applications.
### redisOptions

<MemberInfo kind="property" type={`import('ioredis').RedisOptions`}   />

Options to pass to the `ioredis` Redis client.


</div>
