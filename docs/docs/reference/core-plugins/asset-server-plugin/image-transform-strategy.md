---
title: "ImageTransformStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ImageTransformStrategy

<GenerationInfo sourceFile="packages/asset-server-plugin/src/config/image-transform-strategy.ts" sourceLine="56" packageName="@vendure/asset-server-plugin" since="3.1.0" />

An injectable strategy which is used to determine the parameters for transforming an image.
This can be used to implement custom image transformation logic, for example to
limit transform parameters to a known set of presets.

This is set via the `imageTransformStrategy` option in the AssetServerOptions. Multiple
strategies can be defined and will be executed in the order in which they are defined.

If a strategy throws an error, the image transformation will be aborted and the error
will be logged, with an HTTP 400 response sent to the client.

```ts title="Signature"
interface ImageTransformStrategy extends InjectableStrategy {
    getImageTransformParameters(
        args: GetImageTransformParametersArgs,
    ): Promise<ImageTransformParameters> | ImageTransformParameters;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### getImageTransformParameters

<MemberInfo kind="method" type={`(args: <a href='/reference/core-plugins/asset-server-plugin/image-transform-strategy#getimagetransformparametersargs'>GetImageTransformParametersArgs</a>) => Promise&#60;<a href='/reference/core-plugins/asset-server-plugin/image-transform-strategy#imagetransformparameters'>ImageTransformParameters</a>&#62; | <a href='/reference/core-plugins/asset-server-plugin/image-transform-strategy#imagetransformparameters'>ImageTransformParameters</a>`}   />

Given the input parameters, return the parameters which should be used to transform the image.


</div>


## ImageTransformParameters

<GenerationInfo sourceFile="packages/asset-server-plugin/src/config/image-transform-strategy.ts" sourceLine="14" packageName="@vendure/asset-server-plugin" since="3.1.0" />

Parameters which are used to transform the image.

```ts title="Signature"
interface ImageTransformParameters {
    width: number | undefined;
    height: number | undefined;
    mode: ImageTransformMode | undefined;
    quality: number | undefined;
    format: ImageTransformFormat | undefined;
    fpx: number | undefined;
    fpy: number | undefined;
    preset: string | undefined;
}
```

<div className="members-wrapper">

### width

<MemberInfo kind="property" type={`number | undefined`}   />


### height

<MemberInfo kind="property" type={`number | undefined`}   />


### mode

<MemberInfo kind="property" type={`<a href='/reference/core-plugins/asset-server-plugin/image-transform-mode#imagetransformmode'>ImageTransformMode</a> | undefined`}   />


### quality

<MemberInfo kind="property" type={`number | undefined`}   />


### format

<MemberInfo kind="property" type={`ImageTransformFormat | undefined`}   />


### fpx

<MemberInfo kind="property" type={`number | undefined`}   />


### fpy

<MemberInfo kind="property" type={`number | undefined`}   />


### preset

<MemberInfo kind="property" type={`string | undefined`}   />




</div>


## GetImageTransformParametersArgs

<GenerationInfo sourceFile="packages/asset-server-plugin/src/config/image-transform-strategy.ts" sourceLine="33" packageName="@vendure/asset-server-plugin" since="3.1.0" />

The arguments passed to the `getImageTransformParameters` method of an ImageTransformStrategy.

```ts title="Signature"
interface GetImageTransformParametersArgs {
    req: Request;
    availablePresets: ImageTransformPreset[];
    input: ImageTransformParameters;
}
```

<div className="members-wrapper">

### req

<MemberInfo kind="property" type={`Request`}   />


### availablePresets

<MemberInfo kind="property" type={`<a href='/reference/core-plugins/asset-server-plugin/image-transform-preset#imagetransformpreset'>ImageTransformPreset</a>[]`}   />


### input

<MemberInfo kind="property" type={`<a href='/reference/core-plugins/asset-server-plugin/image-transform-strategy#imagetransformparameters'>ImageTransformParameters</a>`}   />




</div>
