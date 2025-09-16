---
title: "AssetGallery"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AssetGallery

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/asset/asset-gallery.tsx" sourceLine="153" packageName="@vendure/dashboard" />

A component for displaying a gallery of assets.

*Example*

```tsx
 <AssetGallery
     onSelect={handleAssetSelect}
     multiSelect="manual"
     initialSelectedAssets={initialSelectedAssets}
     fixedHeight={false}
     displayBulkActions={false}
 />
```

```ts title="Signature"
function AssetGallery(props: AssetGalleryProps): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`<a href='/reference/dashboard/components/asset-gallery#assetgalleryprops'>AssetGalleryProps</a>`} />



## AssetGalleryProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/asset/asset-gallery.tsx" sourceLine="81" packageName="@vendure/dashboard" />

Props for the <a href='/reference/dashboard/components/asset-gallery#assetgallery'>AssetGallery</a> component.

```ts title="Signature"
interface AssetGalleryProps {
    onSelect?: (assets: Asset[]) => void;
    selectable?: boolean;
    multiSelect?: 'auto' | 'manual';
    initialSelectedAssets?: Asset[];
    pageSize?: number;
    fixedHeight?: boolean;
    showHeader?: boolean;
    className?: string;
    onFilesDropped?: (files: File[]) => void;
    bulkActions?: AssetBulkAction[];
    displayBulkActions?: boolean;
}
```

<div className="members-wrapper">

### onSelect

<MemberInfo kind="property" type={`(assets: <a href='/reference/typescript-api/entities/asset#asset'>Asset</a>[]) =&#62; void`}   />


### selectable

<MemberInfo kind="property" type={`boolean`}   />


### multiSelect

<MemberInfo kind="property" type={`'auto' | 'manual'`}   />

Defines whether multiple assets can be selected.

If set to 'auto', the asset selection will be toggled when the user clicks on an asset.
If set to 'manual', multiple selection will occur only if the user holds down the control/cmd key.
### initialSelectedAssets

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>[]`}   />

The initial assets that should be selected.
### pageSize

<MemberInfo kind="property" type={`number`}   />

The number of assets to display per page.
### fixedHeight

<MemberInfo kind="property" type={`boolean`}   />

Whether the gallery should have a fixed height.
### showHeader

<MemberInfo kind="property" type={`boolean`}   />

Whether the gallery should show a header.
### className

<MemberInfo kind="property" type={`string`}   />

The class name to apply to the gallery.
### onFilesDropped

<MemberInfo kind="property" type={`(files: File[]) =&#62; void`}   />

The function to call when files are dropped.
### bulkActions

<MemberInfo kind="property" type={`AssetBulkAction[]`}   />

The bulk actions to display in the gallery.
### displayBulkActions

<MemberInfo kind="property" type={`boolean`}   />

Whether the gallery should display bulk actions.


</div>
