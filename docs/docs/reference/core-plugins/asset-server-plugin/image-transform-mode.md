---
title: "ImageTransformMode"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ImageTransformMode

<GenerationInfo sourceFile="packages/asset-server-plugin/src/types.ts" sourceLine="21" packageName="@vendure/asset-server-plugin" />

Specifies the way in which an asset preview image will be resized to fit in the
proscribed dimensions:

* crop: crops the image to cover both provided dimensions
* resize: Preserving aspect ratio, resizes the image to be as large as possible
while ensuring its dimensions are less than or equal to both those specified.

```ts title="Signature"
type ImageTransformMode = 'crop' | 'resize'
```
