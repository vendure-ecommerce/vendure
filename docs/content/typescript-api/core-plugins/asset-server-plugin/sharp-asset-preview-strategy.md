---
title: "SharpAssetPreviewStrategy"
weight: 10
date: 2023-07-14T16:57:50.699Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# SharpAssetPreviewStrategy
<div class="symbol">


# SharpAssetPreviewStrategy

{{< generation-info sourceFile="packages/asset-server-plugin/src/sharp-asset-preview-strategy.ts" sourceLine="95" packageName="@vendure/asset-server-plugin">}}

This <a href='/typescript-api/assets/asset-preview-strategy#assetpreviewstrategy'>AssetPreviewStrategy</a> uses the [Sharp library](https://sharp.pixelplumbing.com/) to generate
preview images of uploaded binary files. For non-image binaries, a generic "file" icon with the mime type
overlay will be generated.

By default, this strategy will produce previews up to maximum dimensions of 1600 x 1600 pixels. The created
preview images will match the input format - so a source file in jpeg format will output a jpeg preview,
a webp source file will output a webp preview, and so on.

The settings for the outputs will default to Sharp's defaults (https://sharp.pixelplumbing.com/api-output).
However, it is possible to pass your own configurations to control the output of each format:

```TypeScript
AssetServerPlugin.init({
  previewStrategy: new SharpAssetPreviewStrategy({
    jpegOptions: { quality: 95 },
    webpOptions: { quality: 95 },
  }),
}),
```

## Signature

```TypeScript
class SharpAssetPreviewStrategy implements AssetPreviewStrategy {
  constructor(config?: SharpAssetPreviewConfig)
  async generatePreviewImage(ctx: RequestContext, mimeType: string, data: Buffer) => Promise<Buffer>;
}
```
## Implements

 * <a href='/typescript-api/assets/asset-preview-strategy#assetpreviewstrategy'>AssetPreviewStrategy</a>


## Members

### constructor

{{< member-info kind="method" type="(config?: <a href='/typescript-api/core-plugins/asset-server-plugin/sharp-asset-preview-strategy#sharpassetpreviewconfig'>SharpAssetPreviewConfig</a>) => SharpAssetPreviewStrategy"  >}}

{{< member-description >}}{{< /member-description >}}

### generatePreviewImage

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, mimeType: string, data: Buffer) => Promise&#60;Buffer&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# SharpAssetPreviewConfig

{{< generation-info sourceFile="packages/asset-server-plugin/src/sharp-asset-preview-strategy.ts" sourceLine="17" packageName="@vendure/asset-server-plugin">}}

This <a href='/typescript-api/assets/asset-preview-strategy#assetpreviewstrategy'>AssetPreviewStrategy</a> uses the [Sharp library](https://sharp.pixelplumbing.com/) to generate
preview images of uploaded binary files. For non-image binaries, a generic "file" icon with the mime type
overlay will be generated.

## Signature

```TypeScript
interface SharpAssetPreviewConfig {
  maxHeight?: number;
  maxWidth?: number;
  jpegOptions?: sharp.JpegOptions;
  pngOptions?: sharp.PngOptions;
  webpOptions?: sharp.WebpOptions;
  gifOptions?: sharp.GifOptions;
  avifOptions?: sharp.AvifOptions;
}
```
## Members

### maxHeight

{{< member-info kind="property" type="number" default="1600"  >}}

{{< member-description >}}The max height in pixels of a generated preview image.{{< /member-description >}}

### maxWidth

{{< member-info kind="property" type="number" default="1600"  >}}

{{< member-description >}}The max width in pixels of a generated preview image.{{< /member-description >}}

### jpegOptions

{{< member-info kind="property" type="sharp.JpegOptions"  since="1.7.0" >}}

{{< member-description >}}Set Sharp's options for encoding jpeg files: https://sharp.pixelplumbing.com/api-output#jpeg{{< /member-description >}}

### pngOptions

{{< member-info kind="property" type="sharp.PngOptions"  since="1.7.0" >}}

{{< member-description >}}Set Sharp's options for encoding png files: https://sharp.pixelplumbing.com/api-output#png{{< /member-description >}}

### webpOptions

{{< member-info kind="property" type="sharp.WebpOptions"  since="1.7.0" >}}

{{< member-description >}}Set Sharp's options for encoding webp files: https://sharp.pixelplumbing.com/api-output#webp{{< /member-description >}}

### gifOptions

{{< member-info kind="property" type="sharp.GifOptions"  since="1.7.0" >}}

{{< member-description >}}Set Sharp's options for encoding gif files: https://sharp.pixelplumbing.com/api-output#gif{{< /member-description >}}

### avifOptions

{{< member-info kind="property" type="sharp.AvifOptions"  since="1.7.0" >}}

{{< member-description >}}Set Sharp's options for encoding avif files: https://sharp.pixelplumbing.com/api-output#avif{{< /member-description >}}


</div>
