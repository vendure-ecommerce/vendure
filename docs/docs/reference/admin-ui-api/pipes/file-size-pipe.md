---
title: "FileSizePipe"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FileSizePipe

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/file-size.pipe.ts" sourceLine="14" packageName="@vendure/admin-ui" />

Formats a number into a human-readable file size string.

*Example*

```ts
{{ fileSizeInBytes | filesize }}
```

```ts title="Signature"
class FileSizePipe implements PipeTransform {
    transform(value: number, useSiUnits:  = true) => any;
}
```
* Implements: <code>PipeTransform</code>



<div className="members-wrapper">

### transform

<MemberInfo kind="method" type={`(value: number, useSiUnits:  = true) => any`}   />




</div>
