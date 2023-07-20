---
title: "AssetPreviewStrategy"
weight: 10
date: 2023-07-20T13:56:14.265Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AssetPreviewStrategy

<GenerationInfo sourceFile="packages/core/src/config/asset-preview-strategy/asset-preview-strategy.ts" sourceLine="17" packageName="@vendure/core" />

The AssetPreviewStrategy determines how preview images for assets are created. For image
assets, this would usually typically involve resizing to sensible dimensions. Other file types
could be previewed in a variety of ways, e.g.:
- waveform images generated for audio files
- preview images generated for pdf documents
- watermarks added to preview images

```ts title="Signature"
interface AssetPreviewStrategy extends InjectableStrategy {
  generatePreviewImage(ctx: RequestContext, mimeType: string, data: Buffer): Promise<Buffer>;
}
```
Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>



### generatePreviewImage

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, mimeType: string, data: Buffer) => Promise&#60;Buffer&#62;"   />


