---
title: "ImageTransformMode"
weight: 10
date: 2023-07-14T16:57:50.705Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ImageTransformMode
<div class="symbol">


# ImageTransformMode

{{< generation-info sourceFile="packages/asset-server-plugin/src/types.ts" sourceLine="21" packageName="@vendure/asset-server-plugin">}}

Specifies the way in which an asset preview image will be resized to fit in the
proscribed dimensions:

* crop: crops the image to cover both provided dimensions
* resize: Preserving aspect ratio, resizes the image to be as large as possible
while ensuring its dimensions are less than or equal to both those specified.

## Signature

```TypeScript
type ImageTransformMode = 'crop' | 'resize'
```
</div>
