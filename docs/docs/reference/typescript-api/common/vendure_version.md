---
title: "VENDURE_VERSION"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## VENDURE_VERSION

<GenerationInfo sourceFile="packages/core/src/version.ts" sourceLine="17" packageName="@vendure/core" since="2.0.0" />

A constant which holds the current version of the Vendure core. You can use
this when your code needs to know the version of Vendure which is running.

*Example*

```ts
import { VENDURE_VERSION } from '@vendure/core';

console.log('Vendure version:', VENDURE_VERSION);
```

