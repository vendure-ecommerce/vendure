---
title: "AssetImporter"
weight: 10
date: 2023-07-20T13:56:14.979Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AssetImporter

<GenerationInfo sourceFile="packages/core/src/data-import/providers/asset-importer/asset-importer.ts" sourceLine="18" packageName="@vendure/core" />

This service creates new <a href='/typescript-api/entities/asset#asset'>Asset</a> entities based on string paths provided in the CSV
import format. The source files are resolved by joining the value of `importExportOptions.importAssetsDir`
with the asset path. This service is used internally by the <a href='/typescript-api/import-export/importer#importer'>Importer</a> service.

```ts title="Signature"
class AssetImporter {
  async getAssets(assetPaths: string[], ctx?: RequestContext) => Promise<{ assets: Asset[]; errors: string[] }>;
}
```

### getAssets

<MemberInfo kind="method" type="(assetPaths: string[], ctx?: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;{ assets: <a href='/typescript-api/entities/asset#asset'>Asset</a>[]; errors: string[] }&#62;"   />

Creates Asset entities for the given paths, using the assetMap cache to prevent the
creation of duplicates.
