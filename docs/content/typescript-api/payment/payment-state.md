---
title: "PaymentState"
weight: 10
date: 2023-07-14T16:57:50.257Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PaymentState
<div class="symbol">


# PaymentState

{{< generation-info sourceFile="packages/core/src/service/helpers/payment-state-machine/payment-state.ts" sourceLine="27" packageName="@vendure/core">}}

These are the default states of the payment process.

## Signature

```TypeScript
type PaymentState = | 'Created'
    | 'Error'
    | 'Cancelled'
    | keyof CustomPaymentStates
    | keyof PaymentStates
```
</div>
