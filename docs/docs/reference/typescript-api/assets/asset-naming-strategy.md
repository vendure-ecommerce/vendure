---
title: "AssetNamingStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AssetNamingStrategy

<GenerationInfo sourceFile="packages/core/src/config/asset-naming-strategy/asset-naming-strategy.ts" sourceLine="18" packageName="@vendure/core" />

The AssetNamingStrategy determines how file names are generated based on the uploaded source file name,
as well as how to handle naming conflicts.

:::info

This is configured via the `assetOptions.assetNamingStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface AssetNamingStrategy extends InjectableStrategy {
    generateSourceFileName(ctx: RequestContext, originalFileName: string, conflictFileName?: string): string;
    generatePreviewFileName(ctx: RequestContext, sourceFileName: string, conflictFileName?: string): string;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### generateSourceFileName

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, originalFileName: string, conflictFileName?: string) => string`}   />

Given the original file name of the uploaded file, generate a file name to
be stored on the server. Operations like normalization and time-stamping can
be performed in this method.

The output will be checked for a naming conflict with an existing file. If a conflict
exists, this method will be invoked again with the second argument passed in and a new, unique
file name should then be generated. This process will repeat until a unique file name has
been returned.
### generatePreviewFileName

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, sourceFileName: string, conflictFileName?: string) => string`}   />

Given the source file name generated in the `generateSourceFileName` method, this method
should generate the file name of the preview image.

The same mechanism of checking for conflicts is used as described above.


</div>
