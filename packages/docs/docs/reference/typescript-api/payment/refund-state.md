---
title: "RefundState"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## RefundState

<GenerationInfo sourceFile="packages/core/src/service/helpers/refund-state-machine/refund-state.ts" sourceLine="27" packageName="@vendure/core" />

These are the default states of the refund process.

```ts title="Signature"
type RefundState = 'Pending' | 'Settled' | 'Failed' | keyof CustomRefundStates | keyof RefundStates
```
