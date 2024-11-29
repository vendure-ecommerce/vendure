---
title: "DefaultCachePlugin"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultCachePlugin

<GenerationInfo sourceFile="packages/core/src/plugin/default-cache-plugin/default-cache-plugin.ts" sourceLine="34" packageName="@vendure/core" since="3.1.0" />

This plugin provides a simple SQL-based cache strategy <a href='/reference/typescript-api/cache/sql-cache-strategy#sqlcachestrategy'>SqlCacheStrategy</a> which stores cached
items in the database.
It is suitable for production use (including multi-instance setups). For increased performance
you can also consider using the <a href='/reference/typescript-api/cache/redis-cache-plugin#rediscacheplugin'>RedisCachePlugin</a>.

```ts title="Signature"
class DefaultCachePlugin {
    static options: DefaultCachePluginInitOptions = {
        cacheSize: 10_000,
    };
    init(options: DefaultCachePluginInitOptions) => ;
}
```

<div className="members-wrapper">

### options

<MemberInfo kind="property" type={`DefaultCachePluginInitOptions`}   />


### init

<MemberInfo kind="method" type={`(options: DefaultCachePluginInitOptions) => `}   />




</div>
