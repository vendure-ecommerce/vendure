---
title: "VendureImage"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## VendureImage

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/vendure-image.tsx" sourceLine="141" packageName="@vendure/dashboard" since="3.4.0" />

A component for displaying an image from a Vendure asset.

Supports the following features:

* Presets
* Cropping
* Resizing
* Formatting
* Quality
* Focal point
* Fallback

*Example*

```tsx
 <VendureImage
     asset={asset}
     preset="thumb"
     className="w-full h-full object-contain"
 />
```

```ts title="Signature"
function VendureImage(props: VendureImageProps): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`<a href='/reference/dashboard/components/vendure-image#vendureimageprops'>VendureImageProps</a>`} />



## VendureImageProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/vendure-image.tsx" sourceLine="59" packageName="@vendure/dashboard" since="3.4.0" />

The props for the <a href='/reference/dashboard/components/vendure-image#vendureimage'>VendureImage</a> component.

```ts title="Signature"
interface VendureImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    asset: AssetLike | null | undefined;
    preset?: ImagePreset;
    mode?: ImageMode;
    width?: number;
    height?: number;
    format?: ImageFormat;
    quality?: number;
    useFocalPoint?: boolean;
    fallback?: React.ReactNode;
    ref?: React.Ref<HTMLImageElement>;
}
```
* Extends: <code>React.ImgHTMLAttributes&#60;HTMLImageElement&#62;</code>



<div className="members-wrapper">

### asset

<MemberInfo kind="property" type={`<a href='/reference/dashboard/components/vendure-image#assetlike'>AssetLike</a> | null | undefined`}   />

The asset to display.
### preset

<MemberInfo kind="property" type={`<a href='/reference/dashboard/components/vendure-image#imagepreset'>ImagePreset</a>`}   />

The preset to use for the image.
### mode

<MemberInfo kind="property" type={`<a href='/reference/dashboard/components/vendure-image#imagemode'>ImageMode</a>`}   />

The crop/resize mode to use for the image.
### width

<MemberInfo kind="property" type={`number`}   />

The width of the image.
### height

<MemberInfo kind="property" type={`number`}   />

The height of the image.
### format

<MemberInfo kind="property" type={`<a href='/reference/dashboard/components/vendure-image#imageformat'>ImageFormat</a>`}   />

The format of the image.
### quality

<MemberInfo kind="property" type={`number`}   />

The quality of the image.
### useFocalPoint

<MemberInfo kind="property" type={`boolean`}   />

Whether to use the asset's focal point in crop mode.
### fallback

<MemberInfo kind="property" type={`React.ReactNode`}   />

The fallback to show if no asset is provided. If no fallback is provided, 
a default placeholder will be shown.
### ref

<MemberInfo kind="property" type={`React.Ref&#60;HTMLImageElement&#62;`}   />

The ref to the image element.


</div>


## AssetLike

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/vendure-image.tsx" sourceLine="13" packageName="@vendure/dashboard" since="3.4.0" />

The type of object that can be used as an asset in the <a href='/reference/dashboard/components/vendure-image#vendureimage'>VendureImage</a> component.

```ts title="Signature"
interface AssetLike {
    id: string;
    preview: string;
    name?: string | null;
    focalPoint?: { x: number; y: number } | null;
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />


### preview

<MemberInfo kind="property" type={`string`}   />


### name

<MemberInfo kind="property" type={`string | null`}   />


### focalPoint

<MemberInfo kind="property" type={`{ x: number; y: number } | null`}   />




</div>


## ImagePreset

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/vendure-image.tsx" sourceLine="28" packageName="@vendure/dashboard" since="3.4.0" />

The presets that can be used for the <a href='/reference/dashboard/components/vendure-image#vendureimage'>VendureImage</a> component.

```ts title="Signature"
type ImagePreset = 'tiny' | 'thumb' | 'small' | 'medium' | 'large' | 'full' | null
```


## ImageFormat

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/vendure-image.tsx" sourceLine="38" packageName="@vendure/dashboard" since="3.4.0" />

The formats that can be used for the <a href='/reference/dashboard/components/vendure-image#vendureimage'>VendureImage</a> component.

```ts title="Signature"
type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif' | null
```


## ImageMode

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/vendure-image.tsx" sourceLine="48" packageName="@vendure/dashboard" since="3.4.0" />

The modes that can be used for the <a href='/reference/dashboard/components/vendure-image#vendureimage'>VendureImage</a> component.

```ts title="Signature"
type ImageMode = 'crop' | 'resize' | null
```
