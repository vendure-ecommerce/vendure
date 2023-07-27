---
title: "PaymentTransitionData"
weight: 10
date: 2023-07-14T16:57:50.257Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PaymentTransitionData
<div class="symbol">


# PaymentTransitionData

{{< generation-info sourceFile="packages/core/src/service/helpers/payment-state-machine/payment-state.ts" sourceLine="41" packageName="@vendure/core">}}

The data which is passed to the `onStateTransitionStart` function configured when constructing
a new `PaymentMethodHandler`

## Signature

```TypeScript
interface PaymentTransitionData {
  ctx: RequestContext;
  payment: Payment;
  order: Order;
}
```
## Members

### ctx

{{< member-info kind="property" type="<a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### payment

{{< member-info kind="property" type="<a href='/typescript-api/entities/payment#payment'>Payment</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### order

{{< member-info kind="property" type="<a href='/typescript-api/entities/order#order'>Order</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
