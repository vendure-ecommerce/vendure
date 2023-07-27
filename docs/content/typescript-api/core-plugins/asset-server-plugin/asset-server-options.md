---
title: "AssetServerOptions"
weight: 10
date: 2023-07-14T16:57:50.708Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AssetServerOptions
<div class="symbol">


# AssetServerOptions

{{< generation-info sourceFile="packages/asset-server-plugin/src/types.ts" sourceLine="72" packageName="@vendure/asset-server-plugin">}}

The configuration options for the AssetServerPlugin.

## Signature

```TypeScript
interface AssetServerOptions {
  route: string;
  assetUploadDir: string;
  assetUrlPrefix?: string | ((ctx: RequestContext, identifier: string) => string);
  previewMaxWidth?: number;
  previewMaxHeight?: number;
  presets?: ImageTransformPreset[];
  namingStrategy?: AssetNamingStrategy;
  previewStrategy?: AssetPreviewStrategy;
  storageStrategyFactory?: (
        options: AssetServerOptions,
    ) => AssetStorageStrategy | Promise<AssetStorageStrategy>;
  cacheHeader?: CacheConfig | string;
}
```
## Members

### route

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The route to the asset server.{{< /member-description >}}

### assetUploadDir

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The local directory to which assets will be uploaded when using the <a href='/typescript-api/core-plugins/asset-server-plugin/local-asset-storage-strategy#localassetstoragestrategy'>LocalAssetStorageStrategy</a>.{{< /member-description >}}

### assetUrlPrefix

{{< member-info kind="property" type="string | ((ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, identifier: string) =&#62; string)"  >}}

{{< member-description >}}The complete URL prefix of the asset files. For example, "https://demo.vendure.io/assets/". A
function can also be provided to handle more complex cases, such as serving multiple domains
from a single server. In this case, the function should return a string url prefix.

If not provided, the plugin will attempt to guess based off the incoming
request and the configured route. However, in all but the simplest cases,
this guess may not yield correct results.{{< /member-description >}}

### previewMaxWidth

{{< member-info kind="property" type="number" default="1600"  >}}

{{< member-description >}}The max width in pixels of a generated preview image.{{< /member-description >}}

### previewMaxHeight

{{< member-info kind="property" type="number" default="1600"  >}}

{{< member-description >}}The max height in pixels of a generated preview image.{{< /member-description >}}

### presets

{{< member-info kind="property" type="<a href='/typescript-api/core-plugins/asset-server-plugin/image-transform-preset#imagetransformpreset'>ImageTransformPreset</a>[]"  >}}

{{< member-description >}}An array of additional <a href='/typescript-api/core-plugins/asset-server-plugin/image-transform-preset#imagetransformpreset'>ImageTransformPreset</a> objects.{{< /member-description >}}

### namingStrategy

{{< member-info kind="property" type="<a href='/typescript-api/assets/asset-naming-strategy#assetnamingstrategy'>AssetNamingStrategy</a>" default="<a href='/typescript-api/core-plugins/asset-server-plugin/hashed-asset-naming-strategy#hashedassetnamingstrategy'>HashedAssetNamingStrategy</a>"  >}}

{{< member-description >}}Defines how asset files and preview images are named before being saved.{{< /member-description >}}

### previewStrategy

{{< member-info kind="property" type="<a href='/typescript-api/assets/asset-preview-strategy#assetpreviewstrategy'>AssetPreviewStrategy</a>"  since="1.7.0" >}}

{{< member-description >}}Defines how previews are generated for a given Asset binary. By default, this uses
the <a href='/typescript-api/core-plugins/asset-server-plugin/sharp-asset-preview-strategy#sharpassetpreviewstrategy'>SharpAssetPreviewStrategy</a>{{< /member-description >}}

### storageStrategyFactory

{{< member-info kind="property" type="(         options: <a href='/typescript-api/core-plugins/asset-server-plugin/asset-server-options#assetserveroptions'>AssetServerOptions</a>,     ) =&#62; <a href='/typescript-api/assets/asset-storage-strategy#assetstoragestrategy'>AssetStorageStrategy</a> | Promise&#60;<a href='/typescript-api/assets/asset-storage-strategy#assetstoragestrategy'>AssetStorageStrategy</a>&#62;" default="() =&#62; <a href='/typescript-api/core-plugins/asset-server-plugin/local-asset-storage-strategy#localassetstoragestrategy'>LocalAssetStorageStrategy</a>"  >}}

{{< member-description >}}A function which can be used to configure an <a href='/typescript-api/assets/asset-storage-strategy#assetstoragestrategy'>AssetStorageStrategy</a>. This is useful e.g. if you wish to store your assets
using a cloud storage provider. By default, the <a href='/typescript-api/core-plugins/asset-server-plugin/local-asset-storage-strategy#localassetstoragestrategy'>LocalAssetStorageStrategy</a> is used.{{< /member-description >}}

### cacheHeader

{{< member-info kind="property" type="<a href='/typescript-api/core-plugins/asset-server-plugin/cache-config#cacheconfig'>CacheConfig</a> | string" default="'public, max-age=15552000'"  since="1.9.3" >}}

{{< member-description >}}Configures the `Cache-Control` directive for response to control caching in browsers and shared caches (e.g. Proxies, CDNs).
Defaults to publicly cached for 6 months.{{< /member-description >}}


</div>
