---
title: "SharpAssetPreviewStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SharpAssetPreviewStrategy

<GenerationInfo sourceFile="packages/asset-server-plugin/src/sharp-asset-preview-strategy.ts" sourceLine="95" packageName="@vendure/asset-server-plugin" />

This <a href='/reference/typescript-api/assets/asset-preview-strategy#assetpreviewstrategy'>AssetPreviewStrategy</a> uses the [Sharp library](https://sharp.pixelplumbing.com/) to generate
preview images of uploaded binary files. For non-image binaries, a generic "file" icon with the mime type
overlay will be generated.

By default, this strategy will produce previews up to maximum dimensions of 1600 x 1600 pixels. The created
preview images will match the input format - so a source file in jpeg format will output a jpeg preview,
a webp source file will output a webp preview, and so on.

The settings for the outputs will default to Sharp's defaults (https://sharp.pixelplumbing.com/api-output).
However, it is possible to pass your own configurations to control the output of each format:

```ts
AssetServerPlugin.init({
  previewStrategy: new SharpAssetPreviewStrategy({
    jpegOptions: { quality: 95 },
    webpOptions: { quality: 95 },
  }),
}),
```

```ts title="Signature"
class SharpAssetPreviewStrategy implements AssetPreviewStrategy {
    constructor(config?: SharpAssetPreviewConfig)
    generatePreviewImage(ctx: RequestContext, mimeType: string, data: Buffer) => Promise<Buffer>;
}
```
* Implements: <code><a href='/reference/typescript-api/assets/asset-preview-strategy#assetpreviewstrategy'>AssetPreviewStrategy</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(config?: <a href='/reference/core-plugins/asset-server-plugin/sharp-asset-preview-strategy#sharpassetpreviewconfig'>SharpAssetPreviewConfig</a>) => SharpAssetPreviewStrategy`}   />


### generatePreviewImage

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, mimeType: string, data: Buffer) => Promise&#60;Buffer&#62;`}   />




</div>


## SharpAssetPreviewConfig

<GenerationInfo sourceFile="packages/asset-server-plugin/src/sharp-asset-preview-strategy.ts" sourceLine="17" packageName="@vendure/asset-server-plugin" />

This <a href='/reference/typescript-api/assets/asset-preview-strategy#assetpreviewstrategy'>AssetPreviewStrategy</a> uses the [Sharp library](https://sharp.pixelplumbing.com/) to generate
preview images of uploaded binary files. For non-image binaries, a generic "file" icon with the mime type
overlay will be generated.

```ts title="Signature"
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

<div className="members-wrapper">

### maxHeight

<MemberInfo kind="property" type={`number`} default="1600"   />

The max height in pixels of a generated preview image.
### maxWidth

<MemberInfo kind="property" type={`number`} default="1600"   />

The max width in pixels of a generated preview image.
### jpegOptions

<MemberInfo kind="property" type={`sharp.JpegOptions`}  since="1.7.0"  />

Set Sharp's options for encoding jpeg files: https://sharp.pixelplumbing.com/api-output#jpeg
### pngOptions

<MemberInfo kind="property" type={`sharp.PngOptions`}  since="1.7.0"  />

Set Sharp's options for encoding png files: https://sharp.pixelplumbing.com/api-output#png
### webpOptions

<MemberInfo kind="property" type={`sharp.WebpOptions`}  since="1.7.0"  />

Set Sharp's options for encoding webp files: https://sharp.pixelplumbing.com/api-output#webp
### gifOptions

<MemberInfo kind="property" type={`sharp.GifOptions`}  since="1.7.0"  />

Set Sharp's options for encoding gif files: https://sharp.pixelplumbing.com/api-output#gif
### avifOptions

<MemberInfo kind="property" type={`sharp.AvifOptions`}  since="1.7.0"  />

Set Sharp's options for encoding avif files: https://sharp.pixelplumbing.com/api-output#avif


</div>
