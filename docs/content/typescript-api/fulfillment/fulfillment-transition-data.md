---
title: "FulfillmentTransitionData"
weight: 10
date: 2023-07-14T16:57:50.235Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# FulfillmentTransitionData
<div class="symbol">


# FulfillmentTransitionData

{{< generation-info sourceFile="packages/core/src/service/helpers/fulfillment-state-machine/fulfillment-state.ts" sourceLine="42" packageName="@vendure/core">}}

The data which is passed to the state transition handlers of the FulfillmentStateMachine.

## Signature

```TypeScript
interface FulfillmentTransitionData {
  ctx: RequestContext;
  orders: Order[];
  fulfillment: Fulfillment;
}
```
## Members

### ctx

{{< member-info kind="property" type="<a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### orders

{{< member-info kind="property" type="<a href='/typescript-api/entities/order#order'>Order</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### fulfillment

{{< member-info kind="property" type="<a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
