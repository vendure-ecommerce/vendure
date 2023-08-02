---
title: "DefaultAssetNamingStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultAssetNamingStrategy

<GenerationInfo sourceFile="packages/core/src/config/asset-naming-strategy/default-asset-naming-strategy.ts" sourceLine="15" packageName="@vendure/core" />

The default strategy normalizes the file names to remove unwanted characters and
in the case of conflicts, increments a counter suffix.

```ts title="Signature"
class DefaultAssetNamingStrategy implements AssetNamingStrategy {
    generateSourceFileName(ctx: RequestContext, originalFileName: string, conflictFileName?: string) => string;
    generatePreviewFileName(ctx: RequestContext, sourceFileName: string, conflictFileName?: string) => string;
}
```
* Implements: <code><a href='/reference/typescript-api/assets/asset-naming-strategy#assetnamingstrategy'>AssetNamingStrategy</a></code>



<div className="members-wrapper">

### generateSourceFileName

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, originalFileName: string, conflictFileName?: string) => string`}   />


### generatePreviewFileName

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, sourceFileName: string, conflictFileName?: string) => string`}   />




</div>
