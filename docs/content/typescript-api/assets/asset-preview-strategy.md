---
title: "AssetPreviewStrategy"
weight: 10
date: 2023-07-14T16:57:49.467Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AssetPreviewStrategy
<div class="symbol">


# AssetPreviewStrategy

{{< generation-info sourceFile="packages/core/src/config/asset-preview-strategy/asset-preview-strategy.ts" sourceLine="17" packageName="@vendure/core">}}

The AssetPreviewStrategy determines how preview images for assets are created. For image
assets, this would usually typically involve resizing to sensible dimensions. Other file types
could be previewed in a variety of ways, e.g.:
- waveform images generated for audio files
- preview images generated for pdf documents
- watermarks added to preview images

## Signature

```TypeScript
interface AssetPreviewStrategy extends InjectableStrategy {
  generatePreviewImage(ctx: RequestContext, mimeType: string, data: Buffer): Promise<Buffer>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### generatePreviewImage

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, mimeType: string, data: Buffer) => Promise&#60;Buffer&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
