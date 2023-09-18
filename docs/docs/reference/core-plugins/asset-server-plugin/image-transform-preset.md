---
title: "ImageTransformPreset"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ImageTransformPreset

<GenerationInfo sourceFile="packages/asset-server-plugin/src/types.ts" sourceLine="39" packageName="@vendure/asset-server-plugin" />

A configuration option for an image size preset for the AssetServerPlugin.

Presets allow a shorthand way to generate a thumbnail preview of an asset. For example,
the built-in "tiny" preset generates a 50px x 50px cropped preview, which can be accessed
by appending the string `preset=tiny` to the asset url:

`http://localhost:3000/assets/some-asset.jpg?preset=tiny`

is equivalent to:

`http://localhost:3000/assets/some-asset.jpg?w=50&h=50&mode=crop`

```ts title="Signature"
interface ImageTransformPreset {
    name: string;
    width: number;
    height: number;
    mode: ImageTransformMode;
}
```

<div className="members-wrapper">

### name

<MemberInfo kind="property" type={`string`}   />


### width

<MemberInfo kind="property" type={`number`}   />


### height

<MemberInfo kind="property" type={`number`}   />


### mode

<MemberInfo kind="property" type={`<a href='/reference/core-plugins/asset-server-plugin/image-transform-mode#imagetransformmode'>ImageTransformMode</a>`}   />




</div>
