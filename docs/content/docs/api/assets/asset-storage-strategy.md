---
title: "AssetStorageStrategy"
weight: 10
date: 2019-01-30T10:57:03.707Z
generated: true
---
<!-- This file was generated from the Vendure TypeScript source. Do not modify. Instead, re-run "generate-docs" -->


# AssetStorageStrategy

{{< generation-info source="/server/src/config/asset-storage-strategy/asset-storage-strategy.ts">}}

The AssetPersistenceStrategy determines how Asset files are physically storedand retrieved.

### writeFileFromBuffer

{{< member-info kind="method" type="(fileName: string, data: Buffer) => Promise&#60;string&#62;" >}}



### writeFileFromStream

{{< member-info kind="method" type="(fileName: string, data: Stream) => Promise&#60;string&#62;" >}}



### readFileToBuffer

{{< member-info kind="method" type="(identifier: string) => Promise&#60;Buffer&#62;" >}}



### readFileToStream

{{< member-info kind="method" type="(identifier: string) => Promise&#60;Stream&#62;" >}}



### fileExists

{{< member-info kind="method" type="(fileName: string) => Promise&#60;boolean&#62;" >}}



### toAbsoluteUrl

{{< member-info kind="method" type="(reqest: Request, identifier: string) => string" >}}



