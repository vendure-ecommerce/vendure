---
title: "FileSizePipe"
weight: 10
date: 2023-07-14T16:57:51.328Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# FileSizePipe
<div class="symbol">


# FileSizePipe

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/file-size.pipe.ts" sourceLine="14" packageName="@vendure/admin-ui">}}

Formats a number into a human-readable file size string.

*Example*

```TypeScript
{{ fileSizeInBytes | filesize }}
```

## Signature

```TypeScript
class FileSizePipe implements PipeTransform {
  transform(value: number, useSiUnits:  = true) => any;
}
```
## Implements

 * PipeTransform


## Members

### transform

{{< member-info kind="method" type="(value: number, useSiUnits:  = true) => any"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
