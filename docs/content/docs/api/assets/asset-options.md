---
title: "AssetOptions"
weight: 10
date: 2019-01-30T10:57:03.833Z
generated: true
---
<!-- This file was generated from the Vendure TypeScript source. Do not modify. Instead, re-run "generate-docs" -->


# AssetOptions

{{< generation-info source="/server/src/config/vendure-config.ts">}}

The AssetOptions define how assets (images and other files) are named and stored, and how preview images are generated.

### assetNamingStrategy

{{< member-info kind="property" type="<a href='/docs/api//assets/asset-naming-strategy/'>AssetNamingStrategy</a>" >}}

Defines how asset files and preview images are named before being saved.

### assetStorageStrategy

{{< member-info kind="property" type="<a href='/docs/api//assets/asset-storage-strategy/'>AssetStorageStrategy</a>" >}}

Defines the strategy used for storing uploaded binary files.

### assetPreviewStrategy

{{< member-info kind="property" type="<a href='/docs/api//assets/asset-preview-strategy/'>AssetPreviewStrategy</a>" >}}

Defines the strategy used for creating preview images of uploaded assets.

### uploadMaxFileSize

{{< member-info kind="property" type="number" >}}

The max file size in bytes for uploaded assets.

