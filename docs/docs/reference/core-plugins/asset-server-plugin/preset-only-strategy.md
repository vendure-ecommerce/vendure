---
title: "PresetOnlyStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PresetOnlyStrategy

<GenerationInfo sourceFile="packages/asset-server-plugin/src/config/preset-only-strategy.ts" sourceLine="85" packageName="@vendure/asset-server-plugin" since="3.1.0" />

An <a href='/reference/core-plugins/asset-server-plugin/image-transform-strategy#imagetransformstrategy'>ImageTransformStrategy</a> which only allows transformations to be made using
presets which are defined in the available presets.

With this strategy enabled, requests to the asset server must include a `preset` parameter (or use the default preset)

This is valid: `http://localhost:3000/assets/some-asset.jpg?preset=medium`

This is invalid: `http://localhost:3000/assets/some-asset.jpg?w=200&h=200`, and the dimensions will be ignored.

The strategy can be configured to allow only certain quality values and formats, and to
optionally allow the focal point to be specified in the URL.

If a preset is not found in the available presets, an error will be thrown.

*Example*

```ts
import { AssetServerPlugin, PresetOnlyStrategy } from '@vendure/core';

// ...

AssetServerPlugin.init({
  //...
  imageTransformStrategy: new PresetOnlyStrategy({
    defaultPreset: 'thumbnail',
    permittedQuality: [0, 50, 75, 85, 95],
    permittedFormats: ['jpg', 'webp', 'avif'],
    allowFocalPoint: true,
  }),
});
```

```ts title="Signature"
class PresetOnlyStrategy implements ImageTransformStrategy {
    constructor(options: PresetOnlyStrategyOptions)
    getImageTransformParameters({
        input,
        availablePresets,
    }: GetImageTransformParametersArgs) => Promise<ImageTransformParameters> | ImageTransformParameters;
}
```
* Implements: <code><a href='/reference/core-plugins/asset-server-plugin/image-transform-strategy#imagetransformstrategy'>ImageTransformStrategy</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(options: <a href='/reference/core-plugins/asset-server-plugin/preset-only-strategy#presetonlystrategyoptions'>PresetOnlyStrategyOptions</a>) => PresetOnlyStrategy`}   />


### getImageTransformParameters

<MemberInfo kind="method" type={`({
        input,
        availablePresets,
    }: <a href='/reference/core-plugins/asset-server-plugin/image-transform-strategy#getimagetransformparametersargs'>GetImageTransformParametersArgs</a>) => Promise&#60;<a href='/reference/core-plugins/asset-server-plugin/image-transform-strategy#imagetransformparameters'>ImageTransformParameters</a>&#62; | <a href='/reference/core-plugins/asset-server-plugin/image-transform-strategy#imagetransformparameters'>ImageTransformParameters</a>`}   />




</div>


## PresetOnlyStrategyOptions

<GenerationInfo sourceFile="packages/asset-server-plugin/src/config/preset-only-strategy.ts" sourceLine="16" packageName="@vendure/asset-server-plugin" />

Configuration options for the <a href='/reference/core-plugins/asset-server-plugin/preset-only-strategy#presetonlystrategy'>PresetOnlyStrategy</a>.

```ts title="Signature"
interface PresetOnlyStrategyOptions {
    defaultPreset: string;
    permittedQuality?: number[];
    permittedFormats?: ImageTransformFormat[];
    allowFocalPoint?: boolean;
}
```

<div className="members-wrapper">

### defaultPreset

<MemberInfo kind="property" type={`string`}   />

The name of the default preset to use if no preset is specified in the URL.
### permittedQuality

<MemberInfo kind="property" type={`number[]`} default={`[0, 50, 75, 85, 95]`}   />

The permitted quality of the transformed images. If set to 'any', then any quality is permitted.
If set to an array of numbers (0-100), then only those quality values are permitted.
### permittedFormats

<MemberInfo kind="property" type={`ImageTransformFormat[]`} default={`['jpg', 'webp', 'avif']`}   />

The permitted formats of the transformed images. If set to 'any', then any format is permitted.
If set to an array of strings e.g. `['jpg', 'webp']`, then only those formats are permitted.
### allowFocalPoint

<MemberInfo kind="property" type={`boolean`} default={`false`}   />

Whether to allow the focal point to be specified in the URL.


</div>
