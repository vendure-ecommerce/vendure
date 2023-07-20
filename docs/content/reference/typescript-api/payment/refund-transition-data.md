---
title: "RefundTransitionData"
weight: 10
date: 2023-07-14T16:57:50.261Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# RefundTransitionData
<div class="symbol">


# RefundTransitionData

{{< generation-info sourceFile="packages/core/src/service/helpers/refund-state-machine/refund-state.ts" sourceLine="33" packageName="@vendure/core">}}

The data which is passed to the state transition handlers of the RefundStateMachine.

## Signature

```TypeScript
interface RefundTransitionData {
  ctx: RequestContext;
  order: Order;
  refund: Refund;
}
```
## Members

### ctx

{{< member-info kind="property" type="<a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### order

{{< member-info kind="property" type="<a href='/typescript-api/entities/order#order'>Order</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### refund

{{< member-info kind="property" type="Refund"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
