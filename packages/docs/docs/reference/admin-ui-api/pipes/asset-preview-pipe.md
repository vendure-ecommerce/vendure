---
title: "AssetPreviewPipe"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AssetPreviewPipe

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/asset-preview.pipe.ts" sourceLine="19" packageName="@vendure/admin-ui" />

Given an Asset object (an object with `preview` and optionally `focalPoint` properties), this pipe
returns a string with query parameters designed to work with the image resize capabilities of the
AssetServerPlugin.

*Example*

```HTML
<img [src]="asset | assetPreview:'tiny'" />
<img [src]="asset | assetPreview:150" />
```

```ts title="Signature"
class AssetPreviewPipe implements PipeTransform {
    transform(asset?: AssetFragment, preset: string | number = 'thumb') => string;
}
```
* Implements: <code>PipeTransform</code>



<div className="members-wrapper">

### transform

<MemberInfo kind="method" type={`(asset?: AssetFragment, preset: string | number = 'thumb') => string`}   />




</div>
