---
title: "AssetImportStrategy"
weight: 10
date: 2023-07-14T16:57:49.459Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AssetImportStrategy
<div class="symbol">


# AssetImportStrategy

{{< generation-info sourceFile="packages/core/src/config/asset-import-strategy/asset-import-strategy.ts" sourceLine="18" packageName="@vendure/core" since="1.7.0">}}

The AssetImportStrategy determines how asset files get imported based on the path given in the
import CSV or via the <a href='/typescript-api/import-export/asset-importer#assetimporter'>AssetImporter</a> `getAssets()` method.

The <a href='/typescript-api/import-export/default-asset-import-strategy#defaultassetimportstrategy'>DefaultAssetImportStrategy</a> is able to load files from either the local filesystem
or from a remote URL.

A custom strategy could be created which could e.g. get the asset file from an S3 bucket.

## Signature

```TypeScript
interface AssetImportStrategy extends InjectableStrategy {
  getStreamFromPath(assetPath: string): Readable | Promise<Readable>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### getStreamFromPath

{{< member-info kind="method" type="(assetPath: string) => Readable | Promise&#60;Readable&#62;"  >}}

{{< member-description >}}Given an asset path, this method should return a Stream of file data. This could
e.g. be read from a file system or fetch from a remote location.{{< /member-description >}}


</div>
