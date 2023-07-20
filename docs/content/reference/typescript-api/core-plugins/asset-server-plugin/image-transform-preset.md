---
title: "ImageTransformPreset"
weight: 10
date: 2023-07-14T16:57:50.705Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ImageTransformPreset
<div class="symbol">


# ImageTransformPreset

{{< generation-info sourceFile="packages/asset-server-plugin/src/types.ts" sourceLine="39" packageName="@vendure/asset-server-plugin">}}

A configuration option for an image size preset for the AssetServerPlugin.

Presets allow a shorthand way to generate a thumbnail preview of an asset. For example,
the built-in "tiny" preset generates a 50px x 50px cropped preview, which can be accessed
by appending the string `preset=tiny` to the asset url:

`http://localhost:3000/assets/some-asset.jpg?preset=tiny`

is equivalent to:

`http://localhost:3000/assets/some-asset.jpg?w=50&h=50&mode=crop`

## Signature

```TypeScript
interface ImageTransformPreset {
  name: string;
  width: number;
  height: number;
  mode: ImageTransformMode;
}
```
## Members

### name

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### width

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### height

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### mode

{{< member-info kind="property" type="<a href='/typescript-api/core-plugins/asset-server-plugin/image-transform-mode#imagetransformmode'>ImageTransformMode</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
