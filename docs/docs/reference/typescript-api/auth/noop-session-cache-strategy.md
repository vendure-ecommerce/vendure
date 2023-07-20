---
title: "NoopSessionCacheStrategy"
weight: 10
date: 2023-07-14T16:57:49.688Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# NoopSessionCacheStrategy
<div class="symbol">


# NoopSessionCacheStrategy

{{< generation-info sourceFile="packages/core/src/config/session-cache/noop-session-cache-strategy.ts" sourceLine="10" packageName="@vendure/core">}}

A cache that doesn't cache. The cache lookup will miss every time
so the session will always be taken from the database.

## Signature

```TypeScript
class NoopSessionCacheStrategy implements SessionCacheStrategy {
  clear() => ;
  delete(sessionToken: string) => ;
  get(sessionToken: string) => ;
  set(session: CachedSession) => ;
}
```
## Implements

 * <a href='/typescript-api/auth/session-cache-strategy#sessioncachestrategy'>SessionCacheStrategy</a>


## Members

### clear

{{< member-info kind="method" type="() => "  >}}

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


</div>
