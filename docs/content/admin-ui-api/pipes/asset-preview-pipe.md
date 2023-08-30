---
title: "AssetPreviewPipe"
weight: 10
date: 2023-07-14T16:57:51.324Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AssetPreviewPipe
<div class="symbol">


# AssetPreviewPipe

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/asset-preview.pipe.ts" sourceLine="19" packageName="@vendure/admin-ui">}}

Given an Asset object (an object with `preview` and optionally `focalPoint` properties), this pipe
returns a string with query parameters designed to work with the image resize capabilities of the
AssetServerPlugin.

*Example*

```HTML
<img [src]="asset | assetPreview:'tiny'" />
<img [src]="asset | assetPreview:150" />
```

## Signature

```TypeScript
class AssetPreviewPipe implements PipeTransform {
  transform(asset?: AssetFragment, preset: string | number = 'thumb') => string;
}
```
## Implements

 * PipeTransform


## Members

### transform

{{< member-info kind="method" type="(asset?: AssetFragment, preset: string | number = 'thumb') => string"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
