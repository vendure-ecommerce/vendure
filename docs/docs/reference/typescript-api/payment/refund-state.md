---
title: "RefundState"
weight: 10
date: 2023-07-28T12:05:23.755Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## RefundState

<GenerationInfo sourceFile="packages/core/src/service/helpers/refund-state-machine/refund-state.ts" sourceLine="13" packageName="@vendure/core" />

These are the default states of the refund process.

```ts title="Signature"
type RefundState = 'Pending' | 'Settled' | 'Failed'
```
