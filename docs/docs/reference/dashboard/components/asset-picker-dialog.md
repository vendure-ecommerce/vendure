---
title: "AssetPickerDialog"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AssetPickerDialog

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/asset/asset-picker-dialog.tsx" sourceLine="60" packageName="@vendure/dashboard" />

A dialog which allows the creation and selection of assets.

```ts title="Signature"
function AssetPickerDialog(props: AssetPickerDialogProps): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`<a href='/reference/dashboard/components/asset-picker-dialog#assetpickerdialogprops'>AssetPickerDialogProps</a>`} />



## AssetPickerDialogProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/asset/asset-picker-dialog.tsx" sourceLine="19" packageName="@vendure/dashboard" />

Props for the <a href='/reference/dashboard/components/asset-picker-dialog#assetpickerdialog'>AssetPickerDialog</a> component.

```ts title="Signature"
interface AssetPickerDialogProps {
    open: boolean;
    onClose: () => void;
    onSelect: (assets: Asset[]) => void;
    multiSelect?: boolean;
    initialSelectedAssets?: Asset[];
    title?: string;
}
```

<div className="members-wrapper">

### open

<MemberInfo kind="property" type={`boolean`}   />

Whether the dialog is open.
### onClose

<MemberInfo kind="property" type={`() =&#62; void`}   />

The function to call when the dialog is closed.
### onSelect

<MemberInfo kind="property" type={`(assets: <a href='/reference/typescript-api/entities/asset#asset'>Asset</a>[]) =&#62; void`}   />

The function to call when assets are selected.
### multiSelect

<MemberInfo kind="property" type={`boolean`}   />

Whether multiple assets can be selected.
### initialSelectedAssets

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>[]`}   />

The initial assets that should be selected.
### title

<MemberInfo kind="property" type={`string`}   />

The title of the dialog.


</div>
