---
title: "LocalAssetStorageStrategy"
weight: 10
date: 2023-07-14T16:57:50.683Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# LocalAssetStorageStrategy
<div class="symbol">


# LocalAssetStorageStrategy

{{< generation-info sourceFile="packages/asset-server-plugin/src/local-asset-storage-strategy.ts" sourceLine="15" packageName="@vendure/asset-server-plugin">}}

A persistence strategy which saves files to the local file system.

## Signature

```TypeScript
class LocalAssetStorageStrategy implements AssetStorageStrategy {
  toAbsoluteUrl: ((reqest: Request, identifier: string) => string) | undefined;
  constructor(uploadPath: string, toAbsoluteUrlFn?: (reqest: Request, identifier: string) => string)
  async writeFileFromStream(fileName: string, data: ReadStream) => Promise<string>;
  async writeFileFromBuffer(fileName: string, data: Buffer) => Promise<string>;
  fileExists(fileName: string) => Promise<boolean>;
  readFileToBuffer(identifier: string) => Promise<Buffer>;
  readFileToStream(identifier: string) => Promise<Stream>;
  deleteFile(identifier: string) => Promise<void>;
}
```
## Implements

 * <a href='/typescript-api/assets/asset-storage-strategy#assetstoragestrategy'>AssetStorageStrategy</a>


## Members

### toAbsoluteUrl

{{< member-info kind="property" type="((reqest: Request, identifier: string) =&#62; string) | undefined"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(uploadPath: string, toAbsoluteUrlFn?: (reqest: Request, identifier: string) =&#62; string) => LocalAssetStorageStrategy"  >}}

{{< member-description >}}{{< /member-description >}}

### writeFileFromStream

{{< member-info kind="method" type="(fileName: string, data: ReadStream) => Promise&#60;string&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### writeFileFromBuffer

{{< member-info kind="method" type="(fileName: string, data: Buffer) => Promise&#60;string&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### fileExists

{{< member-info kind="method" type="(fileName: string) => Promise&#60;boolean&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### readFileToBuffer

{{< member-info kind="method" type="(identifier: string) => Promise&#60;Buffer&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### readFileToStream

{{< member-info kind="method" type="(identifier: string) => Promise&#60;Stream&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### deleteFile

{{< member-info kind="method" type="(identifier: string) => Promise&#60;void&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
