---
title: "CacheConfig"
weight: 10
date: 2023-07-14T16:57:50.707Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# CacheConfig
<div class="symbol">


# CacheConfig

{{< generation-info sourceFile="packages/asset-server-plugin/src/types.ts" sourceLine="52" packageName="@vendure/asset-server-plugin">}}

A configuration option for the Cache-Control header in the AssetServerPlugin asset response.

## Signature

```TypeScript
type CacheConfig = {
  maxAge: number;
  restriction?: 'public' | 'private';
}
```
## Members

### maxAge

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The max-age=N response directive indicates that the response remains fresh until N seconds after the response is generated.{{< /member-description >}}

### restriction

{{< member-info kind="property" type="'public' | 'private'"  >}}

{{< member-description >}}The `private` response directive indicates that the response can be stored only in a private cache (e.g. local caches in browsers).
The `public` response directive indicates that the response can be stored in a shared cache.{{< /member-description >}}


</div>
