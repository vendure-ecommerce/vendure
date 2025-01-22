---
title: "CacheConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CacheConfig

<GenerationInfo sourceFile="packages/core/src/cache/cache.ts" sourceLine="14" packageName="@vendure/core" since="3.1.0" />

Configuration for a new <a href='/reference/typescript-api/cache/#cache'>Cache</a> instance.

```ts title="Signature"
interface CacheConfig {
    getKey: (id: string | number) => string;
    options?: SetCacheKeyOptions;
}
```

<div className="members-wrapper">

### getKey

<MemberInfo kind="property" type={`(id: string | number) =&#62; string`}   />

A function which generates a cache key from the given id.
This key will be used to store the value in the cache.

By convention, the key should be namespaced to avoid conflicts.

*Example*

```ts
getKey: id => `MyStrategy:getProductVariantIds:${id}`,
```
### options

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/cache/cache-strategy#setcachekeyoptions'>SetCacheKeyOptions</a>`}   />

Options available when setting the value in the cache.


</div>
