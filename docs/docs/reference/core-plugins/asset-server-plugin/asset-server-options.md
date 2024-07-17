---
title: "AssetServerOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AssetServerOptions

<GenerationInfo sourceFile="packages/asset-server-plugin/src/types.ts" sourceLine="72" packageName="@vendure/asset-server-plugin" />

The configuration options for the AssetServerPlugin.

```ts title="Signature"
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

<div className="members-wrapper">

### route

<MemberInfo kind="property" type={`string`}   />

The route to the asset server.
### assetUploadDir

<MemberInfo kind="property" type={`string`}   />

The local directory to which assets will be uploaded when using the <a href='/reference/core-plugins/asset-server-plugin/local-asset-storage-strategy#localassetstoragestrategy'>LocalAssetStorageStrategy</a>.
### assetUrlPrefix

<MemberInfo kind="property" type={`string | ((ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, identifier: string) =&#62; string)`}   />

The complete URL prefix of the asset files. For example, "https://demo.vendure.io/assets/". A
function can also be provided to handle more complex cases, such as serving multiple domains
from a single server. In this case, the function should return a string url prefix.

If not provided, the plugin will attempt to guess based off the incoming
request and the configured route. However, in all but the simplest cases,
this guess may not yield correct results.
### previewMaxWidth

<MemberInfo kind="property" type={`number`} default={`1600`}   />

The max width in pixels of a generated preview image.
### previewMaxHeight

<MemberInfo kind="property" type={`number`} default={`1600`}   />

The max height in pixels of a generated preview image.
### presets

<MemberInfo kind="property" type={`<a href='/reference/core-plugins/asset-server-plugin/image-transform-preset#imagetransformpreset'>ImageTransformPreset</a>[]`}   />

An array of additional <a href='/reference/core-plugins/asset-server-plugin/image-transform-preset#imagetransformpreset'>ImageTransformPreset</a> objects.
### namingStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/assets/asset-naming-strategy#assetnamingstrategy'>AssetNamingStrategy</a>`} default={`<a href='/reference/core-plugins/asset-server-plugin/hashed-asset-naming-strategy#hashedassetnamingstrategy'>HashedAssetNamingStrategy</a>`}   />

Defines how asset files and preview images are named before being saved.
### previewStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/assets/asset-preview-strategy#assetpreviewstrategy'>AssetPreviewStrategy</a>`}  since="1.7.0"  />

Defines how previews are generated for a given Asset binary. By default, this uses
the <a href='/reference/core-plugins/asset-server-plugin/sharp-asset-preview-strategy#sharpassetpreviewstrategy'>SharpAssetPreviewStrategy</a>
### storageStrategyFactory

<MemberInfo kind="property" type={`(         options: <a href='/reference/core-plugins/asset-server-plugin/asset-server-options#assetserveroptions'>AssetServerOptions</a>,     ) =&#62; <a href='/reference/typescript-api/assets/asset-storage-strategy#assetstoragestrategy'>AssetStorageStrategy</a> | Promise&#60;<a href='/reference/typescript-api/assets/asset-storage-strategy#assetstoragestrategy'>AssetStorageStrategy</a>&#62;`} default={`() =&#62; <a href='/reference/core-plugins/asset-server-plugin/local-asset-storage-strategy#localassetstoragestrategy'>LocalAssetStorageStrategy</a>`}   />

A function which can be used to configure an <a href='/reference/typescript-api/assets/asset-storage-strategy#assetstoragestrategy'>AssetStorageStrategy</a>. This is useful e.g. if you wish to store your assets
using a cloud storage provider. By default, the <a href='/reference/core-plugins/asset-server-plugin/local-asset-storage-strategy#localassetstoragestrategy'>LocalAssetStorageStrategy</a> is used.
### cacheHeader

<MemberInfo kind="property" type={`<a href='/reference/core-plugins/asset-server-plugin/cache-config#cacheconfig'>CacheConfig</a> | string`} default={`'public, max-age=15552000'`}  since="1.9.3"  />

Configures the `Cache-Control` directive for response to control caching in browsers and shared caches (e.g. Proxies, CDNs).
Defaults to publicly cached for 6 months.


</div>
