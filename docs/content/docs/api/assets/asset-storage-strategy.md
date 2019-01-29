---
title: "AssetStorageStrategy"
weight: 10
generated: true
---
<!-- This file was generated from the Vendure TypeScript source. Do not modify. Instead, re-run "generate-docs" -->


# AssetStorageStrategy

The AssetPersistenceStrategy determines how Asset files are physically storedand retrieved.

### writeFileFromBuffer

{{< member-info type="(fileName: string, data: Buffer) => Promise&#60;string&#62;" >}}



### writeFileFromStream

{{< member-info type="(fileName: string, data: Stream) => Promise&#60;string&#62;" >}}



### readFileToBuffer

{{< member-info type="(identifier: string) => Promise&#60;Buffer&#62;" >}}



### readFileToStream

{{< member-info type="(identifier: string) => Promise&#60;Stream&#62;" >}}



### fileExists

{{< member-info type="(fileName: string) => Promise&#60;boolean&#62;" >}}



### toAbsoluteUrl

{{< member-info type="(reqest: Request, identifier: string) => string" >}}



