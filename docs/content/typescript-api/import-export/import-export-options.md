---
title: "ImportExportOptions"
weight: 10
date: 2023-07-14T16:57:49.766Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ImportExportOptions
<div class="symbol">


# ImportExportOptions

{{< generation-info sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="848" packageName="@vendure/core">}}

Options related to importing & exporting data.

## Signature

```TypeScript
interface ImportExportOptions {
  importAssetsDir?: string;
  assetImportStrategy?: AssetImportStrategy;
}
```
## Members

### importAssetsDir

{{< member-info kind="property" type="string" default="__dirname"  >}}

{{< member-description >}}The directory in which assets to be imported are located.{{< /member-description >}}

### assetImportStrategy

{{< member-info kind="property" type="<a href='/typescript-api/import-export/asset-import-strategy#assetimportstrategy'>AssetImportStrategy</a>"  since="1.7.0" >}}

{{< member-description >}}This strategy determines how asset files get imported based on the path given in the
import CSV or via the <a href='/typescript-api/import-export/asset-importer#assetimporter'>AssetImporter</a> `getAssets()` method.{{< /member-description >}}


</div>
