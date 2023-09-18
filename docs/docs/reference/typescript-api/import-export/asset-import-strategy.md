---
title: "AssetImportStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AssetImportStrategy

<GenerationInfo sourceFile="packages/core/src/config/asset-import-strategy/asset-import-strategy.ts" sourceLine="25" packageName="@vendure/core" since="1.7.0" />

The AssetImportStrategy determines how asset files get imported based on the path given in the
import CSV or via the <a href='/reference/typescript-api/import-export/asset-importer#assetimporter'>AssetImporter</a> `getAssets()` method.

The <a href='/reference/typescript-api/import-export/default-asset-import-strategy#defaultassetimportstrategy'>DefaultAssetImportStrategy</a> is able to load files from either the local filesystem
or from a remote URL.

A custom strategy could be created which could e.g. get the asset file from an S3 bucket.

:::info

This is configured via the `importExportOptions.assetImportStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface AssetImportStrategy extends InjectableStrategy {
    getStreamFromPath(assetPath: string): Readable | Promise<Readable>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### getStreamFromPath

<MemberInfo kind="method" type={`(assetPath: string) => Readable | Promise&#60;Readable&#62;`}   />

Given an asset path, this method should return a Stream of file data. This could
e.g. be read from a file system or fetch from a remote location.


</div>
