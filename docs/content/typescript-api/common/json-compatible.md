---
title: "JsonCompatible"
weight: 10
date: 2023-06-13T12:31:11.665Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# JsonCompatible
<div class="symbol">


# JsonCompatible

{{< generation-info sourceFile="packages/common/src/shared-types.ts" sourceLine="51" packageName="@vendure/common">}}

A type representing JSON-compatible values.
From https://github.com/microsoft/TypeScript/issues/1897#issuecomment-580962081

## Signature

```TypeScript
type JsonCompatible<T> = {
    [P in keyof T]: T[P] extends Json
        ? T[P]
        : Pick<T, P> extends Required<Pick<T, P>>
        ? never
        : JsonCompatible<T[P]>;
}
```
</div>
