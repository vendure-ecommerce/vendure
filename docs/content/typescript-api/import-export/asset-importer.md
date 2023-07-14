---
title: "AssetImporter"
weight: 10
date: 2023-07-14T16:57:49.801Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AssetImporter
<div class="symbol">


# AssetImporter

{{< generation-info sourceFile="packages/core/src/data-import/providers/asset-importer/asset-importer.ts" sourceLine="18" packageName="@vendure/core">}}

This service creates new <a href='/typescript-api/entities/asset#asset'>Asset</a> entities based on string paths provided in the CSV
import format. The source files are resolved by joining the value of `importExportOptions.importAssetsDir`
with the asset path. This service is used internally by the <a href='/typescript-api/import-export/importer#importer'>Importer</a> service.

## Signature

```TypeScript
class AssetImporter {
  async getAssets(assetPaths: string[], ctx?: RequestContext) => Promise<{ assets: Asset[]; errors: string[] }>;
}
```
## Members

### getAssets

{{< member-info kind="method" type="(assetPaths: string[], ctx?: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;{ assets: <a href='/typescript-api/entities/asset#asset'>Asset</a>[]; errors: string[] }&#62;"  >}}

{{< member-description >}}Creates Asset entities for the given paths, using the assetMap cache to prevent the
creation of duplicates.{{< /member-description >}}


</div>
