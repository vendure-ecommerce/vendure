---
title: "HashedAssetNamingStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## HashedAssetNamingStrategy

<GenerationInfo sourceFile="packages/asset-server-plugin/src/hashed-asset-naming-strategy.ts" sourceLine="20" packageName="@vendure/asset-server-plugin" />

An extension of the <a href='/reference/typescript-api/assets/default-asset-naming-strategy#defaultassetnamingstrategy'>DefaultAssetNamingStrategy</a> which prefixes file names with
the type (`'source'` or `'preview'`) as well as a 2-character sub-directory based on
the md5 hash of the original file name.

This is an implementation of the technique knows as "hashed directory" file storage,
and the purpose is to reduce the number of files in a single directory, since a very large
number of files can lead to performance issues when reading and writing to that directory.

With this strategy, even with 200,000 total assets stored, each directory would
only contain less than 800 files.

```ts title="Signature"
class HashedAssetNamingStrategy extends DefaultAssetNamingStrategy {
    generateSourceFileName(ctx: RequestContext, originalFileName: string, conflictFileName?: string) => string;
    generatePreviewFileName(ctx: RequestContext, originalFileName: string, conflictFileName?: string) => string;
}
```
* Extends: <code><a href='/reference/typescript-api/assets/default-asset-naming-strategy#defaultassetnamingstrategy'>DefaultAssetNamingStrategy</a></code>



<div className="members-wrapper">

### generateSourceFileName

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, originalFileName: string, conflictFileName?: string) => string`}   />


### generatePreviewFileName

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, originalFileName: string, conflictFileName?: string) => string`}   />




</div>
