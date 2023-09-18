---
title: "DefaultAssetImportStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultAssetImportStrategy

<GenerationInfo sourceFile="packages/core/src/config/asset-import-strategy/default-asset-import-strategy.ts" sourceLine="50" packageName="@vendure/core" since="1.7.0" />

The DefaultAssetImportStrategy is able to import paths from the local filesystem (taking into account the
`importExportOptions.importAssetsDir` setting) as well as remote http/https urls.

```ts title="Signature"
class DefaultAssetImportStrategy implements AssetImportStrategy {
    constructor(options?: {
            retryDelayMs: number;
            retryCount: number;
        })
    init(injector: Injector) => ;
    getStreamFromPath(assetPath: string) => ;
}
```
* Implements: <code><a href='/reference/typescript-api/import-export/asset-import-strategy#assetimportstrategy'>AssetImportStrategy</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(options?: {             retryDelayMs: number;             retryCount: number;         }) => DefaultAssetImportStrategy`}   />


### init

<MemberInfo kind="method" type={`(injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>) => `}   />


### getStreamFromPath

<MemberInfo kind="method" type={`(assetPath: string) => `}   />




</div>
