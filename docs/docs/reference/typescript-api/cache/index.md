---
title: "Cache"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Cache

<GenerationInfo sourceFile="packages/core/src/cache/cache.ts" sourceLine="72" packageName="@vendure/core" since="3.1.0" />

A convenience wrapper around the <a href='/reference/typescript-api/cache/cache-service#cacheservice'>CacheService</a> methods which provides a simple
API for caching and retrieving data.

The advantage of using the `Cache` class rather than directly calling the `CacheService`
methods is that it allows you to define a consistent way of generating cache keys and
to set default cache options, and takes care of setting the value in cache if it does not
already exist.

In most cases, using the `Cache` class will result in simpler and more readable code.

This class is normally created via the <a href='/reference/typescript-api/cache/cache-service#cacheservice'>CacheService</a>.`createCache()` method.

*Example*

```ts
const cache = cacheService.createCache({
  getKey: id => `ProductVariantIds:${id}`,
  options: {
    ttl: 1000 * 60 * 60,
    tags: ['products'],
  },
});

// This will fetch the value from the cache if it exists, or
// fetch it from the ProductService if not, and then cache
// using the key 'ProductVariantIds.${id}'.
const variantIds = await cache.get(id, async () => {
  const variants await ProductService.getVariantsByProductId(ctx, id) ;
  // The cached value must be serializable, so we just return the ids
  return variants.map(v => v.id);
});
```

```ts title="Signature"
class Cache {
    constructor(config: CacheConfig, cacheService: CacheService)
    get(id: string | number, getValueFn: () => T | Promise<T>) => Promise<T>;
    delete(id: string | number | Array<string | number>) => Promise<void>;
    invalidateTags(tags: string[]) => Promise<void>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(config: <a href='/reference/typescript-api/cache/cache-config#cacheconfig'>CacheConfig</a>, cacheService: <a href='/reference/typescript-api/cache/cache-service#cacheservice'>CacheService</a>) => Cache`}   />


### get

<MemberInfo kind="method" type={`(id: string | number, getValueFn: () =&#62; T | Promise&#60;T&#62;) => Promise&#60;T&#62;`}   />

Retrieves the value from the cache if it exists, otherwise calls the `getValueFn` function
to get the value, sets it in the cache and returns it.
### delete

<MemberInfo kind="method" type={`(id: string | number | Array&#60;string | number&#62;) => Promise&#60;void&#62;`}   />

Deletes one or more items from the cache.
### invalidateTags

<MemberInfo kind="method" type={`(tags: string[]) => Promise&#60;void&#62;`}   />

Invalidates one or more tags in the cache.


</div>
