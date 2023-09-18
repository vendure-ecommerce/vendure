---
title: "PaymentState"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PaymentState

<GenerationInfo sourceFile="packages/core/src/service/helpers/payment-state-machine/payment-state.ts" sourceLine="27" packageName="@vendure/core" />

These are the default states of the payment process.

```ts title="Signature"
type PaymentState = | 'Created'
    | 'Error'
    | 'Cancelled'
    | keyof CustomPaymentStates
    | keyof PaymentStates
```
