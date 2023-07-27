---
title: "DefaultAssetImportStrategy"
weight: 10
date: 2023-07-14T16:57:49.460Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultAssetImportStrategy
<div class="symbol">


# DefaultAssetImportStrategy

{{< generation-info sourceFile="packages/core/src/config/asset-import-strategy/default-asset-import-strategy.ts" sourceLine="50" packageName="@vendure/core" since="1.7.0">}}

The DefaultAssetImportStrategy is able to import paths from the local filesystem (taking into account the
`importExportOptions.importAssetsDir` setting) as well as remote http/https urls.

## Signature

```TypeScript
class DefaultAssetImportStrategy implements AssetImportStrategy {
  constructor(options?: {
            retryDelayMs: number;
            retryCount: number;
        })
  init(injector: Injector) => ;
  getStreamFromPath(assetPath: string) => ;
}
```
## Implements

 * <a href='/typescript-api/import-export/asset-import-strategy#assetimportstrategy'>AssetImportStrategy</a>


## Members

### constructor

{{< member-info kind="method" type="(options?: {             retryDelayMs: number;             retryCount: number;         }) => DefaultAssetImportStrategy"  >}}

{{< member-description >}}{{< /member-description >}}

### init

{{< member-info kind="method" type="(injector: <a href='/typescript-api/common/injector#injector'>Injector</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### getStreamFromPath

{{< member-info kind="method" type="(assetPath: string) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
