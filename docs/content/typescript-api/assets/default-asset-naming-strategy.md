---
title: "DefaultAssetNamingStrategy"
weight: 10
date: 2023-07-14T16:57:49.465Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultAssetNamingStrategy
<div class="symbol">


# DefaultAssetNamingStrategy

{{< generation-info sourceFile="packages/core/src/config/asset-naming-strategy/default-asset-naming-strategy.ts" sourceLine="15" packageName="@vendure/core">}}

The default strategy normalizes the file names to remove unwanted characters and
in the case of conflicts, increments a counter suffix.

## Signature

```TypeScript
class DefaultAssetNamingStrategy implements AssetNamingStrategy {
  generateSourceFileName(ctx: RequestContext, originalFileName: string, conflictFileName?: string) => string;
  generatePreviewFileName(ctx: RequestContext, sourceFileName: string, conflictFileName?: string) => string;
}
```
## Implements

 * <a href='/typescript-api/assets/asset-naming-strategy#assetnamingstrategy'>AssetNamingStrategy</a>


## Members

### generateSourceFileName

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, originalFileName: string, conflictFileName?: string) => string"  >}}

{{< member-description >}}{{< /member-description >}}

### generatePreviewFileName

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, sourceFileName: string, conflictFileName?: string) => string"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
