---
title: "AssetImporter"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AssetImporter

<GenerationInfo sourceFile="packages/core/src/data-import/providers/asset-importer/asset-importer.ts" sourceLine="17" packageName="@vendure/core" />

This service creates new <a href='/reference/typescript-api/entities/asset#asset'>Asset</a> entities based on string paths provided in the CSV
import format. The source files are resolved by joining the value of `importExportOptions.importAssetsDir`
with the asset path. This service is used internally by the <a href='/reference/typescript-api/import-export/importer#importer'>Importer</a> service.

```ts title="Signature"
class AssetImporter {
    getAssets(assetPaths: string[], ctx?: RequestContext) => Promise<{ assets: Asset[]; errors: string[] }>;
}
```

<div className="members-wrapper">

### getAssets

<MemberInfo kind="method" type={`(assetPaths: string[], ctx?: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;{ assets: <a href='/reference/typescript-api/entities/asset#asset'>Asset</a>[]; errors: string[] }&#62;`}   />

Creates Asset entities for the given paths, using the assetMap cache to prevent the
creation of duplicates.


</div>
