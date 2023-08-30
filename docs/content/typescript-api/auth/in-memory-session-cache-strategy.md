---
title: "InMemorySessionCacheStrategy"
weight: 10
date: 2023-07-14T16:57:49.685Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# InMemorySessionCacheStrategy
<div class="symbol">


# InMemorySessionCacheStrategy

{{< generation-info sourceFile="packages/core/src/config/session-cache/in-memory-session-cache-strategy.ts" sourceLine="16" packageName="@vendure/core">}}

Caches session in memory, using a LRU cache implementation. Not suitable for
multi-server setups since the cache will be local to each instance, reducing
its effectiveness. By default the cache has a size of 1000, meaning that after
1000 sessions have been cached, any new sessions will cause the least-recently-used
session to be evicted (removed) from the cache.

The cache size can be configured by passing a different number to the constructor
function.

## Signature

```TypeScript
class InMemorySessionCacheStrategy implements SessionCacheStrategy {
  constructor(cacheSize?: number)
  delete(sessionToken: string) => ;
  get(sessionToken: string) => ;
  set(session: CachedSession) => ;
  clear() => ;
}
```
## Implements

 * <a href='/typescript-api/auth/session-cache-strategy#sessioncachestrategy'>SessionCacheStrategy</a>


## Members

### constructor

{{< member-info kind="method" type="(cacheSize?: number) => InMemorySessionCacheStrategy"  >}}

{{< member-description >}}{{< /member-description >}}

### delete

{{< member-info kind="method" type="(sessionToken: string) => "  >}}

{{< member-description >}}{{< /member-description >}}

### get

{{< member-info kind="method" type="(sessionToken: string) => "  >}}

{{< member-description >}}{{< /member-description >}}

### set

{{< member-info kind="method" type="(session: <a href='/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### clear

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
