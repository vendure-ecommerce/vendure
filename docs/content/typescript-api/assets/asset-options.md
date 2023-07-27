---
title: "AssetOptions"
weight: 10
date: 2023-07-14T16:57:49.751Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AssetOptions
<div class="symbol">


# AssetOptions

{{< generation-info sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="605" packageName="@vendure/core">}}

The AssetOptions define how assets (images and other files) are named and stored, and how preview images are generated.

**Note**: If you are using the `AssetServerPlugin`, it is not necessary to configure these options.

## Signature

```TypeScript
interface AssetOptions {
  assetNamingStrategy?: AssetNamingStrategy;
  assetStorageStrategy?: AssetStorageStrategy;
  assetPreviewStrategy?: AssetPreviewStrategy;
  permittedFileTypes?: string[];
  uploadMaxFileSize?: number;
}
```
## Members

### assetNamingStrategy

{{< member-info kind="property" type="<a href='/typescript-api/assets/asset-naming-strategy#assetnamingstrategy'>AssetNamingStrategy</a>" default="<a href='/typescript-api/assets/default-asset-naming-strategy#defaultassetnamingstrategy'>DefaultAssetNamingStrategy</a>"  >}}

{{< member-description >}}Defines how asset files and preview images are named before being saved.{{< /member-description >}}

### assetStorageStrategy

{{< member-info kind="property" type="<a href='/typescript-api/assets/asset-storage-strategy#assetstoragestrategy'>AssetStorageStrategy</a>" default="NoAssetStorageStrategy"  >}}

{{< member-description >}}Defines the strategy used for storing uploaded binary files.{{< /member-description >}}

### assetPreviewStrategy

{{< member-info kind="property" type="<a href='/typescript-api/assets/asset-preview-strategy#assetpreviewstrategy'>AssetPreviewStrategy</a>" default="NoAssetPreviewStrategy"  >}}

{{< member-description >}}Defines the strategy used for creating preview images of uploaded assets.{{< /member-description >}}

### permittedFileTypes

{{< member-info kind="property" type="string[]" default="image, audio, video MIME types plus PDFs"  >}}

{{< member-description >}}An array of the permitted file types that may be uploaded as Assets. Each entry
should be in the form of a valid
[unique file type specifier](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers)
i.e. either a file extension (".pdf") or a mime type ("image/*", "audio/mpeg" etc.).{{< /member-description >}}

### uploadMaxFileSize

{{< member-info kind="property" type="number" default="20971520"  >}}

{{< member-description >}}The max file size in bytes for uploaded assets.{{< /member-description >}}


</div>
