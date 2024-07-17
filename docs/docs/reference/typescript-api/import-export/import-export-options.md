---
title: "ImportExportOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ImportExportOptions

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="889" packageName="@vendure/core" />

Options related to importing & exporting data.

```ts title="Signature"
interface ImportExportOptions {
    importAssetsDir?: string;
    assetImportStrategy?: AssetImportStrategy;
}
```

<div className="members-wrapper">

### importAssetsDir

<MemberInfo kind="property" type={`string`} default={`__dirname`}   />

The directory in which assets to be imported are located.
### assetImportStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/import-export/asset-import-strategy#assetimportstrategy'>AssetImportStrategy</a>`}  since="1.7.0"  />

This strategy determines how asset files get imported based on the path given in the
import CSV or via the <a href='/reference/typescript-api/import-export/asset-importer#assetimporter'>AssetImporter</a> `getAssets()` method.


</div>
