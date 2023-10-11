---
title: "AssetOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AssetOptions

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="606" packageName="@vendure/core" />

The AssetOptions define how assets (images and other files) are named and stored, and how preview images are generated.

**Note**: If you are using the `AssetServerPlugin`, it is not necessary to configure these options.

```ts title="Signature"
interface AssetOptions {
    assetNamingStrategy?: AssetNamingStrategy;
    assetStorageStrategy?: AssetStorageStrategy;
    assetPreviewStrategy?: AssetPreviewStrategy;
    permittedFileTypes?: string[];
    uploadMaxFileSize?: number;
}
```

<div className="members-wrapper">

### assetNamingStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/assets/asset-naming-strategy#assetnamingstrategy'>AssetNamingStrategy</a>`} default="<a href='/reference/typescript-api/assets/default-asset-naming-strategy#defaultassetnamingstrategy'>DefaultAssetNamingStrategy</a>"   />

Defines how asset files and preview images are named before being saved.
### assetStorageStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/assets/asset-storage-strategy#assetstoragestrategy'>AssetStorageStrategy</a>`} default="NoAssetStorageStrategy"   />

Defines the strategy used for storing uploaded binary files.
### assetPreviewStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/assets/asset-preview-strategy#assetpreviewstrategy'>AssetPreviewStrategy</a>`} default="NoAssetPreviewStrategy"   />

Defines the strategy used for creating preview images of uploaded assets.
### permittedFileTypes

<MemberInfo kind="property" type={`string[]`} default="image, audio, video MIME types plus PDFs"   />

An array of the permitted file types that may be uploaded as Assets. Each entry
should be in the form of a valid
[unique file type specifier](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers)
i.e. either a file extension (".pdf") or a mime type ("image/*", "audio/mpeg" etc.).
### uploadMaxFileSize

<MemberInfo kind="property" type={`number`} default="20971520"   />

The max file size in bytes for uploaded assets.


</div>
