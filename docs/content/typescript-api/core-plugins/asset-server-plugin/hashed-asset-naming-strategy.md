---
title: "HashedAssetNamingStrategy"
weight: 10
date: 2023-07-14T16:57:50.681Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# HashedAssetNamingStrategy
<div class="symbol">


# HashedAssetNamingStrategy

{{< generation-info sourceFile="packages/asset-server-plugin/src/hashed-asset-naming-strategy.ts" sourceLine="20" packageName="@vendure/asset-server-plugin">}}

An extension of the <a href='/typescript-api/assets/default-asset-naming-strategy#defaultassetnamingstrategy'>DefaultAssetNamingStrategy</a> which prefixes file names with
the type (`'source'` or `'preview'`) as well as a 2-character sub-directory based on
the md5 hash of the original file name.

This is an implementation of the technique knows as "hashed directory" file storage,
and the purpose is to reduce the number of files in a single directory, since a very large
number of files can lead to performance issues when reading and writing to that directory.

With this strategy, even with 200,000 total assets stored, each directory would
only contain less than 800 files.

## Signature

```TypeScript
class HashedAssetNamingStrategy extends DefaultAssetNamingStrategy {
  generateSourceFileName(ctx: RequestContext, originalFileName: string, conflictFileName?: string) => string;
  generatePreviewFileName(ctx: RequestContext, originalFileName: string, conflictFileName?: string) => string;
}
```
## Extends

 * <a href='/typescript-api/assets/default-asset-naming-strategy#defaultassetnamingstrategy'>DefaultAssetNamingStrategy</a>


## Members

### generateSourceFileName

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, originalFileName: string, conflictFileName?: string) => string"  >}}

{{< member-description >}}{{< /member-description >}}

### generatePreviewFileName

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, originalFileName: string, conflictFileName?: string) => string"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
