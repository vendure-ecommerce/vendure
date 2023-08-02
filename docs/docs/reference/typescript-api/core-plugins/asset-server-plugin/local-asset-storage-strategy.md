---
title: "LocalAssetStorageStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## LocalAssetStorageStrategy

<GenerationInfo sourceFile="packages/asset-server-plugin/src/local-asset-storage-strategy.ts" sourceLine="15" packageName="@vendure/asset-server-plugin" />

A persistence strategy which saves files to the local file system.

```ts title="Signature"
class LocalAssetStorageStrategy implements AssetStorageStrategy {
    toAbsoluteUrl: ((reqest: Request, identifier: string) => string) | undefined;
    constructor(uploadPath: string, toAbsoluteUrlFn?: (reqest: Request, identifier: string) => string)
    writeFileFromStream(fileName: string, data: ReadStream) => Promise<string>;
    writeFileFromBuffer(fileName: string, data: Buffer) => Promise<string>;
    fileExists(fileName: string) => Promise<boolean>;
    readFileToBuffer(identifier: string) => Promise<Buffer>;
    readFileToStream(identifier: string) => Promise<Stream>;
    deleteFile(identifier: string) => Promise<void>;
}
```
* Implements: <code><a href='/reference/typescript-api/assets/asset-storage-strategy#assetstoragestrategy'>AssetStorageStrategy</a></code>



<div className="members-wrapper">

### toAbsoluteUrl

<MemberInfo kind="property" type={`((reqest: Request, identifier: string) =&#62; string) | undefined`}   />


### constructor

<MemberInfo kind="method" type={`(uploadPath: string, toAbsoluteUrlFn?: (reqest: Request, identifier: string) =&#62; string) => LocalAssetStorageStrategy`}   />


### writeFileFromStream

<MemberInfo kind="method" type={`(fileName: string, data: ReadStream) => Promise&#60;string&#62;`}   />


### writeFileFromBuffer

<MemberInfo kind="method" type={`(fileName: string, data: Buffer) => Promise&#60;string&#62;`}   />


### fileExists

<MemberInfo kind="method" type={`(fileName: string) => Promise&#60;boolean&#62;`}   />


### readFileToBuffer

<MemberInfo kind="method" type={`(identifier: string) => Promise&#60;Buffer&#62;`}   />


### readFileToStream

<MemberInfo kind="method" type={`(identifier: string) => Promise&#60;Stream&#62;`}   />


### deleteFile

<MemberInfo kind="method" type={`(identifier: string) => Promise&#60;void&#62;`}   />




</div>
