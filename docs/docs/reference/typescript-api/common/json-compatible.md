---
title: "JsonCompatible"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## JsonCompatible

<GenerationInfo sourceFile="packages/common/src/shared-types.ts" sourceLine="52" packageName="@vendure/common" />

A type representing JSON-compatible values.
From https://github.com/microsoft/TypeScript/issues/1897#issuecomment-580962081

```ts title="Signature"
type JsonCompatible<T> = {
    [P in keyof T]: T[P] extends Json
        ? T[P]
        : Pick<T, P> extends Required<Pick<T, P>>
        ? never
        : JsonCompatible<T[P]>;
}
```
