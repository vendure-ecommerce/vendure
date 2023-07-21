---
title: "ApiType"
weight: 10
date: 2023-07-21T07:16:59.835Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ApiType

<GenerationInfo sourceFile="packages/core/src/api/common/get-api-type.ts" sourceLine="9" packageName="@vendure/core" />

Which of the GraphQL APIs the current request came via.

```ts title="Signature"
type ApiType = 'admin' | 'shop' | 'custom'
```
